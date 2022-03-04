import { defineStore } from 'pinia';
import { searchState } from './types';
import setting from '@/setting'

const useSearchStore = defineStore('search', {
  state: (): searchState => ({
    // 搜索面板激活状态
    active: false,
    // 快捷键
    hotkey: {
      open: setting.hotkey.search.open,
      close: setting.hotkey.search.close
    },
    // 所有可以搜索的页面
    pool: []
  }),

  getters: {
    searchSetting(state: searchState): searchState {
      return { ...state };
    },
  },

  actions: {
    /**
     * @description 切换激活状态
     */
    toggle() {
      this.active = !this.active
    },
    /**
     * @description 设置激活模式
     */
    set(active: boolean) {
      this.active = active
    },
    /**
     * @description 初始化
     * @param {Array} menu menu
     */
    init(menu: any[]) {
      const pool: any[] = []
      const push = function (menu: any[], titlePrefix: any[] = []) {
        menu.forEach(m => {
          if (m.children) {
            push(m.children, [...titlePrefix, m.title])
          } else {
            pool.push({
              ...m,
              fullTitle: [...titlePrefix, m.title].join(' / ')
            })
          }
        })
      }
      push(menu)
      this.pool = pool
    }
  },
});

export default useSearchStore;
