import { defineStore } from 'pinia';
import { menuState, obj } from './types';
import setting from '@/setting'
import Cookies from 'js-cookie'

const useMenuStore = defineStore('menu', {
  state: (): menuState => ({
    // 顶栏菜单
    header: [{ path: "/index", title: "首页", icon: "home" }, { path: "/system", title: "系统管理", iconSvg: "system", children: [{ path: "/system/user", title: "用户管理", iconSvg: "peoples" }, { title: "角色管理", iconSvg: "role", path: "/system/role" }, { title: "菜单管理", iconSvg: "menu", path: "/system/menu" }, { path: "/system/dept", title: "部门管理", iconSvg: "dept", }] }, { path: "/components", title: "组件", icon: "puzzle-piece", children: [{ path: "/components/icon", title: "图标", icon: "star", children: [{ path: "/components/icon/icon-svg", title: "svg 图标组件" }, { path: "/components/icon/list", title: "icon图标组件" }] }, { path: "/demo/components/countup", title: "数字动画", icon: "motorcycle" }] }, { path: "/demo/plugins", title: "插件", icon: "plug", children: [{ path: "/demo/plugins/index", title: "插件", icon: "home" }, { path: "/demo/plugins/import", title: "导入", icon: "download", children: [{ path: "/demo/plugins/import/csv", title: "csv" }, { path: "/demo/plugins/import/xlsx", title: "xlsx" }] }, { path: "/demo/plugins/export", title: "导出", icon: "upload", children: [{ path: "/demo/plugins/export/table", title: "表格" }, { path: "/demo/plugins/export/txt", title: "文本" }] }, { path: "/demo/plugins/clipboard-polyfill", title: "剪贴板访问", icon: "clipboard" }, { path: "/demo/plugins/day", title: "日期计算", icon: "clock-o" }, { path: "/demo/plugins/js-cookie", title: "Cookie 读写", icon: "asterisk" }] }],
    // 侧栏菜单
    aside: [],
    fullAside: [],
    // 侧边栏收缩
    asideCollapse: setting.menu.asideCollapse,
    // 侧边栏折叠动画
    asideTransition: setting.menu.asideTransition
  }),

  getters: {
    menuSetting(state: menuState): menuState {
      return { ...state };
    },
  },

  actions: {
    /**
     * 切换侧边栏展开和收缩
     */
    asideCollapseToggle() {
      this.asideCollapse = !this.asideCollapse
      Cookies.set('asideCollapse', this.asideCollapse)
    },
    /**
     * 从持久化数据读取侧边栏展开或者收缩
     */
    asideCollapseLoad() {
      this.asideCollapse = Cookies.get('asideCollapse')
    },
    /**
      * @description 设置顶栏菜单
      * @param {Array} menu menu setting
      */
    headerSet(menu: Array<obj>) {
      this.header = menu
    },
    /**
     * @description 设置侧边栏菜单
     * @param {Array} menu menu setting
     */
    asideSet(menu: string[]) {
      this.aside = menu
    },
    fullAsideSet(menu: string[]) {
      this.fullAside = menu
      this.aside = menu
    }
  },
});

export default useMenuStore;
