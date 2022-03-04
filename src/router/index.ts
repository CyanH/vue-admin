import { createRouter, createWebHistory, NavigationGuardNext, RouteLocationNormalized, RouteRecordRaw } from 'vue-router'
import { isLogin } from '@/utils/auth';
import { buildMenus } from '@/api/system/menu'
import { filterAsyncRouter } from '@/store/modules/permission'
import { useUserStore, permissionStore, useMenuStore } from '@/store';
import NProgress from "nprogress"
import "nprogress/nprogress.css"

NProgress.configure({ showSpinner: false });

// 引入routes
import routes from './routers'

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 })
})

const whiteList = ['/login']

router.beforeEach((to, from, next) => {
  NProgress.start();
  if (isLogin()) {
    if (to.path === '/login') {
      next({ path: '/' })
      NProgress.done()
    } else {
      const userStore = useUserStore();
      if (userStore.roles.length === 0) { // 判断当前用户是否已拉取完user_info信息
        userStore.getInfo().then(() => { // 拉取user_info
          // 动态路由，拉取菜单
          loadMenus(next, to)
        }).catch(() => {
          userStore.logOut().then(() => {
            location.reload() // 为了重新实例化vue-router对象 避免bug
          })
        })
        // 登录时未拉取 菜单，在此处拉取
      } else if (userStore.loadMenus) {
        // 修改成false，防止死循环
        userStore.updateLoadMenus()
        loadMenus(next, to)
      } else {
        next()
      }
    }
  } else {
    /* has no token*/
    if (whiteList.indexOf(to.path) !== -1) { // 在免登录白名单，直接进入
      next()
    } else {
      next(`/login?redirect=${to.fullPath}`) // 否则全部重定向到登录页
      NProgress.done()
    }
  }
});

router.afterEach(() => {
  NProgress.done() // finish progress bar
})

export const loadMenus = (next: NavigationGuardNext, to: RouteLocationNormalized) => {
  buildMenus().then(res => {
    const data = JSON.parse(JSON.stringify(res))
    const rewriteRoutes = filterAsyncRouter(data, true)
    rewriteRoutes.push({ path: '/:pathMatch(.*)', redirect: '/404', hidden: true })
    const usePermission = permissionStore()
    usePermission.generateRoutes(rewriteRoutes)
    rewriteRoutes.map((route: RouteRecordRaw) => {
      router.addRoute(route) // 动态添加可访问路由表

    })
    next({ ...to, replace: true })

  })
}

export default router