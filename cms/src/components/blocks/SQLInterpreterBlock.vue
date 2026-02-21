<template>
  <div class="block-container block-sql">
    <div class="sql-block__container">
      <header class="sql-block__header">
        <span class="sql-block__header-title">Postgres SQL client</span>
        <div class="sql-block__status-row">
          <div
            class="sql-block__status"
            :class="{ 'sql-block__status--ready': store.ready }"
            :title="store.ready ? 'Database ready' : 'Waiting for PGLite (waitReady).'"
          >
            <span class="sql-block__status-dot" aria-hidden="true" />
            <span class="sql-block__status-text">{{ store.ready ? 'Database' : 'Loading…' }}</span>
          </div>
          <div
            v-if="isActive"
            class="sql-block__status"
            :class="solutionStatusClass"
            :title="solutionStatusTitle"
          >
            <span class="sql-block__status-dot" aria-hidden="true" />
            <span class="sql-block__status-text">{{ solutionStatusText }}</span>
          </div>
        </div>
      </header>
      <!-- Mobile portrait: 4 tabs (Instructions, Table, Query, Solution) share one central pane -->
      <div class="sql-block__mobile">
        <div class="sql-block__mobile-tabs">
          <button
            type="button"
            class="sql-block__mobile-tab"
            :class="{ 'sql-block__mobile-tab--active': mobileCentralTab === 'instructions' }"
            @click="mobileCentralTab = 'instructions'"
          >
            Instructions
          </button>
          <button
            type="button"
            class="sql-block__mobile-tab"
            :class="{ 'sql-block__mobile-tab--active': mobileCentralTab === 'table' }"
            @click="mobileCentralTab = 'table'"
          >
            Table
          </button>
          <button
            type="button"
            class="sql-block__mobile-tab"
            :class="{ 'sql-block__mobile-tab--active': mobileCentralTab === 'query' }"
            @click="mobileCentralTab = 'query'"
          >
            Query
          </button>
          <button
            type="button"
            class="sql-block__mobile-tab"
            :class="{ 'sql-block__mobile-tab--active': mobileCentralTab === 'solution' }"
            @click="mobileCentralTab = 'solution'"
          >
            Solution
          </button>
        </div>
        <div class="sql-block__mobile-central">
          <div v-show="mobileCentralTab === 'instructions'" class="sql-block__mobile-pane">
            <div class="sql-block__instructions-tabs">
              <button
                type="button"
                class="sql-block__instructions-tab"
                :class="{ 'sql-block__instructions-tab--active': instructionsSectionTab === 'instructions' }"
                @click="instructionsSectionTab = 'instructions'"
              >
                Instructions
              </button>
              <button
                type="button"
                class="sql-block__instructions-tab"
                :class="{ 'sql-block__instructions-tab--active': instructionsSectionTab === 'output' }"
                @click="instructionsSectionTab = 'output'"
              >
                Output
              </button>
            </div>
            <div v-show="instructionsSectionTab === 'instructions'" class="sql-block__instructions-content">
              <div class="sql-block__instructions-body">{{ instructions || ' ' }}</div>
            </div>
            <div v-show="instructionsSectionTab === 'output'" class="sql-block__instructions-content sql-block__instructions-output">
              <p class="sql-block__output-intro"><strong>Expected columns</strong> (case-insensitive).</p>
              <p v-if="solutionOutputColumns.length === 0" class="sql-block__output-empty">Run Start to see expected column names here.</p>
              <ul v-else class="sql-block__output-columns">
                <li v-for="(col, i) in solutionOutputColumns" :key="i" class="sql-block__output-column">{{ col }}</li>
              </ul>
            </div>
          </div>
          <div v-show="mobileCentralTab === 'table'" class="sql-block__mobile-pane sql-block__mobile-pane--schema">
            <template v-if="tablesList.length > 1">
              <label class="sql-block__schema-label" for="sql-table-select-mobile">Table:</label>
              <select
                id="sql-table-select-mobile"
                v-model.number="selectedTableIndex"
                class="sql-block__table-select"
                aria-label="Select table"
              >
                <option
                  v-for="(t, idx) in tablesList"
                  :key="idx"
                  :value="idx"
                >
                  {{ t.tableName }}
                </option>
              </select>
            </template>
            <template v-else>
              <h4 class="sql-block__schema-title">Table: {{ tablesList[0]?.tableName ?? tableName }}</h4>
            </template>
            <p class="sql-block__schema-column-head">Columns</p>
            <div class="sql-block__schema-divider" aria-hidden="true" />
            <ul class="sql-block__columns">
              <li
                v-for="(col, i) in displayColumns"
                :key="i"
                class="sql-block__column"
              >
                <span class="sql-block__column-name">{{ col.name }}</span>
                <span class="sql-block__column-type">{{ col.type }}</span>
              </li>
            </ul>
          </div>
          <div v-show="mobileCentralTab === 'query'" class="sql-block__mobile-pane">
            <template v-if="!isActive">
              <div class="sql-block__start-wrap">
                <button
                  type="button"
                  class="sql-block__start-btn"
                  :disabled="!store.ready"
                  @click="onStart"
                >
                  {{ store.ready ? 'Start' : 'Loading…' }}
                </button>
              </div>
            </template>
            <template v-else>
              <div class="sql-block__mobile-query-actions">
                <button
                  type="button"
                  class="sql-block__copy-solution-btn sql-block__copy-solution-btn--mobile"
                  :disabled="!solutionTrimmed"
                  title="Copy the solution into your query"
                  @click="onCopySolution"
                >
                  Copy solution
                </button>
                <button
                  type="button"
                  class="sql-block__run-btn sql-block__run-btn--mobile"
                  :disabled="store.isQueryRunning"
                  @click="onRun"
                >
                  {{ store.isQueryRunning ? 'Running…' : 'Run' }}
                </button>
              </div>
              <div class="sql-block__editor-wrap">
                <textarea
                  v-model="queryText"
                  class="sql-block__editor"
                  placeholder="SELECT *&#10;FROM table_name&#10;WHERE ..."
                  spellcheck="false"
                  rows="10"
                />
              </div>
            </template>
          </div>
          <div v-show="mobileCentralTab === 'solution'" class="sql-block__mobile-pane">
            <pre class="sql-block__solution">{{ formattedSolution }}</pre>
          </div>
        </div>
      </div>
      <div class="sql-block__grid">
        <!-- Top row: schema (table) | query -->
        <aside class="sql-block__schema">
          <template v-if="tablesList.length > 1">
            <label class="sql-block__schema-label" for="sql-table-select">Table:</label>
            <select
              id="sql-table-select"
              v-model.number="selectedTableIndex"
              class="sql-block__table-select"
              aria-label="Select table"
            >
              <option
                v-for="(t, idx) in tablesList"
                :key="idx"
                :value="idx"
              >
                {{ t.tableName }}
              </option>
            </select>
          </template>
          <template v-else>
            <h4 class="sql-block__schema-title">Table: {{ tablesList[0]?.tableName ?? tableName }}</h4>
          </template>
          <p class="sql-block__schema-column-head">Columns</p>
          <div class="sql-block__schema-divider" aria-hidden="true" />
          <ul class="sql-block__columns">
            <li
              v-for="(col, i) in displayColumns"
              :key="i"
              class="sql-block__column"
            >
              <span class="sql-block__column-name">{{ col.name }}</span>
              <span class="sql-block__column-type">{{ col.type }}</span>
            </li>
          </ul>
        </aside>
        <div class="sql-block__query-pane">
          <template v-if="!isActive">
            <div class="sql-block__start-wrap">
              <button
                type="button"
                class="sql-block__start-btn"
                :disabled="!store.ready"
                @click="onStart"
              >
                {{ store.ready ? 'Start' : 'Loading…' }}
              </button>
            </div>
          </template>
          <template v-else>
            <div class="sql-block__query-split">
              <div class="sql-block__query-half">
                <div class="sql-block__tabs">
                  <button
                    type="button"
                    class="sql-block__tab"
                    :class="{ 'sql-block__tab--active': activeTab === 'query' }"
                    @click="activeTab = 'query'"
                  >
                    Your query
                  </button>
                  <button
                    type="button"
                    class="sql-block__tab"
                    :class="{ 'sql-block__tab--active': activeTab === 'solution' }"
                    @click="activeTab = 'solution'"
                  >
                    Solution
                  </button>
                  <div class="sql-block__tabs-actions">
                    <button
                      type="button"
                      class="sql-block__copy-solution-btn"
                      :disabled="!solutionTrimmed"
                      title="Copy the solution into your query"
                      @click="onCopySolution"
                    >
                      Copy solution
                    </button>
                    <button
                      type="button"
                      class="sql-block__run-btn"
                      :disabled="store.isQueryRunning"
                      @click="onRun"
                    >
                      {{ store.isQueryRunning ? 'Running…' : 'Run' }}
                    </button>
                  </div>
                </div>
                <div class="sql-block__editor-wrap">
                  <textarea
                    v-show="activeTab === 'query'"
                    v-model="queryText"
                    class="sql-block__editor"
                    placeholder="SELECT *&#10;FROM table_name&#10;WHERE ..."
                    spellcheck="false"
                    rows="12"
                  />
                  <pre v-show="activeTab === 'solution'" class="sql-block__solution">{{ formattedSolution }}</pre>
                </div>
              </div>
              <div class="sql-block__instructions-half">
                <div class="sql-block__instructions-tabs">
                  <button
                    type="button"
                    class="sql-block__instructions-tab"
                    :class="{ 'sql-block__instructions-tab--active': instructionsSectionTab === 'instructions' }"
                    @click="instructionsSectionTab = 'instructions'"
                  >
                    Instructions
                  </button>
                  <button
                    type="button"
                    class="sql-block__instructions-tab"
                    :class="{ 'sql-block__instructions-tab--active': instructionsSectionTab === 'output' }"
                    @click="instructionsSectionTab = 'output'"
                  >
                    Output
                  </button>
                </div>
                <div v-show="instructionsSectionTab === 'instructions'" class="sql-block__instructions-content">
                  <div class="sql-block__instructions-body">{{ instructions || ' ' }}</div>
                </div>
                <div v-show="instructionsSectionTab === 'output'" class="sql-block__instructions-content sql-block__instructions-output">
                  <p class="sql-block__output-intro"><strong>Expected columns</strong> (case-insensitive).</p>
                  <p v-if="solutionOutputColumns.length === 0" class="sql-block__output-empty">Run Start to see expected column names here.</p>
                  <ul v-else class="sql-block__output-columns">
                    <li v-for="(col, i) in solutionOutputColumns" :key="i" class="sql-block__output-column">{{ col }}</li>
                  </ul>
                </div>
              </div>
            </div>
          </template>
        </div>
      </div>
      <div class="sql-block__divider" aria-hidden="true" />
      <div v-if="validationMessage" class="sql-block__validation" :class="validationStatusClass" role="status">
        {{ validationMessage }}
      </div>
      <div class="sql-block__results">
        <h4 class="sql-block__results-header">Query results</h4>
        <div v-if="hasRunOnce && resultError" class="sql-block__error">{{ resultError }}</div>
        <template v-else-if="hasRunOnce">
          <div v-if="resultRows.length > 0" class="sql-block__table-wrap">
            <table class="sql-block__table">
            <thead>
              <tr>
                <th
                  v-for="(colName, colIndex) in resultColumns"
                  :key="colIndex"
                  class="sql-block__th"
                >
                  {{ colName }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(row, rowIndex) in resultRows"
                :key="rowIndex"
                class="sql-block__tr"
                :class="{ 'sql-block__tr--issue': rowHasIssue(rowIndex) }"
              >
                <td
                  v-for="(colName, cellIndex) in resultColumns"
                  :key="cellIndex"
                  class="sql-block__td"
                  :class="{ 'sql-block__td--first': cellIndex === 0 }"
                >
                  <span
                    v-if="cellIndex === 0 && rowHasIssue(rowIndex)"
                    class="sql-block__row-issue-dot"
                    title="Row has a count or content issue vs solution"
                    aria-label="Issue"
                  />
                  {{ row[colName] }}
                </td>
              </tr>
            </tbody>
          </table>
          </div>
          <div v-else class="sql-block__empty">
            No rows returned.
          </div>
        </template>
        <div v-else class="sql-block__empty">
          Run a query to see results.
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { format } from 'sql-formatter'
import { useSqlInterpreterStore } from '../../stores/sqlInterpreter.js'

function toPlainLessonPayload(props) {
  try {
    if (Array.isArray(props.tables) && props.tables.length > 0) {
      return JSON.parse(JSON.stringify({ tables: props.tables }))
    }
    return JSON.parse(
      JSON.stringify({
        tableName: props.tableName ?? '',
        columns: Array.isArray(props.columns) ? props.columns : [],
        rows: Array.isArray(props.rows) ? props.rows : []
      })
    )
  } catch (_) {
    return {
      tableName: String(props.tableName ?? ''),
      columns: [],
      rows: [],
      tables: []
    }
  }
}

let blockIdCounter = 0
const blockId = `sql-${++blockIdCounter}-${Math.random().toString(36).slice(2, 9)}`

const props = defineProps({
  tableName: { type: String, default: 'table' },
  columns: { type: Array, default: () => [] },
  rows: { type: Array, default: () => [] },
  tables: { type: Array, default: () => [] },
  solution: { type: String, default: '' },
  instructions: { type: String, default: '' }
})

const store = useSqlInterpreterStore()
const queryText = ref('')
const activeTab = ref('query')
const mobileCentralTab = ref('instructions')
const instructionsSectionTab = ref('instructions')
const selectedTableIndex = ref(0)
const resultRows = ref([])
const resultColumns = ref([])
const resultError = ref(null)
const hasRunOnce = ref(false)
const solutionOutputColumns = ref([])

const tablesList = computed(() => {
  if (Array.isArray(props.tables) && props.tables.length > 0) {
    return props.tables.map((t) => ({
      tableName: t?.tableName ?? '',
      columns: Array.isArray(t?.columns) ? t.columns : [],
      rows: Array.isArray(t?.rows) ? t.rows : []
    }))
  }
  return [
    {
      tableName: props.tableName ?? 'table',
      columns: Array.isArray(props.columns) ? props.columns : [],
      rows: Array.isArray(props.rows) ? props.rows : []
    }
  ]
})

const displayColumns = computed(() => {
  const t = tablesList.value[selectedTableIndex.value]
  return t?.columns ?? []
})

const isActive = computed(() => store.isActive(blockId))

const solutionTrimmed = computed(() => (props.solution ?? '').trim())

const formattedSolution = computed(() => {
  const raw = solutionTrimmed.value
  if (!raw) return ''
  try {
    return format(raw, { language: 'postgresql', keywordCase: 'upper', tabWidth: 2 })
  } catch (_) {
    return raw
  }
})

function onCopySolution() {
  queryText.value = formattedSolution.value
  activeTab.value = 'query'
  mobileCentralTab.value = 'query'
}

const SOLUTION_TIMEOUT_MS = 30000

async function onStart() {
  const payload = toPlainLessonPayload(props)
  await store.startLesson(blockId, payload)
  queryText.value = ''
  resultRows.value = []
  resultColumns.value = []
  resultError.value = null
  hasRunOnce.value = false
  solutionOutputColumns.value = []
  const solutionSql = (props.solution ?? '').trim()
  if (solutionSql) {
    try {
      const result = await Promise.race([
        store.runQuery(solutionSql),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Query timed out')), SOLUTION_TIMEOUT_MS)
        )
      ])
      const { rows, columns, error } = result
      if (error) {
        store.setSolutionFailed(error)
        return
      }
      if (store.hasDuplicateColumnNames(columns)) {
        store.setSolutionDuplicateColumns()
        return
      }
      store.setSolutionOk()
      store.setExpectedFromResult(columns, rows?.length ?? 0)
      const solutionResult = await store.computeResultFingerprint(rows ?? [], columns ?? [])
      if (solutionResult) {
        store.setExpectedFingerprint(solutionResult.fingerprint, solutionResult.hashCounts)
      }
      solutionOutputColumns.value = Array.isArray(columns) ? [...columns] : []
    } catch (e) {
      store.setSolutionFailed(e?.message ?? 'Query timed out')
    }
  } else {
    store.setSolutionOk()
  }
}

