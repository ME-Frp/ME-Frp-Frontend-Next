<template>
  <!-- PC端导航栏 -->
  <NLayoutHeader bordered class="navbar pc-navbar" style="user-select: none" role="banner">
    <div class="navbar-content">
      <div class="logo">
        <RouterLink to="/" class="logo-link" aria-label="返回首页">
          <h2>ME Frp 幻缘映射</h2>
        </RouterLink>
      </div>

      <!-- 桌面端菜单 -->
      <div class="nav-links">
        <NSpace class="desktop-menu" role="navigation">
          <NSwitch size="small" :value="isDarkMode" @update:value="toggleTheme" :rail-style="switchButtonRailStyle"
            aria-label="切换深色模式" :aria-checked="isDarkMode">
            <template #checked>
              <NIcon :component="Moon" aria-hidden="true" />
            </template>
            <template #unchecked>
              <NIcon :component="Sunny" aria-hidden="true" />
            </template>
          </NSwitch>
          <RouterLink to="/privacy">
            <NButton text>隐私政策</NButton>
          </RouterLink>
          <RouterLink to="/content">
            <NButton text>内容策略</NButton>
          </RouterLink>
          <RouterLink to="/terms">
            <NButton text>服务条款</NButton>
          </RouterLink>
          <RouterLink to="/contact">
            <NButton text>联系我们</NButton>
          </RouterLink>
          <RouterLink to="/dashboard">
            <NButton secondary type="primary">管理面板</NButton>
          </RouterLink>
        </NSpace>
      </div>
    </div>
  </NLayoutHeader>

  <!-- 移动端导航栏 -->
  <NLayoutHeader bordered class="navbar mobile-navbar" style="user-select: none" role="banner">
    <div class="mobile-header">
      <NPopover trigger="click" placement="bottom-start" :show="showMenu" @update:show="showMenu = $event">
        <template #trigger>
          <NButton text class="menu-button" aria-label="打开菜单" :aria-expanded="showMenu">
            <NIcon size="24">
              <MenuOutline />
            </NIcon>
          </NButton>
        </template>
        <div class="mobile-menu" role="navigation" aria-label="移动端导航菜单">
          <NMenu :options="menuOptions" @update:value="handleMenuSelect" role="menu" />
        </div>
      </NPopover>
      <div class="logo">
        <RouterLink to="/" class="logo-link" aria-label="返回首页">
          <h2>ME Frp 幻缘映射</h2>
        </RouterLink>
      </div>
    </div>
  </NLayoutHeader>
</template>

<script setup lang="ts">
import { h, inject, Ref, ref } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { NLayoutHeader, NButton, NSpace, NSwitch, NIcon, NPopover, NMenu, MenuOption } from 'naive-ui'
import { MenuOutline, Moon, Sunny } from '@vicons/ionicons5'
import {
  HomeOutline,
  DocumentTextOutline,
  LogInOutline,
  PersonAddOutline,
  InformationCircleOutline,
  ShieldCheckmarkOutline,
  DocumentLockOutline
} from '@vicons/ionicons5'
import { switchButtonRailStyle } from '../constants/theme'

const showMenu = ref(false)
const router = useRouter()
const { isDarkMode, toggleTheme } = inject('theme', {
  isDarkMode: ref(false),
  toggleTheme: () => { }
}) as {
  isDarkMode: Ref<boolean>
  toggleTheme: () => void
}

function renderIcon(icon: any) {
  return () => h(NIcon, { 'aria-hidden': 'true' }, { default: () => h(icon) })
}

const menuOptions: MenuOption[] = [
  {
    label: '首页',
    key: 'home',
    icon: renderIcon(HomeOutline)
  },
  {
    label: '文档',
    key: 'docs',
    icon: renderIcon(DocumentTextOutline)
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
    case 'docs':
      router.push('/docs')
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
@use '../assets/styles/components/homeMenu.scss' as *;
</style>
