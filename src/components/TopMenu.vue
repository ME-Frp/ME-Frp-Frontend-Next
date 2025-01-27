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
            <NMenu :options="menuOptions" :value="currentKey" @update:value="handleMenuSelect" />
          </div>
        </NPopover>
        <h2 class="logo">ME Frp</h2>
      </div>
      <div class="right">
        <NDropdown :options="options" @select="handleUserMenuSelect" trigger="hover">
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

  <!-- 移动端菜单抽屉 -->
  <NDrawer v-model:show="showMobileMenu" :width="280" placement="left">
    <NDrawerContent title="菜单">
      <LeftMenu @select="showMobileMenu = false" />
    </NDrawerContent>
  </NDrawer>
</template>

<script setup lang="ts">
import { h, ref, inject, computed, Ref, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { NLayoutHeader, NIcon, NButton, NDropdown, useDialog, useMessage, NSwitch, NPopover, NMenu, MenuOption, NDrawer, NDrawerContent } from 'naive-ui'
import { PersonCircleOutline, LogOutOutline, SunnyOutline, MoonOutline, MenuOutline, HomeOutline } from '@vicons/ionicons5'
import { switchButtonRailStyle } from '../constants/theme'
import { getMenuOptions, renderIcon } from '../shared/menuOptions'
import LeftMenu from './LeftMenu.vue'

const router = useRouter()
const route = useRoute()
const showMenu = ref(false)
const menuOptions = ref(getMenuOptions())
const dialog = useDialog()
const message = useMessage()
const username = localStorage.getItem('username')
const showMobileMenu = ref(false)
const isMobile = ref(window.innerWidth <= 700)

// 注入主题相关函数
const { isDarkMode, toggleTheme } = inject('theme') as {
  isDarkMode: Ref<boolean>
  toggleTheme: () => void
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
      value: isDarkMode.value,
      'onUpdate:value': handleThemeChange,
      railStyle: switchButtonRailStyle,
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
    label: '返回首页',
    key: 'home',
    icon: renderIcon(HomeOutline)
  },
  {
    type: 'divider',
    key: 'd2'
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

// 处理主题切换
const handleThemeChange = () => {
  toggleTheme()
}

const handleUserMenuSelect = (key: string) => {
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
          router.push('/auth/login').then(() => {
            window.location.reload()
          })
        }
      })
      break
    case 'profile':
      router.push('/dashboard/profile')
      break
    case 'home':
      router.push('/')
      break
  }
}

const handleMenuSelect = (_: any, item: MenuOption) => {
  router.push(item.link as string)
  showMenu.value = false
}

const currentKey = computed(() => {
  const key = route.path.replace('/dashboard/', '').replace('/', '-')
  if (key === 'home') return 'dashboard-home'
  return key
})

const handleResize = () => {
  isMobile.value = window.innerWidth <= 700
}

onMounted(() => {
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
</script>