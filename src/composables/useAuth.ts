import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'

/** 认证相关逻辑快捷入口 */
export function useAuth() {
  const router = useRouter()
  const store = useUserStore()

  function requireAuth(): boolean {
    if (!store.isLoggedIn) {
      router.push({ name: 'login', query: { redirect: router.currentRoute.value.fullPath } })
      return false
    }
    return true
  }

  function goLogin() {
    router.push({ name: 'login' })
  }

  function goRegister() {
    router.push({ name: 'register' })
  }

  return { store, requireAuth, goLogin, goRegister }
}
