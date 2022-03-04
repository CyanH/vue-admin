import { defineStore } from 'pinia';
import { themeState } from './types';
import { get } from 'lodash'
import setting from '@/setting.js'
import Cookies from 'js-cookie'

const useThemeStore = defineStore('theme', {
  state: (): themeState => ({
    // 主题
    list: get(setting, 'theme.list', []),
    // 现在激活的主题 这应该是一个名字 不是对象
    activeName: get(setting, 'theme.list[0].name', ''),
    themeActiveSetting: get(setting, 'theme.list[0]', {})
  }),

  getters: {
    theme(state: themeState): themeState {
      return { ...state };
    },
  },

  actions: {
    /**
     * @description 激活一个主题
     * @param {String} themeValue 需要激活的主题名称
     */
    async set(themeName: string) {
      // 检查这个主题在主题列表里是否存在
      if (this.list.find(e => e.name === themeName)) {
        this.activeName = themeName
        this.themeActiveSetting = this.list.find(e => e.name === themeName)
      }
      // 将 vuex 中的主题应用到 dom
      this.dom()
      // 持久化
      Cookies.set('themeName', this.activeName)
    },
    /**
     * @description 从持久化数据加载主题设置
     */
    async load() {
      // store 赋值
      const activeName = Cookies.get('themeName')
      // 检查这个主题在主题列表里是否存在
      if (this.list.find(e => e.name === activeName)) {
        this.activeName = activeName
        this.themeActiveSetting = this.list.find(e => e.name === activeName)
      }
      // 将 vuex 中的主题应用到 dom
      this.dom()
    },
    dom() {
      document.body.className = `theme-${this.activeName}`
    }
  },
});

export default useThemeStore;
