<template>
  <div class="block-container block-sql">
    <div class="sql-block__container">
      <header class="sql-block__header">
        <span class="sql-block__header-title">Postgres SQL client</span>
        <div
          class="sql-block__status"
          :class="{ 'sql-block__status--ready': store.ready }"
          :title="store.ready ? 'PGLite waitReady resolved — client can run queries. (No polling.)' : 'Waiting for PGLite to finish loading (waitReady).'"
        >
          <span class="sql-block__status-dot" aria-hidden="true" />
          <span class="sql-block__status-text">{{ store.ready ? 'Ready' : 'Loading…' }}</span>
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
            <h4 class="sql-block__instructions-title">Instructions</h4>
            <div class="sql-block__instructions-body">{{ instructions || ' ' }}</div>
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
                  <button
                    type="button"
                    class="sql-block__run-btn"
                    :disabled="store.isQueryRunning"
                    @click="onRun"
                  >
                    {{ store.isQueryRunning ? 'Running…' : 'Run' }}
                  </button>
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
                <h4 class="sql-block__instructions-title">Instructions</h4>
                <div class="sql-block__instructions-body">{{ instructions || ' ' }}</div>
              </div>
            </div>
          </template>
        </div>
      </div>
      <div class="sql-block__divider" aria-hidden="true" />
      <div class="sql-block__results">
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
              >
                <td
                  v-for="(colName, cellIndex) in resultColumns"
                  :key="cellIndex"
                  class="sql-block__td"
                >
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
const selectedTableIndex = ref(0)
const resultRows = ref([])
const resultColumns = ref([])
const resultError = ref(null)
const hasRunOnce = ref(false)

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

const formattedSolution = computed(() => {
  const raw = (props.solution ?? '').trim()
  if (!raw) return ''
  try {
    return format(raw, { language: 'postgresql', keywordCase: 'upper', tabWidth: 2 })
  } catch (_) {
    return raw
  }
})

async function onStart() {
  const payload = toPlainLessonPayload(props)
  await store.startLesson(blockId, payload)
  resultRows.value = []
  resultColumns.value = []
  resultError.value = null
  hasRunOnce.value = false
}

async function onRun() {
  const sql = queryText.value.trim()
  if (!sql) return
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
  }
}

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
.sql-block__mobile-pane .sql-block__instructions-title {
  flex-shrink: 0;
  margin: 0 0 0.35rem 0;
}
.sql-block__mobile-pane .sql-block__instructions-body {
  flex: 1;
  min-height: 0;
  overflow: auto;
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
  width: 100%;
}

/* Mobile only: hide scrollbars on SQL interpreter */
@media (max-width: 768px) {
  .sql-block__mobile,
  .sql-block__mobile-central,
  .sql-block__mobile-pane .sql-block__editor-wrap,
  .sql-block__mobile-pane .sql-block__instructions-body,
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

.sql-block__instructions-body {
  flex: 1;
  padding: 0.6rem;
  font-size: 0.75rem;
  line-height: 1.45;
  color: #334155;
  white-space: pre-wrap;
  word-break: break-word;
  overflow-y: auto;
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

.sql-block__run-btn {
  margin-left: auto;
  margin-right: 0;
  margin-bottom: -1px;
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

/* Results pane — 40% of container height */
.sql-block__results {
  flex: 5 1 0;
  min-height: 0;
  padding: 0.75rem 1rem;
  background: #fafafa;
  overflow: auto;
}

.sql-block__error {
  color: #c62828;
  font-size: 0.875rem;
  font-family: ui-monospace, monospace;
}

.sql-block__table-wrap {
  overflow-x: auto;
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

.sql-block__td {
  padding: 0.4rem 0.6rem;
  border: 1px solid #eee;
}

.sql-block__empty {
  color: #888;
  font-size: 0.875rem;
}
</style>
