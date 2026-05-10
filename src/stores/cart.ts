import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { CartItem } from '@/types/member'
import { getStorage, setStorage } from '@/utils/storage'

export const useCartStore = defineStore('cart', () => {
  const items = ref<CartItem[]>(getStorage<CartItem[]>('ray-cart', []))

  const totalCount = computed(() => items.value.reduce((sum, item) => sum + item.quantity, 0))

  const totalPrice = computed(() =>
    items.value.reduce((sum, item) => {
      const price = Number(item.price) || 0
      const qty = Number(item.quantity) || 0
      const discount = Number(item.memberDiscount) || 1
      return sum + price * qty * discount
    }, 0)
  )

  function persist() {
    setStorage('ray-cart', items.value)
  }

  function addItem(item: CartItem) {
    const existing = items.value.find(
      (i) => i.productId === item.productId && i.color === item.color && i.size === item.size
    )
    if (existing) {
      existing.quantity += item.quantity
    } else {
      items.value.push({ ...item })
    }
    persist()
  }

  function removeItem(index: number) {
    items.value.splice(index, 1)
    persist()
  }

  function updateQuantity(index: number, qty: number) {
    if (qty < 1) return
    items.value[index].quantity = qty
    persist()
  }

  function clear() {
    items.value = []
    persist()
  }

  return { items, totalCount, totalPrice, addItem, removeItem, updateQuantity, clear, persist }
})
