import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import { useLoadingBar } from 'naive-ui'
import { Window } from '../types'

declare const window: Window

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('../views/Home.vue'),
    meta: { title: '首页' }
  },
  {
    path: '/auth/login',
    name: 'login',
    component: () => import('../views/auth/LoginMethod.vue'),
    meta: {
      title: '登录',
      requiresGuest: true
    }
  },
  {
    path: '/auth/pwd-login',
    name: 'pwd-login',
    component: () => import('../views/auth/PwdLogin.vue'),
    meta: {
      title: '密码登录',
      requiresGuest: true
    }
  },
  {
    path: '/auth/register',
    name: 'register',
    component: () => import('../views/auth/Register.vue'),
    meta: {
      title: '注册',
      requiresGuest: true
    }
  },
  {
    path: '/auth/iforgot',
    name: 'iforgot',
    component: () => import('../views/auth/iForgot.vue'),
    meta: {
      title: '找回密码',
      requiresGuest: true
    }
  },
  {
    path: '/auth/mlogin',
    name: 'mlogin',
    component: () => import('../views/auth/MagicLink.vue'),
    meta: {
      title: 'Magic Link 登录',
      requiresGuest: true
    }
  },
  {
    path: '/auth/mverify',
    name: 'mverify',
    component: () => import('../views/auth/VerifyMagicLink.vue'),
    meta: {
      title: '验证 Magic Link',
      requiresGuest: true
    }
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import('../views/Dashboard.vue'),
    redirect: '/dashboard/home',
    meta: {
      title: '控制台',
      requiresAuth: true
    },
    children: [
      {
        path: 'home',
        name: 'dashboard-home',
        component: () => import('../views/dashboard/Home.vue'),
        meta: { title: '控制台' }
      },
      {
        path: 'create-proxy',
        name: 'create-proxy',
        component: () => import('../views/dashboard/CreateProxy.vue'),
        meta: { title: '创建隧道' }
      },
      {
        path: 'manage-proxies',
        name: 'manage-proxies',
        component: () => import('../views/dashboard/ManageProxies.vue'),
        meta: { title: '隧道管理' }
      },
      {
        path: 'node-status',
        name: 'node-status',
        component: () => import('../views/dashboard/NodeStatus.vue'),
        meta: { title: '节点监控' }
      },
      {
        path: 'downloads',
        name: 'downloads',
        component: () => import('../views/dashboard/Downloads.vue'),
        meta: { title: '文件下载' }
      },
      {
        path: 'help',
        name: 'help',
        component: () => import('../views/dashboard/Help.vue'),
        meta: { title: '帮助中心' }
      },
      {
        path: 'profile',
        name: 'profile',
        component: () => import('../views/dashboard/Profile.vue'),
        meta: { title: '个人中心' }
      },
      {
        path: 'cash',
        name: 'cash',
        component: () => import('../views/dashboard/Cash.vue'),
        meta: { title: '增值服务' }
      },
      {
        path: 'about',
        name: 'about',
        component: () => import('../views/dashboard/About.vue'),
        meta: { title: '关于面板' }
      },
      {
        path: 'admin',
        name: 'admin',
        redirect: '/dashboard/admin/users',
        children: [
          {
            path: 'users',
            name: 'admin-users',
            component: () => import('../views/dashboard/admin/Users.vue'),
            meta: {
              title: '用户管理',
              requiresAdmin: true
            }
          },
          {
            path: 'nodes',
            name: 'admin-nodes',
            component: () => import('../views/dashboard/admin/Nodes.vue'),
            meta: {
              title: '节点管理',
              requiresAdmin: true
            }
          },
          {
            path: 'proxies',
            name: 'admin-proxies',
            component: () => import('../views/dashboard/admin/Proxies.vue'),
            meta: {
              title: '隧道管理',
              requiresAdmin: true
            }
          },
          {
            path: 'system',
            name: 'admin-system',
            component: () => import('../views/dashboard/admin/System.vue'),
            meta: {
              title: '系统管理',
              requiresAdmin: true
            }
          },
          {
            path: 'products',
            name: 'admin-products',
            component: () => import('../views/dashboard/admin/Products.vue'),
            meta: {
              title: '产品管理',
              requiresAdmin: true
            }
          }
        ]
      },
    ]
  },
  {
    path: '/terms',
    name: 'Terms',
    component: () => import('../views/Terms.vue'),
    meta: { title: '服务条款' }
  },
  {
    path: '/content',
    name: 'Content',
    component: () => import('../views/Content.vue'),
    meta: { title: '内容策略' }
  },
  {
    path: '/privacy',
    name: 'Privacy',
    component: () => import('../views/Privacy.vue'),
    meta: { title: '隐私政策' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, _from) => {
  const token = localStorage.getItem('token')
  const isAdmin = localStorage.getItem('group') === 'admin'

  if (to.meta.requiresAuth && !token) {
    return '/auth/login'
  }

  if (to.meta.requiresAdmin && !isAdmin) {
    return '/dashboard'
  }

  if (to.meta.requiresGuest && token) {
    return '/dashboard'
  }

  if (to.path === '/') {
    document.title = 'ME Frp | 幻缘映射 - 免费内网穿透_免费端口映射_半公益_高速_Minecraft我的世界联机_泰拉瑞亚联机_远程桌面_开发调试_建站'
  } else if (to.path === '/auth/login') {
    document.title = '登录到 ME Frp 5.0'
  } else if (to.path === '/auth/register') {
    document.title = '注册 ME Frp 账户'
  } else if (to.path === '/auth/iforgot') {
    document.title = '找回 ME Frp 账户'
  } else {
    document.title = `${to.meta.title} | ME Frp 5.0 管理面板`
  }

  if (!window.$loadingBar) return true
  window.$loadingBar.start()
  return true
})

router.afterEach((to, from) => {
  if (!window.$loadingBar) return
  window.$loadingBar.finish()
})

router.onError(() => {
  if (window.$loadingBar) window.$loadingBar.error()
})

export default router
