<template>
  <div>
    <NLayout position="absolute">
      <TopMenu />
      <NLayout has-sider position="absolute" style="top: 64px">
        <NLayoutSider v-if="!isMobile" bordered collapse-mode="width" :collapsed-width="64" :width="240"
          :collapsed="collapsed" :native-scrollbar="false" show-trigger @update:collapsed="collapsed = $event">
          <LeftMenu />
        </NLayoutSider>
        <NLayout :native-scrollbar="false">
          <NLayoutContent :style="contentStyle">
            <RouterView v-slot="{ Component }">
              <transition name="fade" mode="out-in" appear>
                <component :is="Component" />
              </transition>
            </RouterView>
          </NLayoutContent>
        </NLayout>
      </NLayout>
    </NLayout>
  </div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { NLayout, NLayoutContent, NLayoutSider } from 'naive-ui'
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

onMounted(() => {
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
</script>