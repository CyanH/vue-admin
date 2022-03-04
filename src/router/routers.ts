/**
 * @description 所有人可使用的参数配置列表
 * @params hidden: 是否隐藏当前路由结点不在导航中展示
 */

import Layout from '@/layout/index.vue'

const route = [
  {
    path: '/login',
    meta: { title: '登录', noCache: true },
    component: () => import('@/views/login.vue'),
    hidden: true,
  },
  {
    path: '/404',
    component: () => import('@/views/features/404.vue'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/features/401.vue'),
    hidden: true
  },
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path*',
        component: () => import('@/views/features/redirect.vue')
      }
    ]
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    alwaysShow: true,
    meta: { title: '首页', icon: 'index', affix: true, noCache: true },

    children: [
      {
        path: '/dashboard',
        component: () => import('@/views/home.vue'),
        name: 'Dashboard',
        meta: { title: '首页', icon: 'index', affix: true, noCache: true }
      }
    ]
  },
  // {
  //   path: '/user',
  //   component: Layout,
  //   hidden: true,
  //   redirect: 'noredirect',
  //   children: [
  //     {
  //       path: 'center',
  //       component: () => import('@/views/system/user/center.vue'),
  //       name: '个人中心',
  //       meta: { title: '个人中心' }
  //     }
  //   ]
  // }
]

export default route