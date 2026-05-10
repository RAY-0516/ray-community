<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { ShoppingCart, Star } from '@element-plus/icons-vue'
import type { Product } from '@/types/product'
import { fetchProduct } from '@/api/product'
import { useUserStore } from '@/stores/user'
import { useCartStore } from '@/stores/cart'
import { useTheme } from '@/composables/useTheme'
import { formatPrice, formatSales } from '@/utils/format'
import AppLayout from '@/components/layout/AppLayout.vue'
import LoadingSkeleton from '@/components/common/LoadingSkeleton.vue'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const cartStore = useCartStore()
const { t } = useTheme()

const product = ref<Product | null>(null)
const loading = ref(true)
const selectedColor = ref('')
const selectedSize = ref('')
const quantity = ref(1)

const discountPrice = computed(() => {
  if (!product.value) return 0
  return product.value.price * product.value.memberDiscount
})

const isCollected = computed(() => {
  if (!product.value) return false
  return userStore.isCollected(product.value.id)
})

onMounted(async () => {
  const id = Number(route.params.id)
  try {
    const res = await fetchProduct(id)
    product.value = res.data
    if (product.value.colors.length) selectedColor.value = product.value.colors[0]
    if (product.value.sizes.length) selectedSize.value = product.value.sizes[0]
  } finally {
    loading.value = false
  }
})

function handleAddToCart() {
  if (!product.value) return
  cartStore.addItem({
    productId: product.value.id,
    name: product.value.name,
    image: product.value.images[0],
    price: product.value.price,
    color: selectedColor.value,
    size: selectedSize.value,
    quantity: quantity.value,
    memberDiscount: product.value.memberDiscount,
  })
  ElMessage.success('已加入购物车')
}

function handleToggleCollect() {
  if (!product.value) return
  userStore.toggleCollection(product.value.id)
  ElMessage.success(isCollected.value ? '已取消收藏' : '已加入收藏')
}
</script>

<template>
  <AppLayout>
    <LoadingSkeleton v-if="loading" type="detail" />
    <template v-else-if="product">
      <div class="detail-page">
        <button class="back-btn" @click="router.back()">← {{ t.common.back }}</button>

        <div class="detail-main">
          <!-- 商品图片 -->
          <div class="detail-images">
            <img
              v-for="(img, i) in product.images"
              :key="i"
              :src="img"
              :alt="product.name"
              class="detail-img"
              :class="{ 'detail-img-main': i === 0 }"
            />
          </div>

          <!-- 商品信息 -->
          <div class="detail-info">
            <div class="detail-tags">
              <span v-if="product.isNew" class="tag-new">新品</span>
              <span v-if="product.isHot" class="tag-hot">热门</span>
            </div>
            <h1 class="detail-name">{{ product.name }}</h1>
            <p class="detail-meta">
              ⭐ {{ product.rating }} · 已售 {{ formatSales(product.sales) }} · 库存 {{ product.stock }} 件
            </p>

            <div class="detail-price-box">
              <span class="detail-price">{{ formatPrice(discountPrice) }}</span>
              <span v-if="product.memberDiscount < 1" class="detail-price-original">{{ formatPrice(product.price) }}</span>
              <span v-if="product.memberDiscount < 1" class="detail-discount-badge">
                {{ t.product.memberDiscount }} {{ Math.round((1 - product.memberDiscount) * 100) }}%
              </span>
            </div>

            <!-- 颜色选择 -->
            <div class="detail-option">
              <label>{{ t.product.selectColor }}</label>
              <div class="color-options">
                <button
                  v-for="color in product.colors"
                  :key="color"
                  class="color-option"
                  :class="{ active: selectedColor === color }"
                  :style="{ background: color }"
                  @click="selectedColor = color"
                />
              </div>
            </div>

            <!-- 尺码选择 -->
            <div class="detail-option">
              <label>{{ t.product.selectSize }}</label>
              <div class="size-options">
                <button
                  v-for="size in product.sizes"
                  :key="size"
                  class="size-option"
                  :class="{ active: selectedSize === size }"
                  @click="selectedSize = size"
                >
                  {{ size }}
                </button>
              </div>
            </div>

            <!-- 数量 -->
            <div class="detail-option">
              <label>数量</label>
              <el-input-number v-model="quantity" :min="1" :max="product.stock" size="small" />
            </div>

            <!-- 操作按钮 -->
            <div class="detail-actions">
              <el-button size="large" round :icon="Star" :type="isCollected ? 'danger' : 'default'" @click="handleToggleCollect">
                {{ isCollected ? '已收藏' : '收藏' }}
              </el-button>
              <el-button size="large" round type="warning" :icon="ShoppingCart" @click="handleAddToCart">
                {{ t.product.addToCart }}
              </el-button>
            </div>
          </div>
        </div>

        <!-- 商品详情 -->
        <section class="detail-description">
          <h2 class="section-title">{{ t.product.productDesc }}</h2>
          <p>{{ product.description }}</p>
        </section>
      </div>
    </template>
  </AppLayout>
