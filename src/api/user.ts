import request from './request'
import type { User, LoginForm, RegisterForm } from '@/types/user'

export async function loginAPI(form: LoginForm): Promise<{ token: string; user: User }> {
  const res = await request.get<User[]>('/users', { params: { phone: form.phone } })
  if (res.data.length === 0) throw new Error('用户不存在')
  // 模拟密码验证
  const user = res.data[0]
  return { token: `mock-token-${user.id}-${Date.now()}`, user }
}

export async function registerAPI(form: RegisterForm) {
  const res = await request.get<User[]>('/users', { params: { phone: form.phone } })
  if (res.data.length > 0) throw new Error('手机号已注册')
  return request.post<User>('/users', {
    nickname: form.nickname,
    phone: form.phone,
    avatar: '',
    memberLevel: 'normal',
    memberExpire: '',
    collections: [],
    settings: { lang: 'zh-CN', theme: 'light', fontSize: 'medium' },
  })
}

export function fetchUserAPI(id: number) {
  return request.get<User>(`/users/${id}`).then((r) => r.data)
}

export function updateUserAPI(id: number, data: Partial<User>) {
  return request.patch<User>(`/users/${id}`, data).then((r) => r.data)
}
