<template>
  <page-layout :title="courseDetail?.name || '课程详情'">
    <template #header-extra>
      <div class="header-actions">
        <el-button link @click="$router.back()">
          <el-icon><arrow-left /></el-icon>
          返回
        </el-button>
        <el-button 
          link 
          class="favorite-btn"
          @click="toggleFavorite"
        >
          <el-icon>
            <star-filled v-if="isFavorite" />
            <star v-else />
          </el-icon>
          {{ isFavorite ? '取消收藏' : '收藏' }}
        </el-button>
      </div>
    </template>

    <div class="course-detail" v-loading="loading">
      <template v-if="courseDetail">
        <div class="course-meta">
          <div class="meta-item">
            <span class="label">讲师：</span>
            <span class="value">{{ courseDetail.instructorName }}</span>
          </div>
          <div class="meta-item">
            <span class="label">学习人数：</span>
            <span class="value">{{ courseDetail.studentCount }}人</span>
          </div>
          <div class="meta-item">
            <span class="label">价格：</span>
            <span class="value price">￥{{ courseDetail.price }}</span>
          </div>
        </div>

        <div class="course-tags">
          <el-tag
            v-for="tag in courseDetail.tags"
            :key="tag.id"
            size="small"
            effect="plain"
          >
            {{ tag.name }}
          </el-tag>
        </div>

        <div class="course-content">
          <h2>课程介绍</h2>
          <div class="description">{{ courseDetail.description }}</div>
          
          <h2>课程大纲</h2>
          <div class="outline">
            <el-collapse v-model="activeChapters">
              <el-collapse-item
                v-for="chapter in courseDetail.chapters"
                :key="chapter.id"
                :title="chapter.title"
                :name="chapter.id"
              >
                <div class="chapter-lessons">
                  <div 
                    v-for="lesson in chapter.lessons" 
                    :key="lesson.id"
                    class="lesson-item"
                  >
                    <el-icon><video-camera /></el-icon>
                    <span class="lesson-title">{{ lesson.title }}</span>
                    <span class="lesson-duration">{{ lesson.duration }}分钟</span>
                  </div>
                </div>
              </el-collapse-item>
            </el-collapse>
          </div>
        </div>
      </template>
      <el-empty 
        v-else 
        :image-size="200" 
        description="课程不存在或已下架"
      >
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
import { VideoCamera, ArrowLeft, Star, StarFilled } from '@element-plus/icons-vue'
import { ROUTE_NAMES } from '@/config/constants'

const route = useRoute()
const router = useRouter()
const loading = ref(false)
const courseDetail = ref(null)
const activeChapters = ref([])
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
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.header-actions {
  display: flex;
  gap: 16px;
  align-items: center;
}

.favorite-btn {
  font-size: 16px;
}

.course-meta {
  display: flex;
  gap: 32px;
  margin-bottom: 16px;
}

.meta-item {
  display: flex;
  align-items: center;
}

.meta-item .label {
  color: var(--el-text-color-secondary);
  margin-right: 8px;
}

.meta-item .value {
  color: var(--el-text-color-primary);
}

.meta-item .price {
  color: #f56c6c;
  font-weight: bold;
}

.course-tags {
  margin-bottom: 32px;
  display: flex;
  gap: 8px;
}

.course-content {
  h2 {
    font-size: 20px;
    font-weight: 500;
    margin: 24px 0 16px;
    color: var(--el-text-color-primary);
  }

  .description {
    color: var(--el-text-color-regular);
    line-height: 1.6;
    margin-bottom: 32px;
  }
}

.chapter-lessons {
  padding: 8px 0;
}

.lesson-item {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  color: var(--el-text-color-regular);
  transition: background-color 0.3s;

  &:hover {
    background-color: var(--el-fill-color-light);
  }

  .el-icon {
    margin-right: 8px;
    font-size: 16px;
  }

  .lesson-title {
    flex: 1;
  }

  .lesson-duration {
    color: var(--el-text-color-secondary);
    font-size: 13px;
  }
}
</style> 