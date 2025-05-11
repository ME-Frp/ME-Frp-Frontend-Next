<template>
  <NLayoutHeader bordered position="absolute" style="height: 64px; z-index: 999; user-select: none" role="banner">
    <div class="header-content">
      <div class="left">
        <NPopover trigger="click" placement="bottom-start" :show="showMenu" @update:show="showMenu = $event">
          <template #trigger>
            <NButton text class="menu-trigger" aria-label="打开菜单" aria-expanded="showMenu">
              <NIcon size="24">
                <MenuOutline />
              </NIcon>
            </NButton>
          </template>
          <div class="mobile-menu" role="navigation" aria-label="主导航菜单">
            <NScrollbar style="max-height: 500px">
              <NMenu :options="menuOptions" :value="currentKey" @update:value="handleMenuSelect"
                :default-expanded-keys="defaultExpandedKeys" role="menu" />
            </NScrollbar>
          </div>
        </NPopover>
        <h2 class="logo" role="heading" aria-level="1">ME Frp</h2>
      </div>
      <div class="right">
        <NDropdown :options="options" @select="handleUserMenuSelect" trigger="hover" role="menu" aria-label="用户菜单">
          <NButton text aria-label="用户菜单">
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
  <NDrawer v-model:show="showMobileMenu" :width="280" placement="left" role="navigation" aria-label="移动端菜单">
    <NDrawerContent title="菜单">
      <LeftMenu @select="showMobileMenu = false" />
    </NDrawerContent>
  </NDrawer>
</template>

<script setup lang="ts">
import { PersonCircleOutline, LogOutOutline, SunnyOutline, MoonOutline, MenuOutline, HomeOutline, ArrowBack } from '@vicons/ionicons5'
import { NSwitch, NIcon } from 'naive-ui'
import { defaultSwc } from '../constants/theme'
import { getMenuOptions, renderIcon, defaultExpandedKeys } from '../shared/menuOptions'
import LeftMenu from './LeftMenu.vue'
import type { MenuOption } from 'naive-ui'

const router = useRouter()
const route = useRoute()
const showMenu = ref(false)
const menuOptions = ref(getMenuOptions())
const dialog = useDialog()
const message = useMessage()
const username = localStorage.getItem('username')
const showMobileMenu = ref(false)
const isMobile = ref(window.innerWidth <= 768)
const isTempFuckMode = ref(localStorage.getItem('tempFuckMode') === 'true')

const handleRestoreAdmin = () => {
  try {
    // 恢复管理员信息
    const adminGroup = localStorage.getItem('admin_group')
    const adminUsername = localStorage.getItem('admin_username')
    const adminToken = localStorage.getItem('admin_token')

    if (adminGroup) localStorage.setItem('group', adminGroup)
    if (adminUsername) localStorage.setItem('username', adminUsername)
    if (adminToken) localStorage.setItem('token', adminToken)

    // 清理夺舍相关数据
    localStorage.removeItem('admin_group')
    localStorage.removeItem('admin_username')
    localStorage.removeItem('admin_token')
    localStorage.removeItem('tempFuckMode')

    message.success('已恢复管理员身份')
    isTempFuckMode.value = false
    window.location.reload()
  } catch (error: any) {
    message.error(error?.message || '恢复管理员身份失败')
  }
}

// 注入主题相关函数
const { isDarkMode, toggleTheme } = inject('theme') as {
  isDarkMode: Ref<boolean>
  toggleTheme: () => void
}

// 渲染下拉菜单中的主题切换选项
const renderThemeOption = () => {
  return h('div', {
    style: 'display: flex; align-items: center; padding: 8px 12px; height: 20px;',
    role: 'menuitem'
  }, [
    h('span', {
      style: 'flex: 1; margin-right: 12px; font-size: 14px;'
    }, '主题切换'),
    h(NSwitch, {
      value: isDarkMode.value,
      'onUpdate:value': handleThemeChange,
      railStyle: defaultSwc,
      size: 'small',
      'aria-label': '切换深色模式',
      'aria-checked': isDarkMode.value,
      role: 'switch'
    }, {
      checked: () => h(NIcon, {
        'aria-hidden': 'true'
      }, { default: () => h(MoonOutline) }),
      unchecked: () => h(NIcon, {
        'aria-hidden': 'true'
      }, { default: () => h(SunnyOutline) })
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

// 在夺舍模式下添加回溯选项
if (isTempFuckMode.value) {
  options.splice(-1, 0, {
    type: 'divider',
    key: 'd3'
  }, {
    label: '夺舍回溯',
    key: 'restore',
    icon: renderIcon(ArrowBack)
  })
}

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
    case 'restore':
      dialog.warning({
        title: '提示',
        content: '确定要回溯管理员身份吗？',
        positiveText: '确定',
        negativeText: '取消',
        onPositiveClick: () => {
          handleRestoreAdmin()
        }
      })
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
  isMobile.value = window.innerWidth <= 768
}

onMounted(() => {
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
</script>

<style lang="scss" scoped>
@use "../assets/styles/components/topMenu.scss";
</style>