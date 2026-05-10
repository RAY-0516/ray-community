import request from './request'
import type { Product, ProductFilter, Banner } from '@/types/product'

export function fetchProducts(params: ProductFilter = {}) {
  const query: Record<string, string | number> = {}
  if (params.category) query.category = params.category
  if (params.minPrice !== undefined) query.price_gte = params.minPrice
  if (params.maxPrice !== undefined) query.price_lte = params.maxPrice
  if (params.keyword) query.q = params.keyword
  if (params.page) query._page = params.page
  if (params.pageSize) query._limit = params.pageSize

  if (params.sortBy) {
    const sortMap: Record<string, string> = {
      price: 'price', sales: 'sales', rating: 'rating', newest: 'id',
    }
    query._sort = sortMap[params.sortBy] ?? 'id'
    query._order = params.sortOrder ?? 'desc'
  }

  return request.get<Product[]>('/products', { params: query })
}

export function fetchProduct(id: number) {
  return request.get<Product>(`/products/${id}`)
}

export function fetchBanners() {
  return request.get<Banner[]>('/banners')
}
