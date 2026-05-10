<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Phone, Lock } from '@element-plus/icons-vue'
import { useUserStore } from '@/stores/user'
import { useTheme } from '@/composables/useTheme'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const { t } = useTheme()

const phone = ref('13800001111')
const password = ref('')
const loading = ref(false)

async function handleLogin() {
  if (!phone.value.trim()) {
    ElMessage.warning('请输入手机号')
    return
  }
  loading.value = true
  const ok = await userStore.login({ phone: phone.value, password: password.value || '123456' })
  loading.value = false
  if (ok) {
    ElMessage.success('登录成功！')
    const redirect = (route.query.redirect as string) ?? '/'
    router.push(redirect)
  } else {
    ElMessage.error('登录失败，请检查手机号')
  }
}
</script>

<template>
  <div class="auth-page">
    <div class="auth-card">
      <router-link to="/" class="auth-logo">⚡ Ray社区</router-link>
      <h1 class="auth-title">{{ t.user.phoneLogin }}</h1>

      <div class="auth-form">
        <el-input
          v-model="phone"
          :placeholder="t.user.phonePlaceholder"
          :prefix-icon="Phone"
          size="large"
          maxlength="11"
        />
        <el-input
          v-model="password"
          :placeholder="t.user.passwordPlaceholder"
          :prefix-icon="Lock"
          type="password"
          size="large"
          show-password
          @keyup.enter="handleLogin"
        />
        <el-button type="primary" size="large" round :loading="loading" @click="handleLogin" class="auth-submit">
          {{ t.common.login }}
        </el-button>
      </div>

      <p class="auth-switch">
        {{ t.user.noAccount }} <router-link to="/register">{{ t.user.goRegister }}</router-link>
      </p>
    </div>
  </div>
</template>

<style scoped>
.auth-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-bg);
  padding: var(--spacing-md);
}

.auth-card {
  width: 100%;
  max-width: 400px;
  background: var(--color-bg-card);
  border-radius: var(--radius-xl);
  padding: var(--spacing-2xl);
  text-align: center;
  box-shadow: var(--shadow-lg);
}

.auth-logo {
  font-size: var(--font-size-xl);
  font-weight: 800;
  color: var(--color-text-primary);
}

.auth-title {
  font-size: var(--font-size-lg);
  font-weight: 600;
  margin: var(--spacing-lg) 0;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.auth-submit {
  margin-top: var(--spacing-sm);
}

.auth-switch {
  margin-top: var(--spacing-lg);
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

.auth-switch a {
  color: var(--color-primary);
  font-weight: 600;
}
</style>
