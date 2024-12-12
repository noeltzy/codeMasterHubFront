<script setup>
import { ref, onMounted, watch } from 'vue'
import { userApi } from '../api/user'
import { ElMessage } from 'element-plus'
import { Plus, Edit } from '@element-plus/icons-vue'
import { courseApi } from '../api/course'

const userInfo = ref(null)
const loading = ref(true)
const uploadLoading = ref(false)
const editMode = ref(false)
const editForm = ref({
  nickname: ''
})

// 监听用户信息变化，更新编辑表单
watch(() => userInfo.value, (newVal) => {
  if (newVal) {
    editForm.value.nickname = newVal.nickname
  }
}, { immediate: true })

const loadUserInfo = async () => {
  try {
    const result = await userApi.getCurrentUser()
    if (result.success) {
      userInfo.value = result.data
    } else {
      ElMessage.error(result.message)
    }
  } catch (error) {
    console.error('加载用户信息错误:', error)
    ElMessage.error('加载用户信息失败')
  } finally {
    loading.value = false
  }
}

const handleAvatarSuccess = async (file) => {
  try {
    uploadLoading.value = true
    
    // 上传头像
    const uploadResult = await userApi.uploadAvatar(file)
    if (!uploadResult.success) {
      ElMessage.error('头像上传失败')
      return
    }

    // 更新用户信息
    const updateResult = await userApi.updateUserInfo({
      id: userInfo.value.id,
      avatar: uploadResult.data
    })

    if (updateResult.success) {
      ElMessage.success('头像更新成功')
      await loadUserInfo()
    } else {
      ElMessage.error(updateResult.message)
    }
  } catch (error) {
    console.error('更新头像错误:', error)
    ElMessage.error('更新头像失败')
  } finally {
    uploadLoading.value = false
  }
}

const handleEditNickname = () => {
  editMode.value = true
}

const handleSaveNickname = async () => {
  if (!editForm.value.nickname.trim()) {
    ElMessage.warning('昵称不能为空')
    return
  }

  try {
    loading.value = true
    const result = await userApi.updateUserInfo({
      id: userInfo.value.id,
      nickname: editForm.value.nickname.trim()
    })

    if (result.success) {
      ElMessage.success('昵称更新成功')
      editMode.value = false
      await loadUserInfo()
    } else {
      ElMessage.error(result.message)
    }
  } catch (error) {
    console.error('更新昵称错误:', error)
    ElMessage.error('更新昵称失败')
  } finally {
    loading.value = false
  }
}

const handleCancelEdit = () => {
  editMode.value = false
  editForm.value.nickname = userInfo.value.nickname // 取消时恢复原值
}

const beforeAvatarUpload = (file) => {
  const isImage = file.type.startsWith('image/')
  const isLt2M = file.size / 1024 / 1024 < 2

  if (!isImage) {
    ElMessage.error('头像必须是图片格式!')
    return false
  }
  if (!isLt2M) {
    ElMessage.error('头像大小不能超过 2MB!')
    return false
  }
  return true
}

// 添加收藏课程相关的状态
const favoriteCourses = ref([])
const favoritesLoading = ref(false)

// 加载收藏的课程
const loadFavoriteCourses = async () => {
  try {
    favoritesLoading.value = true
    const result = await courseApi.getFavoriteCourses()
    if (result.success) {
      favoriteCourses.value = result.data.map(course => ({
        ...course,
        unfavoriteLoading: false
      }))
    } else {
      ElMessage.error(result.message)
    }
  } catch (error) {
    console.error('加载收藏课程失败:', error)
    ElMessage.error('加载收藏课程失败')
  } finally {
    favoritesLoading.value = false
  }
}

// 添加取消收藏的处理函数
const handleUnfavorite = async (course) => {
  try {
    // 添加loading状态到课程对象
    course.unfavoriteLoading = true
    const result = await courseApi.toggleFavorite(course.id)
    if (result.success) {
      ElMessage.success('已取消收藏')
      // 从列表中移除该课程
      favoriteCourses.value = favoriteCourses.value.filter(item => item.id !== course.id)
    } else {
      ElMessage.error(result.message)
    }
  } catch (error) {
    console.error('取消收藏失败:', error)
    ElMessage.error('取消收藏失败')
  } finally {
    course.unfavoriteLoading = false
  }
}

// 在组件挂载时加载数据
onMounted(async () => {
  await Promise.all([loadUserInfo(), loadFavoriteCourses()])
})
</script>

