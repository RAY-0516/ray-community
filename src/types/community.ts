/** 社区穿搭分享 */
export interface CommunityPost {
  id: number
  author: {
    id: number
    nickname: string
    avatar: string
  }
  images: string[]
  content: string
  tags: string[]
  likes: number
  liked: boolean
  comments: number
  createdAt: string
  linkedProducts: number[]
}

/** 发布穿搭表单 */
export interface PostForm {
  images: string[]
  content: string
  tags: string[]
}
