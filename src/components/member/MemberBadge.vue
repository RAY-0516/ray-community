<script setup lang="ts">
import { computed } from 'vue'
import type { MemberLevel } from '@/types/user'
import { useMemberStore } from '@/stores/member'

const props = defineProps<{ level: MemberLevel; showIcon?: boolean }>()

const memberStore = useMemberStore()

const config = computed(() => memberStore.levels.find((l) => l.level === props.level))
</script>

<template>
  <span v-if="config" class="member-badge" :style="{ color: config.color, borderColor: config.color }">
    <span class="member-icon" v-if="showIcon !== false">{{ config.level === 'gold' ? '👑' : config.level === 'silver' ? '⭐' : '' }}</span>
    {{ config.name }}
  </span>
</template>

<style scoped>
.member-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 10px;
  border: 1.5px solid currentColor;
  border-radius: var(--radius-full);
  font-size: var(--font-size-xs);
  font-weight: 600;
}

.member-icon { font-size: 13px; }
</style>
