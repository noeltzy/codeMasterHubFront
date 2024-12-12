<template>
  <page-layout title="直播">
    <el-result
      icon="info"
      title="开发中"
      sub-title="教程功能正在开发中，敬请期待..."
    >
      <template #extra>
        <el-button type="primary" @click="$router.push('/study')"
          >去学习</el-button
        >
      </template>
    </el-result>
  </page-layout>
</template>

<script setup>
import PageLayout from '@/layouts/PageLayout.vue'
</script>