</template>

<style scoped>
.detail-page {
  max-width: 960px;
  margin: 0 auto;
}

.back-btn {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  margin-bottom: var(--spacing-md);
  transition: color var(--transition-fast);
}

.back-btn:hover { color: var(--color-primary); }

.detail-main {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-xl);
  margin-bottom: var(--spacing-xl);
}

.detail-images {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.detail-img {
  border-radius: var(--radius-md);
  background: var(--color-divider);
  object-fit: cover;
  width: 100%;
}

.detail-img-main {
  aspect-ratio: 3/4;
}

.detail-img:not(.detail-img-main) {
  aspect-ratio: 3/4;
  width: calc(50% - var(--spacing-xs));
  display: inline-block;
}

.detail-info {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.detail-tags { display: flex; gap: 6px; }

.tag-new, .tag-hot {
  padding: 2px 10px;
  border-radius: var(--radius-full);
  font-size: var(--font-size-xs);
  font-weight: 600;
  color: #fff;
}

.tag-new { background: var(--color-primary); }
.tag-hot { background: var(--color-danger); }

.detail-name {
  font-size: var(--font-size-xl);
  font-weight: 700;
}

.detail-meta {
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
}

.detail-price-box {
  display: flex;
  align-items: baseline;
  gap: var(--spacing-sm);
  padding: var(--spacing-md);
  background: var(--color-divider);
  border-radius: var(--radius-md);
}

.detail-price {
  font-size: var(--font-size-2xl);
  font-weight: 800;
  color: var(--color-primary);
}

.detail-price-original {
  font-size: var(--font-size-base);
  color: var(--color-text-muted);
  text-decoration: line-through;
}

.detail-discount-badge {
  font-size: var(--font-size-xs);
  color: var(--color-danger);
  font-weight: 600;
}

.detail-option label {
  display: block;
  font-size: var(--font-size-sm);
  font-weight: 500;
  margin-bottom: var(--spacing-sm);
}

.color-options {
  display: flex;
  gap: var(--spacing-sm);
}

.color-option {
  width: 36px;
  height: 36px;
  border-radius: var(--radius-full);
  border: 3px solid transparent;
  transition: border-color var(--transition-fast);
}

.color-option.active {
  border-color: var(--color-primary);
  box-shadow: var(--shadow-glow);
}

.size-options {
  display: flex;
  gap: var(--spacing-sm);
}

.size-option {
  min-width: 44px;
  padding: 8px 16px;
  border-radius: var(--radius-sm);
  border: 1.5px solid var(--color-border);
  font-size: var(--font-size-sm);
  font-weight: 500;
  transition: all var(--transition-fast);
}

.size-option:hover { border-color: var(--color-primary); }
.size-option.active {
  border-color: var(--color-primary);
  background: var(--color-primary);
  color: #fff;
}

.detail-actions {
  display: flex;
  gap: var(--spacing-md);
}

.detail-description {
  padding-top: var(--spacing-xl);
  border-top: 1px solid var(--color-divider);
}

.detail-description p {
  font-size: var(--font-size-base);
  color: var(--color-text-secondary);
  line-height: 1.8;
}

@media (max-width: 768px) {
  .detail-main { grid-template-columns: 1fr; }
}
</style>
