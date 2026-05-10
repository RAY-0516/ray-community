<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElCarousel, ElCarouselItem } from 'element-plus'
import type { Product, Banner } from '@/types/product'
import type { CommunityPost } from '@/types/community'
import { fetchProducts, fetchBanners } from '@/api/product'
import { fetchPosts } from '@/api/community'
import { useTheme } from '@/composables/useTheme'
import AppLayout from '@/components/layout/AppLayout.vue'
import ProductCard from '@/components/common/ProductCard.vue'
import CommunityCard from '@/components/common/CommunityCard.vue'
import LoadingSkeleton from '@/components/common/LoadingSkeleton.vue'

const router = useRouter()
const { t } = useTheme()

const banners = ref<Banner[]>([])
const hotProducts = ref<Product[]>([])
const newProducts = ref<Product[]>([])
const communityPosts = ref<CommunityPost[]>([])
const loading = ref(true)

const categories = [
  { label: '新品', value: '新品' },
  { label: '女装', value: '女装' },
  { label: '男装', value: '男装' },
  { label: '配饰', value: '配饰' },
]

onMounted(async () => {
  try {
    const [bannerRes, hotRes, newRes, postsRes] = await Promise.all([
      fetchBanners(),
      fetchProducts({ sortBy: 'sales', sortOrder: 'desc', pageSize: 8 }),
      fetchProducts({ sortBy: 'newest', sortOrder: 'desc', pageSize: 8 }),
      fetchPosts(1, 3),
    ])
    banners.value = bannerRes.data
    hotProducts.value = hotRes.data
    newProducts.value = newRes.data
    communityPosts.value = postsRes.data
  } finally {
    loading.value = false
  }
})

function goShop(category?: string) {
  router.push({ name: 'shop', query: category ? { category } : {} })
}

function goProduct(id: number) {
  router.push({ name: 'product-detail', params: { id } })
}

function goCommunity() {
  router.push({ name: 'community' })
}
</script>

<template>
  <AppLayout>
    <!-- Banner -->
    <section class="hero-banner" v-if="!loading && banners.length">
      <el-carousel height="360px" :interval="4000" arrow="hover" indicator-position="outside">
        <el-carousel-item v-for="banner in banners" :key="banner.id">
          <div class="banner-slide" @click="router.push(banner.link)">
            <img :src="banner.image" :alt="banner.title" />
            <div class="banner-text">
              <h2>{{ banner.title }}</h2>
              <p>{{ banner.subtitle }}</p>
            </div>
          </div>
        </el-carousel-item>
      </el-carousel>
    </section>

    <!-- 分类导航 -->
    <section class="page-section category-nav">
      <div class="category-chips">
        <button
          v-for="cat in categories"
          :key="cat.value"
          class="category-chip"
          @click="goShop(cat.value)"
        >
          {{ cat.label }}
        </button>
      </div>
    </section>

    <!-- 热门推荐 -->
    <section class="page-section">
      <div class="section-header">
        <h2 class="section-title">🔥 {{ t.home.hotProducts }}</h2>
        <button class="section-more" @click="goShop()">{{ t.common.more }} →</button>
      </div>
      <LoadingSkeleton v-if="loading" type="card" :rows="4" />
      <div v-else class="product-grid">
        <ProductCard
          v-for="product in hotProducts"
          :key="product.id"
          :product="product"
          @view="goProduct(product.id)"
        />
      </div>
    </section>

    <!-- 社区预览 -->
    <section class="page-section">
      <div class="section-header">
        <h2 class="section-title">👗 {{ t.home.communityPreview }}</h2>
        <button class="section-more" @click="goCommunity()">{{ t.common.more }} →</button>
      </div>
      <LoadingSkeleton v-if="loading" type="list" :rows="2" />
      <div v-else class="community-preview-list">
        <CommunityCard
          v-for="post in communityPosts"
          :key="post.id"
          :post="post"
          @view="goCommunity()"
        />
      </div>
    </section>

    <!-- 新品上架 -->
    <section class="page-section">
      <div class="section-header">
        <h2 class="section-title">✨ {{ t.home.newArrivals }}</h2>
        <button class="section-more" @click="goShop()">{{ t.common.more }} →</button>
      </div>
      <LoadingSkeleton v-if="loading" type="card" :rows="4" />
      <div v-else class="product-grid">
        <ProductCard
          v-for="product in newProducts"
          :key="product.id"
          :product="product"
          @view="goProduct(product.id)"
        />
      </div>
    </section>
  </AppLayout>
</template>

<style scoped>
.hero-banner {
  margin: calc(-1 * var(--spacing-lg)) calc(-1 * var(--spacing-md)) var(--spacing-xl);
}

.banner-slide {
  position: relative;
  height: 360px;
  cursor: pointer;
  overflow: hidden;
  border-radius: 0 0 var(--radius-xl) var(--radius-xl);
}

.banner-slide img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.banner-text {
  position: absolute;
  bottom: 40px;
  left: 48px;
  color: #fff;
  text-shadow: 0 2px 8px rgba(0,0,0,0.3);
}

.banner-text h2 {
  font-size: var(--font-size-2xl);
  font-weight: 800;
  margin-bottom: var(--spacing-xs);
}

.banner-text p {
  font-size: var(--font-size-md);
  opacity: 0.9;
}

.category-nav {
  text-align: center;
}

.category-chips {
  display: flex;
  justify-content: center;
  gap: var(--spacing-md);
  flex-wrap: wrap;
}

.category-chip {
  padding: 10px 28px;
  border-radius: var(--radius-full);
  font-size: var(--font-size-md);
  font-weight: 600;
  color: var(--color-text-secondary);
  background: var(--color-bg-card);
  border: 1.5px solid var(--color-border);
  transition: all var(--transition-fast);
}

.category-chip:hover {
  color: var(--color-primary);
  border-color: var(--color-primary);
  box-shadow: var(--shadow-glow);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: var(--spacing-md);
}

.section-more {
  font-size: var(--font-size-sm);
  color: var(--color-primary);
  font-weight: 500;
  transition: opacity var(--transition-fast);
}

.section-more:hover { opacity: 0.7; }

.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: var(--spacing-md);
}

.community-preview-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

@media (max-width: 768px) {
  .product-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: var(--spacing-sm);
  }
  .banner-text {
    left: 20px;
    bottom: 20px;
  }
  .banner-text h2 { font-size: var(--font-size-xl); }
}
</style>
