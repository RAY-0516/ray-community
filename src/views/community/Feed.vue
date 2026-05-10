<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import type { CommunityPost } from '@/types/community'
import type { Comment } from '@/types/comment'
import { fetchPosts, toggleLikeAPI } from '@/api/community'
import { fetchCommentsAPI, createCommentAPI } from '@/api/comment'
import { useAuth } from '@/composables/useAuth'
import { useThemeStore } from '@/stores/theme'
import { formatRelativeTime } from '@/utils/format'
import AppLayout from '@/components/layout/AppLayout.vue'
import LoadingSkeleton from '@/components/common/LoadingSkeleton.vue'
import EmptyState from '@/components/common/EmptyState.vue'

const router = useRouter()
const { store: userStore, requireAuth } = useAuth()
const themeStore = useThemeStore()

const posts = ref<CommunityPost[]>([])
const loading = ref(true)
const page = ref(1)
const hasMore = ref(true)

// 评论状态
const commentMap = ref<Record<number, Comment[]>>({})
const commentInput = ref<Record<number, string>>({})
const commentLoading = ref<Record<number, boolean>>({})
const showComments = ref<Record<number, boolean>>({})

async function loadPosts() {
  loading.value = true
  try {
    const res = await fetchPosts(page.value, 10)
    if (page.value === 1) posts.value = res.data
    else posts.value.push(...res.data)
    hasMore.value = res.data.length >= 10
  } finally { loading.value = false }
}

function loadMore() { page.value++; loadPosts() }

function handlePost() {
  if (!requireAuth()) return
  router.push({ name: 'post-create' })
}

async function handleLike(post: CommunityPost) {
  if (!userStore.isLoggedIn) { requireAuth(); return }
  post.liked = !post.liked
  post.likes += post.liked ? 1 : -1
  await toggleLikeAPI(post.id, post.liked).catch(() => {
    post.liked = !post.liked
    post.likes += post.liked ? 1 : -1
  })
}

async function toggleComments(postId: number) {
  showComments.value[postId] = !showComments.value[postId]
  if (showComments.value[postId] && !commentMap.value[postId]) {
    commentLoading.value[postId] = true
    try {
      const res = await fetchCommentsAPI(postId)
      commentMap.value[postId] = res.data
      const post = posts.value.find(p => p.id === postId)
      if (post) post.comments = res.data.length
    } finally { commentLoading.value[postId] = false }
  }
}

async function sendComment(postId: number) {
  const content = (commentInput.value[postId] ?? '').trim()
  if (!content) { ElMessage.warning('请输入评论内容'); return }
  if (!userStore.isLoggedIn) { requireAuth(); return }

  try {
    const res = await createCommentAPI({
      postId,
      content,
      author: { id: userStore.user!.id, nickname: userStore.user!.nickname, avatar: userStore.user!.avatar ?? '' },
    })
    if (!commentMap.value[postId]) commentMap.value[postId] = []
    commentMap.value[postId].push(res.data)
    commentInput.value[postId] = ''
    const post = posts.value.find(p => p.id === postId)
    if (post) post.comments++
  } catch { /* handled by interceptor */ }
}

function goProduct(id: number) {
  router.push({ name: 'product-detail', params: { id } })
}

onMounted(loadPosts)
</script>

