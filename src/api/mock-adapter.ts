import type { AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import dbJson from '../../db.json'

type Db = Record<string, any[]>
const db: Db = JSON.parse(JSON.stringify(dbJson))

function getPathParts(url: string): { collection: string; id: number | null } {
  const clean = url.replace(/^https?:\/\/[^/]+/, '').replace(/^\//, '')
  const parts = clean.split('/').filter(Boolean)
  return {
    collection: parts[0] || '',
    id: parts[1] ? Number(parts[1]) : null,
  }
}

function queryItems(collection: string, params: Record<string, any> = {}): any[] {
  let items = [...(db[collection] || [])]

  for (const [key, val] of Object.entries(params)) {
    if (key.startsWith('_')) continue
    if (key === 'q') {
      items = items.filter((item) =>
        JSON.stringify(item).toLowerCase().includes(String(val).toLowerCase())
      )
    } else {
      items = items.filter((item) => String(item[key]) === String(val))
    }
  }

  const sort = params._sort
  const order = params._order || 'asc'
  if (sort) {
    items.sort((a, b) => {
      const diff = a[sort] - b[sort]
      return order === 'desc' ? -diff : diff
    })
  }

  const page = params._page
  const limit = params._limit
  if (page && limit) {
    const start = (Number(page) - 1) * Number(limit)
    items = items.slice(start, start + Number(limit))
  }

  return items
}

function buildResponse<T>(data: T, status = 200): AxiosResponse<T> {
  return {
    data,
    status,
    statusText: 'OK',
    headers: {},
    config: {} as InternalAxiosRequestConfig,
  }
}

export default function mockAdapter(config: AxiosRequestConfig): Promise<AxiosResponse> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        const method = (config.method || 'get').toLowerCase()
        const { collection, id } = getPathParts(config.url || '')

        if (!collection || !db[collection]) {
          reject(new Error(`Collection not found: ${collection}`))
          return
        }

        if (method === 'get') {
          if (id !== null) {
            const item = db[collection].find((i) => i.id === id)
            if (!item) { reject(new Error('Not found')); return }
            resolve(buildResponse(item))
          } else {
            const items = queryItems(collection, config.params || {})
            resolve(buildResponse(items))
          }
          return
        }

        if (method === 'post') {
          const data = typeof config.data === 'string' ? JSON.parse(config.data) : config.data
          const maxId = db[collection].reduce((max, i) => Math.max(max, i.id || 0), 0)
          data.id = maxId + 1
          db[collection].push(data)
          resolve(buildResponse(data, 201))
          return
        }

        if (method === 'patch') {
          if (id === null) { reject(new Error('Missing id')); return }
          const data = typeof config.data === 'string' ? JSON.parse(config.data) : config.data
          const idx = db[collection].findIndex((i) => i.id === id)
          if (idx === -1) { reject(new Error('Not found')); return }
          db[collection][idx] = { ...db[collection][idx], ...data }
          resolve(buildResponse(db[collection][idx]))
          return
        }

        if (method === 'delete') {
          if (id === null) { reject(new Error('Missing id')); return }
          const idx = db[collection].findIndex((i) => i.id === id)
          if (idx === -1) { reject(new Error('Not found')); return }
          const deleted = db[collection].splice(idx, 1)[0]
          resolve(buildResponse(deleted))
          return
        }

        reject(new Error(`Unsupported method: ${method}`))
      } catch (err) {
        reject(err)
      }
    }, 50)
  })
}
