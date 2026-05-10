/** 格式化价格（保留两位小数，千分位） */
export function formatPrice(price: number): string {
  if (!isFinite(price)) return '¥0.00'
  return `¥${price.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`
}

/** 格式化日期为相对时间 */
export function formatRelativeTime(dateStr: string): string {
  const now = Date.now()
  const date = new Date(dateStr).getTime()
  const diff = now - date

  const minute = 60 * 1000
  const hour = 60 * minute
  const day = 24 * hour

  if (diff < minute) return '刚刚'
  if (diff < hour) return `${Math.floor(diff / minute)}分钟前`
  if (diff < day) return `${Math.floor(diff / hour)}小时前`
  if (diff < 7 * day) return `${Math.floor(diff / day)}天前`
  return formatDate(dateStr)
}

/** 格式化日期 */
export function formatDate(dateStr: string): string {
  const d = new Date(dateStr)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

/** 格式化销量 */
export function formatSales(count: number): string {
  if (count >= 10000) return `${(count / 10000).toFixed(1)}万`
  if (count >= 1000) return `${(count / 1000).toFixed(1)}k`
  return String(count)
}
