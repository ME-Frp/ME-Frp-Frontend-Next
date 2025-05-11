<template>
  <NLayout position="absolute">
    <TopMenu />
    <NLayout has-sider position="absolute" style="top: 64px">
      <NLayoutSider v-if="!isMobile" bordered collapse-mode="width" :collapsed-width="64" :width="240"
        :collapsed="collapsed" :native-scrollbar="false" show-trigger @update:collapsed="collapsed = $event">
        <LeftMenu />
      </NLayoutSider>
      <NLayout :native-scrollbar="false">
        <NLayoutContent :style="contentStyle">
          <NWatermark fullscreen :content="isTempFuckMode ? oriAdminUsername + ' 夺舍模式已启用，请勿滥用' : ''" :font-size="16"
            :line-height="16" :width="300" :height="300" :x-offset="12" :y-offset="80" :rotate="-15" :gap="[100, 100]">
          </NWatermark>
          <RouterView v-slot="{ Component }">
            <transition name="fade" mode="out-in" appear>
              <component :is="Component" />
            </transition>
          </RouterView>
        </NLayoutContent>
      </NLayout>
    </NLayout>
  </NLayout>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { NLayout, NLayoutContent, NLayoutSider, NWatermark } from 'naive-ui'
import TopMenu from '../components/TopMenu.vue'
import LeftMenu from '../components/LeftMenu.vue'

const collapsed = ref(false)
const isMobile = ref(window.innerWidth <= 768)
const contentStyle = computed(() => ({
  padding: isMobile.value ? '16px' : '24px'
}))

const handleResize = () => {
  isMobile.value = window.innerWidth <= 768
}

const oriAdminUsername = ref(localStorage.getItem('admin_username'))
const isTempFuckMode = ref(localStorage.getItem('tempFuckMode') === 'true')

onMounted(() => {
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
</script>