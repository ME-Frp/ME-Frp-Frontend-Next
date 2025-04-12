<template>
  <div class="docs-sub-menu" v-if="isMobile">
    <div class="sub-menu-container">
      <div class="left-section">
        <NButton quaternary circle class="menu-button" @click="openDrawer">
          <template #icon>
            <NIcon size="20">
              <MenuOutline />
            </NIcon>
          </template>
        </NButton>
        <span class="current-page-title">{{ title || currentTitle }}</span>
      </div>
      <NButtonGroup size="small" class="navigation-buttons">
        <NButton quaternary @click="navigateToPrevious" :disabled="!previousRoute">
          <template #icon>
            <NIcon size="16">
              <ChevronBackOutline />
            </NIcon>
          </template>
          上一页
        </NButton>
        <NButton quaternary @click="navigateToNext" :disabled="!nextRoute">
          下一页
          <template #icon>
            <NIcon size="16">
              <ChevronForwardOutline />
            </NIcon>
          </template>
        </NButton>
      </NButtonGroup>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { NButton, NButtonGroup, NIcon } from 'naive-ui'
import { MenuOutline, ChevronBackOutline, ChevronForwardOutline } from '@vicons/ionicons5'
import { PropType } from 'vue'

// 路由排序
const docRoutes = [
  // 'readme',
  'safety',
  'usage/common',
  'usage/fnnas',
]

defineProps({
  openDrawer: {
    type: Function as PropType<() => void>,
    required: true
  },
  title: {
    type: String,
    default: ''
  }
})

const isMobile = ref(window.innerWidth <= 768)
const router = useRouter()
const route = useRoute()

// 计算当前页面标题
const currentTitle = computed(() => {
  return (route.meta.title as string) || '文档'
})

// 计算前一个和后一个路由
const currentIndex = computed(() => {
  const path = route.path.split('docs/').pop() || ''
  return docRoutes.indexOf(path)
})

const previousRoute = computed(() => {
  if (currentIndex.value > 0) {
    return `/docs/${docRoutes[currentIndex.value - 1]}`
  }
  return null
})

const nextRoute = computed(() => {
  if (currentIndex.value < docRoutes.length - 1 && currentIndex.value >= 0) {
    return `/docs/${docRoutes[currentIndex.value + 1]}`
  }
  return null
})

// 导航方法
const navigateToPrevious = () => {
  if (previousRoute.value) {
    router.push(previousRoute.value)
  }
}

const navigateToNext = () => {
  if (nextRoute.value) {
    router.push(nextRoute.value)
  }
}

// 响应式处理
const handleResize = () => {
  isMobile.value = window.innerWidth <= 768
}

onMounted(() => {
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
</script>

<style lang="scss" scoped>
@use '../assets/styles/components/docsSubMenu.scss';
</style> 