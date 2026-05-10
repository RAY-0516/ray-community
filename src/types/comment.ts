/** 评论实体 */
export interface Comment {
  id: number
  postId: number
  author: {
    id: number
    nickname: string
    avatar: string
  }
  content: string
  createdAt: string
}

/** 发表评论表单 */
export interface CommentForm {
  postId: number
  content: string
}
