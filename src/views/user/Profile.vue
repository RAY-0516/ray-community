<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { User, Star, ShoppingCart, Setting } from '@element-plus/icons-vue'
import { useUserStore } from '@/stores/user'
import { useMemberStore } from '@/stores/member'
import { useTheme } from '@/composables/useTheme'
import AppLayout from '@/components/layout/AppLayout.vue'
import MemberBadge from '@/components/member/MemberBadge.vue'

const router = useRouter()
const userStore = useUserStore()
const memberStore = useMemberStore()
const { t } = useTheme()

const menuItems = computed(() => [
  { icon: Star, label: t.user.collections, path: '/profile/collections' },
  { icon: ShoppingCart, label: t.cart.title, path: '/cart' },
  { icon: User, label: t.user.memberCenter, path: '/member' },
  { icon: Setting, label: t.nav.settings, path: '/settings' },
])

onMounted(() => memberStore.fetchLevels())
</script>

<template>
  <AppLayout>
    <div class="profile-page" v-if="userStore.user">
      <!-- 用户信息卡 -->
      <div class="profile-card">
        <el-avatar :size="72" :src="userStore.user.avatar">
          {{ userStore.user.nickname[0] }}
        </el-avatar>
        <div class="profile-info">
          <h1 class="profile-name">{{ userStore.user.nickname }}</h1>
          <MemberBadge :level="userStore.memberLevel" />
        </div>
      </div>

      <!-- 功能菜单 -->
      <div class="profile-menu">
        <div
          v-for="item in menuItems"
          :key="item.path"
          class="profile-menu-item"
          @click="router.push(item.path)"
        >
          <el-icon :size="20"><component :is="item.icon" /></el-icon>
          <span>{{ item.label }}</span>
          <span class="menu-arrow">→</span>
        </div>
      </div>

      <el-button type="danger" plain round class="logout-btn" @click="userStore.logout(); router.push('/')">
        {{ t.common.logout }}
      </el-button>
    </div>
  </AppLayout>
</template>

<style scoped>
.profile-page {
  max-width: 480px;
  margin: 0 auto;
}

.profile-card {
  display: flex;
  align-items: center;
  gap: var(--spacing-lg);
  padding: var(--spacing-xl);
  background: var(--color-bg-card);
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border-light);
  margin-bottom: var(--spacing-lg);
}

.profile-name {
  font-size: var(--font-size-lg);
  font-weight: 700;
  margin-bottom: 6px;
}

.profile-menu {
  background: var(--color-bg-card);
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border-light);
  overflow: hidden;
  margin-bottom: var(--spacing-lg);
}

.profile-menu-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-md) var(--spacing-lg);
  cursor: pointer;
  transition: background var(--transition-fast);
  border-bottom: 1px solid var(--color-divider);
  font-size: var(--font-size-base);
}

.profile-menu-item:last-child { border: none; }

.profile-menu-item:hover {
  background: var(--color-divider);
}

.menu-arrow {
  margin-left: auto;
  color: var(--color-text-muted);
}

.logout-btn {
  width: 100%;
}
</style>
