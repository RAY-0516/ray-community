<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { User, Phone, Lock } from '@element-plus/icons-vue'
import { useUserStore } from '@/stores/user'
import { useTheme } from '@/composables/useTheme'

const router = useRouter()
const userStore = useUserStore()
const { t } = useTheme()

const nickname = ref('')
const phone = ref('')
const password = ref('')
const confirmPassword = ref('')
const loading = ref(false)

async function handleRegister() {
  if (!nickname.value.trim()) { ElMessage.warning('请输入昵称'); return }
  if (!phone.value.trim()) { ElMessage.warning('请输入手机号'); return }
  if (!password.value) { ElMessage.warning('请输入密码'); return }
  if (password.value !== confirmPassword.value) { ElMessage.warning('两次密码不一致'); return }

  loading.value = true
  const ok = await userStore.register({
    nickname: nickname.value,
    phone: phone.value,
    password: password.value,
    confirmPassword: confirmPassword.value,
  })
  loading.value = false
  if (ok) {
    ElMessage.success('注册成功，请登录')
    router.push({ name: 'login' })
  } else {
    ElMessage.error('注册失败，手机号可能已注册')
  }
}
</script>

<template>
  <div class="auth-page">
    <div class="auth-card">
      <router-link to="/" class="auth-logo">⚡ Ray社区</router-link>
      <h1 class="auth-title">{{ t.common.register }}</h1>

      <div class="auth-form">
        <el-input
          v-model="nickname"
          :placeholder="t.user.nicknamePlaceholder"
          :prefix-icon="User"
          size="large"
        />
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
        />
        <el-input
          v-model="confirmPassword"
          :placeholder="t.user.confirmPassword"
          :prefix-icon="Lock"
          type="password"
          size="large"
          show-password
        />
        <el-button type="primary" size="large" round :loading="loading" @click="handleRegister" class="auth-submit">
          {{ t.common.register }}
        </el-button>
      </div>

      <p class="auth-switch">
        {{ t.user.hasAccount }} <router-link to="/login">{{ t.user.goLogin }}</router-link>
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
