<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import type { Product } from '@/types/product'
import { fetchProduct } from '@/api/product'
import { useUserStore } from '@/stores/user'
import { useTheme } from '@/composables/useTheme'
import AppLayout from '@/components/layout/AppLayout.vue'
import ProductCard from '@/components/common/ProductCard.vue'
import EmptyState from '@/components/common/EmptyState.vue'
import LoadingSkeleton from '@/components/common/LoadingSkeleton.vue'

const router = useRouter()
const userStore = useUserStore()
const { t } = useTheme()

const products = ref<Product[]>([])
const loading = ref(true)

onMounted(async () => {
  if (!userStore.user?.collections.length) {
    loading.value = false
    return
  }
  const results = await Promise.allSettled(
    userStore.user.collections.map((id) => fetchProduct(id))
  )
  products.value = results
    .filter((r): r is PromiseFulfilledResult<{ data: Product }> => r.status === 'fulfilled')
    .map((r) => r.value.data)
  loading.value = false
})

function goProduct(id: number) {
  router.push({ name: 'product-detail', params: { id } })
}
</script>

<template>
  <AppLayout>
    <div class="collections-page">
      <h1 class="page-title">⭐ {{ t.user.collections }}</h1>

      <LoadingSkeleton v-if="loading" type="card" :rows="4" />
      <EmptyState v-else-if="!products.length" :message="'还没有收藏商品'" @action="router.push('/shop')">
        <template #action-text>去逛逛</template>
      </EmptyState>
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
.collections-page {
  max-width: 960px;
  margin: 0 auto;
}

.page-title {
  font-size: var(--font-size-xl);
  font-weight: 700;
  margin-bottom: var(--spacing-lg);
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: var(--spacing-md);
}

@media (max-width: 768px) {
  .product-grid { grid-template-columns: repeat(2, 1fr); }
}
</style>
