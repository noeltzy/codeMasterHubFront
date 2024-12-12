<script setup>
defineProps({
  activeTab: {
    type: String,
    required: true
  }
})
</script>

<template>
  <el-main class="main-content">
    <div class="content-container">
      <slot></slot>
    </div>
  </el-main>
</template>

<style scoped>
.main-content {
  flex: 1;
  padding: 80px 20px 20px;
  background-color: var(--background-color-base);
}

.content-container {
  max-width: 1200px;
  margin: 0 auto;
}
</style> 