import { defineStore } from 'pinia';
import { PermissionState } from './types';
import route from '@/router/routers'
import Layout from '@/layout/index.vue'
import ParentView from '@/components/ParentView/index.vue'

export interface childrenMap {
  component: string,
  hidden: boolean,
  meta: { icon: string, noCache: boolean, title: string },
  name: string,
  path: string,
  children?: undefined | Array<childrenMap>
}

const permissionStore = defineStore('perssion', {
  state: (): PermissionState => ({
    routers: route,
    addRouters: []
  }),

  getters: {
    permission(state: PermissionState): PermissionState {
      return { ...state };
    },
  },

  actions: {
    generateRoutes(routers: any) {
      this.addRouters = routers
      this.routers = route.concat(routers)
    }
  },
});



export const filterAsyncRouter = (routers: any[], isRewrite = false) => { // 遍历后台传来的路由字符串，转换为组件对象
  return routers.filter(router => {
    if (isRewrite && router.children) {
      router.children = filterChildren(router.children)
    }
    if (router.component) {
      if (router.component === 'Layout') { // Layout组件特殊处理
        router.component = Layout
      } else if (router.component === 'ParentView') {
        router.component = ParentView
      } else {
        const component = router.component
        router.component = loadView(component)
      }
    }
    if (router.children && router.children.length) {
      router.children = filterAsyncRouter(router.children, router)
    }
    return true
  })
}

function filterChildren(childrenMap: Array<childrenMap>) {
  let children: Array<childrenMap> = []
  childrenMap.forEach((el) => {
    if (el.children && el.children.length) {
      if (el.component === 'ParentView') {
        el.children.forEach(c => {
          c.path = el.path + '/' + c.path
          if (c.children && c.children.length) {
            children = children.concat(filterChildren(c.children))
            return
          }
          children.push(c)
        })
        return
      }
    }
    children = children.concat(el)
  })
  return children
}

const modules = import.meta.glob('../../../views/*/*.vue')
export const loadView = (view: string) => {
  return () => modules[view]
}



export default permissionStore;