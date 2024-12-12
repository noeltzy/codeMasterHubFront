<template>
  <page-layout :title="courseDetail?.name || '课程详情'">
    <template #header-extra>
      <div class="header-actions">
        <el-button link @click="$router.back()">
          <el-icon><arrow-left /></el-icon>
          返回
        </el-button>
      </div>
    </template>

    <div class="course-detail" v-loading="loading">
      <template v-if="courseDetail">
        <el-row :gutter="24">
          <!-- 左侧内容区 -->
          <el-col :span="16">
            <div class="course-main">
              <!-- 课程封面 -->
              <div class="course-cover">
                <el-image
                  :src="courseDetail.coverImage"
                  fit="cover"
                  :fallback="'https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png'"
                >
                  <template #error>
                    <div class="image-placeholder">
                      <el-icon><picture-filled /></el-icon>
                      <span>暂无封面</span>
                    </div>
                  </template>
                </el-image>
              </div>

              <!-- 课程介绍 -->
              <div class="course-section">
                <h2 class="section-title">课程介绍</h2>
                <div class="course-description">
                  {{ courseDetail.description }}
                </div>
              </div>
            </div>
          </el-col>

          <!-- 右侧信息栏 -->
          <el-col :span="8">
            <div class="course-sidebar">
              <el-card class="info-card">
                <div class="price-section">
                  <div class="price">￥{{ courseDetail.price }}</div>
                  <el-button type="primary" size="large" class="buy-button">
                    立即购买
                  </el-button>
                </div>

                <div class="course-meta">
                  <div class="meta-item">
                    <el-icon><user /></el-icon>
                    <span class="label">讲师：</span>
                    <span class="value">{{ courseDetail.instructorName }}</span>
                  </div>
                  <div class="meta-item">
                    <el-icon><user-filled /></el-icon>
                    <span class="label">学习人数：</span>
                    <span class="value">{{ courseDetail.studentCount }}人</span>
                  </div>
                  <div class="meta-item">
                    <el-icon><timer /></el-icon>
                    <span class="label">课程时长：</span>
                    <span class="value">{{
                      formatDuration(courseDetail.duration)
                    }}</span>
                  </div>
                </div>

                <div class="action-section">
                  <el-button
                    :type="isFavorite ? 'danger' : 'default'"
                    class="action-button"
                    @click="toggleFavorite"
                  >
                    <el-icon>
                      <star-filled v-if="isFavorite" />
                      <star v-else />
                    </el-icon>
                    {{ isFavorite ? '取消收藏' : '收藏课程' }}
                  </el-button>
                </div>

                <div class="tags-section">
                  <div class="section-label">课程标签：</div>
                  <div class="tags-list">
                    <el-tag
                      v-for="tag in courseDetail.tags"
                      :key="tag.id"
                      size="small"
                      effect="light"
                      class="course-tag"
                    >
                      {{ tag.name }}
                    </el-tag>
                  </div>
                </div>
              </el-card>
            </div>
          </el-col>
        </el-row>
      </template>

      <el-empty v-else :image-size="200" description="课程不存在或已下架">
        <template #description>
          <p>该课程可能已被删除或暂时下架</p>
          <el-button type="primary" @click="$router.push('/study')">
            返回课程列表
          </el-button>
        </template>
      </el-empty>
    </div>
  </page-layout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import PageLayout from '@/layouts/PageLayout.vue'
import { courseApi } from '@/api/modules/course'
import { ElMessage } from 'element-plus'
import {
  VideoCamera,
  ArrowLeft,
  Star,
  StarFilled,
  User,
  UserFilled,
  Timer,
  PictureFilled,
} from '@element-plus/icons-vue'
import { formatDuration } from '@/utils/helpers'

const route = useRoute()
const router = useRouter()
const loading = ref(false)
const courseDetail = ref(null)
const isFavorite = ref(false)

const loadCourseDetail = async () => {
  try {
    loading.value = true
    const result = await courseApi.getCourseDetail(route.params.id)
    if (result.success) {
      courseDetail.value = result.data
    } else {
      ElMessage.error(result.message)
    }
  } catch (error) {
    console.error('加载课程详情错误:', error)
    ElMessage.error('加载课程详情失败')
  } finally {
    loading.value = false
  }
}

const toggleFavorite = async () => {
  try {
    const result = await courseApi.toggleFavorite(route.params.id)
    if (result.success) {
      isFavorite.value = !isFavorite.value
      ElMessage.success(isFavorite.value ? '收藏成功' : '取消收藏成功')
    } else {
      ElMessage.error(result.message)
    }
  } catch (error) {
    console.error('收藏操作错误:', error)
    ElMessage.error('操作失败')
  }
}

const loadFavoriteStatus = async () => {
  try {
    const result = await courseApi.getFavoriteIds()
    if (result.success) {
      isFavorite.value = result.data.includes(Number(route.params.id))
    }
  } catch (error) {
    console.error('加载收藏状态错误:', error)
  }
}

onMounted(() => {
  loadCourseDetail()
  loadFavoriteStatus()
})
</script>

<style scoped>
.course-detail {
  margin: 0 auto;
  padding: 20px;
}

.header-actions {
  display: flex;
  gap: 16px;
  align-items: center;
}

.course-main {
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
}

.course-cover {
  width: 100%;
  height: 360px;
  background: #000;
  overflow: hidden;
}

.course-cover .el-image {
  width: 100%;
  height: 100%;
}

.image-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #f5f7fa;
  color: #909399;
  font-size: 14px;
}

.image-placeholder .el-icon {
  font-size: 48px;
  margin-bottom: 12px;
}

.course-section {
  padding: 24px;
  border-bottom: 1px solid var(--el-border-color-lighter);
}

.course-section:last-child {
  border-bottom: none;
}

.section-title {
  font-size: 20px;
  font-weight: 500;
  margin: 0 0 16px;
  color: var(--el-text-color-primary);
}

.course-description {
  color: var(--el-text-color-regular);
  line-height: 1.8;
  font-size: 14px;
}

.course-sidebar {
  position: sticky;
  top: 84px;
}

.info-card {
  border-radius: 8px;
}

.price-section {
  text-align: center;
  padding-bottom: 20px;
  margin-bottom: 20px;
  border-bottom: 1px solid var(--el-border-color-lighter);
}

.price {
  font-size: 32px;
  color: #f56c6c;
  font-weight: bold;
  margin-bottom: 16px;
}

.buy-button {
  width: 100%;
}

.course-meta {
  margin-bottom: 20px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  color: var(--el-text-color-regular);
}

.meta-item:last-child {
  margin-bottom: 0;
}

.meta-item .el-icon {
  font-size: 16px;
}

.meta-item .label {
  color: var(--el-text-color-secondary);
}

.action-section {
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid var(--el-border-color-lighter);
}

.action-button {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.tags-section {
  .section-label {
    color: var(--el-text-color-secondary);
    margin-bottom: 12px;
  }
}

.tags-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.course-tag {
  border-radius: 12px;
}
</style>
