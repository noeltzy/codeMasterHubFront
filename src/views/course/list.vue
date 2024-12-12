<template>
  <page-layout title="学习">
    <template #header-extra>
      <div class="tag-filter" v-loading="loading">
        <div class="tag-list">
          <div
            v-for="tag in tags"
            :key="tag.id"
            class="tag-item"
            :class="{ active: selectedTag === tag.id }"
            @click="handleTagChange(tag.id)"
          >
            {{ tag.name }}
          </div>
        </div>
      </div>
    </template>

    <div class="study-content" v-loading="loading">
      <template v-if="courseList.length > 0">
        <el-row :gutter="20">
          <el-col
            v-for="course in courseList"
            :key="course.id"
            :xs="24"
            :sm="12"
            :md="8"
            :lg="6"
          >
            <el-card class="course-card" :body-style="{ padding: '0px' }">
              <el-image
                :src="course.coverImage"
                fit="cover"
                class="course-image"
                :fallback="'https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png'"
              >
                <template #error>
                  <div class="image-placeholder">
                    <span>暂无封面</span>
                  </div>
                </template>
              </el-image>

              <div class="course-info">
                <h3 class="course-title">{{ course.name }}</h3>
                <div class="course-tags">
                  <el-tag
                    v-for="tag in course.tags"
                    :key="tag.id"
                    size="small"
                    type="info"
                    effect="plain"
                  >
                    {{ tag.name }}
                  </el-tag>
                </div>
                <div class="course-meta">
                  <span class="instructor">{{ course.instructorName }}</span>
                  <span class="student-count"
                    >{{ course.studentCount }}人学习</span
                  >
                </div>
                <div class="course-footer">
                  <span class="price">￥{{ course.price }}</span>
                  <el-button 
                    type="primary" 
                    link 
                    @click="handleCourseDetail(course.id)"
                  >
                    查看详情
                  </el-button>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>

        <div class="pagination-container">
          <el-pagination
            v-model:current-page="pagination.current"
            :page-size="pagination.pageSize"
            :total="pagination.total"
            @current-change="handleCurrentChange"
            layout="prev, pager, next"
            background
          />
        </div>
      </template>
      <el-empty v-else :image-size="200" description="暂无相关课程">
        <template #description>
          <p>当前分类下暂无课程内容</p>
          <p class="empty-tip">可以切换其他分类查看更多课程</p>
        </template>
      </el-empty>
    </div>
  </page-layout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import PageLayout from '@/layouts/PageLayout.vue'
import { tagApi } from '@/api/modules/tag'
import { courseApi } from '@/api/modules/course'
import { ElMessage } from 'element-plus'
import { ROUTE_NAMES } from '@/config/constants'

const router = useRouter()
const activeTab = ref(ROUTE_NAMES.STUDY)
const tags = ref([])
const selectedTag = ref(null)
const loading = ref(false)
const courseList = ref([])
const pagination = ref({
  current: 1,
  pageSize: 12,
  total: 0,
})

const loadTags = async () => {
  try {
    loading.value = true
    const result = await tagApi.getAllTags()
    if (result.success) {
      tags.value = result.data
      if (result.data.length > 0) {
        selectedTag.value = result.data[0].id
        await loadCourses() // 加载第一个标签的课程
      }
    } else {
      ElMessage.error(result.message)
    }
  } catch (error) {
    console.error('加载标签错误:', error)
    ElMessage.error('加载标签失败')
  } finally {
    loading.value = false
  }
}

const loadCourses = async () => {
  try {
    loading.value = true
    const result = await courseApi.getCourseList({
      tags: selectedTag.value ? String(selectedTag.value) : '',
      current: pagination.value.current,
      pageSize: pagination.value.pageSize,
    })

    if (result.success) {
      courseList.value = result.data.records
      pagination.value.total = result.data.total
    } else {
      ElMessage.error(result.message)
    }
  } catch (error) {
    console.error('加载课程错误:', error)
    ElMessage.error('加载课程失败')
  } finally {
    loading.value = false
  }
}

const handleTagChange = async (tagId) => {
  selectedTag.value = tagId
  pagination.value.current = 1 // 切换标签时重置页码
  await loadCourses()
}

const handleCurrentChange = async (current) => {
  pagination.value.current = current
  await loadCourses()
}

const handleCourseDetail = (courseId) => {
  console.log('跳转到课程详情，课程ID:', courseId)
  router.push(`/course/${courseId}`).catch(err => {
    console.error('路由跳转错误:', err)
    ElMessage.error('页面跳转失败')
  })
}

onMounted(() => {
  loadTags()
})
</script>

<style scoped>
.tag-filter {
  padding: 16px 0;
}

.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  padding: 0 20px;
}

.tag-item {
  padding: 6px 16px;
  border-radius: 16px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s;
  background: var(--el-fill-color-light);
  color: var(--el-text-color-regular);
}

.tag-item:hover {
  background: var(--el-color-primary-light-8);
  color: var(--el-color-primary);
}

.tag-item.active {
  background: var(--el-color-primary);
  color: white;
}

.study-content {
  margin-top: 24px;
  background: #fff;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
}

.course-card {
  margin-bottom: 20px;
  transition: all 0.3s;
}

.course-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
}

.course-image {
  width: 100%;
  height: 160px;
}

.image-placeholder {
  width: 100%;
  height: 160px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f7fa;
  color: #909399;
}

.course-info {
  padding: 14px;
}

.course-title {
  margin: 0 0 8px;
  font-size: 16px;
  font-weight: 500;
  color: var(--el-text-color-primary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.course-tags {
  margin-bottom: 8px;
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
}

.course-meta {
  display: flex;
  justify-content: space-between;
  color: var(--el-text-color-secondary);
  font-size: 13px;
  margin-bottom: 8px;
}

.course-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.price {
  color: #f56c6c;
  font-size: 16px;
  font-weight: bold;
}

.pagination-container {
  margin-top: 32px;
  display: flex;
  justify-content: center;
}

.empty-tip {
  color: var(--el-text-color-secondary);
  font-size: 14px;
  margin-top: 8px;
}
</style>
