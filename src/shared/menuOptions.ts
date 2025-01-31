import { h, Component } from 'vue'
import { HomeOutline, AddCircleOutline, AppsOutline, DownloadOutline,IdCardOutline,CreateOutline, CashOutline, InformationCircleOutline, StatsChartOutline, PeopleOutline, CloudyOutline, ConstructOutline, WalletOutline, HelpCircleOutline } from '@vicons/ionicons5'
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
    icon: renderIcon(DownloadOutline),
    key: 'downloads',
    link: '/dashboard/downloads',
  },
  {
    label: '帮助中心',
    icon: renderIcon(HelpCircleOutline),
    key: 'help',
    link: '/dashboard/help',
  },
  {
    label: '用户中心',
    icon: renderIcon(IdCardOutline),
    key: 'profile',
    link: '/dashboard/profile',
  },
  {
    label: '增值服务',
    key: 'cash',
    icon: renderIcon(WalletOutline),
    link: '/dashboard/cash',
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
  icon: renderIcon(ConstructOutline),
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
      icon: renderIcon(CloudyOutline)
    },
    {
      label: '隧道管理',
      key: 'admin-proxies',
      link: '/dashboard/admin/proxies',
      icon: renderIcon(AppsOutline)
    },
    {
      label: '系统管理',
      key: 'admin-system',
      link: '/dashboard/admin/system',
      icon: renderIcon(CreateOutline)
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

export function renderIcon(icon: Component) {
  return () => h(NIcon, {
    component: icon,
    size: 22
  })
}