<template>
  <div class="page">
    <div class="container">
      <div class="page-header">
        <div class="header-main">
          <h2>{{ title }}</h2>
        </div>
        <slot name="header-extra"></slot>
      </div>
      <div class="page-content">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true
  }
})
</script>

<style scoped>
.page {
  padding: 20px;
  min-height: calc(100vh - 60px);
  display: flex;
  justify-content: center;
}

.container {
  width: 100%;
  max-width: var(--content-max-width);
  min-width: var(--content-min-width);
  background: white;
  border-radius: 8px;
  box-shadow: var(--el-box-shadow-light);
}

.page-header {
  padding: 16px 24px;
  border-bottom: 1px solid var(--el-border-color-light);
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.header-main {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.page-header h2 {
  margin: 0;
  font-size: 18px;
  color: var(--el-text-color-primary);
  font-weight: 500;
}

.page-content {
  padding: 24px;
  min-height: 500px;
}
</style> 