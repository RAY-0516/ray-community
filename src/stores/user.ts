import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User, LoginForm, RegisterForm } from '@/types/user'
import { getStorage, setStorage, removeStorage } from '@/utils/storage'
import { loginAPI, registerAPI, fetchUserAPI, updateUserAPI } from '@/api/user'

export const useUserStore = defineStore('user', () => {
  const user = ref<User | null>(getStorage<User | null>('ray-user', null))
  const token = ref<string | null>(getStorage<string | null>('ray-token', null))

  const isLoggedIn = computed(() => !!token.value && !!user.value)
  const memberLevel = computed(() => user.value?.memberLevel ?? 'normal')

  async function login(form: LoginForm): Promise<boolean> {
    try {
      const res = await loginAPI(form)
      token.value = res.token
      user.value = res.user
      setStorage('ray-token', token.value)
      setStorage('ray-user', user.value)
      return true
    } catch {
      return false
    }
  }

  async function register(form: RegisterForm): Promise<boolean> {
    try {
      await registerAPI(form)
      return true
    } catch {
      return false
    }
  }

  function logout() {
    token.value = null
    user.value = null
    removeStorage('ray-token')
    removeStorage('ray-user')
  }

  async function refreshUser(): Promise<void> {
    if (!user.value) return
    try {
      const updated = await fetchUserAPI(user.value.id)
      user.value = updated
      setStorage('ray-user', updated)
    } catch {
      // 静默失败
    }
  }

  async function updateProfile(data: Partial<User>): Promise<boolean> {
    if (!user.value) return false
    try {
      const updated = await updateUserAPI(user.value.id, data)
      user.value = updated
      setStorage('ray-user', updated)
      return true
    } catch {
      return false
    }
  }

  function toggleCollection(productId: number) {
    if (!user.value) return
    const idx = user.value.collections.indexOf(productId)
    if (idx > -1) {
      user.value.collections.splice(idx, 1)
    } else {
      user.value.collections.push(productId)
    }
    setStorage('ray-user', user.value)
    updateUserAPI(user.value.id, { collections: user.value.collections }).catch(() => {})
  }

  function isCollected(productId: number): boolean {
    return user.value?.collections.includes(productId) ?? false
  }

  return {
    user, token, isLoggedIn, memberLevel,
    login, register, logout, refreshUser, updateProfile,
    toggleCollection, isCollected,
  }
})
