import request from './request'
import type { Order } from '@/types/order'
import type { CartItem } from '@/types/member'

export function createOrderAPI(data: {
  userId: number
  items: CartItem[]
  totalPrice: number
}) {
  return request.post<Order>('/orders', {
    ...data,
    status: 'paid',
    createdAt: new Date().toISOString(),
  })
}

export function fetchOrdersAPI(userId: number) {
  return request.get<Order[]>('/orders', { params: { userId, _sort: 'createdAt', _order: 'desc' } })
}

export function deleteOrderAPI(id: number) {
  return request.delete(`/orders/${id}`)
}
