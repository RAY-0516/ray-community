<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Search, ShoppingCart, Sunny, Moon, Menu, Close } from '@element-plus/icons-vue'
import { useUserStore } from '@/stores/user'
import { useCartStore } from '@/stores/cart'
import { useThemeStore } from '@/stores/theme'
import { useTheme } from '@/composables/useTheme'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const cartStore = useCartStore()
const themeStore = useThemeStore()
const { t } = useTheme()

const mobileMenuOpen = ref(false)
const searchText = ref('')

const activeTab = computed(() => {
  const path = route.path
  if (path.startsWith('/shop')) return 'shop'
  if (path.startsWith('/community')) return 'community'
  if (path.startsWith('/member')) return 'member'
  if (path.startsWith('/orders')) return 'orders'
  return 'home'
})

const tabs = computed(() => [
  { key: 'home', label: t.nav.home, path: '/' },
  { key: 'shop', label: t.nav.shop, path: '/shop' },
  { key: 'community', label: t.nav.community, path: '/community' },
  { key: 'member', label: t.nav.member, path: '/member' },
])

function doSearch() {
  if (searchText.value.trim()) {
    router.push({ name: 'search', query: { q: searchText.value } })
    searchText.value = ''
  }
}

function closeMobile() { mobileMenuOpen.value = false }
</script>

<template>
  <header class="app-header">
    <div class="header-inner">
      <!-- 移动端汉堡按钮 -->
      <button class="hamburger" @click="mobileMenuOpen = !mobileMenuOpen">
        <el-icon :size="22"><component :is="mobileMenuOpen ? Close : Menu" /></el-icon>
      </button>

      <router-link to="/" class="logo">
        <span class="logo-icon">⚡</span>
        <span class="logo-text">Ray社区</span>
      </router-link>

      <!-- 桌面导航 -->
      <nav class="nav-tabs">
        <router-link
          v-for="tab in tabs" :key="tab.key" :to="tab.path"
          class="nav-tab" :class="{ active: activeTab === tab.key }"
        >{{ tab.label }}</router-link>
      </nav>

      <div class="header-actions">
        <el-input
          v-model="searchText" :placeholder="t.common.search"
          :prefix-icon="Search" size="default" class="search-input"
          @keyup.enter="doSearch"
        />

        <el-badge :value="cartStore.totalCount" :hidden="cartStore.totalCount === 0" class="action-btn">
          <el-button circle :icon="ShoppingCart" @click="router.push('/cart')" />
        </el-badge>

        <el-button circle @click="themeStore.toggleTheme()" class="action-btn">
          <el-icon><component :is="themeStore.theme === 'light' ? Moon : Sunny" /></el-icon>
        </el-button>

        <template v-if="userStore.isLoggedIn">
          <el-dropdown trigger="click">
            <el-avatar :size="32" :src="userStore.user?.avatar" class="avatar-btn">
              {{ userStore.user?.nickname?.[0] }}
            </el-avatar>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="router.push('/profile')">{{ t.nav.profile }}</el-dropdown-item>
                <el-dropdown-item @click="router.push('/orders')">📦 我的订单</el-dropdown-item>
                <el-dropdown-item @click="router.push('/settings')">{{ t.nav.settings }}</el-dropdown-item>
                <el-dropdown-item divided @click="userStore.logout(); router.push('/')">{{ t.common.logout }}</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </template>
        <template v-else>
          <el-button type="primary" size="small" round @click="router.push('/login')">{{ t.common.login }}</el-button>
        </template>
      </div>
    </div>

    <!-- 移动端下拉菜单 -->
    <nav v-if="mobileMenuOpen" class="mobile-nav">
      <router-link v-for="tab in tabs" :key="tab.key" :to="tab.path"
        class="mobile-nav-item" :class="{ active: activeTab === tab.key }"
        @click="closeMobile">{{ tab.label }}</router-link>
      <router-link to="/orders" class="mobile-nav-item" @click="closeMobile">📦 我的订单</router-link>
    </nav>
  </header>
</template>

<style scoped>
.app-header {
  position: sticky; top: 0; z-index: 100;
  background: var(--color-bg-card); border-bottom: 1px solid var(--color-border);
  backdrop-filter: blur(12px);
}

.header-inner {
  max-width: 1280px; margin: 0 auto; padding: 0 var(--spacing-md);
  height: 56px; display: flex; align-items: center; gap: var(--spacing-lg);
}

.logo { display: flex; align-items: center; gap: var(--spacing-sm); font-size: var(--font-size-lg); font-weight: 800; color: var(--color-text-primary); flex-shrink: 0; }
.logo-icon { font-size: 24px; }
.logo-text { background: linear-gradient(135deg, var(--color-primary), var(--color-secondary)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }

.nav-tabs { display: flex; gap: var(--spacing-xs); }
.nav-tab { padding: 6px 16px; border-radius: var(--radius-full); font-size: var(--font-size-sm); font-weight: 500; color: var(--color-text-secondary); transition: all var(--transition-fast); }
.nav-tab:hover { color: var(--color-text-primary); background: var(--color-divider); }
.nav-tab.active { background: var(--color-primary); color: #fff; font-weight: 600; }

.header-actions { display: flex; align-items: center; gap: var(--spacing-sm); margin-left: auto; }
.search-input { width: 200px; }
.action-btn { --el-button-bg-color: transparent; --el-button-border-color: transparent; color: var(--color-text-secondary); }
.action-btn:hover { color: var(--color-primary); }
.avatar-btn { cursor: pointer; border: 2px solid var(--color-primary-light); transition: border-color var(--transition-fast); }
.avatar-btn:hover { border-color: var(--color-primary); }

/* 移动端 */
.hamburger { display: none; color: var(--color-text-secondary); padding: 4px; }

.mobile-nav {
  display: none; flex-direction: column; padding: var(--spacing-sm) var(--spacing-md);
  background: var(--color-bg-card); border-top: 1px solid var(--color-border);
}

.mobile-nav-item {
  padding: var(--spacing-sm) var(--spacing-md); border-radius: var(--radius-md);
  font-size: var(--font-size-base); font-weight: 500; color: var(--color-text-secondary);
  transition: all var(--transition-fast);
}

.mobile-nav-item:hover, .mobile-nav-item.active { color: var(--color-primary); background: var(--color-divider); }

@media (max-width: 768px) {
  .nav-tabs { display: none; }
  .search-input { width: 120px; }
  .hamburger { display: block; }
  .mobile-nav { display: flex; }
  .header-inner { gap: var(--spacing-sm); }
}
</style>
