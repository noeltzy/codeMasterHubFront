<template>
  <header class="app-header">
    <div class="header-container">
      <div class="header-left">
        <router-link to="/" class="logo">
          <h1>CodeMaster</h1>
        </router-link>
        <el-menu
          mode="horizontal"
          :default-active="activeRoute"
          class="nav-menu"
          :ellipsis="false"
          @select="handleSelect"
        >
          <el-menu-item
            v-for="item in navItems"
            :key="item.path"
            :index="item.path"
            :class="{ 'is-active': activeRoute === item.path }"
          >
            <el-icon>
              <component :is="item.icon" />
            </el-icon>
            <span>{{ item.title }}</span>
          </el-menu-item>
        </el-menu>
      </div>

      <div class="header-right">
        <template v-if="userInfo">
          <el-dropdown trigger="click" @command="handleCommand">
            <div class="user-info">
              <el-avatar :size="32" :src="userInfo.avatar">
                {{ userInfo.nickname?.charAt(0) }}
              </el-avatar>
              <span class="nickname">{{ userInfo.nickname }}</span>
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="profile">个人中心</el-dropdown-item>
                <el-dropdown-item command="logout" divided
                  >退出登录</el-dropdown-item
                >
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </template>
        <template v-else>
          <el-button
            type="primary"
            @click="$router.push('/login')"
            class="login-button"
          >
            登录
          </el-button>
        </template>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { userApi } from '@/api/modules/user'
import { auth } from '@/utils/auth'
import { ElMessage } from 'element-plus'

const router = useRouter()
const route = useRoute()

const userInfo = ref(auth.getUserInfo())

const navItems = [
  { title: '主页', path: '/', icon: 'House' },
  { title: '学习', path: '/study', icon: 'Reading' },
  { title: '教程', path: '/tutorial', icon: 'Document' },
  { title: '问答', path: '/qa', icon: 'QuestionFilled' },
  { title: '求职', path: '/job', icon: 'Briefcase' },
  { title: '直播', path: '/live', icon: 'VideoCamera' },
  { title: '词典', path: '/dict', icon: 'Collection' },
  { title: '资讯', path: '/news', icon: 'Bell' }
]

const activeRoute = computed(() => route.path)

const handleSelect = (path) => {
  router.push(path)
}

const handleCommand = async (command) => {
  if (command === 'profile') {
    router.push('/profile')
  } else if (command === 'logout') {
    try {
      await userApi.logout()
      auth.clearAuth()
      router.push('/login')
      ElMessage.success('退出成功')
    } catch (error) {
      console.error('退出失败:', error)
      ElMessage.error('退出失败')
    }
  }
}
</script>

<style scoped>
.app-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 60px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(8px);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  z-index: 100;
}

.header-container {
  max-width: 1200px;
  height: 100%;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 40px;
}

.logo {
  text-decoration: none;
}

.logo h1 {
  margin: 0;
  font-size: 20px;
  color: var(--primary-color);
}

.nav-menu {
  border-bottom: none;
  background: transparent;
}

:deep(.el-menu--horizontal .el-menu-item) {
  border-bottom: none;
}

:deep(.el-menu-item.is-active) {
  color: var(--primary-color);
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.user-info:hover {
  background-color: var(--el-fill-color-light);
}

.nickname {
  font-size: 14px;
  color: var(--el-text-color-regular);
}

.login-button {
  padding: 8px 24px;
  font-size: 14px;
}
</style>
