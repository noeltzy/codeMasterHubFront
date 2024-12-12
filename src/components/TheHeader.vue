<script setup>
import { useRouter, useRoute } from 'vue-router'
import { ref, onMounted, computed } from 'vue'
import { userApi } from '../api/user'
import { ElMessage } from 'element-plus'

const router = useRouter()
const route = useRoute()
const userInfo = ref(null)
const searchText = ref('')

const navItems = computed(() => {
  return router.options.routes
    .filter(route => route.meta?.nav && !route.meta?.hideNav)
    .sort((a, b) => (a.meta.nav.order || 0) - (b.meta.nav.order || 0))
    .map(route => ({
      name: route.meta.nav.title,
      path: route.path,
      icon: route.meta.nav.icon
    }))
})

const handleLogout = async () => {
  try {
    const result = await userApi.logout()
    if (result.success) {
      localStorage.removeItem('isLoggedIn')
      ElMessage.success('退出成功')
      router.push('/login')
    } else {
      ElMessage.error(result.message)
    }
  } catch (error) {
    console.error('退出错误:', error)
    ElMessage.error('退出失败，请稍后重试')
  }
}

const handleCommand = (command) => {
  switch (command) {
    case 'logout':
      handleLogout()
      break
    case 'profile':
      router.push('/profile')
      break
    case 'settings':
      router.push('/settings')
      break
  }
}

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

<template>
  <div class="header-container">
    <div class="header-left">
      <div class="logo" @click="router.push('/')">
        <el-icon><Monitor /></el-icon>
        CodeMaster
      </div>
      <el-menu
        :default-active="route.path"
        mode="horizontal"
        :ellipsis="false"
        router
      >
        <el-menu-item
          v-for="item in navItems"
          :key="item.path"
          :index="item.path"
        >
          <el-icon><component :is="item.icon" /></el-icon>
          <span>{{ item.name }}</span>
        </el-menu-item>
      </el-menu>
    </div>

    <div class="header-right">
      <el-input
        v-model="searchText"
        placeholder="搜索资源"
        class="search-input"
      >
        <template #prefix>
          <el-icon><Search /></el-icon>
        </template>
      </el-input>

      <el-button type="primary" :icon="Plus"> 发布 </el-button>

      <el-dropdown @command="handleCommand">
        <el-avatar
          :size="32"
          :src="userInfo?.avatar"
          :fallback="'https://placeholder.co/32x32'"
        />
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="profile">
              <el-icon><User /></el-icon>个人中心
            </el-dropdown-item>
            <el-dropdown-item command="settings">
              <el-icon><Setting /></el-icon>设置
            </el-dropdown-item>
            <el-dropdown-item divided command="logout">
              <el-icon><SwitchButton /></el-icon>退出登录
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<style scoped>
.header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 var(--main-spacing);
  height: 60px;
  background: transparent;
  min-width: var(--content-min-width);
  max-width: var(--content-max-width);
  margin: 0 auto;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 48px;
}

.logo {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 20px;
  font-weight: bold;
  color: var(--el-color-primary);
  user-select: none;
  cursor: pointer;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 20px;
}

.search-input {
  width: 260px;
  transition: width 0.3s ease;
}

.search-input:focus-within {
  width: 320px;
}

:deep(.el-menu) {
  border-bottom: none;
  background: transparent;
}

:deep(.el-menu-item) {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 15px;
}

:deep(.el-menu-item.is-active) {
  font-weight: 500;
}

:deep(.el-avatar) {
  border: 2px solid #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  cursor: pointer;
}
</style>
