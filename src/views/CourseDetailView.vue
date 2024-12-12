<template>
  <page-layout :title="courseDetail?.name || '课程详情'" v-loading="loading">
    <template #header-extra>
      <div class="header-actions">
        <el-button 
          type="default"
          link
          @click="$router.back()"
          :icon="ArrowLeft"
          class="back-button"
        >
          返回
        </el-button>
      </div>
    </template>

    <!-- 添加无数据时的展示 -->
    <el-empty 
      v-if="!loading && !courseDetail"
      description="课程不存在或已下架"
    >
      <el-button type="primary" @click="$router.push('/study')">
        返回课程列表
      </el-button>
    </el-empty>

    <!-- 有数据时显示课程详情 -->
    <div class="course-detail" v-else-if="courseDetail">
      <el-row :gutter="24">
        <el-col :span="16">
          <div class="video-container">
            <video
              v-if="courseDetail.videoUrl"
              :src="courseDetail.videoUrl"
              controls
              class="course-video"
            ></video>
            <div v-else class="video-placeholder">
              <el-icon><VideoCamera /></el-icon>
              <span>暂无视频内容</span>
            </div>
          </div>
          
          <div class="course-info-section">
            <h2>课程介绍</h2>
            <p class="description">{{ courseDetail.description }}</p>
          </div>
        </el-col>
        
        <el-col :span="8">
          <el-card class="course-sidebar">
            <div class="course-meta">
              <el-image
                :src="courseDetail.coverImage"
                fit="cover"
                class="course-cover"
              />
              <div class="price-section">
                <div class="price-actions">
                  <span class="price">￥{{ courseDetail.price }}</span>
                  <el-button
                    :type="isFavorite ? 'danger' : 'default'"
                    :icon="isFavorite ? Star : StarFilled"
                    circle
                    @click="handleToggleFavorite"
                    :loading="favoriteLoading"
                  />
                </div>
                <el-button type="primary" size="large" block>立即购买</el-button>
              </div>
              <div class="course-stats">
                <div class="stat-item">
                  <span class="label">讲师</span>
                  <span class="value">{{ courseDetail.instructorName }}</span>
                </div>
                <div class="stat-item">
                  <span class="label">学习人数</span>
                  <span class="value">{{ courseDetail.studentCount }}人</span>
                </div>
                <div class="stat-item">
                  <span class="label">课程时长</span>
                  <span class="value">{{ formatDuration(courseDetail.duration) }}</span>
                </div>
              </div>
              <div class="course-tags">
                <el-tag
                  v-for="tag in courseDetail.tags"
                  :key="tag.id"
                  size="small"
                  effect="plain"
                  class="tag"
                >
                  {{ tag.name }}
                </el-tag>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </page-layout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { VideoCamera, ArrowLeft, Star, StarFilled } from '@element-plus/icons-vue'
import PageLayout from '@/layouts/PageLayout.vue'
import { courseApi } from '@/api/course'

const route = useRoute()
const loading = ref(false)
const courseDetail = ref(null)
const isFavorite = ref(false)
const favoriteLoading = ref(false)

const loadCourseDetail = async () => {
  try {
    loading.value = true
    const result = await courseApi.getCourseDetail(route.params.id)
    if (result.success) {
      if (result.data) {
        courseDetail.value = result.data
      } else {
        courseDetail.value = null
        ElMessage.warning('课程不存在或已下架')
      }
    } else {
      ElMessage.error(result.message)
    }
  } catch (error) {
    console.error('加载课程详情失败:', error)
    ElMessage.error('加载课程详情失败')
  } finally {
    loading.value = false
  }
}

const formatDuration = (seconds) => {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  return `${hours}小时${minutes}分钟`
}

const loadFavoriteStatus = async () => {
  if (!courseDetail.value) return

  try {
    const result = await courseApi.getFavoriteIds()
    if (result.success) {
      isFavorite.value = result.data.includes(Number(route.params.id))
    }
  } catch (error) {
    console.error('加载收藏状态失败:', error)
  }
}

const handleToggleFavorite = async () => {
  if (!courseDetail.value) return

  try {
    favoriteLoading.value = true
    const result = await courseApi.toggleFavorite(route.params.id)
    if (result.success) {
      isFavorite.value = !isFavorite.value
      ElMessage.success(isFavorite.value ? '收藏成功' : '已取消收藏')
    } else {
      ElMessage.error(result.message)
    }
  } catch (error) {
    console.error('收藏操作失败:', error)
    ElMessage.error('操作失败，请稍后重试')
  } finally {
    favoriteLoading.value = false
  }
}

onMounted(async () => {
  await loadCourseDetail()
  if (courseDetail.value) {
    await loadFavoriteStatus()
  }
})
</script>

<style scoped>
.course-detail {
  padding: 20px 0;
}

.video-container {
  width: 100%;
  background: #000;
  border-radius: 8px;
  overflow: hidden;
}

.course-video {
  width: 100%;
  aspect-ratio: 16 / 9;
}

.video-placeholder {
  width: 100%;
  aspect-ratio: 16 / 9;
  background: #f5f7fa;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: var(--el-text-color-secondary);
  font-size: 16px;
  gap: 8px;
}

.course-info-section {
  margin-top: 24px;
  padding: 20px;
  background: #fff;
  border-radius: 8px;
}

.description {
  color: var(--el-text-color-regular);
  line-height: 1.8;
}

.course-sidebar {
  position: sticky;
  top: 24px;
}

.course-cover {
  width: 100%;
  height: 200px;
  border-radius: 8px;
  margin-bottom: 16px;
}

.price-section {
  margin-bottom: 20px;
}

.price {
  display: block;
  color: #f56c6c;
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 16px;
}

.course-stats {
  margin: 20px 0;
  padding: 16px 0;
  border-top: 1px solid var(--el-border-color-lighter);
  border-bottom: 1px solid var(--el-border-color-lighter);
}

.stat-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.stat-item .label {
  color: var(--el-text-color-secondary);
}

.course-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 16px;
}

.tag {
  margin-right: 8px;
  margin-bottom: 8px;
}

.header-actions {
  display: flex;
  justify-content: flex-start;
  width: 100%;
}

.back-button {
  font-size: 14px;
  padding: 4px 12px;
}

.price-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.price {
  margin-bottom: 0;
}
</style> 