<template>
  <div class="docs-page">
    <transition name="fade" mode="out-in" appear>
      <MarkdownDisplay :key="route.path" :path="(route.path + '.md' as string)" />
    </transition>
  </div>
</template>

<script setup lang="ts">
import MarkdownDisplay from '../components/MarkdownDisplay.vue'
import { useRoute, onBeforeRouteUpdate } from 'vue-router'
import { ref } from 'vue'

const route = useRoute()
const currentPath = ref(route.path)

// 监听路由变化，更新当前路径
onBeforeRouteUpdate((to) => {
  currentPath.value = to.path
})
</script>

<style lang="scss" scoped>
.docs-page {
  padding-bottom: 40px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style> 