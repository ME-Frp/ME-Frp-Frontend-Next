<template>
  <NLayout class="dashboard" position="absolute">
    <TopMenu />
    <NLayout has-sider position="absolute" style="top: 64px;">
      <NLayoutSider
        bordered
        collapse-mode="width"
        :collapsed-width="64"
        :width="240"
        :collapsed="collapsed"
        show-trigger
        @collapse="collapsed = true"
        @expand="collapsed = false"
      >
        <NMenu
          :collapsed="collapsed"
          :collapsed-width="64"
          :collapsed-icon-size="22"
          :options="menuOptions"
          :value="activeKey"
        />
      </NLayoutSider>
      <NLayoutContent class="content" :native-scrollbar="false">
        <RouterView v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </RouterView>
      </NLayoutContent>
    </NLayout>
  </NLayout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { NLayout, NLayoutSider, NLayoutContent, NMenu } from 'naive-ui'
import TopMenu from '../../components/TopMenu.vue'
import { getMenuOptions } from '../../shared/menuOptions'

const route = useRoute()
const menuOptions = ref(getMenuOptions())
const collapsed = ref(false)

const activeKey = computed(() => {
  const path = route.path
  const key = path.split('/').pop()
  if (key === 'home') return 'dashboard-home'
  return key
})
</script>

<style lang="scss">
@use '../../assets/styles/dashboard/dashboard.scss';
</style> 