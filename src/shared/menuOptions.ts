import { h, Component } from 'vue'
import { RouterLink } from 'vue-router'
import { HomeOutline, AddCircleOutline, AppsOutline, CloudDownloadOutline, PersonOutline, CashOutline, InformationCircleOutline, StatsChartOutline, PeopleOutline, ServerOutline, SettingsOutline } from '@vicons/ionicons5'

export const menuOptions = [
  {
    label: () =>
      h(
        RouterLink,
        {
          to: '/dashboard/home'
        },
        { default: () => '首页' }
      ),
    key: 'dashboard-home',
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
    key: 'create-proxy',
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
    key: 'manage-proxies',
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
    key: 'node-status',
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
    key: 'downloads',
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
    key: 'profile',
    icon: renderIcon(PersonOutline)
  },
  {
    // label: () =>
    //   h(
    //     RouterLink,
    //     {
    //       to: '/dashboard/donate'
    //     },
    //     { default: () => '赞助我们' }
    //   ),
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
    key: 'about',
    icon: renderIcon(InformationCircleOutline)
  },
  {
    label: '管理选项',
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
        key: 'admin-users',
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
        key: 'admin-nodes',
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
        key: 'admin-proxies',
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
        key: 'admin-panel',
        icon: renderIcon(SettingsOutline)
      }
    ]
  }
]

function renderIcon(icon: Component) {
  return () => h(icon, { style: 'font-size: 18px;' })
} 