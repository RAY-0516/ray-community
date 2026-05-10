<script setup lang="ts">
import AppHeader from './AppHeader.vue'
import AppFooter from './AppFooter.vue'
</script>

<template>
  <div class="app-layout">
    <AppHeader />
    <main class="app-main">
      <slot />
    </main>
    <AppFooter />
    <el-backtop :right="40" :bottom="40" />
  </div>
</template>

<style scoped>
.app-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.app-main {
  flex: 1;
  max-width: 1280px;
  width: 100%;
  margin: 0 auto;
  padding: var(--spacing-lg) var(--spacing-md);
}
</style>
