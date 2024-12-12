<script setup>
import TheHeader from './components/TheHeader.vue'
import { useRoute } from 'vue-router'

const route = useRoute()
</script>

<template>
  <el-container class="app">
    <el-header class="app-header" height="60px" v-if="!route.meta.hideHeader">
      <TheHeader />
    </el-header>
    <el-main class="app-main">
      <div class="main-container">
        <router-view></router-view>
      </div>
    </el-main>
  </el-container>
</template>

<style>
:root {
  --app-background: #f5f7fa;
  --content-max-width: min(75%, 1800px);
  --content-min-width: 900px;
  --header-height: 60px;
  --main-spacing: 20px;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  color: var(--el-text-color-regular);
  line-height: 1.6;
  background: var(--app-background);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.app {
  min-height: 100vh;
}

.app-header {
  padding: 0 !important;
  background: #fff;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  backdrop-filter: blur(8px);
  background: rgba(255, 255, 255, 0.95);
}

.app-main {
  padding: calc(var(--header-height) + var(--main-spacing)) var(--main-spacing) var(--main-spacing) !important;
}

.main-container {
  min-width: var(--content-min-width);
  max-width: var(--content-max-width);
  margin: 0 auto;
  background: transparent;
}

/* Element Plus 样式覆盖 */
.el-card {
  border: none;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05) !important;
  transition: box-shadow 0.3s ease;
}

.el-card:hover {
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.08) !important;
}

.el-button {
  border-radius: 6px;
}

.el-input {
  --el-input-border-radius: 6px;
}

.el-menu--horizontal {
  border-bottom: none !important;
}

.el-menu-item {
  border-radius: 6px;
  margin: 0 2px;
}

.el-dropdown-menu {
  border-radius: 8px !important;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1) !important;
}
</style> 