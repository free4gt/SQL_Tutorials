import { markRaw } from 'vue'
import { defineStore } from 'pinia'
import { PGlite } from '@electric-sql/pglite'

const SCHEMA_NAME = 'lesson'
/** Skip content fingerprint for result sets larger than this to avoid huge strings and slow SHA-256. */
const MAX_ROWS_FOR_FINGERPRINT = 50000

export const useSqlInterpreterStore = defineStore('sqlInterpreter', {
  state: () => ({
    db: null,
    ready: false,
    activeBlockId: null,
    queryRunning: false,
    /** Per-block validation state so each SQL interpreter shows only its own warnings. Key: blockId. */
    blockValidation: {}
  }),

  getters: {
    isActive: (state) => (blockId) => state.activeBlockId === blockId,
    isQueryRunning: (state) => state.queryRunning,
    /** Get validation state for a block. Returns a safe object with nulls if block has no data. */
    getBlockValidation(state) {
      return (blockId) => {
        const d = state.blockValidation[blockId]
        if (!d || typeof d !== 'object') {
          return {
            solutionStatus: null,
            solutionValidationMessage: null,
            expectedColumnNames: null,
            expectedRowCount: null,
            expectedResultFingerprint: null,
            userResultFingerprint: null,
            expectedHashCounts: null,
            userRowHashes: null
          }
        }
        return d
      }
    },
    /** Booleans per user result row for a block. Only used when fingerprint fails. */
    userRowIssueFlags(state) {
      return (blockId) => {
        const d = state.blockValidation[blockId]
        const expected = d?.expectedHashCounts
        const rowHashes = d?.userRowHashes
        if (!expected || !Array.isArray(rowHashes) || rowHashes.length === 0) return []
        const userCounts = {}
        for (const h of rowHashes) {
          userCounts[h] = (userCounts[h] || 0) + 1
        }
        const problematic = new Set()
        const allHashes = new Set([...Object.keys(expected), ...rowHashes])
        for (const h of allHashes) {
          if ((expected[h] || 0) !== (userCounts[h] || 0)) problematic.add(h)
        }
        return rowHashes.map((h) => problematic.has(h))
      }
    }
  },

  actions: {
    // One-time init: create PGLite, wait for its waitReady promise (no polling).
    // Green light = waitReady resolved; red = not yet or failed.
    async initDb() {
      if (this.db) return
      try {
        const db = new PGlite()
        this.db = markRaw(db)
        await db.waitReady
        this.ready = true
      } catch (err) {
        console.error('SQL interpreter: failed to init PGLite', err)
      }
    },

    async startLesson(blockId, payload) {
      if (!this.db || !this.ready) return
      this.activeBlockId = blockId
      if (!this.blockValidation[blockId]) this.blockValidation[blockId] = {}
      const b = this.blockValidation[blockId]
      b.solutionStatus = null
      b.solutionValidationMessage = null
      b.expectedColumnNames = null
      b.expectedRowCount = null
      b.expectedResultFingerprint = null
      b.userResultFingerprint = null
      b.expectedHashCounts = null
      b.userRowHashes = null

      const plain = toPlainPayload(payload)
      const tables = Array.isArray(plain.tables) && plain.tables.length > 0
        ? plain.tables
        : [{ tableName: plain.tableName ?? '', columns: plain.columns ?? [], rows: plain.rows ?? [] }]

      try {
        await this.db.exec(`DROP SCHEMA IF EXISTS ${SCHEMA_NAME} CASCADE;`)
        await this.db.exec(`CREATE SCHEMA ${SCHEMA_NAME};`)

        for (const { tableName, columns, rows } of tables) {
          const normCols = (columns || []).map(normalizeColumn).filter(Boolean)
          if (normCols.length === 0) continue
          const colDefs = normCols
            .map((c) => `${escapeIdent(c.name)} ${mapType(c.type)}`)
            .join(', ')
          const tableRef = `${SCHEMA_NAME}.${escapeIdent(tableName)}`
          await this.db.exec(`CREATE TABLE ${tableRef} (${colDefs});`)

          if (Array.isArray(rows) && rows.length > 0) {
            const numCols = normCols.length
            for (const row of rows) {
              const vals = row.slice(0, numCols).map((v) => formatValue(v))
              await this.db.exec(
                `INSERT INTO ${tableRef} VALUES (${vals.join(', ')})`
              )
            }
          }
        }
      } catch (err) {
        console.error('SQL interpreter: startLesson failed', err)
      }
    },

    async runQuery(sql) {
      if (!this.db || !this.ready || this.queryRunning) return { rows: [], columns: [], error: null }
      this.queryRunning = true
      try {
        await this.db.exec(`SET search_path TO ${SCHEMA_NAME};`)
        const result = await this.db.query(sql.trim())
        let rawRows = []
        let fields = []
        try {
          rawRows = Array.isArray(result?.rows) ? result.rows : []
          fields = Array.isArray(result?.fields) ? result.fields : []
        } catch (_) {
          rawRows = []
          fields = []
        }
        const columnNames = Array.isArray(fields) && fields.length > 0
          ? fields.map((f) => (f && typeof f.name === 'string' ? f.name : null)).filter(Boolean)
          : (() => {
              if (rawRows.length === 0) return []
              try {
                const first = rawRows[0]
                if (first && typeof first === 'object') return Object.keys(first)
              } catch (_) {}
              return []
            })()
        const rows = rawRows.map((row) => {
          const plain = {}
          for (const name of columnNames) {
            try {
              plain[name] = row[name]
            } catch (_) {
              plain[name] = null
            }
          }
          if (columnNames.length === 0 && row && typeof row === 'object') {
            try {
              for (const k of Object.keys(row)) plain[k] = row[k]
            } catch (_) {}
          }
          return plain
        })
        return { rows, columns: columnNames.length ? columnNames : (rows[0] ? Object.keys(rows[0]) : []), error: null }
      } catch (err) {
        return { rows: [], columns: [], error: err?.message ?? String(err) }
      } finally {
        this.queryRunning = false
      }
    },

    /** SQL results validation: set expected column names and row count from running the solution (for the given block). */
    setExpectedFromResult(blockId, columnNames, rowCount) {
      if (!this.blockValidation[blockId]) this.blockValidation[blockId] = {}
      const b = this.blockValidation[blockId]
      b.expectedColumnNames =
        Array.isArray(columnNames) && columnNames.length > 0
          ? columnNames.map((n) => (n != null ? String(n) : ''))
          : null
      const num = rowCount != null ? Number(rowCount) : NaN
      b.expectedRowCount = Number.isInteger(num) && num >= 0 ? num : null
    },

    setExpectedFingerprint(blockId, fingerprint, hashCounts) {
      if (!this.blockValidation[blockId]) this.blockValidation[blockId] = {}
      const b = this.blockValidation[blockId]
      b.expectedResultFingerprint = fingerprint != null ? String(fingerprint) : null
      b.expectedHashCounts =
        hashCounts != null && typeof hashCounts === 'object' && !Array.isArray(hashCounts)
          ? { ...hashCounts }
          : null
    },

    setUserResultFingerprint(blockId, fingerprint, rowHashes) {
      if (!this.blockValidation[blockId]) this.blockValidation[blockId] = {}
      const b = this.blockValidation[blockId]
      b.userResultFingerprint = fingerprint != null ? String(fingerprint) : null
      b.userRowHashes = Array.isArray(rowHashes) ? [...rowHashes] : null
    },

    /**
     * Compute SHA-256 content fingerprint using a sequential chain (no huge string).
     * 1. Order the columns (sort by name, case-insensitive).
     * 2. For each row: build string from ordered columns, hash it → list of row hashes.
     * 3. Sort that list of hashes.
     * 4. Sequential chain: acc = H(acc + "\n" + next) for each sorted hash → top-level fingerprint.
     * Also returns hashCounts (for hash-count comparison when fingerprint fails) and rowHashes (for per-row red dots).
     * Skipped for large result sets (see MAX_ROWS_FOR_FINGERPRINT).
     */
    async computeResultFingerprint(rows, columns) {
      const rowList = Array.isArray(rows) ? rows : []
      if (rowList.length > MAX_ROWS_FOR_FINGERPRINT) return null
      const cols = Array.isArray(columns) ? columns : []
      const orderedCols = [...cols].sort((a, b) =>
        String(a).toLowerCase().localeCompare(String(b).toLowerCase())
      )
      const rowHashes = await Promise.all(
        rowList.map((row) => {
          const parts = orderedCols.map((col) => {
            const key = Object.keys(row).find(
              (k) => String(k).toLowerCase() === String(col).toLowerCase()
            )
            const val = key != null ? row[key] : null
            return `${String(col).toLowerCase()}:${JSON.stringify(val ?? null)}`
          })
          return sha256Hex(parts.join('|'))
        })
      )
      rowHashes.sort()
      const hashCounts = {}
      for (const h of rowHashes) {
        hashCounts[h] = (hashCounts[h] || 0) + 1
      }
      let fingerprint
      if (rowHashes.length === 0) {
        fingerprint = await sha256Hex('')
      } else {
        let acc = rowHashes[0]
        for (let i = 1; i < rowHashes.length; i++) {
          acc = await sha256Hex(acc + '\n' + rowHashes[i])
        }
        fingerprint = acc
      }
      return { fingerprint, hashCounts, rowHashes }
    },

    setSolutionOk(blockId) {
      if (!this.blockValidation[blockId]) this.blockValidation[blockId] = {}
      this.blockValidation[blockId].solutionStatus = 'ok'
      this.blockValidation[blockId].solutionValidationMessage = null
    },

    setSolutionFailed(blockId, reason) {
      if (!this.blockValidation[blockId]) this.blockValidation[blockId] = {}
      this.blockValidation[blockId].solutionStatus = 'failed'
      const base = 'Solution failed.'
      this.blockValidation[blockId].solutionValidationMessage =
        reason && String(reason).trim() ? `${base} ${String(reason).trim()}` : base
    },

    setSolutionDuplicateColumns(blockId) {
      if (!this.blockValidation[blockId]) this.blockValidation[blockId] = {}
      this.blockValidation[blockId].solutionStatus = 'duplicate_columns'
      this.blockValidation[blockId].solutionValidationMessage = 'Solution failed (duplicate column name).'
    },

    /** Returns true if the column names array has duplicates. */
    hasDuplicateColumnNames(columns) {
      if (!Array.isArray(columns) || columns.length === 0) return false
      const seen = new Set()
      for (const name of columns) {
        if (seen.has(name)) return true
        seen.add(name)
      }
      return false
    },

    /**
     * Returns true if two column name arrays match case-insensitively, order-invariant (same set of names).
     */
    columnNamesMatchCaseInsensitive(expected, actual) {
      if (!Array.isArray(expected) || !Array.isArray(actual)) return false
      if (expected.length !== actual.length) return false
      const sortedExpected = [...expected]
        .map((n) => String(n).toLowerCase())
        .sort()
      const sortedActual = [...actual]
        .map((n) => String(n ?? '').toLowerCase())
        .sort()
      return sortedExpected.every((name, i) => name === sortedActual[i])
    },

    /**
     * SQL results validation: message for the status bar (for the given block).
     * Precedence: 1) solution bad, 2) user duplicate columns, 3) column names, 4) row count, 5) match.
     */
    getValidationMessage(blockId, resultColumns, resultRowCount) {
      const d = this.blockValidation[blockId]
      if (!d) return null
      const cols = Array.isArray(resultColumns) ? resultColumns : []
      const gotRow = resultRowCount == null ? 0 : Number(resultRowCount)
      const expNames = d.expectedColumnNames
      const expRow = d.expectedRowCount
      const expFp = d.expectedResultFingerprint
      const userFp = d.userResultFingerprint

      if (d.solutionStatus === 'failed' || d.solutionStatus === 'duplicate_columns') {
        return d.solutionValidationMessage
      }
      if (this.hasDuplicateColumnNames(cols)) {
        return 'Duplicate column names in result.'
      }
      if (expNames == null && expRow == null) return null
      if (expNames != null && !this.columnNamesMatchCaseInsensitive(expNames, cols)) {
        const expectedStr = expNames.join(', ')
        const gotStr = cols.length ? cols.join(', ') : '(none)'
        return `Wrong columns (expected: ${expectedStr}; got: ${gotStr})`
      }
      if (expRow != null && gotRow !== expRow) {
        return `Wrong row count (expected ${expRow}, got ${gotRow})`
      }
      if (expFp != null && userFp != null && userFp !== expFp) {
        return 'Result values don\'t match solution.'
      }
      return `success: columns match, ${gotRow} row${gotRow !== 1 ? 's' : ''}, values match`
    }
  }
})

