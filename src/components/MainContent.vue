<script setup>
defineProps({
  activeTab: {
    type: String,
    required: true
  }
})
</script>

<template>
  <el-card class="content-card">
    <template #header>
      <div class="card-header">
        <h2>{{ activeTab }}</h2>
      </div>
    </template>
    <div class="card-content">
      <!-- 内容区域 -->
    </div>
  </el-card>
</template>

<style scoped>
.content-card {
  margin: 0 auto;
  max-width: 1200px;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.card-header h2 {
  margin: 0;
  font-size: 18px;
  color: var(--el-text-color-primary);
}

.card-content {
  min-height: 500px;
}
</style> 