import { markRaw } from 'vue'
import { defineStore } from 'pinia'
import { PGlite } from '@electric-sql/pglite'

const SCHEMA_NAME = 'lesson'

export const useSqlInterpreterStore = defineStore('sqlInterpreter', {
  state: () => ({
    db: null,
    ready: false,
    activeBlockId: null,
    queryRunning: false
  }),

  getters: {
    isActive: (state) => (blockId) => state.activeBlockId === blockId,
    isQueryRunning: (state) => state.queryRunning
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

      const plain = toPlainPayload(payload)
      const tables = Array.isArray(plain.tables) && plain.tables.length > 0
        ? plain.tables
        : [{ tableName: plain.tableName ?? '', columns: plain.columns ?? [], rows: plain.rows ?? [] }]

      try {
        await this.db.exec(`DROP SCHEMA IF EXISTS ${SCHEMA_NAME} CASCADE;`)
        await this.db.exec(`CREATE SCHEMA ${SCHEMA_NAME};`)

        for (const { tableName, columns, rows } of tables) {
          const colDefs = (columns || [])
            .map((c) => `${escapeIdent(c.name)} ${mapType(c.type)}`)
            .join(', ')
          const tableRef = `${SCHEMA_NAME}.${escapeIdent(tableName)}`
          await this.db.exec(`CREATE TABLE ${tableRef} (${colDefs});`)

          if (Array.isArray(rows) && rows.length > 0) {
            const numCols = columns?.length ?? 0
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
    }
  }
})

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
