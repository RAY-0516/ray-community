<script setup lang="ts">
import { Sunny, Moon } from '@element-plus/icons-vue'
import { useThemeStore } from '@/stores/theme'
import AppLayout from '@/components/layout/AppLayout.vue'

const themeStore = useThemeStore()
</script>

<template>
  <AppLayout>
    <div class="settings-page">
      <h1 class="page-title">⚙️ {{ themeStore.t.settings.title }}</h1>

      <div class="settings-sections">
        <!-- 语言 -->
        <section class="settings-section">
          <h2 class="section-label">{{ themeStore.t.settings.language }}</h2>
          <div class="settings-options">
            <button
              class="setting-chip"
              :class="{ active: themeStore.locale === 'zh-CN' }"
              @click="themeStore.setLocale('zh-CN')"
            >
              🇨🇳 中文
            </button>
            <button
              class="setting-chip"
              :class="{ active: themeStore.locale === 'en-US' }"
              @click="themeStore.setLocale('en-US')"
            >
              🇺🇸 English
            </button>
          </div>
        </section>

        <!-- 主题 -->
        <section class="settings-section">
          <h2 class="section-label">{{ themeStore.t.settings.theme }}</h2>
          <div class="settings-options">
            <button
              class="setting-chip"
              :class="{ active: themeStore.theme === 'light' }"
              @click="themeStore.toggleTheme()"
            >
              <el-icon><Sunny /></el-icon> {{ themeStore.t.settings.themeLight }}
            </button>
            <button
              class="setting-chip"
              :class="{ active: themeStore.theme === 'dark' }"
              @click="themeStore.toggleTheme()"
            >
              <el-icon><Moon /></el-icon> {{ themeStore.t.settings.themeDark }}
            </button>
          </div>
        </section>

        <!-- 字号 -->
        <section class="settings-section">
          <h2 class="section-label">{{ themeStore.t.settings.fontSize }}</h2>
          <div class="settings-options">
            <button
              class="setting-chip"
              :class="{ active: themeStore.fontSize === 'small' }"
              @click="themeStore.setFontSize('small')"
            >
              {{ themeStore.t.settings.fontSizeSmall }}
            </button>
            <button
              class="setting-chip"
              :class="{ active: themeStore.fontSize === 'medium' }"
              @click="themeStore.setFontSize('medium')"
            >
              {{ themeStore.t.settings.fontSizeMedium }}
            </button>
            <button
              class="setting-chip"
              :class="{ active: themeStore.fontSize === 'large' }"
              @click="themeStore.setFontSize('large')"
            >
              {{ themeStore.t.settings.fontSizeLarge }}
            </button>
          </div>
        </section>

        <!-- 关于 -->
        <section class="settings-section">
          <h2 class="section-label">{{ themeStore.t.settings.about }}</h2>
          <div class="about-info">
            <p>Ray社区 v1.0.0</p>
            <p>潮流穿搭分享平台</p>
            <p class="about-stack">Vue 3 · TypeScript · Element Plus · Pinia</p>
          </div>
        </section>
      </div>
    </div>
  </AppLayout>
</template>

<style scoped>
.settings-page {
  max-width: 560px;
  margin: 0 auto;
}

.page-title {
  font-size: var(--font-size-xl);
  font-weight: 700;
  margin-bottom: var(--spacing-xl);
}

.settings-sections {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.settings-section {
  background: var(--color-bg-card);
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
  border: 1px solid var(--color-border-light);
}

.section-label {
  font-size: var(--font-size-sm);
  font-weight: 600;
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: var(--spacing-md);
}

.settings-options {
  display: flex;
  gap: var(--spacing-sm);
  flex-wrap: wrap;
}

.setting-chip {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 20px;
  border-radius: var(--radius-full);
  font-size: var(--font-size-sm);
  font-weight: 500;
  color: var(--color-text-secondary);
  border: 1.5px solid var(--color-border);
  transition: all var(--transition-fast);
}

.setting-chip:hover { border-color: var(--color-primary); color: var(--color-primary); }

.setting-chip.active {
  background: var(--color-primary);
  color: #fff;
  border-color: var(--color-primary);
}

.about-info {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  line-height: 1.8;
}

.about-stack {
  font-size: var(--font-size-xs);
  color: var(--color-text-muted);
  margin-top: var(--spacing-xs);
}
</style>
