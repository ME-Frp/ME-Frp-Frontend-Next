import { h, Component } from 'vue'
import { HomeOutline, AddCircleOutline, AppsOutline, CloudDownloadOutline, PersonOutline, CashOutline, InformationCircleOutline, StatsChartOutline, PeopleOutline, ServerOutline, SettingsOutline } from '@vicons/ionicons5'
import { NIcon, type MenuOption } from 'naive-ui'

const baseMenuOptions: MenuOption[] = [
  {
    label: '首页',
    icon: renderIcon(HomeOutline),
    key: 'dashboard-home',
    link: '/dashboard/home',
  },
  {
    label: '创建隧道',
    icon: renderIcon(AddCircleOutline),
    key: 'create-proxy',
    link: '/dashboard/create-proxy',
  },
  {
    label: '隧道管理',
    icon: renderIcon(AppsOutline),
    key: 'manage-proxies',
    link: '/dashboard/manage-proxies',
  },
  {
    label: '节点监控',
    icon: renderIcon(StatsChartOutline),
    key: 'node-status',
    link: '/dashboard/node-status',
  },
  {
    label: '文件下载',
    icon: renderIcon(CloudDownloadOutline),
    key: 'downloads',
    link: '/dashboard/downloads',
  },
  {
    label: '个人资料',
    icon: renderIcon(PersonOutline),
    key: 'profile',
    link: '/dashboard/profile',
  },
  {
    label: '赞助我们',
    key: 'donate',
    icon: renderIcon(CashOutline),
    link: '/dashboard/donate',
    disabled: true
  },
  {
    label: '关于面板',
    icon: renderIcon(InformationCircleOutline),
    key: 'about',
    link: '/dashboard/about',
  }
]

const adminMenuOptions: MenuOption = {
  label: '管理选项',
  icon: renderIcon(SettingsOutline),
  key: 'admin',
  children: [
    {
      label: '用户管理',
      key: 'admin-users',
      link: '/dashboard/admin/users',
      icon: renderIcon(PeopleOutline)
    },
    {
      label: '节点管理',
      key: 'admin-nodes',
      link: '/dashboard/admin/nodes',
      icon: renderIcon(ServerOutline)
    },
    {
      label: '隧道管理',
      key: 'admin-proxies',
      link: '/dashboard/admin/proxies',
      icon: renderIcon(AppsOutline)
    },
    {
      label: '面板管理',
      key: 'admin-panel',
      link: '/dashboard/admin/panel',
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
  console.log(options)
  return options
}

export function renderIcon(icon: Component) {
  return () => h(NIcon, {
    component: icon,
    size: 22
  })
}