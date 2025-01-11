<template>
  <NMenu :collapsed-width="64" :collapsed-icon-size="24" :options="menuOptions" :value="currentPath" :icon-size="22"
    @update:value="handleMenuSelect" />
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { NMenu } from 'naive-ui'
import { useRouter, useRoute } from 'vue-router'
import { getMenuOptions } from '../shared/menuOptions'

const router = useRouter()
const route = useRoute()
const menuOptions = ref(getMenuOptions())
const isMobile = ref(window.innerWidth <= 700)

const updateIsMobile = () => {
  isMobile.value = window.innerWidth <= 700
}

onMounted(() => {
  window.addEventListener('resize', updateIsMobile)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateIsMobile)
})

const currentPath = computed(() => {
  const path = route.path
  if (path === '/dashboard') return 'dashboard-home'
  const key = path.split('/').pop()
  return key === 'home' ? 'dashboard-home' : key
})

const handleMenuSelect = (key: string) => {
  router.push({ name: key })
}
</script>