<template>
  <AppLayout>
    <div class="feed-page">
      <div class="feed-header">
        <h1 class="page-title">👗 {{ themeStore.t.community.title }}</h1>
        <el-button type="primary" round :icon="Plus" @click="handlePost">
          {{ themeStore.t.community.postNew }}
        </el-button>
      </div>

      <LoadingSkeleton v-if="loading && !posts.length" type="list" :rows="3" />
      <EmptyState v-else-if="!posts.length" :message="themeStore.t.common.empty" />

      <div v-else class="feed-list">
        <article v-for="post in posts" :key="post.id" class="feed-card">
          <div class="feed-author">
            <el-avatar :size="40" :src="post.author.avatar">{{ post.author.nickname[0] }}</el-avatar>
            <div>
              <span class="feed-nickname">{{ post.author.nickname }}</span>
              <span class="feed-time">{{ formatRelativeTime(post.createdAt) }}</span>
            </div>
          </div>

          <p class="feed-content">{{ post.content }}</p>

          <div class="feed-images" v-if="post.images.length">
            <img v-for="(img, i) in post.images" :key="i" :src="img" :alt="'穿搭图' + (i + 1)" class="feed-img" />
          </div>

          <div class="feed-tags" v-if="post.tags.length">
            <span v-for="tag in post.tags" :key="tag" class="feed-tag">#{{ tag }}</span>
          </div>

          <div class="feed-linked" v-if="post.linkedProducts.length">
            <span class="linked-label">相关商品:</span>
            <span v-for="pid in post.linkedProducts" :key="pid" class="linked-item" @click="goProduct(pid)">商品 #{{ pid }}</span>
          </div>

          <div class="feed-actions">
            <button class="feed-action" :class="{ liked: post.liked }" @click="handleLike(post)">
              {{ post.liked ? '❤️' : '🤍' }} {{ post.likes }}
            </button>
            <button class="feed-action" @click="toggleComments(post.id)">
              💬 {{ post.comments }}
            </button>
          </div>

          <!-- 评论区 -->
          <div v-if="showComments[post.id]" class="comments-section">
            <div class="comments-list" v-if="commentMap[post.id]?.length">
              <div v-for="c in commentMap[post.id]" :key="c.id" class="comment-item">
                <el-avatar :size="28" :src="c.author.avatar">{{ c.author.nickname[0] }}</el-avatar>
                <div class="comment-body">
                  <span class="comment-author">{{ c.author.nickname }}</span>
                  <span class="comment-text">{{ c.content }}</span>
                  <span class="comment-time">{{ formatRelativeTime(c.createdAt) }}</span>
                </div>
              </div>
            </div>
            <div v-else-if="!commentLoading[post.id]" class="comments-empty">暂无评论</div>
            <div v-if="commentLoading[post.id]" class="comments-loading">加载中...</div>

            <div class="comment-input-row">
              <el-input
                v-model="commentInput[post.id]"
                placeholder="写下你的评论..."
                size="small"
                @keyup.enter="sendComment(post.id)"
              />
              <el-button size="small" type="primary" @click="sendComment(post.id)">发送</el-button>
            </div>
          </div>
        </article>

        <div class="load-more" v-if="hasMore">
          <el-button :loading="loading" round @click="loadMore">加载更多</el-button>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<style scoped>
.feed-page { max-width: 640px; margin: 0 auto; }
.feed-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--spacing-lg); }
.page-title { font-size: var(--font-size-xl); font-weight: 700; }
.feed-list { display: flex; flex-direction: column; gap: var(--spacing-md); }

.feed-card { background: var(--color-bg-card); border-radius: var(--radius-lg); padding: var(--spacing-lg); border: 1px solid var(--color-border-light); }
.feed-author { display: flex; align-items: center; gap: var(--spacing-sm); margin-bottom: var(--spacing-md); }
.feed-nickname { font-size: var(--font-size-base); font-weight: 600; }
.feed-time { display: block; font-size: var(--font-size-xs); color: var(--color-text-muted); }
.feed-content { font-size: var(--font-size-base); line-height: 1.8; margin-bottom: var(--spacing-md); }

.feed-images { display: grid; grid-template-columns: 1fr 1fr; gap: 6px; margin-bottom: var(--spacing-md); border-radius: var(--radius-md); overflow: hidden; }
.feed-img { width: 100%; aspect-ratio: 3/4; object-fit: cover; }

.feed-tags { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: var(--spacing-sm); }
.feed-tag { font-size: var(--font-size-xs); color: var(--color-secondary); }
.feed-linked { margin-bottom: var(--spacing-sm); font-size: var(--font-size-xs); }
.linked-label { color: var(--color-text-muted); }
.linked-item { color: var(--color-primary); cursor: pointer; margin-left: 6px; text-decoration: underline; }

.feed-actions { display: flex; gap: var(--spacing-lg); padding-top: var(--spacing-sm); border-top: 1px solid var(--color-divider); }
.feed-action { font-size: var(--font-size-sm); color: var(--color-text-secondary); display: flex; align-items: center; gap: 4px; }
.feed-action.liked { color: var(--color-danger); }

/* 评论 */
.comments-section { margin-top: var(--spacing-md); padding-top: var(--spacing-md); border-top: 1px solid var(--color-divider); }
.comments-list { display: flex; flex-direction: column; gap: var(--spacing-sm); margin-bottom: var(--spacing-sm); }
.comment-item { display: flex; gap: var(--spacing-sm); }
.comment-body { display: flex; flex-direction: column; font-size: var(--font-size-sm); }
.comment-author { font-weight: 600; font-size: var(--font-size-xs); }
.comment-text { color: var(--color-text-secondary); }
.comment-time { font-size: var(--font-size-xs); color: var(--color-text-muted); }
.comments-empty, .comments-loading { font-size: var(--font-size-xs); color: var(--color-text-muted); padding: var(--spacing-sm) 0; }
.comment-input-row { display: flex; gap: var(--spacing-sm); }

.load-more { text-align: center; padding: var(--spacing-lg) 0; }
</style>