async function onRun() {
  const sql = queryText.value.trim()
  if (!sql) {
    hasRunOnce.value = true
    resultError.value = 'No SQL present.'
    resultRows.value = []
    resultColumns.value = []
    return
  }
  hasRunOnce.value = true
  resultError.value = null
  const { rows, columns, error } = await store.runQuery(sql)
  if (error) {
    resultError.value = error
    resultRows.value = []
    resultColumns.value = []
  } else {
    resultError.value = null
    resultRows.value = rows
    resultColumns.value = Array.isArray(columns) && columns.length > 0 ? columns : (rows.length > 0 ? Object.keys(rows[0]) : [])
    const userResult = await store.computeResultFingerprint(rows, resultColumns.value)
    if (userResult) {
      store.setUserResultFingerprint(userResult.fingerprint, userResult.rowHashes)
    }
  }
}

const solutionStatusClass = computed(() => {
  const s = store.solutionStatus
  if (s === 'ok') return 'sql-block__status--ready'
  if (s === 'failed' || s === 'duplicate_columns') return 'sql-block__status--error'
  return 'sql-block__status--pending'
})
const solutionStatusTitle = computed(() => {
  const s = store.solutionStatus
  if (s === 'ok') return 'Solution ran successfully; no duplicate columns.'
  if (s === 'failed') return 'Solution query did not complete.'
  if (s === 'duplicate_columns') return 'Solution result has duplicate column names.'
  return 'Solution not run yet.'
})
const solutionStatusText = computed(() => {
  const s = store.solutionStatus
  if (s === 'ok') return 'Solution'
  if (s === 'failed') return 'Solution'
  if (s === 'duplicate_columns') return 'Solution'
  return 'Solution…'
})

