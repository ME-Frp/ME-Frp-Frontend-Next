import { h, Component, ref } from 'vue'
import { HomeOutline, AddCircleOutline, AppsOutline, DownloadOutline, IdCardOutline, InformationCircleOutline, StatsChartOutline, PeopleOutline, CloudyOutline, ConstructOutline, WalletOutline, HelpCircleOutline, BuildOutline, PricetagsOutline, CafeOutline, SettingsOutline, BulbOutline, GlobeOutline } from '@vicons/ionicons5'
import { NIcon, type MenuOption } from 'naive-ui'

const baseMenuOptions: MenuOption[] = [
  {
    label: '面板首页',
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
    label: '关于面板',
    icon: renderIcon(InformationCircleOutline),
    key: 'about',
    link: '/dashboard/about',
  }
]

const moreMenuOptions: MenuOption = {
  label: '更多服务',
  icon: renderIcon(BulbOutline),
  key: 'more',
  children: [
    {
      label: '节点捐赠',
      key: 'more-node-donate', 
      link: '/dashboard/more/node-donate',
      icon: renderIcon(CafeOutline)
    },
    {
      label: '增值服务',
      key: 'more-cash',
      disabled: true,
      icon: renderIcon(WalletOutline),
      link: '/dashboard/more/cash',
    },
    {
      label: '广告投放',
      key: 'user-ads-appl',
      disabled: true,
      link: '/dashboard/more/ads-apply',
      icon: renderIcon(PricetagsOutline)
    },
    {
      label: 'DNS 解析',
      key: 'user-dns-resolve',
      disabled: true,
      link: '/dashboard/more/dns-resolve',
      icon: renderIcon(GlobeOutline)
    }
  ]
}

const adminMenuOptions: MenuOption = {
  label: '超管选项',
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
      label: '产品管理',
      key: 'admin-products',
      link: '/dashboard/admin/products',
      icon: renderIcon(BuildOutline)
    },
    {
      label: '广告管理',
      key: 'admin-ads',
      link: '/dashboard/admin/ads',
      icon: renderIcon(PricetagsOutline)
    },
    {
      label: '捐赠管理',
      key: 'admin-node-donate',
      link: '/dashboard/admin/node-donate',
      icon: renderIcon(CafeOutline)
    },
    {
      label: '系统管理',
      key: 'admin-system',
      link: '/dashboard/admin/system',
      icon: renderIcon(SettingsOutline)
    }
  ]
}

export function getMenuOptions(): MenuOption[] {
  const userGroup = localStorage.getItem('group')
  const options = [...baseMenuOptions]

  options.push(moreMenuOptions)
  if (userGroup === 'admin') {
    options.push(adminMenuOptions)
    defaultExpandedKeys.value.push('admin')
  }
  return options
}

export function renderIcon(icon: Component) {
  return () => h(NIcon, {
    component: icon,
    size: 22
  })
}

export const defaultExpandedKeys = ref<string[]>(['more'])