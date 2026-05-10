<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import type { MemberLevelConfig } from '@/types/user'
import { useMemberStore } from '@/stores/member'
import { useUserStore } from '@/stores/user'
import { formatPrice } from '@/utils/format'

defineProps<{ level: MemberLevelConfig }>()
const emit = defineEmits<{ (e: 'done'): void }>()

const memberStore = useMemberStore()
const userStore = useUserStore()
const loading = ref(false)

async function handleUpgrade(level: string) {
  if (!userStore.isLoggedIn) {
    ElMessage.warning('请先登录')
    return
  }
  loading.value = true
  const ok = await memberStore.upgrade(level)
  loading.value = false
  if (ok) {
    ElMessage.success('升级成功！')
    emit('done')
  } else {
    ElMessage.error('升级失败，请重试')
  }
}
</script>

<template>
  <div class="upgrade-card">
    <div class="upgrade-header" :style="{ background: level.color }">
      <span class="upgrade-level-name">{{ level.name }}</span>
      <span class="upgrade-price">{{ formatPrice(level.price) }}<small>/年</small></span>
    </div>
    <ul class="upgrade-benefits">
      <li v-for="benefit in level.benefits" :key="benefit">
        <span class="benefit-check">✓</span> {{ benefit }}
      </li>
    </ul>
    <el-button
      :type="level.level === 'gold' ? 'warning' : 'default'"
      round
      :loading="loading"
      :disabled="userStore.memberLevel === level.level || (userStore.memberLevel === 'gold' && level.level === 'silver')"
      @click="handleUpgrade(level.level)"
      class="upgrade-btn"
    >
      <template v-if="userStore.memberLevel === level.level">当前等级</template>
      <template v-else-if="userStore.memberLevel === 'gold' && level.level === 'silver'">已超越</template>
      <template v-else>{{ level.price > 0 ? '立即升级' : '当前等级' }}</template>
    </el-button>
  </div>
</template>

<style scoped>
.upgrade-card {
  background: var(--color-bg-card);
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border);
  overflow: hidden;
  transition: all var(--transition-base);
  display: flex;
  flex-direction: column;
}

.upgrade-card:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}

.upgrade-header {
  padding: var(--spacing-lg);
  text-align: center;
  color: #fff;
}

.upgrade-level-name {
  display: block;
  font-size: var(--font-size-lg);
  font-weight: 700;
}

.upgrade-price {
  font-size: var(--font-size-2xl);
  font-weight: 800;
}

.upgrade-price small {
  font-size: var(--font-size-sm);
  font-weight: 400;
  opacity: 0.8;
}

.upgrade-benefits {
  padding: var(--spacing-md);
  flex: 1;
}

.upgrade-benefits li {
  padding: 6px 0;
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  border-bottom: 1px solid var(--color-divider);
}

.upgrade-benefits li:last-child { border: none; }

.benefit-check {
  color: var(--color-success);
  font-weight: 700;
  margin-right: 6px;
}

.upgrade-btn {
  margin: var(--spacing-md);
  margin-top: 0;
}
</style>
