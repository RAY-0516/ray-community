<script setup lang="ts">
const currentYear = new Date().getFullYear()
</script>

<template>
  <footer class="app-footer">
    <div class="footer-inner">
      <div class="footer-brand">
        <span class="footer-logo">Ray社区</span>
        <p class="footer-desc">潮流穿搭分享平台 · 发现你的风格</p>
      </div>
      <div class="footer-links">
        <a href="#">关于我们</a>
        <a href="#">帮助中心</a>
        <a href="#">隐私政策</a>
        <a href="#">用户协议</a>
      </div>
      <div class="footer-copy">
        &copy; {{ currentYear }} Ray社区 仅供学习展示使用
      </div>
    </div>
  </footer>
</template>

<style scoped>
.app-footer {
  background: var(--color-bg-card);
  border-top: 1px solid var(--color-border);
  padding: var(--spacing-2xl) 0;
  margin-top: var(--spacing-2xl);
}

.footer-inner {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 var(--spacing-md);
  text-align: center;
}

.footer-brand {
  margin-bottom: var(--spacing-md);
}

.footer-logo {
  font-size: var(--font-size-md);
  font-weight: 700;
  background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.footer-desc {
  font-size: var(--font-size-xs);
  color: var(--color-text-muted);
  margin-top: var(--spacing-xs);
}

.footer-links {
  display: flex;
  justify-content: center;
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-md);
}

.footer-links a {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  transition: color var(--transition-fast);
}

.footer-links a:hover {
  color: var(--color-primary);
}

.footer-copy {
  font-size: var(--font-size-xs);
  color: var(--color-text-muted);
}
</style>
