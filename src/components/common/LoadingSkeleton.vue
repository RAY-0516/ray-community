<script setup lang="ts">
defineProps<{
  rows?: number
  type?: 'card' | 'list' | 'detail'
}>()
</script>

<template>
  <div class="skeleton" :class="`skeleton-${type ?? 'card'}`">
    <template v-if="type === 'card' || !type">
      <div v-for="i in (rows ?? 6)" :key="i" class="sk-card">
        <div class="sk-img sk-animate"></div>
        <div class="sk-text sk-animate" style="width:80%"></div>
        <div class="sk-text sk-animate" style="width:50%"></div>
      </div>
    </template>
    <template v-else-if="type === 'list'">
      <div v-for="i in (rows ?? 4)" :key="i" class="sk-list-item">
        <div class="sk-img sk-animate" style="width:200px;height:260px"></div>
        <div class="sk-list-content">
          <div class="sk-text sk-animate" style="width:60%"></div>
          <div class="sk-text sk-animate" style="width:90%"></div>
          <div class="sk-text sk-animate" style="width:40%"></div>
        </div>
      </div>
    </template>
    <template v-else-if="type === 'detail'">
      <div class="sk-detail-img sk-animate"></div>
      <div class="sk-text sk-animate" style="width:70%;height:28px"></div>
      <div class="sk-text sk-animate" style="width:40%;height:24px"></div>
      <div class="sk-text sk-animate" style="width:90%;height:16px"></div>
      <div class="sk-text sk-animate" style="width:80%;height:16px"></div>
    </template>
  </div>
</template>

<style scoped>
.skeleton-card {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: var(--spacing-md);
}

.sk-card {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.sk-list-item {
  display: flex;
  gap: var(--spacing-md);
  padding: var(--spacing-md);
  background: var(--color-bg-card);
  border-radius: var(--radius-md);
}

.sk-img {
  border-radius: var(--radius-md);
  background: var(--color-divider);
}

.sk-card .sk-img {
  aspect-ratio: 3/4;
}

.sk-detail-img {
  width: 100%;
  height: 400px;
  border-radius: var(--radius-lg);
}

.sk-text {
  height: 14px;
  border-radius: var(--radius-sm);
  background: var(--color-divider);
}

.sk-animate {
  animation: shimmer 1.5s infinite;
  background: linear-gradient(90deg, var(--color-divider) 25%, var(--color-border) 50%, var(--color-divider) 75%);
  background-size: 200% 100%;
}

@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
</style>
