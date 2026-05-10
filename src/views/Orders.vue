<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { fetchOrdersAPI, createOrderAPI, deleteOrderAPI } from '@/api/order'
import { ElMessageBox, ElMessage } from 'element-plus'
import { useCartStore } from '@/stores/cart'
import { useThemeStore } from '@/stores/theme'
import { formatPrice, formatDate } from '@/utils/format'
import type { Order } from '@/types/order'
import AppLayout from '@/components/layout/AppLayout.vue'
import EmptyState from '@/components/common/EmptyState.vue'
import LoadingSkeleton from '@/components/common/LoadingSkeleton.vue'

const router = useRouter()
const userStore = useUserStore()
const cartStore = useCartStore()
const themeStore = useThemeStore()

const orders = ref<Order[]>([])
const loading = ref(true)

const statusMap: Record<string, string> = { paid: '已支付', shipped: '已发货', completed: '已完成' }

onMounted(async () => {
  if (!userStore.isLoggedIn) {
    router.push('/login')
    return
  }
  try {
    const res = await fetchOrdersAPI(userStore.user!.id)
    orders.value = res.data
  } finally {
    loading.value = false
  }
})

async function handleCheckout() {
  if (!cartStore.items.length) return
  try {
    await createOrderAPI({
      userId: userStore.user!.id,
      items: [...cartStore.items],
      totalPrice: cartStore.totalPrice,
    })
    cartStore.clear()
    loadOrders()
  } catch {
    // handled by interceptor
  }
}

async function loadOrders() {
  loading.value = true
  try {
    const res = await fetchOrdersAPI(userStore.user!.id)
    orders.value = res.data
  } finally { loading.value = false }
}

async function handleDelete(orderId: number) {
  try {
    await ElMessageBox.confirm('确定要删除此订单吗？', '确认删除', { confirmButtonText: '删除', cancelButtonText: '取消', type: 'warning' })
    await deleteOrderAPI(orderId)
    orders.value = orders.value.filter(o => o.id !== orderId)
    ElMessage.success('订单已删除')
  } catch {
    // 取消或失败
  }
}
</script>

<template>
  <AppLayout>
    <div class="orders-page">
      <h1 class="page-title">📦 我的订单</h1>

      <!-- 购物车结算 -->
      <div v-if="cartStore.items.length" class="checkout-bar">
        <span>购物车有 {{ cartStore.totalCount }} 件商品，合计 {{ formatPrice(cartStore.totalPrice) }}</span>
        <el-button type="primary" round @click="handleCheckout">立即结算</el-button>
      </div>

      <!-- 订单列表 -->
      <LoadingSkeleton v-if="loading" type="list" :rows="2" />
      <EmptyState v-else-if="!orders.length" message="暂无订单" @action="router.push('/shop')">
        <template #action-text>去逛逛</template>
      </EmptyState>
      <div v-else class="order-list">
        <div v-for="order in orders" :key="order.id" class="order-card">
          <div class="order-header">
            <span class="order-id">订单 #{{ order.id }}</span>
            <el-tag :type="order.status === 'completed' ? 'success' : order.status === 'shipped' ? 'warning' : ''" size="small">
              {{ statusMap[order.status] }}
            </el-tag>
            <span class="order-date">{{ formatDate(order.createdAt) }}</span>
            <el-button type="danger" size="small" text @click.stop="handleDelete(order.id)">删除</el-button>
          </div>
          <div class="order-items">
            <div v-for="item in order.items" :key="item.productId" class="order-item">
              <img :src="item.image" :alt="item.name" class="order-item-img" />
              <div class="order-item-info">
                <span class="order-item-name">{{ item.name }}</span>
                <span class="order-item-spec">{{ item.color }} / {{ item.size }} × {{ item.quantity }}</span>
              </div>
              <span class="order-item-price">{{ formatPrice(item.price * item.memberDiscount) }}</span>
            </div>
          </div>
          <div class="order-footer">
            <span class="order-total">合计: <strong>{{ formatPrice(order.totalPrice) }}</strong></span>
          </div>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<style scoped>
.orders-page { max-width: 720px; margin: 0 auto; }
.page-title { font-size: var(--font-size-xl); font-weight: 700; margin-bottom: var(--spacing-lg); }

.checkout-bar {
  display: flex; justify-content: space-between; align-items: center;
  padding: var(--spacing-md); background: var(--color-bg-card);
  border-radius: var(--radius-md); border: 1px solid var(--color-primary-light);
  margin-bottom: var(--spacing-lg); font-size: var(--font-size-base);
}

.order-list { display: flex; flex-direction: column; gap: var(--spacing-md); }

.order-card {
  background: var(--color-bg-card); border-radius: var(--radius-md);
  border: 1px solid var(--color-border-light); padding: var(--spacing-md);
}

.order-header {
  display: flex; align-items: center; gap: var(--spacing-md);
  padding-bottom: var(--spacing-sm); border-bottom: 1px solid var(--color-divider);
  margin-bottom: var(--spacing-sm);
}

.order-id { font-weight: 600; font-size: var(--font-size-base); }
.order-date { margin-left: auto; font-size: var(--font-size-xs); color: var(--color-text-muted); }

.order-item {
  display: flex; align-items: center; gap: var(--spacing-md);
  padding: var(--spacing-sm) 0;
}

.order-item-img {
  width: 56px; height: 72px; object-fit: cover; border-radius: var(--radius-sm);
}

.order-item-info { flex: 1; min-width: 0; }
.order-item-name { font-size: var(--font-size-sm); font-weight: 500; display: block; }
.order-item-spec { font-size: var(--font-size-xs); color: var(--color-text-muted); }
.order-item-price { font-weight: 600; color: var(--color-primary); font-size: var(--font-size-sm); }

.order-footer {
  text-align: right; padding-top: var(--spacing-sm);
  border-top: 1px solid var(--color-divider);
}

.order-total { font-size: var(--font-size-base); }
.order-total strong { color: var(--color-primary); font-size: var(--font-size-md); }
</style>