const validationMessage = computed(() => {
  if (!hasRunOnce.value || resultError.value) return null
  return store.getValidationMessage(resultColumns.value, resultRows.value?.length ?? 0)
})

function rowHasIssue(rowIndex) {
  if (validationMessage.value !== "Result values don't match solution.") return false
  if (!store.userRowHashes || store.userRowHashes.length === 0) return false
  const flags = store.userRowIssueFlags
  return Array.isArray(flags) && flags[rowIndex] === true
}

const validationStatusClass = computed(() => {
  const msg = validationMessage.value
  if (!msg) return ''
  if (msg.startsWith('success:')) return 'sql-block__validation--match'
  if (store.solutionStatus === 'failed' || store.solutionStatus === 'duplicate_columns') return 'sql-block__validation--error'
  return 'sql-block__validation--mismatch'
})

onMounted(() => {
  store.initDb()
})
</script>

<style scoped>
.block-sql {
  flex: 0 0 auto;
  width: 100%;
}

/* SQL block — slightly larger; extra height goes to results (60/40 split) */
.sql-block__container {
  width: 100%;
  min-height: 640px;
  display: flex;
  flex-direction: column;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  background: #fff;
  border: 1px solid #c5d0de;
}

@media (max-width: 768px) {
  .sql-block__container {
    max-height: 58vh;
  }
}

