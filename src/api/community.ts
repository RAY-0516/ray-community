import request from './request'
import type { CommunityPost, PostForm } from '@/types/community'

export function fetchPosts(page = 1, limit = 10) {
  return request.get<CommunityPost[]>('/community', {
    params: { _sort: 'createdAt', _order: 'desc', _page: page, _limit: limit },
  })
}

export function createPost(data: PostForm) {
  return request.post<CommunityPost>('/community', {
    ...data,
    likes: 0,
    liked: false,
    comments: 0,
    createdAt: new Date().toISOString(),
    author: { id: 1, nickname: 'Ray酱', avatar: '' },
    linkedProducts: [],
  })
}

export function toggleLikeAPI(id: number, liked: boolean) {
  return request.patch(`/community/${id}`, { liked })
}

export function fetchPostById(id: number) {
  return request.get<CommunityPost>(`/community/${id}`)
}
