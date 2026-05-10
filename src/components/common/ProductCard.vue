<script setup lang="ts">
import { computed } from 'vue'
import { Star } from '@element-plus/icons-vue'
import type { Product } from '@/types/product'
import { useUserStore } from '@/stores/user'
import { useCartStore } from '@/stores/cart'
import { useTheme } from '@/composables/useTheme'
import { formatPrice, formatSales } from '@/utils/format'

const props = defineProps<{ product: Product }>()

const emit = defineEmits<{
  (e: 'view'): void
}>()

const userStore = useUserStore()
const cartStore = useCartStore()
const { t } = useTheme()

const discountPrice = computed(() => {
  return props.product.price * props.product.memberDiscount
})

const isCollecting = computed(() => userStore.isCollected(props.product.id))

function toggleCollect(e: Event) {
  e.stopPropagation()
  userStore.toggleCollection(props.product.id)
}

function quickAddToCart(e: Event) {
  e.stopPropagation()
  cartStore.addItem({
    productId: props.product.id,
    name: props.product.name,
    image: props.product.images[0],
    price: props.product.price,
    color: props.product.colors[0],
    size: props.product.sizes[0],
    quantity: 1,
    memberDiscount: props.product.memberDiscount,
  })
}
</script>

<template>
  <article class="product-card" @click="emit('view')">
    <div class="card-image">
      <img :src="product.images[0]" :alt="product.name" loading="lazy" />
      <div class="card-badges">
        <span v-if="product.isNew" class="badge badge-new">新品</span>
        <span v-if="product.isHot" class="badge badge-hot">热门</span>
      </div>
      <button class="card-collect" :class="{ active: isCollecting }" @click="toggleCollect">
        <el-icon><Star /></el-icon>
      </button>
      <div class="card-quick-add" @click="quickAddToCart">
        <span>加入购物车</span>
      </div>
    </div>

    <div class="card-body">
      <h3 class="card-name">{{ product.name }}</h3>
      <div class="card-meta">
        <span class="card-rating">⭐ {{ product.rating }}</span>
        <span class="card-sales">已售 {{ formatSales(product.sales) }}</span>
      </div>
      <div class="card-price">
        <span class="price-current">{{ formatPrice(discountPrice) }}</span>
        <span v-if="product.memberDiscount < 1" class="price-original">{{ formatPrice(product.price) }}</span>
        <span v-if="product.memberDiscount < 1" class="price-discount">{{ Math.round((1 - product.memberDiscount) * 100) }}% off</span>
      </div>
      <div class="card-colors">
        <span
          v-for="color in product.colors.slice(0, 4)"
          :key="color"
          class="color-dot"
          :style="{ background: color }"
        />
        <span v-if="product.colors.length > 4" class="color-more">+{{ product.colors.length - 4 }}</span>
      </div>
    </div>
  </article>
</template>

<style scoped>
.product-card {
  background: var(--color-bg-card);
  border-radius: var(--radius-lg);
  overflow: hidden;
  cursor: pointer;
  transition: all var(--transition-base);
  border: 1px solid var(--color-border-light);
}

.product-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
  border-color: var(--color-primary-light);
}

.card-image {
  position: relative;
  aspect-ratio: 3/4;
  overflow: hidden;
  background: var(--color-divider);
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform var(--transition-slow);
}

.product-card:hover .card-image img {
  transform: scale(1.05);
}

.card-badges {
  position: absolute;
  top: var(--spacing-sm);
  left: var(--spacing-sm);
  display: flex;
  gap: 4px;
}

.badge {
  padding: 2px 8px;
  border-radius: var(--radius-full);
  font-size: var(--font-size-xs);
  font-weight: 600;
  color: #fff;
}

.badge-new { background: var(--color-primary); }
.badge-hot { background: var(--color-danger); }

.card-collect {
  position: absolute;
  top: var(--spacing-sm);
  right: var(--spacing-sm);
  width: 32px;
  height: 32px;
  border-radius: var(--radius-full);
  background: rgba(255,255,255,0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transform: translateY(-4px);
  transition: all var(--transition-fast);
}

.product-card:hover .card-collect {
  opacity: 1;
  transform: translateY(0);
}

.card-collect.active {
  opacity: 1;
  color: var(--color-danger);
}

.card-quick-add {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 10px;
  background: var(--color-primary);
  color: #fff;
  text-align: center;
  font-size: var(--font-size-sm);
  font-weight: 600;
  transform: translateY(100%);
  transition: transform var(--transition-base);
}

.product-card:hover .card-quick-add {
  transform: translateY(0);
}

.card-body {
  padding: var(--spacing-md);
}

.card-name {
  font-size: var(--font-size-base);
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: 6px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-meta {
  display: flex;
  gap: var(--spacing-md);
  font-size: var(--font-size-xs);
  color: var(--color-text-muted);
  margin-bottom: 6px;
}

.card-price {
  display: flex;
  align-items: baseline;
  gap: 6px;
  margin-bottom: 6px;
}

.price-current {
  font-size: var(--font-size-md);
  font-weight: 700;
  color: var(--color-primary);
}

.price-original {
  font-size: var(--font-size-xs);
  color: var(--color-text-muted);
  text-decoration: line-through;
}

.price-discount {
  font-size: var(--font-size-xs);
  color: var(--color-danger);
  font-weight: 600;
}

.card-colors {
  display: flex;
  align-items: center;
  gap: 4px;
}

.color-dot {
  width: 14px;
  height: 14px;
  border-radius: var(--radius-full);
  border: 1.5px solid var(--color-border);
}

.color-more {
  font-size: var(--font-size-xs);
  color: var(--color-text-muted);
}
</style>
