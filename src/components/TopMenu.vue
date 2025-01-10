<template>
  <NLayoutHeader bordered position="absolute" style="height: 64px; z-index: 999;">
    <div class="header-content">
      <div class="left">
        <NPopover trigger="click" placement="bottom-start" :show="showMenu" @update:show="showMenu = $event">
          <template #trigger>
            <NButton text class="menu-trigger">
              <NIcon size="24">
                <MenuOutline />
              </NIcon>
            </NButton>
          </template>
          <div class="mobile-menu">
            <NMenu :options="menuOptions" :value="activeKey" @update:value="handleMenuSelect" />
          </div>
        </NPopover>
        <h2 class="logo">ME Frp</h2>
      </div>
      <div class="right">
        <NDropdown :options="options" @select="handleSelect">
          <NButton text>
            <template #icon>
              <NIcon>
                <PersonCircleOutline />
              </NIcon>
            </template>
            {{ username }}
          </NButton>
        </NDropdown>
      </div>
    </div>
  </NLayoutHeader>
</template>

<script setup lang="ts">
import { h, ref, inject } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { NLayoutHeader, NIcon, NButton, NDropdown, useDialog, useMessage, NSwitch, NPopover, NMenu } from 'naive-ui'
import { PersonCircleOutline, LogOutOutline, SunnyOutline, MoonOutline, MenuOutline } from '@vicons/ionicons5'
import { themeColors } from '../constants/theme'
import { menuOptions } from '../shared/menuOptions'

const router = useRouter()
const route = useRoute()
const showMenu = ref(false)
const activeKey = ref(route.path)
const dialog = useDialog()
const message = useMessage()
const username = localStorage.getItem('username')
// 注入主题相关函数
const { toggleTheme } = inject('theme') as { theme: any, toggleTheme: (isDark: boolean) => void }

// 当前主题状态
const isDark = ref(localStorage.getItem('theme') === 'dark')

// Switch 按钮样式
const railStyle = ({ focused, checked }: { focused: boolean; checked: boolean }) => {
  const style = {
    background: checked ? themeColors.primary : undefined,
    boxShadow: focused ? `0 0 0 2px ${themeColors.primarySuppl}` : undefined
  }
  return style
}

// 渲染下拉菜单中的主题切换选项
const renderThemeOption = () => {
  return h('div', { 
    style: 'display: flex; align-items: center; padding: 8px 12px; height: 20px;' 
  }, [
    h('span', { 
      style: 'flex: 1; margin-right: 12px; font-size: 14px;' 
    }, '主题切换'),
    h(NSwitch, {
      value: isDark.value,
      'onUpdate:value': handleThemeChange,
      railStyle,
      size: 'small'
    }, {
      checked: () => h(NIcon, null, { default: () => h(MoonOutline) }),
      unchecked: () => h(NIcon, null, { default: () => h(SunnyOutline) })
    })
  ])
}

const options = [
  {
    key: 'theme',
    type: 'render',
    render: renderThemeOption
  },
  {
    type: 'divider',
    key: 'd1'
  },
  {
    label: '个人资料',
    key: 'profile',
    icon: renderIcon(PersonCircleOutline)
  },
  {
    label: '退出登录',
    key: 'logout',
    icon: renderIcon(LogOutOutline)
  }
]

function renderIcon(icon: any) {
  return () => h(NIcon, null, { default: () => h(icon) })
}

// 处理主题切换
const handleThemeChange = (value: boolean) => {
  isDark.value = value
  toggleTheme(value)
}

const handleSelect = (key: string) => {
  switch (key) {
    case 'logout':
      dialog.warning({
        title: '提示',
        content: '确定要退出登录吗？',
        positiveText: '确定',
        negativeText: '取消',
        onPositiveClick: () => {
          localStorage.removeItem('token')
          localStorage.removeItem('username')
          localStorage.removeItem('group')
          message.success('已退出登录')
          router.push('/auth/login')
        }
      })
      break
    case 'profile':
      router.push('/dashboard/profile')
      break
  }
}

const handleMenuSelect = (key: string) => {
  router.push(key)
  showMenu.value = false
}
</script>

<style lang="scss" scoped>
@use '../assets/styles/components/topMenu.scss';

</style>
