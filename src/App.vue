<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import TheHeader from '@/components/common/TheHeader.vue'
import MainContent from '@/components/common/MainContent.vue'

const route = useRoute()
const hideHeader = computed(() => route.meta.hideHeader)
</script>

<template>
  <div class="app-container">
    <the-header v-if="!hideHeader" />
    <main-content>
      <router-view />
    </main-content>
  </div>
</template>

<style>
.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
</style> 