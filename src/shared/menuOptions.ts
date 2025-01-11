import { h, Component } from 'vue'
import { RouterLink } from 'vue-router'
import { HomeOutline, AddCircleOutline, AppsOutline, CloudDownloadOutline, PersonOutline, CashOutline, InformationCircleOutline, StatsChartOutline, PeopleOutline, ServerOutline, SettingsOutline } from '@vicons/ionicons5'
import type { MenuOption } from 'naive-ui'

const baseMenuOptions: MenuOption[] = [
  {
    label: () =>
      h(
        RouterLink,
        {
          to: '/dashboard/home'
        },
        { default: () => '首页' }
      ),
    key: '/dashboard/home',
    icon: renderIcon(HomeOutline)
  },
  {
    label: () =>
      h(
        RouterLink,
        {
          to: '/dashboard/create-proxy'
        },
        { default: () => '创建隧道' }
      ),
    key: '/dashboard/create-proxy',
    icon: renderIcon(AddCircleOutline)
  },
  {
    label: () =>
      h(
        RouterLink,
        {
          to: '/dashboard/manage-proxies'
        },
        { default: () => '隧道管理' }
      ),
    key: '/dashboard/manage-proxies',
    icon: renderIcon(AppsOutline)
  },
  {
    label: () =>
      h(
        RouterLink,
        {
          to: '/dashboard/node-status'
        },
        { default: () => '节点监控' }
      ),
    key: '/dashboard/node-status',
    icon: renderIcon(StatsChartOutline)
  },
  {
    label: () =>
      h(
        RouterLink,
        {
          to: '/dashboard/downloads'
        },
        { default: () => '文件下载' }
      ),
    key: '/dashboard/downloads',
    icon: renderIcon(CloudDownloadOutline)
  },
  {
    label: () =>
      h(
        RouterLink,
        {
          to: '/dashboard/profile'
        },
        { default: () => '个人中心' }
      ),
    key: '/dashboard/profile',
    icon: renderIcon(PersonOutline)
  },
  {
    label: '赞助我们',
    key: 'donate',
    icon: renderIcon(CashOutline),
    disabled: true
  },
  {
    label: () =>
      h(
        RouterLink,
        {
          to: '/dashboard/about'
        },
        { default: () => '关于面板' }
      ),
    key: '/dashboard/about',
    icon: renderIcon(InformationCircleOutline)
  }
]

const adminMenuOptions: MenuOption = {
  label: '管理选项',
  key: 'admin',
  icon: renderIcon(SettingsOutline),
  children: [
    {
      label: () =>
        h(
          RouterLink,
          {
            to: '/dashboard/admin/users'
          },
          { default: () => '用户管理' }
        ),
      key: '/dashboard/admin/users',
      icon: renderIcon(PeopleOutline)
    },
    {
      label: () =>
        h(
          RouterLink,
          {
            to: '/dashboard/admin/nodes'
          },
          { default: () => '节点管理' }
        ),
      key: '/dashboard/admin/nodes',
      icon: renderIcon(ServerOutline)
    },
    {
      label: () =>
        h(
          RouterLink,
          {
            to: '/dashboard/admin/proxies'
          },
          { default: () => '隧道管理' }
        ),
      key: '/dashboard/admin/proxies',
      icon: renderIcon(AppsOutline)
    },
    {
      label: () =>
        h(
          RouterLink,
          {
            to: '/dashboard/admin/panel'
          },
          { default: () => '面板管理' }
        ),
      key: '/dashboard/admin/panel',
      icon: renderIcon(SettingsOutline)
    }
  ]
}

export function getMenuOptions(): MenuOption[] {
  const userGroup = localStorage.getItem('group')
  const options = [...baseMenuOptions]
  
  if (userGroup === 'admin') {
    options.push(adminMenuOptions)
  }
  
  return options
}

function renderIcon(icon: Component) {
  return () => h(icon, { style: 'font-size: 18px;' })
} 