import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { getStorage, setStorage } from '@/utils/storage'
import zhCN from '@/i18n/zh-CN'
import enUS from '@/i18n/en-US'

const messages = { 'zh-CN': zhCN, 'en-US': enUS } as const
type Locale = keyof typeof messages
type Theme = 'light' | 'dark'
type FontSize = 'small' | 'medium' | 'large'

export const useThemeStore = defineStore('theme', () => {
  const theme = ref<Theme>(getStorage<Theme>('ray-theme', 'light'))
  const locale = ref<Locale>(getStorage<Locale>('ray-locale', 'zh-CN'))
  const fontSize = ref<FontSize>(getStorage<FontSize>('ray-font-size', 'medium'))

  const t = computed(() => messages[locale.value])

  const fontSizeVars: Record<FontSize, Record<string, string>> = {
    small: {
      '--el-font-size-extra-large': '18px',
      '--el-font-size-large': '16px',
      '--el-font-size-medium': '14px',
      '--el-font-size-base': '12px',
      '--el-font-size-small': '11px',
      '--el-font-size-extra-small': '10px',
      '--font-size-2xl': '26px', '--font-size-xl': '19px', '--font-size-lg': '16px',
      '--font-size-md': '14px', '--font-size-base': '13px', '--font-size-sm': '12px', '--font-size-xs': '11px',
    },
    medium: {
      '--el-font-size-extra-large': '20px',
      '--el-font-size-large': '18px',
      '--el-font-size-medium': '16px',
      '--el-font-size-base': '14px',
      '--el-font-size-small': '13px',
      '--el-font-size-extra-small': '12px',
      '--font-size-2xl': '32px', '--font-size-xl': '24px', '--font-size-lg': '20px',
      '--font-size-md': '16px', '--font-size-base': '14px', '--font-size-sm': '13px', '--font-size-xs': '12px',
    },
    large: {
      '--el-font-size-extra-large': '24px',
      '--el-font-size-large': '20px',
      '--el-font-size-medium': '18px',
      '--el-font-size-base': '16px',
      '--el-font-size-small': '15px',
      '--el-font-size-extra-small': '14px',
      '--font-size-2xl': '38px', '--font-size-xl': '29px', '--font-size-lg': '24px',
      '--font-size-md': '18px', '--font-size-base': '16px', '--font-size-sm': '15px', '--font-size-xs': '14px',
    },
  }

  function applyTheme() {
    const html = document.documentElement
    html.classList.toggle('dark', theme.value === 'dark')
    const vars = fontSizeVars[fontSize.value]
    for (const [key, val] of Object.entries(vars)) {
      html.style.setProperty(key, val)
    }
    html.lang = locale.value
    setStorage('ray-theme', theme.value)
    setStorage('ray-locale', locale.value)
    setStorage('ray-font-size', fontSize.value)
  }

  function toggleTheme() {
    theme.value = theme.value === 'light' ? 'dark' : 'light'
    applyTheme()
  }

  function setLocale(lang: Locale) {
    locale.value = lang
    applyTheme()
  }

  function setFontSize(size: FontSize) {
    fontSize.value = size
    applyTheme()
  }

  return { theme, locale, fontSize, t, applyTheme, toggleTheme, setLocale, setFontSize }
})
