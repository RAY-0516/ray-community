import type { CartItem } from './member'

/** 订单实体 */
export interface Order {
  id: number
  userId: number
  items: CartItem[]
  totalPrice: number
  status: OrderStatus
  createdAt: string
}

export type OrderStatus = 'paid' | 'shipped' | 'completed'
