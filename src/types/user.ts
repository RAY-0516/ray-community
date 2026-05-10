/** 会员等级 */
export type MemberLevel = 'normal' | 'silver' | 'gold'

/** 会员等级配置 */
export interface MemberLevelConfig {
  level: MemberLevel
  name: string
  discount: number
  price: number
  icon: string
  color: string
  benefits: string[]
}

/** 用户设置 */
export interface UserSettings {
  lang: 'zh-CN' | 'en-US'
  theme: 'light' | 'dark'
  fontSize: 'small' | 'medium' | 'large'
}

/** 用户实体 */
export interface User {
  id: number
  nickname: string
  avatar: string
  phone: string
  memberLevel: MemberLevel
  memberExpire: string
  collections: number[]
  settings: UserSettings
}

/** 登录表单 */
export interface LoginForm {
  phone: string
  password: string
}

/** 注册表单 */
export interface RegisterForm {
  nickname: string
  phone: string
  password: string
  confirmPassword: string
}
