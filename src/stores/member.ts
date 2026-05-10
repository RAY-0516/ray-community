import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { MemberLevelConfig } from '@/types/user'
import { fetchMemberLevelsAPI, upgradeMemberAPI } from '@/api/member'
import { useUserStore } from './user'

export const useMemberStore = defineStore('member', () => {
  const levels = ref<MemberLevelConfig[]>([])
  const loading = ref(false)

  const currentLevel = computed(() => {
    const userStore = useUserStore()
    const level = userStore.user?.memberLevel ?? 'normal'
    return levels.value.find((l) => l.level === level) ?? levels.value[0]
  })

  const higherLevels = computed(() => {
    const idx = levels.value.findIndex((l) => l.level === currentLevel.value?.level)
    return levels.value.slice(idx + 1)
  })

  async function fetchLevels() {
    if (levels.value.length > 0) return
    loading.value = true
    try {
      levels.value = await fetchMemberLevelsAPI()
    } finally {
      loading.value = false
    }
  }

  async function upgrade(level: string): Promise<boolean> {
    const userStore = useUserStore()
    if (!userStore.user) return false
    try {
      const result = await upgradeMemberAPI(userStore.user.id, level)
      userStore.user.memberLevel = result.level
      userStore.user.memberExpire = result.expire
      return true
    } catch {
      return false
    }
  }

  return { levels, loading, currentLevel, higherLevels, fetchLevels, upgrade }
})
