<template>
  <!-- PC端导航栏 -->
  <NLayoutHeader bordered class="navbar pc-navbar" position="absolute" style="height: 53px; z-index: 999; user-select: none">
    <div class="navbar-content">
      <div class="logo">
        <div class="logo-link">
          <h2>ME Frp 幻缘映射 使用文档</h2>
        </div>
      </div>

      <!-- 桌面端菜单 -->
      <div class="nav-links">
        <NSpace class="desktop-menu">
          <NSwitch size="small" :value="isDarkMode" @update:value="toggleTheme" :rail-style="switchButtonRailStyle">
            <template #checked>
              <NIcon :component="Moon" />
            </template>
            <template #unchecked>
              <NIcon :component="Sunny" />
            </template>
          </NSwitch>
          <RouterLink to="/">
            <NButton text>回到首页</NButton>
          </RouterLink>
          <RouterLink to="/dashboard">
            <NButton text>管理面板</NButton>
          </RouterLink>
        </NSpace>
      </div>
    </div>
  </NLayoutHeader>

  <!-- 移动端导航栏 -->
  <NLayoutHeader bordered class="navbar mobile-navbar" style="user-select: none">
    <div class="mobile-header">
      <NPopover trigger="click" placement="bottom-start" :show="showMenu" @update:show="showMenu = $event">
        <template #trigger>
          <NButton text class="menu-button">
            <NIcon size="24">
              <MenuOutline />
            </NIcon>
          </NButton>
        </template>
        <div class="mobile-menu">
          <NMenu :options="menuOptions" @update:value="handleMenuSelect" />
        </div>
      </NPopover>
      <div class="logo">
        <RouterLink to="/" class="logo-link">
          <h2>ME Frp 幻缘映射 使用文档</h2>
        </RouterLink>
      </div>
          <NSwitch size="small" :value="isDarkMode" @update:value="toggleTheme" :rail-style="switchButtonRailStyle">
            <template #checked>
              <NIcon :component="Moon" />
            </template>
            <template #unchecked>
              <NIcon :component="Sunny" />
            </template>
          </NSwitch>
    </div>
  </NLayoutHeader>
</template>

<script setup lang="ts">
import { h, inject, Ref, ref } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { NLayoutHeader, NButton, NSpace, NSwitch, NIcon, NPopover, NMenu } from 'naive-ui'
import type { MenuOption } from 'naive-ui'
import { MenuOutline, Moon, Sunny } from '@vicons/ionicons5'
import {
  HomeOutline,
  LogInOutline,
  PersonAddOutline,
  InformationCircleOutline,
  ShieldCheckmarkOutline,
  DocumentLockOutline,
} from '@vicons/ionicons5'
import { switchButtonRailStyle } from '../constants/theme'


const showMenu = ref(false)
const router = useRouter()

// 获取主题上下文
const { isDarkMode, toggleTheme } = inject('theme', {
  isDarkMode: ref(false),
  toggleTheme: () => { }
}) as {
  isDarkMode: Ref<boolean>
  toggleTheme: () => void
}

// 渲染图标助手函数
function renderIcon(icon: any) {
  return () => h(NIcon, null, { default: () => h(icon) })
}

const menuOptions: MenuOption[] = [
  {
    label: '首页',
    key: 'home',
    icon: renderIcon(HomeOutline)
  },
  {
    type: 'divider',
    key: 'd1'
  },
  {
    label: '登录',
    key: 'login',
    icon: renderIcon(LogInOutline)
  },
  {
    label: '注册',
    key: 'register',
    icon: renderIcon(PersonAddOutline)
  },
  {
    type: 'divider',
    key: 'd2'
  },
  {
    label: '隐私政策',
    key: 'privacy',
    icon: renderIcon(ShieldCheckmarkOutline)
  },
  {
    label: '内容策略',
    key: 'content',
    icon: renderIcon(DocumentLockOutline)
  },
  {
    label: '服务条款',
    key: 'terms',
    icon: renderIcon(InformationCircleOutline)
  },
  {
    label: '联系我们',
    key: 'contact',
    icon: renderIcon(InformationCircleOutline)
  }
]

function handleMenuSelect(key: string) {
  switch (key) {
    case 'home':
      router.push('/')
      break
    case 'login':
      router.push('/auth/login')
      break
    case 'register':
      router.push('/auth/register')
      break
    case 'privacy':
      router.push('/privacy')
      break
    case 'content':
      router.push('/content')
      break
    case 'terms':
      router.push('/terms')
      break
    case 'contact':
      router.push('/contact')
      break
  }
}
</script>

<style lang="scss" scoped>
@use '../assets/styles/components/docsTopMenu.scss' as *;
</style>
