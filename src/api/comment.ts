import request from './request'
import type { Comment, CommentForm } from '@/types/comment'

export function fetchCommentsAPI(postId: number) {
  return request.get<Comment[]>('/comments', { params: { postId, _sort: 'createdAt', _order: 'asc' } })
}

export function createCommentAPI(data: CommentForm & { author: { id: number; nickname: string; avatar: string } }) {
  return request.post<Comment>('/comments', {
    ...data,
    createdAt: new Date().toISOString(),
  })
}
