<script setup lang="ts">
import { ChatDotRound, Star } from '@element-plus/icons-vue'
import type { CommunityPost } from '@/types/community'
import { formatRelativeTime } from '@/utils/format'

defineProps<{ post: CommunityPost }>()
defineEmits<{ (e: 'view'): void }>()
</script>

<template>
  <article class="community-card" @click="$emit('view')">
    <div class="cc-image" v-if="post.images[0]">
      <img :src="post.images[0]" :alt="post.content.slice(0, 20)" loading="lazy" />
    </div>
    <div class="cc-body">
      <div class="cc-header">
        <el-avatar :size="36" :src="post.author.avatar">
          {{ post.author.nickname[0] }}
        </el-avatar>
        <div class="cc-author">
          <span class="cc-nickname">{{ post.author.nickname }}</span>
          <span class="cc-time">{{ formatRelativeTime(post.createdAt) }}</span>
        </div>
      </div>
      <p class="cc-content">{{ post.content }}</p>
      <div class="cc-tags" v-if="post.tags.length">
        <span class="cc-tag" v-for="tag in post.tags" :key="tag">#{{ tag }}</span>
      </div>
      <div class="cc-actions">
        <span class="cc-action">
          <el-icon><Star /></el-icon> {{ post.likes }}
        </span>
        <span class="cc-action">
          <el-icon><ChatDotRound /></el-icon> {{ post.comments }}
        </span>
      </div>
    </div>
  </article>
</template>

<style scoped>
.community-card {
  background: var(--color-bg-card);
  border-radius: var(--radius-lg);
  overflow: hidden;
  cursor: pointer;
  transition: all var(--transition-base);
  border: 1px solid var(--color-border-light);
  display: flex;
}

.community-card:hover {
  box-shadow: var(--shadow-md);
  border-color: var(--color-secondary-light);
}

.cc-image {
  width: 220px;
  flex-shrink: 0;
  overflow: hidden;
  background: var(--color-divider);
}

.cc-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform var(--transition-slow);
}

.community-card:hover .cc-image img {
  transform: scale(1.05);
}

.cc-body {
  flex: 1;
  padding: var(--spacing-md);
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.cc-header {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-sm);
}

.cc-author {
  display: flex;
  flex-direction: column;
}

.cc-nickname {
  font-size: var(--font-size-base);
  font-weight: 600;
}

.cc-time {
  font-size: var(--font-size-xs);
  color: var(--color-text-muted);
}

.cc-content {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  line-height: 1.7;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  flex: 1;
}

.cc-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: var(--spacing-sm);
}

.cc-tag {
  font-size: var(--font-size-xs);
  color: var(--color-secondary);
  background: var(--color-divider);
  padding: 2px 8px;
  border-radius: var(--radius-full);
}

.cc-actions {
  display: flex;
  gap: var(--spacing-md);
  margin-top: var(--spacing-sm);
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
}

.cc-action {
  display: flex;
  align-items: center;
  gap: 4px;
}

@media (max-width: 640px) {
  .community-card { flex-direction: column; }
  .cc-image { width: 100%; height: 200px; }
}
</style>
