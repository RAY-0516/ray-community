<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { Product } from '@/types/product'
import type { CommunityPost } from '@/types/community'
import { fetchProducts } from '@/api/product'
import { fetchPosts } from '@/api/community'
import { useThemeStore } from '@/stores/theme'
import AppLayout from '@/components/layout/AppLayout.vue'
import ProductCard from '@/components/common/ProductCard.vue'
import CommunityCard from '@/components/common/CommunityCard.vue'
import LoadingSkeleton from '@/components/common/LoadingSkeleton.vue'
import EmptyState from '@/components/common/EmptyState.vue'

const route = useRoute()
const router = useRouter()
const themeStore = useThemeStore()

const keyword = ref((route.query.q as string) ?? '')
const products = ref<Product[]>([])
const posts = ref<CommunityPost[]>([])
const loading = ref(false)

async function doSearch() {
  if (!keyword.value.trim()) return
  loading.value = true
  try {
    const [pRes, cRes] = await Promise.all([
      fetchProducts({ keyword: keyword.value }),
      fetchPosts(1, 20),
    ])
    products.value = pRes.data
    posts.value = cRes.data.filter(
      (p) => p.content.includes(keyword.value) || p.tags.some((t) => t.includes(keyword.value))
    )
  } finally {
    loading.value = false
  }
}

watch(() => route.query.q, (val) => {
  keyword.value = (val as string) ?? ''
  doSearch()
}, { immediate: true })

function goProduct(id: number) { router.push({ name: 'product-detail', params: { id } }) }
</script>

<template>
  <AppLayout>
    <div class="search-page">
      <div class="search-header">
        <el-input
          v-model="keyword"
          placeholder="搜索商品或穿搭..."
          size="large"
          @keyup.enter="router.replace({ query: { q: keyword || undefined } })"
        >
          <template #prefix>🔍</template>
        </el-input>
      </div>

      <template v-if="!route.query.q">
        <EmptyState message="输入关键词开始搜索" />
      </template>
      <template v-else>
        <LoadingSkeleton v-if="loading" type="card" :rows="3" />

        <template v-else>
          <!-- 商品结果 -->
          <section class="search-section" v-if="products.length">
            <h2 class="section-title">🛍️ 相关商品 ({{ products.length }})</h2>
            <div class="product-grid">
              <ProductCard v-for="p in products" :key="p.id" :product="p" @view="goProduct(p.id)" />
            </div>
          </section>

          <!-- 社区结果 -->
          <section class="search-section" v-if="posts.length">
            <h2 class="section-title">👗 相关穿搭 ({{ posts.length }})</h2>
            <div class="post-list">
              <CommunityCard v-for="post in posts" :key="post.id" :post="post" @view="router.push('/community')" />
            </div>
          </section>

          <EmptyState v-if="!products.length && !posts.length" message="没有找到相关内容" />
        </template>
      </template>
    </div>
  </AppLayout>
</template>

<style scoped>
.search-page { max-width: 800px; margin: 0 auto; }
.search-header { margin-bottom: var(--spacing-lg); }
.search-section { margin-bottom: var(--spacing-xl); }
.section-title { font-size: var(--font-size-lg); font-weight: 700; margin-bottom: var(--spacing-md); }
.product-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: var(--spacing-md); }
.post-list { display: flex; flex-direction: column; gap: var(--spacing-md); }
</style>
