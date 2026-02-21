<template>
  <div class="block-container block-table">
    <div class="table-block__wrapper">
      <div class="table-block__scroll">
        <table class="table-block__table">
          <caption v-if="caption" class="table-block__caption" v-katex>{{ caption }}</caption>
          <thead>
            <tr>
              <th
                v-for="(header, colIndex) in headers"
                :key="'h-' + colIndex"
                class="table-block__th"
                :class="{ 'table-block__th--sortable': sortable }"
                scope="col"
                @click="sortable ? toggleSort(colIndex) : null"
              >
                <span v-katex>{{ header }}</span>
                <span
                  v-if="sortable && sortColumn === colIndex"
                  class="table-block__sort-icon"
                  aria-hidden
                >
                  {{ sortDir === 'asc' ? '↑' : '↓' }}
                </span>
              </th>
            </tr>
            <tr v-if="filterable" class="table-block__filter-row">
              <th
                v-for="(header, colIndex) in headers"
                :key="'f-' + colIndex"
                class="table-block__th table-block__th--filter"
              >
                <input
                  v-model="columnFilters[colIndex]"
                  type="search"
                  class="table-block__column-filter"
                  :placeholder="`Filter by ${header}`"
                  :aria-label="`Filter by ${header}`"
                />
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(row, rowIndex) in displayRows"
              :key="rowIndex"
              class="table-block__tr"
            >
              <td
                v-for="(cell, cellIndex) in row"
                :key="cellIndex"
                class="table-block__td"
                v-katex
              >
                {{ cell }}
              </td>
            </tr>
          </tbody>
          <tfoot v-if="footer?.length">
            <tr class="table-block__tr table-block__tr--footer">
              <td
                v-for="(cell, cellIndex) in footer"
                :key="cellIndex"
                class="table-block__td table-block__td--footer"
                v-katex
              >
                {{ cell }}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  caption: { type: String, default: '' },
  headers: { type: Array, default: () => [] },
  rows: { type: Array, default: () => [] },
  footer: { type: Array, default: () => null },
  sortable: { type: Boolean, default: false },
  filterable: { type: Boolean, default: false }
})

const sortColumn = ref(-1)
const sortDir = ref('asc')
const columnFilters = ref({})

const filteredRows = computed(() => {
  if (!props.filterable) return props.rows ?? []
  const filters = columnFilters.value
  const numCols = props.headers?.length ?? 0
  const hasFilter = numCols > 0 && Object.keys(filters).some(i => filters[i]?.trim())
  if (!hasFilter) return props.rows ?? []
  return (props.rows ?? []).filter(row => {
    for (let c = 0; c < numCols; c++) {
      const q = filters[c]?.trim()
      if (!q) continue
      const cell = row[c] != null ? String(row[c]) : ''
      if (!cell.toLowerCase().includes(q.toLowerCase())) return false
    }
    return true
  })
})

const displayRows = computed(() => {
  const rows = filteredRows.value
  if (!props.sortable || sortColumn.value < 0 || sortColumn.value >= (props.headers?.length ?? 0)) {
    return rows
  }
  const col = sortColumn.value
  const dir = sortDir.value === 'asc' ? 1 : -1
  return [...rows].sort((a, b) => {
    const va = a[col] != null ? a[col] : ''
    const vb = b[col] != null ? b[col] : ''
    const na = Number(va)
    const nb = Number(vb)
    if (!Number.isNaN(na) && !Number.isNaN(nb)) return dir * (na - nb)
    return dir * String(va).localeCompare(String(vb), undefined, { numeric: true })
  })
})

function toggleSort(colIndex) {
  if (sortColumn.value === colIndex) {
    sortDir.value = sortDir.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortColumn.value = colIndex
    sortDir.value = 'asc'
  }
}
</script>

<style scoped>
.block-table {
  flex: 0 0 auto;
  width: 100%;
}

.table-block__wrapper {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.table-block__scroll {
  overflow-x: auto;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background: #fff;
}

.table-block__table {
  width: 100%;
  border-collapse: collapse;
  font-size: clamp(0.8125rem, 2vw, 0.9375rem);
}

.table-block__caption {
  padding: 0.5rem 0.75rem;
  text-align: left;
  font-weight: 600;
  color: #1a1a1a;
  background: #f5f5f5;
  border-bottom: 1px solid #e0e0e0;
}

.table-block__th {
  padding: 0.6rem 0.75rem;
  text-align: left;
  font-weight: 600;
  color: #333;
  background: #f0f4f8;
  border-bottom: 2px solid #c5d0de;
  white-space: nowrap;
}
.table-block__th--sortable {
  cursor: pointer;
  user-select: none;
}
.table-block__th--sortable:hover {
  background: #e3eaf2;
}

.table-block__filter-row .table-block__th {
  vertical-align: bottom;
  padding: 0.25rem 0.35rem;
  border-bottom: 1px solid #c5d0de;
}
.table-block__th--filter {
  background: #e8eef4;
}
.table-block__column-filter {
  width: 100%;
  min-width: 4rem;
  padding: 0.35rem 0.5rem;
  border: 1px solid #c5d0de;
  border-radius: 4px;
  font-size: 0.8125rem;
  background: #fff;
}
.table-block__column-filter:focus {
  outline: 2px solid #2196f3;
  outline-offset: 1px;
  border-color: #2196f3;
}
.table-block__column-filter::placeholder {
  color: #888;
}

.table-block__sort-icon {
  margin-left: 0.35rem;
  font-size: 0.85em;
  color: #2196f3;
}

.table-block__tr {
  border-bottom: 1px solid #eee;
}
.table-block__tr:hover {
  background: #fafafa;
}
.table-block__tr--footer {
  border-bottom: none;
  font-weight: 600;
}
.table-block__tr--footer:hover {
  background: transparent;
}

.table-block__td {
  padding: 0.5rem 0.75rem;
  color: #333;
  vertical-align: top;
}
.table-block__td--footer {
  background: #f5f5f5;
  border-top: 2px solid #e0e0e0;
}

.table-block__caption :deep(.katex),
.table-block__th :deep(.katex),
.table-block__td :deep(.katex) {
  margin: 0 0.1em;
}
</style>