/* Mobile portrait only: 4 tabs + single central pane; results stay at bottom */
.sql-block__mobile {
  display: none;
  flex-direction: column;
  flex: 5 1 0;
  min-height: 0;
  border-bottom: 1px solid #c5d0de;
}

@media (max-width: 768px) {
  .sql-block__mobile {
    display: flex;
  }
  .sql-block__grid {
    display: none !important;
  }
}

.sql-block__mobile-tabs {
  flex-shrink: 0;
  display: flex;
  align-items: stretch;
  border-bottom: 1px solid #c5d0de;
  background: #e8eef4;
}

.sql-block__mobile-tab {
  flex: 1;
  padding: 0.5rem 0.35rem;
  font-size: 0.75rem;
  font-weight: 500;
  border: none;
  border-bottom: 2px solid transparent;
  background: transparent;
  color: #555;
  cursor: pointer;
  margin-bottom: -1px;
}
.sql-block__mobile-tab--active {
  background: #fff;
  border-bottom-color: #2196f3;
  color: #1a1a1a;
}

.sql-block__mobile-central {
  flex: 1;
  min-height: 0;
  overflow: auto;
  background: #fff;
  display: flex;
  flex-direction: column;
}

.sql-block__mobile-pane {
  min-height: 100%;
  flex: 1;
  min-height: 0;
  padding: 0.75rem;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.sql-block__mobile-pane--schema {
  background: #f0f4f8;
}
.sql-block__mobile-pane--schema .sql-block__schema-title,
.sql-block__mobile-pane--schema .sql-block__schema-label {
  margin-top: 0;
}
.sql-block__mobile-pane .sql-block__instructions-tabs {
  margin: 0 -0.75rem 0.35rem -0.75rem;
  padding: 0 0.75rem;
}
.sql-block__mobile-pane .sql-block__instructions-content {
  flex: 1;
  min-height: 0;
  overflow: auto;
}
.sql-block__mobile-pane .sql-block__instructions-body {
  min-height: 0;
}
.sql-block__mobile-pane--schema {
  overflow: auto;
}
.sql-block__mobile-pane .sql-block__solution {
  flex: 1;
  min-height: 0;
  overflow: auto;
}

/* Query tab: Run button fixed at top, SQL editor fills below (mobile) */
.sql-block__mobile-query-actions {
  flex-shrink: 0;
  margin-bottom: 0.5rem;
  display: flex;
  gap: 0.5rem;
  align-items: stretch;
}
.sql-block__mobile-pane .sql-block__editor-wrap {
  flex: 1 1 auto;
  min-height: 0;
  overflow: auto;
  display: flex;
  flex-direction: column;
}
.sql-block__mobile-pane .sql-block__editor-wrap .sql-block__editor {
  flex: 1;
  min-height: 6rem;
  resize: none;
}
.sql-block__run-btn--mobile {
  margin-left: 0;
  margin-right: 0;
  flex: 1;
}

/* Mobile only: hide scrollbars on SQL interpreter */
@media (max-width: 768px) {
  .sql-block__mobile,
  .sql-block__mobile-central,
  .sql-block__mobile-pane .sql-block__editor-wrap,
  .sql-block__mobile-pane .sql-block__instructions-body,
  .sql-block__mobile-pane .sql-block__instructions-content,
  .sql-block__mobile-pane--schema,
  .sql-block__results {
    scrollbar-width: none;
    -ms-overflow-style: none;
  }
  .sql-block__mobile ::-webkit-scrollbar,
  .sql-block__mobile-central ::-webkit-scrollbar,
  .sql-block__results ::-webkit-scrollbar {
    display: none;
  }
}

@media (min-width: 769px) {
  .sql-block__container {
    max-height: 62vh;
  }
}

.sql-block__header {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: #1a1a1a;
  background: #e8eef4;
  border-bottom: 1px solid #c5d0de;
}

.sql-block__header-title {
  flex-shrink: 0;
}

/* Top row: table (schema) | query — 60% of container height */
.sql-block__grid {
  display: grid;
  grid-template-columns: minmax(160px, 200px) 1fr;
  flex: 5 1 0;
  min-height: 0;
  border-bottom: 1px solid #c5d0de;
}

.sql-block__schema {
  padding: 0.75rem 1rem;
  background: #f0f4f8;
  border-right: 1px solid #c5d0de;
  overflow-y: auto;
  min-width: 0;
}

.sql-block__status-row {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.sql-block__status {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.75rem;
  color: #555;
}

.sql-block__status-dot {
  flex-shrink: 0;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #c62828;
}

.sql-block__status--ready .sql-block__status-dot {
  background: #2e7d32;
}

.sql-block__status--error .sql-block__status-dot {
  background: #c62828;
}

.sql-block__status--pending .sql-block__status-dot {
  background: #9e9e9e;
}

.sql-block__status-text {
  font-weight: 500;
}

.sql-block__schema-label {
  display: block;
  margin: 0 0 0.25rem 0;
  font-size: 0.8125rem;
  font-weight: 600;
  color: #555;
}

.sql-block__table-select {
  width: 100%;
  margin-bottom: 0.5rem;
  padding: 0.35rem 0.5rem;
  font-size: 0.875rem;
  font-family: inherit;
  border: 1px solid #c5d0de;
  border-radius: 6px;
  background: #fff;
  color: #1a1a1a;
  cursor: pointer;
}

.sql-block__schema-title {
  margin: 0 0 0.5rem 0;
  font-size: 0.9375rem;
  font-weight: 700;
  color: #1a1a1a;
}

.sql-block__schema-column-head {
  margin: 0 0 0.25rem 0;
  font-size: 0.75rem;
  font-weight: 600;
  color: #555;
  text-transform: uppercase;
  letter-spacing: 0.02em;
}

.sql-block__schema-divider {
  height: 0;
  border-bottom: 1px solid #c5d0de;
  margin: 0 0 0.5rem 0;
}

.sql-block__columns {
  list-style: none;
  margin: 0;
  padding: 0;
}

.sql-block__column {
  display: flex;
  justify-content: space-between;
  gap: 0.5rem;
  padding: 0.25rem 0;
  font-size: 0.8125rem;
  border-bottom: 1px solid #e0e0e0;
}
.sql-block__column:last-child {
  border-bottom: none;
}

.sql-block__column-name {
  font-weight: 600;
  color: #333;
}

.sql-block__column-type {
  color: #666;
  font-family: ui-monospace, monospace;
}

.sql-block__query-pane {
  display: flex;
  flex-direction: column;
  min-width: 0;
  min-height: 0;
  background: #fff;
}

.sql-block__query-split {
  display: flex;
  flex: 1;
  min-height: 0;
  min-width: 0;
}

.sql-block__query-half {
  flex: 6 1 0;
  min-width: 0;
  min-height: 0;
  display: flex;
  flex-direction: column;
  border-right: 1px solid #c5d0de;
}

.sql-block__instructions-half {
  flex: 4 1 0;
  min-width: 0;
  min-height: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: #f5f7fa;
}

.sql-block__instructions-tabs {
  flex-shrink: 0;
  display: flex;
  align-items: stretch;
  border-bottom: 1px solid #e2e8f0;
  background: #e8eef4;
}
.sql-block__instructions-tab {
  padding: 0.4rem 0.6rem;
  font-size: 0.75rem;
  font-weight: 600;
  border: none;
  border-bottom: 2px solid transparent;
  margin-bottom: -1px;
  background: transparent;
  color: #555;
  cursor: pointer;
}
.sql-block__instructions-tab--active {
  background: #f5f7fa;
  border-bottom-color: #2196f3;
  color: #1a1a1a;
}

.sql-block__instructions-content {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}
.sql-block__instructions-body {
  flex: 1;
  padding: 0.6rem;
  font-size: 0.75rem;
  line-height: 1.45;
  color: #334155;
  white-space: pre-wrap;
  word-break: break-word;
}
.sql-block__instructions-output {
  padding: 0.6rem;
}
.sql-block__output-intro {
  margin: 0 0 0.5rem 0;
  font-size: 0.875rem;
  line-height: 1.4;
  color: #334155;
}
.sql-block__output-intro strong {
  font-weight: 700;
  color: #1e293b;
}
.sql-block__output-empty {
  margin: 0;
  font-size: 0.75rem;
  color: #64748b;
  font-style: italic;
}
.sql-block__output-columns {
  list-style: none;
  margin: 0;
  padding: 0;
  font-size: 0.8125rem;
  font-family: ui-monospace, monospace;
  color: #334155;
}
.sql-block__output-column {
  padding: 0.25rem 0;
  border-bottom: 1px solid #e2e8f0;
}
.sql-block__output-column:last-child {
  border-bottom: none;
}

.sql-block__instructions-title {
  flex-shrink: 0;
  margin: 0;
  padding: 0.4rem 0.6rem;
  font-size: 0.6875rem;
  font-weight: 700;
  color: #555;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  border-bottom: 1px solid #e2e8f0;
}

.sql-block__start-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  min-height: 8rem;
  padding: 1rem;
}

.sql-block__start-btn {
  padding: 0.6rem 1.25rem;
  font-size: 1rem;
  font-weight: 600;
  border: 2px solid #2196f3;
  border-radius: 8px;
  background: #2196f3;
  color: white;
  cursor: pointer;
}
.sql-block__start-btn:hover:not(:disabled) {
  background: #1976d2;
  border-color: #1976d2;
}
.sql-block__start-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.sql-block__tabs {
  display: flex;
  align-items: center;
  gap: 0;
  flex-shrink: 0;
  border-bottom: 1px solid #c5d0de;
}

.sql-block__tab {
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  border: none;
  border-bottom: 2px solid transparent;
  background: #e8eef4;
  color: #555;
  cursor: pointer;
  margin-bottom: -1px;
}
.sql-block__tab--active {
  background: #fff;
  border-bottom-color: #2196f3;
  color: #1a1a1a;
}

.sql-block__editor-wrap {
  flex: 1 1 auto;
  min-height: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: #fff;
}

.sql-block__editor {
  width: 100%;
  flex: 1;
  min-height: 10rem;
  padding: 0.75rem;
  font-family: ui-monospace, monospace;
  font-size: 0.875rem;
  line-height: 1.5;
  border: none;
  resize: vertical;
  box-sizing: border-box;
  white-space: pre;
  overflow-wrap: normal;
}
.sql-block__editor:focus {
  outline: none;
}

.sql-block__solution {
  margin: 0;
  padding: 0.75rem;
  font-family: ui-monospace, monospace;
  font-size: 0.875rem;
  line-height: 1.4;
  color: #333;
  white-space: pre-wrap;
  word-break: break-word;
  overflow: auto;
  flex: 1;
}

.sql-block__tabs-actions {
  display: flex;
  align-items: center;
  gap: 0.875rem;
  margin-left: auto;
  margin-bottom: -1px;
}

.sql-block__copy-solution-btn {
  margin-right: 0;
  margin-bottom: 0;
  padding: 0.4rem 0.875rem;
  border-radius: 6px;
  font-size: 0.8125rem;
  font-weight: 600;
  border: 1px solid #0ea5e9;
  background: #e0f2fe;
  color: #0369a1;
  cursor: pointer;
}
.sql-block__copy-solution-btn:hover:not(:disabled) {
  background: #bae6fd;
  border-color: #0284c7;
  color: #075985;
}
.sql-block__copy-solution-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.sql-block__copy-solution-btn--mobile {
  margin-right: 0;
}

.sql-block__run-btn {
  margin-left: 0;
  margin-right: 0;
  margin-bottom: 0;
  padding: 0.4rem 1rem;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 600;
  border: 1px solid #2e7d32;
  border-radius: 6px;
  background: #2e7d32;
  color: white;
  cursor: pointer;
}
.sql-block__run-btn:hover:not(:disabled) {
  background: #1b5e20;
  border-color: #1b5e20;
}
.sql-block__run-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

/* Horizontal separator between query area and results */
.sql-block__divider {
  flex-shrink: 0;
  height: 0;
  border-top: 1px solid #c5d0de;
}

/* Results validation status bar — above results, shows match vs solution */
.sql-block__validation {
  flex-shrink: 0;
  padding: 0.4rem 1rem;
  font-size: 0.8125rem;
  font-weight: 500;
  border-bottom: 1px solid #e2e8f0;
}
.sql-block__validation--match {
  background: #dcfce7;
  color: #166534;
  border-bottom-color: #bbf7d0;
}
.sql-block__validation--mismatch {
  background: #fef3c7;
  color: #92400e;
  border-bottom-color: #fde68a;
}
.sql-block__validation--error {
  background: #fee2e2;
  color: #991b1b;
  border-bottom-color: #fecaca;
}

/* Results pane — 40% of container height */
.sql-block__results {
  flex: 5 1 0;
  min-height: 0;
  padding: 0.75rem 1rem;
  background: #fafafa;
  overflow: auto;
}

.sql-block__results-header {
  margin: 0 0 0.5rem 0;
  font-size: 0.6875rem;
  font-weight: 700;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.sql-block__error {
  color: #c62828;
  font-size: 0.875rem;
  font-family: ui-monospace, monospace;
}

.sql-block__table-wrap {
  overflow-x: auto;
  padding-left: 1.5rem;
}

.sql-block__table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.875rem;
}

.sql-block__th {
  padding: 0.4rem 0.6rem;
  text-align: left;
  font-weight: 600;
  background: #e8eef4;
  border: 1px solid #c5d0de;
}

.sql-block__tr {
  border-bottom: 1px solid #eee;
}
.sql-block__tr--issue {
  background: #fef2f2;
}

.sql-block__td {
  padding: 0.4rem 0.6rem;
  border: 1px solid #eee;
}
.sql-block__td--first {
  position: relative;
}
.sql-block__row-issue-dot {
  position: absolute;
  left: -1.25rem;
  top: 50%;
  transform: translateY(-50%);
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #dc2626;
}

.sql-block__empty {
  color: #888;
  font-size: 0.875rem;
}
</style>