async function sha256Hex(str) {
  const enc = new TextEncoder().encode(str)
  const buf = await crypto.subtle.digest('SHA-256', enc)
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

function toPlainPayload(payload) {
  if (payload == null) return { tableName: '', columns: [], rows: [], tables: [] }
  try {
    const tables = Array.isArray(payload.tables)
      ? payload.tables.map((t) => ({
          tableName: t?.tableName ?? '',
          columns: Array.isArray(t?.columns) ? t.columns : [],
          rows: Array.isArray(t?.rows) ? t.rows : []
        }))
      : []
    return JSON.parse(JSON.stringify({
      tableName: payload.tableName ?? '',
      columns: Array.isArray(payload.columns) ? payload.columns : [],
      rows: Array.isArray(payload.rows) ? payload.rows : [],
      tables
    }))
  } catch (_) {
    return {
      tableName: String(payload.tableName ?? ''),
      columns: [],
      rows: [],
      tables: []
    }
  }
}

/** Normalize column to { name, type }. Accepts string (column name, type 'text') or object { name, type }. */
function normalizeColumn(c) {
  if (c != null && typeof c === 'object' && typeof c.name === 'string') {
    return { name: c.name, type: c.type }
  }
  if (typeof c === 'string' && c.trim() !== '') {
    return { name: c.trim(), type: 'text' }
  }
  return null
}

function escapeIdent(name) {
  if (typeof name !== 'string') return '"unknown"'
  return `"${name.replace(/"/g, '""')}"`
}

function mapType(type) {
  const t = (type || 'text').toLowerCase()
  if (t === 'int' || t === 'integer') return 'integer'
  if (t === 'bigint') return 'bigint'
  if (t === 'real' || t === 'float' || t === 'double') return 'double precision'
  if (t === 'bool' || t === 'boolean') return 'boolean'
  if (t === 'date') return 'date'
  if (t === 'timestamp') return 'timestamp'
  return 'text'
}

function formatValue(v) {
  if (v == null) return 'NULL'
  if (typeof v === 'number' && !Number.isNaN(v)) return String(v)
  if (typeof v === 'boolean') return v ? 'TRUE' : 'FALSE'
  const s = String(v)
  return `'${s.replace(/'/g, "''")}'`
}
