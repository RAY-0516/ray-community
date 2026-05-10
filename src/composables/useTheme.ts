import { useThemeStore } from '@/stores/theme'

/** 主题相关逻辑快捷入口 */
export function useTheme() {
  const store = useThemeStore()

  return {
    t: store.t,
    theme: store.theme,
    locale: store.locale,
    fontSize: store.fontSize,
    toggleTheme: store.toggleTheme,
    setLocale: store.setLocale,
    setFontSize: store.setFontSize,
  }
}
