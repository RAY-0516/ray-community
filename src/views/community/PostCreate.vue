<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Picture } from '@element-plus/icons-vue'
import { createPost } from '@/api/community'
import { useTheme } from '@/composables/useTheme'
import AppLayout from '@/components/layout/AppLayout.vue'

const router = useRouter()
const { t } = useTheme()

const content = ref('')
const tagInput = ref('')
const tags = ref<string[]>([])
const imageUrl = ref('')
const images = ref<string[]>([])
const submitting = ref(false)

function addTag() {
  const tag = tagInput.value.trim()
  if (tag && !tags.value.includes(tag)) {
    tags.value.push(tag)
    tagInput.value = ''
  }
}

function removeTag(index: number) {
  tags.value.splice(index, 1)
}

function addImage() {
  const url = imageUrl.value.trim()
  if (url && !images.value.includes(url)) {
    images.value.push(url)
    imageUrl.value = ''
  }
}

function removeImage(index: number) {
  images.value.splice(index, 1)
}

async function handlePublish() {
  if (!content.value.trim()) {
    ElMessage.warning('请输入穿搭心得')
    return
  }
  submitting.value = true
  try {
    await createPost({
      images: images.value,
      content: content.value,
      tags: tags.value,
    })
    ElMessage.success('发布成功！')
    router.push({ name: 'community' })
  } catch {
    ElMessage.error('发布失败，请重试')
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <AppLayout>
    <div class="post-page">
      <h1 class="page-title">✍️ {{ t.community.postNew }}</h1>

      <div class="post-form">
        <!-- 图片区域 -->
        <div class="form-section">
          <label>穿搭图片</label>
          <div class="image-preview-list" v-if="images.length">
            <div v-for="(img, i) in images" :key="i" class="image-preview-item">
              <img :src="img" alt="预览" />
              <button class="image-remove" @click="removeImage(i)">×</button>
            </div>
          </div>
          <div class="image-input">
            <el-input v-model="imageUrl" placeholder="输入图片链接地址" size="small" />
            <el-button size="small" @click="addImage" :disabled="!imageUrl.trim()">添加</el-button>
          </div>
        </div>

        <!-- 内容 -->
        <div class="form-section">
          <label>穿搭心得</label>
          <el-input
            v-model="content"
            type="textarea"
            :rows="5"
            :placeholder="t.community.contentPlaceholder"
            maxlength="500"
            show-word-limit
          />
        </div>

        <!-- 标签 -->
        <div class="form-section">
          <label>{{ t.community.addTags }}</label>
          <div class="tags-display" v-if="tags.length">
            <el-tag
              v-for="(tag, i) in tags"
              :key="i"
              closable
              size="small"
              @close="removeTag(i)"
              type="info"
            >
              #{{ tag }}
            </el-tag>
          </div>
          <div class="tag-input">
            <el-input v-model="tagInput" placeholder="输入标签名，回车添加" size="small" @keyup.enter="addTag" />
          </div>
        </div>

        <el-button type="primary" size="large" round :loading="submitting" @click="handlePublish">
          {{ t.community.publish }}
        </el-button>
      </div>
    </div>
  </AppLayout>
</template>

<style scoped>
.post-page {
  max-width: 640px;
  margin: 0 auto;
}

.page-title {
  font-size: var(--font-size-xl);
  font-weight: 700;
  margin-bottom: var(--spacing-lg);
}

.post-form {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.form-section label {
  display: block;
  font-size: var(--font-size-sm);
  font-weight: 600;
  margin-bottom: var(--spacing-sm);
}

.image-preview-list {
  display: flex;
  gap: var(--spacing-sm);
  flex-wrap: wrap;
  margin-bottom: var(--spacing-sm);
}

.image-preview-item {
  position: relative;
  width: 120px;
  height: 160px;
  border-radius: var(--radius-sm);
  overflow: hidden;
}

.image-preview-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-remove {
  position: absolute;
  top: 2px;
  right: 2px;
  width: 22px;
  height: 22px;
  border-radius: var(--radius-full);
  background: rgba(0,0,0,0.6);
  color: #fff;
  font-size: 14px;
  line-height: 22px;
  text-align: center;
}

.image-input {
  display: flex;
  gap: var(--spacing-sm);
}

.tags-display {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: var(--spacing-sm);
}
</style>
