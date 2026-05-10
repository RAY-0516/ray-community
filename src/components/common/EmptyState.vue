<script setup lang="ts">
import { FolderOpened } from '@element-plus/icons-vue'

defineProps<{ message?: string }>()
const emit = defineEmits<{ (e: 'action'): void }>()
</script>

<template>
  <div class="empty-state">
    <el-icon class="empty-icon"><FolderOpened /></el-icon>
    <p class="empty-text">{{ message ?? '暂无数据' }}</p>
    <slot name="action">
      <el-button type="primary" round size="small" @click="emit('action')" v-if="$slots.action">
        <slot name="action-text">去逛逛</slot>
      </el-button>
    </slot>
  </div>
</template>

<style scoped>
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-2xl) 0;
  color: var(--color-text-muted);
}

.empty-icon {
  font-size: 48px;
  margin-bottom: var(--spacing-md);
}

.empty-text {
  font-size: var(--font-size-base);
}
</style>
