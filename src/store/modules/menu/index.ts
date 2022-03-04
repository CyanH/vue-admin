import { defineStore } from 'pinia';
import { menuState, obj } from './types';
import setting from '@/setting'
import Cookies from 'js-cookie'

const useMenuStore = defineStore('menu', {
  state: (): menuState => ({
    // 顶栏菜单
    header: [{ path: "/index", title: "首页", icon: "home" }, { path: "/demo/playground", title: "功能", icon: "flask", children: [{ path: "/demo/playground/index", title: "功能", icon: "home" }, { title: "svg 菜单图标", iconSvg: "admin", children: [{ title: "add", iconSvg: "add", path: "menu-empty-26" }, { title: "alarm", iconSvg: "alarm", path: "menu-empty-27" }, { title: "camera", iconSvg: "camera", path: "menu-empty-28" }, { title: "history", iconSvg: "history", path: "menu-empty-29" }, { title: "like", iconSvg: "like", path: "menu-empty-30" }, { title: "love", iconSvg: "love", path: "menu-empty-31" }, { title: "message", iconSvg: "message", path: "menu-empty-32" }, { title: "notice", iconSvg: "notice", path: "menu-empty-33" }, { title: "search", iconSvg: "search", path: "menu-empty-34" }, { title: "share", iconSvg: "share", path: "menu-empty-35" }, { title: "star", iconSvg: "star", path: "menu-empty-36" }, { title: "user", iconSvg: "user", path: "menu-empty-37" }], path: "menu-empty-25" }, { title: "空菜单演示", icon: "folder-o", children: [{ title: "正在开发 1", children: [{ title: "正在开发 1-1", path: "menu-empty-40" }, { title: "正在开发 1-2", path: "menu-empty-41" }], path: "menu-empty-39" }, { title: "正在开发 2", path: "menu-empty-42" }, { title: "正在开发 3", path: "menu-empty-43" }], path: "menu-empty-38" }, { path: "/demo/playground/frame", title: "内嵌网页", icon: "globe", children: [{ path: "/demo/playground/frame/doc", title: "D2Admin 中文文档", iconSvg: "admin" }, { path: "/demo/playground/frame/html", title: "静态 HTML", icon: "code" }, { path: "/demo/playground/frame/report", title: "构建分析", icon: "pie-chart" }] }, { title: "新窗口打开链接", icon: "link", children: [{ path: "https://github.com/projects/admin", title: "D2Admin Github", icon: "github" }, { path: "https://juejin.im/user/57a48b632e958a006691b946/posts", title: "掘金", icon: "globe" }, { path: "https://my.oschina.net/u/3871516", title: "开源中国", icon: "globe" }, { path: "https://www.zhihu.com/people/fairy-ever/activities", title: "知乎", icon: "globe" }, { path: "https://segmentfault.com/blog/liyang-note-book", title: "segmentfault 专栏", icon: "globe" }, { path: "http://www.fairyever.com/", title: "www.fairyever.com", icon: "globe" }], path: "menu-empty-44" }, { path: "/demo/playground/store", title: "全局状态管理", icon: "bolt", children: [{ path: "/demo/playground/store/page", title: "多标签页控制", icon: "window-restore" }, { path: "/demo/playground/store/menu", title: "菜单控制", icon: "bars" }, { path: "/demo/playground/store/size", title: "全局尺寸", icon: "font" }, { path: "/demo/playground/store/ua", title: "浏览器信息", icon: "info-circle" }, { path: "/demo/playground/store/gray", title: "灰度模式", icon: "eye" }, { path: "/demo/playground/store/fullscreen", title: "全屏", icon: "arrows-alt" }, { path: "/demo/playground/store/theme", title: "主题", icon: "diamond" }, { path: "/demo/playground/store/transition", title: "页面过渡开关", icon: "toggle-on" }] }, { path: "/demo/playground/page-cache", title: "页面缓存", icon: "hdd-o", children: [{ path: "/demo/playground/page-cache/on", title: "开启缓存" }, { path: "/demo/playground/page-cache/off", title: "关闭缓存" }, { path: "/demo/playground/page-cache/params/1", title: "带参路由缓存 1" }, { path: "/demo/playground/page-cache/params/2", title: "带参路由缓存 2" }] }, { path: "/demo/playground/page-argu", title: "参数传递和留存", icon: "assistive-listening-systems", children: [{ path: "/demo/playground/page-argu/send", title: "发送" }, { path: "/demo/playground/page-argu/get/username-from-menu?userid=userid-from-menu", title: "接收" }] }, { path: "/demo/playground/db", title: "数据持久化", icon: "database", children: [{ path: "/demo/playground/db/all", title: "总览", icon: "table" }, { path: "/demo/playground/db/public", title: "公共存储", icon: "users" }, { path: "/demo/playground/db/user", title: "私有数据", icon: "user" }, { path: "/demo/playground/db/page-public", title: "路由存储", icon: "file-o" }, { path: "/demo/playground/db/page-user", title: "私有路由存储", icon: "file-o" }, { path: "/demo/playground/db/page-snapshot-public", title: "路由快照", icon: "file" }, { path: "/demo/playground/db/page-snapshot-user", title: "私有路由快照", icon: "file" }] }, { path: "/demo/playground/log", title: "日志", icon: "bullseye", children: [{ path: "/demo/playground/log/log", title: "日志记录", icon: "dot-circle-o" }, { path: "/demo/playground/log/error", title: "错误捕捉", icon: "bug" }, { path: "/demo/playground/log/ajax", title: "Ajax 错误", icon: "bug" }, { path: "/demo/playground/log/console", title: "控制台日志", icon: "lightbulb-o" }] }, { path: "/demo/playground/add-routes", title: "动态添加路由", icon: "plus-square", children: [{ path: "/demo/playground/add-routes/routes", title: "添加页面", icon: "file-o" }] }, { path: "/demo/playground/env", title: "环境信息", icon: "exclamation-circle" }, { path: "/demo/playground/locales", title: "国际化", icon: "language" }] }, { path: "/demo/components", title: "组件", icon: "puzzle-piece", children: [{ path: "/demo/components/index", title: "扩展组件", icon: "home" }, { path: "/demo/components/container", title: "布局容器", icon: "window-restore", children: [{ title: "填充型", children: [{ path: "/demo/components/container/full", title: "基础", icon: "" }, { path: "/demo/components/container/full-slot", title: "插槽", icon: "" }, { path: "/demo/components/container/full-bs", title: "滚动优化", icon: "" }], path: "menu-empty-45" }, { title: "隐形模式", children: [{ path: "/demo/components/container/ghost", title: "基础", icon: "" }, { path: "/demo/components/container/ghost-slot", title: "插槽", icon: "" }, { path: "/demo/components/container/ghost-bs", title: "滚动优化", icon: "" }], path: "menu-empty-46" }, { title: "卡片型", children: [{ path: "/demo/components/container/card", title: "基础", icon: "" }, { path: "/demo/components/container/card-slot", title: "插槽", icon: "" }, { path: "/demo/components/container/card-bs", title: "滚动优化", icon: "" }], path: "menu-empty-47" }, { title: "方法", children: [{ path: "/demo/components/container/api?bs=false", title: "滚动控制", icon: "" }, { path: "/demo/components/container/api?bs=true", title: "滚动控制 BS", icon: "" }], path: "menu-empty-48" }] }, { path: "/demo/components/layout/grid", title: "高级布局", icon: "tasks", children: [{ path: "/demo/components/layout/grid", title: "拖拽位置和大小" }, { path: "/demo/components/layout/splitpane", title: "区域划分" }] }, { path: "/demo/components/editor", title: "编辑器", icon: "pencil-square-o", children: [{ path: "/demo/components/editor-ueditor", title: "UEditor", icon: "" }, { path: "/demo/components/editor-quill", title: "Quill", icon: "" }, { path: "/demo/components/editor-simpleMDE", title: "simpleMDE", icon: "" }] }, { path: "/demo/components/icon", title: "图标", icon: "star", children: [{ path: "/demo/components/icon/icon", title: "图标组件" }, { path: "/demo/components/icon/icon-svg", title: "svg 图标组件" }, { path: "/demo/components/icon/select", title: "图标选择器" }, { path: "/demo/components/icon/select-svg", title: "svg 图标选择器" }, { path: "/demo/components/icon/list", title: "FontAwesome" }] }, { path: "/demo/components/markdown", title: "markdown 解析", icon: "file-text-o", children: [{ path: "/demo/components/markdown/source", title: "指定资源" }, { path: "/demo/components/markdown/url", title: "异步加载文件" }] }, { path: "/demo/components/countup", title: "数字动画", icon: "motorcycle" }, { path: "/demo/components/highlight", title: "代码高亮显示", icon: "code" }, { path: "/demo/components/json-tree", title: "JSON 展示", icon: "sitemap" }] }, { path: "/demo/plugins", title: "插件", icon: "plug", children: [{ path: "/demo/plugins/index", title: "插件", icon: "home" }, { path: "/demo/plugins/import", title: "导入", icon: "download", children: [{ path: "/demo/plugins/import/csv", title: "csv" }, { path: "/demo/plugins/import/xlsx", title: "xlsx" }] }, { path: "/demo/plugins/export", title: "导出", icon: "upload", children: [{ path: "/demo/plugins/export/table", title: "表格" }, { path: "/demo/plugins/export/txt", title: "文本" }] }, { path: "/demo/plugins/clipboard-polyfill", title: "剪贴板访问", icon: "clipboard" }, { path: "/demo/plugins/day", title: "日期计算", icon: "clock-o" }, { path: "/demo/plugins/js-cookie", title: "Cookie 读写", icon: "asterisk" }] }],
    // 侧栏菜单
    aside: [],
    fullAside: [],
    // 侧边栏收缩
    asideCollapse: setting.menu.asideCollapse,
    // 侧边栏折叠动画
    asideTransition: setting.menu.asideTransition
  }),

  getters: {
    searchSetting(state: menuState): menuState {
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
