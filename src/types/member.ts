import type { MemberLevel, MemberLevelConfig } from './user'

export type { MemberLevel, MemberLevelConfig }

/** 购物车条目 */
export interface CartItem {
  productId: number
  name: string
  image: string
  price: number
  color: string
  size: string
  quantity: number
  memberDiscount: number
}
