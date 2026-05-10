import request from './request'
import type { MemberLevelConfig } from '@/types/user'

export function fetchMemberLevelsAPI() {
  return request.get<MemberLevelConfig[]>('/memberLevels').then((r) => r.data)
}

export function upgradeMemberAPI(userId: number, level: string) {
  return request.patch(`/users/${userId}`, {
    memberLevel: level,
    memberExpire: new Date(Date.now() + 365 * 24 * 3600 * 1000).toISOString().slice(0, 10),
  }).then((r) => ({ level: r.data.memberLevel, expire: r.data.memberExpire }))
}
