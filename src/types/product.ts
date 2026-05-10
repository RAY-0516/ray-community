/** 商品分类 */
export type ProductCategory = '新品' | '女装' | '男装' | '配饰'

/** 商品实体 */
export interface Product {
  id: number
  name: string
  price: number
  originalPrice: number
  images: string[]
  category: ProductCategory
  tags: string[]
  rating: number
  sales: number
  stock: number
  colors: string[]
  sizes: string[]
  description: string
  isNew: boolean
  isHot: boolean
  memberDiscount: number
}

/** 商品筛选参数 */
export interface ProductFilter {
  category?: ProductCategory
  minPrice?: number
  maxPrice?: number
  sortBy?: 'price' | 'sales' | 'rating' | 'newest'
  sortOrder?: 'asc' | 'desc'
  keyword?: string
  page?: number
  pageSize?: number
}

/** 首页 Banner */
export interface Banner {
  id: number
  image: string
  link: string
  title: string
  subtitle?: string
}
