<template>
  <NMenu :collapsed-width="64" :collapsed-icon-size="24" :options="menuOptions" :value="currentKey" :icon-size="22"
    @update:value="handleMenuSelect" />
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { NMenu, MenuOption } from 'naive-ui'
import { useRouter, useRoute } from 'vue-router'
import { getMenuOptions } from '../shared/menuOptions'

const route = useRoute()
const router = useRouter()
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

const handleMenuSelect = (_: any, item: MenuOption) => {
  router.push(item.link as string)
}
const currentKey = computed(() => {
  const key = route.path.replace('/dashboard/', '').replace('/', '-')
  if (key === 'home') return 'dashboard-home'
  return key
})
</script>