<template>
  <div class="profile-page">
    <el-row :gutter="20">
      <el-col :span="8">
        <el-card v-loading="loading" class="user-card">
          <div class="user-card-content">
            <el-upload
              class="avatar-uploader"
              action="#"
              :show-file-list="false"
              :before-upload="beforeAvatarUpload"
              :http-request="({ file }) => handleAvatarSuccess(file)"
            >
              <el-avatar 
                v-loading="uploadLoading"
                :size="120" 
                :src="userInfo?.avatar"
                :fallback="'https://placeholder.co/120x120'"
              >
                <el-icon class="avatar-upload-icon"><Plus /></el-icon>
              </el-avatar>
            </el-upload>
            
            <div class="user-info">
              <div v-if="!editMode" class="nickname-display">
                <h3>{{ userInfo?.nickname }}</h3>
                <el-button 
                  type="primary" 
                  link
                  :icon="Edit"
                  @click="handleEditNickname"
                >
                  修改昵称
                </el-button>
              </div>
              <div v-else class="nickname-edit">
                <el-input 
                  v-model="editForm.nickname"
                  placeholder="请输入昵称"
                  maxlength="20"
                  show-word-limit
                  @keyup.enter="handleSaveNickname"
                />
                <div class="nickname-buttons">
                  <el-button type="primary" @click="handleSaveNickname">
                    保存
                  </el-button>
                  <el-button @click="handleCancelEdit">
                    取消
                  </el-button>
                </div>
              </div>
              <p class="username">@{{ userInfo?.username }}</p>
            </div>
          </div>
        </el-card>
      </el-col>

      <el-col :span="16">
        <el-card v-loading="loading" class="info-card">
          <template #header>
            <div class="card-header">
              <h3>基本信息</h3>
            </div>
          </template>

          <el-descriptions :column="1" border>
            <el-descriptions-item label="手机号">
              {{ userInfo?.phoneNumber }}
            </el-descriptions-item>
            <el-descriptions-item label="用户角色">
              <el-tag :type="userInfo?.role === 'ADMIN' ? 'danger' : 'info'">
                {{ userInfo?.role }}
              </el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="最后登录时间">
              {{ userInfo?.lastLoginTime ? new Date(userInfo.lastLoginTime).toLocaleString() : '-' }}
            </el-descriptions-item>
          </el-descriptions>
        </el-card>

        <!-- 添加收藏课程卡片 -->
        <el-card v-loading="favoritesLoading" class="favorites-card">
          <template #header>
            <div class="card-header">
              <div class="header-left">
                <h3>收藏的课程</h3>
                <el-tag 
                  type="info" 
                  size="small" 
                  class="course-count"
                >
                  共 {{ favoriteCourses.length }} 门
                </el-tag>
              </div>
            </div>
          </template>

          <div v-if="favoriteCourses.length > 0" class="favorites-list">
            <el-row :gutter="20">
              <el-col 
                v-for="course in favoriteCourses" 
                :key="course.id"
                :span="12"
              >
                <el-card 
                  class="favorite-course-card" 
                  shadow="hover"
                  @click="$router.push(`/course/${course.id}`)"
                >
                  <div class="course-content">
                    <el-image
                      :src="course.coverImage"
                      fit="cover"
                      class="course-image"
                    >
                      <template #error>
                        <div class="image-placeholder">暂无封面</div>
                      </template>
                    </el-image>
                    <div class="course-info">
                      <h4 class="course-title">{{ course.name }}</h4>
                      <div class="course-meta">
                        <span class="instructor">{{ course.instructorName }}</span>
                        <span class="price">￥{{ course.price }}</span>
                      </div>
                    </div>
                  </div>
                </el-card>
              </el-col>
            </el-row>
          </div>
          <el-empty 
            v-else 
            description="暂无收藏课程"
            :image-size="100"
          >
            <el-button 
              type="primary" 
              @click="$router.push('/study')"
            >
              去学习
            </el-button>
          </el-empty>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<style scoped>
.profile-page {
  padding: 20px;
}

.user-card {
  height: 100%;
}

.user-card-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 20px 0;
}

.avatar-uploader {
  position: relative;
  cursor: pointer;
  margin-bottom: 24px;
}

.avatar-upload-icon {
  font-size: 24px;
  color: #fff;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  opacity: 0;
  transition: opacity 0.3s;
}

.avatar-uploader:hover .avatar-upload-icon {
  opacity: 1;
}

.avatar-uploader:hover .el-avatar {
  filter: brightness(0.8);
}

.avatar-upload-tip {
  margin-top: 8px;
  font-size: 12px;
  color: var(--el-text-color-secondary);
}

.user-info {
  width: 100%;
}

.nickname-display {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-bottom: 12px;
}

.nickname-display h3 {
  margin: 0;
  font-size: 24px;
  color: var(--el-text-color-primary);
}

.nickname-edit {
  padding: 0 20px;
  margin-bottom: 12px;
}

.nickname-buttons {
  display: flex;
  gap: 8px;
  justify-content: center;
  margin-top: 8px;
}

.username {
  margin: 0;
  color: var(--el-text-color-secondary);
  font-size: 14px;
}

.info-card .card-header {
  display: flex;
  align-items: center;
}

.info-card .card-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 500;
  color: var(--el-text-color-primary);
}

:deep(.el-descriptions__label) {
  width: 120px;
  justify-content: flex-start !important;
}

:deep(.el-descriptions__content) {
  justify-content: flex-start !important;
}

.favorites-card {
  margin-top: 20px;
}

.favorites-list {
  margin: -10px;
}

.favorite-course-card {
  margin-bottom: 20px;
  cursor: pointer;
  transition: transform 0.3s;
}

.favorite-course-card:hover {
  transform: translateY(-5px);
}

.course-content {
  display: flex;
  gap: 12px;
}

.course-image {
  width: 120px;
  height: 80px;
  border-radius: 4px;
}

.image-placeholder {
  width: 120px;
  height: 80px;
  background: #f5f7fa;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--el-text-color-secondary);
  font-size: 14px;
}

.course-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.course-title {
  margin: 0;
  font-size: 14px;
  font-weight: normal;
  color: var(--el-text-color-primary);
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.course-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;
}

.instructor {
  color: var(--el-text-color-secondary);
}

.price {
  color: #f56c6c;
  font-weight: bold;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.course-count {
  font-weight: normal;
  border-radius: 10px;
}
</style> 