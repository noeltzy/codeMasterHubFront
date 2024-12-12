<template>
  <page-layout title="主页">
    <div class="home-content">
      <el-card class="welcome-card">
        <template #header>
          <div class="welcome-header">
            <h3>欢迎来到 CodeMaster</h3>
          </div>
        </template>
        <div class="welcome-content">
          <p>这里是您的编程能力提升平台，您可以：</p>
          <ul>
            <li>学习专业的编程课程</li>
            <li>参与技术社区讨论</li>
            <li>获取前沿技术资讯</li>
            <li>提升职业发展能力</li>
          </ul>
        </div>
      </el-card>
    </div>
  </page-layout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import PageLayout from '@/layouts/PageLayout.vue'
import { userApi } from '@/api/modules/user'

const userInfo = ref(null)

const loadUserInfo = async () => {
  try {
    const result = await userApi.getCurrentUser()
    if (result.success) {
      userInfo.value = result.data
    }
  } catch (error) {
    console.error('加载用户信息错误:', error)
  }
}

onMounted(() => {
  loadUserInfo()
})
</script>

<style scoped>
.home-content {
  margin-top: -10px;
}

.welcome-card {
  max-width: 800px;
  margin: 0 auto;
}

.welcome-header h3,
.card-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 500;
}

.welcome-content {
  color: var(--el-text-color-regular);
}

.welcome-content ul {
  padding-left: 20px;
  margin: 10px 0;
}

.welcome-content li {
  margin: 8px 0;
}
</style>
