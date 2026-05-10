<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Search, ArrowUp, ArrowDown } from '@element-plus/icons-vue'
import type { Product, ProductCategory } from '@/types/product'
import { fetchProducts } from '@/api/product'
import { useTheme } from '@/composables/useTheme'
import AppLayout from '@/components/layout/AppLayout.vue'
import ProductCard from '@/components/common/ProductCard.vue'
import LoadingSkeleton from '@/components/common/LoadingSkeleton.vue'
import EmptyState from '@/components/common/EmptyState.vue'

const router = useRouter()
const route = useRoute()
const { t } = useTheme()

const products = ref<Product[]>([])
const loading = ref(true)

const activeCategory = ref<ProductCategory | ''>((route.query.category as ProductCategory) ?? '')
const sortBy = ref<'price' | 'sales' | 'rating' | 'newest'>('newest')
const sortOrder = ref<'asc' | 'desc'>('desc')
const keyword = ref((route.query.keyword as string) ?? '')

const categories = computed(() => [
  { label: t.shop.allCategories, value: '' as ProductCategory | '' },
  { label: '新品', value: '新品' as ProductCategory | '' },
  { label: '女装', value: '女装' as ProductCategory | '' },
  { label: '男装', value: '男装' as ProductCategory | '' },
  { label: '配饰', value: '配饰' as ProductCategory | '' },
])

const sortOptions = computed(() => [
  { label: t.shop.sortNewest, value: 'newest' as const },
  { label: t.shop.sortPrice, value: 'price' as const },
  { label: t.shop.sortSales, value: 'sales' as const },
  { label: t.shop.sortRating, value: 'rating' as const },
])

async function loadProducts() {
  loading.value = true
  try {
    const res = await fetchProducts({
      category: activeCategory.value || undefined,
      sortBy: sortBy.value,
      sortOrder: sortOrder.value,
      keyword: keyword.value || undefined,
    })
    products.value = res.data
  } finally {
    loading.value = false
  }
}

function toggleSortOrder() {
  sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
}

function setCategory(cat: ProductCategory | '') {
  activeCategory.value = cat
  router.replace({ query: { ...route.query, category: cat || undefined } })
}

function handleSearch() {
  router.replace({ query: { ...route.query, keyword: keyword.value || undefined } })
}

function goProduct(id: number) {
  router.push({ name: 'product-detail', params: { id } })
}

watch([activeCategory, sortBy, sortOrder], loadProducts)
onMounted(loadProducts)
</script>

<template>
  <AppLayout>
    <div class="shop-page">
      <!-- 筛选栏 -->
      <div class="filter-bar">
        <div class="filter-left">
          <button
            v-for="cat in categories"
            :key="cat.value"
            class="filter-chip"
            :class="{ active: activeCategory === cat.value }"
            @click="setCategory(cat.value)"
          >
            {{ cat.label }}
          </button>
        </div>
        <div class="filter-right">
          <el-input
            v-model="keyword"
            :placeholder="t.common.search"
            :prefix-icon="Search"
            size="small"
            class="filter-search"
            @keyup.enter="handleSearch"
          />
          <el-select v-model="sortBy" size="small" style="width:110px">
            <el-option v-for="opt in sortOptions" :key="opt.value" :label="opt.label" :value="opt.value" />
          </el-select>
          <el-button circle size="small" @click="toggleSortOrder">
            <el-icon><component :is="sortOrder === 'asc' ? ArrowUp : ArrowDown" /></el-icon>
          </el-button>
        </div>
      </div>

      <!-- 商品列表 -->
      <LoadingSkeleton v-if="loading" type="card" :rows="8" />
      <EmptyState v-else-if="!products.length" :message="t.common.empty" @action="router.push('/')" />
      <div v-else class="product-grid">
        <ProductCard
          v-for="product in products"
          :key="product.id"
          :product="product"
          @view="goProduct(product.id)"
        />
      </div>
    </div>
  </AppLayout>
</template>

<style scoped>
.shop-page {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.filter-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
}

.filter-left {
  display: flex;
  gap: var(--spacing-sm);
  flex-wrap: wrap;
}

.filter-chip {
  padding: 6px 18px;
  border-radius: var(--radius-full);
  font-size: var(--font-size-sm);
  font-weight: 500;
  color: var(--color-text-secondary);
  border: 1px solid var(--color-border);
  transition: all var(--transition-fast);
}

.filter-chip:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.filter-chip.active {
  background: var(--color-primary);
  color: #fff;
  border-color: var(--color-primary);
}

.filter-right {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.filter-search { width: 180px; }

.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: var(--spacing-md);
}

@media (max-width: 768px) {
  .product-grid { grid-template-columns: repeat(2, 1fr); gap: var(--spacing-sm); }
  .filter-bar { flex-direction: column; align-items: stretch; }
  .filter-right { justify-content: flex-end; }
}
</style>
