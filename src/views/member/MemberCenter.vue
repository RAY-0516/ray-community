<script setup lang="ts">
import { onMounted } from 'vue'
import { Trophy } from '@element-plus/icons-vue'
import { useMemberStore } from '@/stores/member'
import { useUserStore } from '@/stores/user'
import { useTheme } from '@/composables/useTheme'
import AppLayout from '@/components/layout/AppLayout.vue'
import MemberBadge from '@/components/member/MemberBadge.vue'
import MemberUpgrade from '@/components/member/MemberUpgrade.vue'
import LoadingSkeleton from '@/components/common/LoadingSkeleton.vue'
import { formatDate } from '@/utils/format'

const memberStore = useMemberStore()
const userStore = useUserStore()
const { t } = useTheme()

onMounted(() => memberStore.fetchLevels())
</script>

<template>
  <AppLayout>
    <div class="member-page">
      <h1 class="page-title">💎 {{ t.member.title }}</h1>

      <!-- 当前等级 -->
      <div class="current-level-card" v-if="memberStore.currentLevel">
        <div class="current-left">
          <el-icon :size="36"><Trophy /></el-icon>
          <div>
            <p class="current-label">{{ t.member.currentLevel }}</p>
            <MemberBadge :level="userStore.memberLevel" :show-icon="true" />
            <p v-if="userStore.user?.memberExpire" class="current-expire">
              有效期至 {{ formatDate(userStore.user.memberExpire) }}
            </p>
          </div>
        </div>
        <div class="current-discount">
          <span class="discount-num">{{ Math.round((1 - (memberStore.currentLevel?.discount ?? 1)) * 100) }}%</span>
          <span class="discount-label">专享折扣</span>
        </div>
      </div>

      <!-- 升级选项 -->
      <LoadingSkeleton v-if="memberStore.loading" :rows="3" />
      <div v-else-if="memberStore.higherLevels.length" class="upgrade-section">
        <h2 class="section-title">升级会员</h2>
        <div class="upgrade-grid">
          <MemberUpgrade
            v-for="level in memberStore.higherLevels"
            :key="level.level"
            :level="level"
          />
        </div>
      </div>

      <!-- 会员权益对比 -->
      <section class="benefits-section" v-if="memberStore.levels.length">
        <h2 class="section-title">{{ t.member.benefits }}</h2>
        <div class="benefits-table">
          <table>
            <thead>
              <tr>
                <th>权益</th>
                <th v-for="l in memberStore.levels" :key="l.level">{{ l.name }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(benefit, i) in memberStore.levels[memberStore.levels.length - 1]?.benefits ?? []" :key="i">
                <td>{{ benefit }}</td>
                <td v-for="l in memberStore.levels" :key="l.level">
                  <span :class="l.benefits.includes(benefit) ? 'check-yes' : 'check-no'">
                    {{ l.benefits.includes(benefit) ? '✓' : '—' }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  </AppLayout>
</template>

<style scoped>
.member-page {
  max-width: 800px;
  margin: 0 auto;
}

.page-title {
  font-size: var(--font-size-xl);
  font-weight: 700;
  margin-bottom: var(--spacing-lg);
}

.current-level-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-xl);
  background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
  color: #fff;
  border-radius: var(--radius-lg);
  margin-bottom: var(--spacing-xl);
}

.current-left {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.current-label {
  font-size: var(--font-size-sm);
  opacity: 0.8;
  margin-bottom: 4px;
}

.current-expire {
  font-size: var(--font-size-xs);
  opacity: 0.7;
  margin-top: 4px;
}

.discount-num {
  font-size: var(--font-size-2xl);
  font-weight: 800;
}

.discount-label {
  display: block;
  font-size: var(--font-size-xs);
  opacity: 0.8;
}

.upgrade-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: var(--spacing-md);
}

.benefits-section {
  margin-top: var(--spacing-xl);
}

.benefits-table {
  overflow-x: auto;
  background: var(--color-bg-card);
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border-light);
}

.benefits-table table {
  width: 100%;
  border-collapse: collapse;
}

.benefits-table th,
.benefits-table td {
  padding: var(--spacing-sm) var(--spacing-md);
  text-align: center;
  font-size: var(--font-size-sm);
  border-bottom: 1px solid var(--color-divider);
}

.benefits-table th {
  font-weight: 600;
  color: var(--color-text-primary);
  background: var(--color-divider);
}

.benefits-table td:first-child {
  text-align: left;
  font-weight: 500;
}

.check-yes { color: var(--color-success); font-weight: 700; }
.check-no { color: var(--color-text-muted); }
</style>
