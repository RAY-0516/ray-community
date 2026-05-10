<script setup lang="ts">
import { Delete } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cart'
import { useTheme } from '@/composables/useTheme'
import { formatPrice } from '@/utils/format'
import AppLayout from '@/components/layout/AppLayout.vue'
import EmptyState from '@/components/common/EmptyState.vue'

const router = useRouter()
const cartStore = useCartStore()
const { t } = useTheme()

function goProduct(id: number) {
  router.push({ name: 'product-detail', params: { id } })
}
</script>

<template>
  <AppLayout>
    <div class="cart-page">
      <h1 class="page-title">🛒 {{ t.cart.title }}</h1>

      <EmptyState v-if="!cartStore.items.length" :message="t.cart.empty" @action="router.push('/shop')">
        <template #action-text>{{ t.cart.goShop }}</template>
      </EmptyState>

      <template v-else>
        <div class="cart-list">
          <div
            v-for="(item, index) in cartStore.items"
            :key="`${item.productId}-${item.color}-${item.size}`"
            class="cart-item"
          >
            <div class="cart-item-main" @click="goProduct(item.productId)">
              <img :src="item.image" :alt="item.name" class="cart-item-img" />
              <div class="cart-item-info">
                <h3 class="cart-item-name">{{ item.name }}</h3>
                <p class="cart-item-spec">颜色: {{ item.color }} / 尺码: {{ item.size }}</p>
                <p class="cart-item-price">{{ formatPrice(item.price * item.memberDiscount) }}</p>
              </div>
            </div>
            <div class="cart-item-actions">
              <el-input-number
                v-model="item.quantity"
                :min="1"
                :max="99"
                size="small"
                @change="cartStore.updateQuantity(index, item.quantity)"
              />
              <el-button type="danger" circle size="small" :icon="Delete" @click="cartStore.removeItem(index)" />
            </div>
          </div>
        </div>

        <div class="cart-footer">
          <div class="cart-total">
            <span>{{ t.cart.total }}:</span>
            <span class="total-price">{{ formatPrice(cartStore.totalPrice) }}</span>
          </div>
          <el-button type="primary" size="large" round @click="router.push('/orders')">
            {{ t.cart.settle }} ({{ cartStore.totalCount }})
          </el-button>
        </div>
      </template>
    </div>
  </AppLayout>
</template>

<style scoped>
.cart-page {
  max-width: 800px;
  margin: 0 auto;
}

.page-title {
  font-size: var(--font-size-xl);
  font-weight: 700;
  margin-bottom: var(--spacing-lg);
}

.cart-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-xl);
}

.cart-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-md);
  background: var(--color-bg-card);
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border-light);
  gap: var(--spacing-md);
}

.cart-item-main {
  display: flex;
  gap: var(--spacing-md);
  cursor: pointer;
  flex: 1;
  min-width: 0;
}

.cart-item-main:hover .cart-item-name {
  color: var(--color-primary);
}

.cart-item-img {
  width: 80px;
  height: 100px;
  object-fit: cover;
  border-radius: var(--radius-sm);
  flex-shrink: 0;
}

.cart-item-info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 4px;
  min-width: 0;
}

.cart-item-name {
  font-size: var(--font-size-base);
  font-weight: 600;
  transition: color var(--transition-fast);
}

.cart-item-spec {
  font-size: var(--font-size-xs);
  color: var(--color-text-muted);
}

.cart-item-price {
  font-size: var(--font-size-md);
  font-weight: 700;
  color: var(--color-primary);
}

.cart-item-actions {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  flex-shrink: 0;
}

.cart-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-md);
  background: var(--color-bg-card);
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border-light);
  position: sticky;
  bottom: 0;
}

.cart-total {
  font-size: var(--font-size-md);
  font-weight: 500;
}

.total-price {
  font-size: var(--font-size-xl);
  font-weight: 800;
  color: var(--color-primary);
  margin-left: var(--spacing-sm);
}

@media (max-width: 640px) {
  .cart-item { flex-direction: column; }
  .cart-footer { flex-direction: column; gap: var(--spacing-md); }
}
</style>
