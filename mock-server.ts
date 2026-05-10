import type { Plugin } from 'vite'
import { readFileSync } from 'fs'
import { resolve } from 'path'

export function mockServer(): Plugin {
  const dbPath = resolve(__dirname, 'db.json')
  let db: Record<string, any[]>

  function loadDb() {
    db = JSON.parse(readFileSync(dbPath, 'utf-8'))
  }

  function saveDb() {
    const fs = require('fs')
    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2))
  }

  return {
    name: 'mock-server',
    configureServer(server) {
      loadDb()

      server.middlewares.use('/api', (req, res, next) => {
        const url = new URL(req.url!, `http://${req.headers.host}`)
        const parts = url.pathname.replace(/^\/api\/?/, '').split('/').filter(Boolean)
        const collection = parts[0]
        const id = parts[1] ? Number(parts[1]) : null

        if (!collection || !db[collection]) {
          res.writeHead(404, { 'Content-Type': 'application/json' })
          res.end(JSON.stringify({ error: 'Not found' }))
          return
        }

        // CORS
        res.setHeader('Access-Control-Allow-Origin', '*')
        res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PATCH,DELETE,OPTIONS')
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

        if (req.method === 'OPTIONS') {
          res.writeHead(204)
          res.end()
          return
        }

        let body = ''
        req.on('data', (chunk: Buffer) => { body += chunk.toString() })
        req.on('end', () => {
          res.setHeader('Content-Type', 'application/json')

          if (req.method === 'GET') {
            let items = [...db[collection]]

            // Filter
            for (const [key, val] of url.searchParams.entries()) {
              if (key.startsWith('_')) continue
              if (key === 'q') {
                items = items.filter((item: any) =>
                  JSON.stringify(item).toLowerCase().includes(val.toLowerCase())
                )
              } else {
                items = items.filter((item: any) => String(item[key]) === val)
              }
            }

            // Sort
            const sort = url.searchParams.get('_sort')
            const order = url.searchParams.get('_order') || 'asc'
            if (sort) {
              items.sort((a: any, b: any) => {
                const diff = a[sort] - b[sort]
                return order === 'desc' ? -diff : diff
              })
            }

            // Single item
            if (id !== null) {
              const item = db[collection].find((i: any) => i.id === id)
              if (!item) { res.writeHead(404); res.end('null'); return }
              res.writeHead(200)
              res.end(JSON.stringify(item))
              return
            }

            // Pagination
            const page = url.searchParams.get('_page')
            const limit = url.searchParams.get('_limit')
            if (page && limit) {
              const start = (Number(page) - 1) * Number(limit)
              items = items.slice(start, start + Number(limit))
              res.setHeader('X-Total-Count', String(db[collection].length))
            }

            res.writeHead(200)
            res.end(JSON.stringify(items))
            return
          }

          if (req.method === 'POST') {
            const data = JSON.parse(body || '{}')
            const maxId = db[collection].reduce((max: number, i: any) => Math.max(max, i.id || 0), 0)
            data.id = maxId + 1
            db[collection].push(data)
            saveDb()
            res.writeHead(201)
            res.end(JSON.stringify(data))
            return
          }

          if (req.method === 'PATCH') {
            if (id === null) { res.writeHead(400); res.end('Missing id'); return }
            const data = JSON.parse(body || '{}')
            const idx = db[collection].findIndex((i: any) => i.id === id)
            if (idx === -1) { res.writeHead(404); res.end('null'); return }
            db[collection][idx] = { ...db[collection][idx], ...data }
            saveDb()
            res.writeHead(200)
            res.end(JSON.stringify(db[collection][idx]))
            return
          }

          if (req.method === 'DELETE') {
            if (id === null) { res.writeHead(400); res.end('Missing id'); return }
            const idx = db[collection].findIndex((i: any) => i.id === id)
            if (idx === -1) { res.writeHead(404); res.end('null'); return }
            const deleted = db[collection].splice(idx, 1)[0]
            saveDb()
            res.writeHead(200)
            res.end(JSON.stringify(deleted))
            return
          }

          next()
        })
      })
    },
  }
}
