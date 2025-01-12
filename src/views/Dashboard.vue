<template>
  <NLayout position="absolute">
    <TopMenu />
    <NLayout has-sider position="absolute" style="top: 64px;">
      <NLayoutSider v-if="!isMobile" :native-scrollbar="false" bordered collapse-mode="width" :collapsed-width="64"
        :width="240" :collapsed="collapsed" show-trigger @collapse="collapsed = true" @expand="collapsed = false">
        <LeftMenu
          :collapsed-width="64"
          :collapsed-icon-size="22"
        />
      </NLayoutSider>
      <NLayout :native-scrollbar="false">
        <NLayoutContent style="padding: 16px;">
          <RouterView v-slot="{ Component }">
            <component :is="Component" />
          </RouterView>
        </NLayoutContent>
      </NLayout>
    </NLayout>
  </NLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { NLayout, NLayoutContent, NLayoutSider } from 'naive-ui'
import TopMenu from '../components/TopMenu.vue'
import LeftMenu from '../components/LeftMenu.vue'

const collapsed = ref(false)
const isMobile = ref(window.innerWidth <= 700)

const handleResize = () => {
  isMobile.value = window.innerWidth <= 700
  if (isMobile.value) {
    collapsed.value = true
  }
}

onMounted(() => {
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
</script> 