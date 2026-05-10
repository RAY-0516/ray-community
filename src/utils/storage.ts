/** localStorage 封装，带类型支持和 JSON 序列化 */

export function getStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

export function setStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    console.warn(`[storage] 写入失败: ${key}`)
  }
}

export function removeStorage(key: string): void {
  localStorage.removeItem(key)
}
