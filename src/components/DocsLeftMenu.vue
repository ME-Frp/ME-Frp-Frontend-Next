<template>
  <NConfigProvider :theme-overrides="getExemptedTheme()">
    <div class="menu-container">
      <NMenu :value="activeKey" :options="menuOptions" :indent="18" :collapsed-width="64" :collapsed-icon-size="22"
        @update:value="handleMenuClick" />
    </div>
  </NConfigProvider>
</template>

<script setup lang="ts">
import { h, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { NMenu, NIcon } from 'naive-ui'
import type { MenuOption } from 'naive-ui'
import {
  AlertCircleOutline,
  BugOutline,
  RocketOutline,
} from '@vicons/ionicons5'
import { getExemptedTheme } from '../constants/theme'

const emit = defineEmits(['menu-click'])
const route = useRoute()
const router = useRouter()

// 根据当前路由计算活动的菜单项
const activeKey = computed(() => {
  const path = route.path
  if (path.startsWith('/docs/')) {
    return path.substring(6)
  }
  return 'introduction'
})

// 菜单项配置
const menuOptions = computed<MenuOption[]>(() => [
  // {
  //   label: 'ME Frp 简介',
  //   key: 'readme',
  //   icon: renderIcon(BookOutline),
  // },
  {
    label: '安全提醒',
    key: 'safety',
    icon: renderIcon(AlertCircleOutline),
  },
  {
    label: '启动隧道教程',
    key: 'usage',
    icon: renderIcon(RocketOutline),
    children: [
      {
        label: '通用客户端',
        key: 'usage/common',
      },
      {
        label: 'fnOS 飞牛私有云',
        key: 'usage/fnnas',
      },
    ]
  },
  {
    label: '测试',
    key: 'test',
    icon: renderIcon(BugOutline),
  }
])

// 渲染图标助手函数
function renderIcon(icon) {
  return () => h(NIcon, null, { default: () => h(icon) })
}

// 处理菜单点击
function handleMenuClick(key: string) {
  if (key === 'home') {
    router.push('/docs')
  } else {
    router.push(`/docs/${key}`)
  }

  emit('menu-click')
}
</script>

<style lang="scss" scoped>
.menu-container {
  height: 100%;
  overflow-y: auto;
}
</style>