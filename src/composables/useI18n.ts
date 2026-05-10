import { useThemeStore } from '@/stores/theme'

/** 国际化翻译 hook */
export function useI18n() {
  const store = useThemeStore()
  return { t: store.t }
}
