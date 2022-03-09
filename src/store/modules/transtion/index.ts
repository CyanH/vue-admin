import { defineStore } from 'pinia';
import { transtionState } from './types';
import setting from '@/setting.js'
import Cookies from 'js-cookie'

const useTransitionStore = defineStore('transtion', {
  state: (): transtionState => ({
    // 是否开启页面过度动画
    active: setting.transition.active
  }),

  getters: {
    userInfo(state: transtionState): transtionState {
      return { ...state };
    },
  },

  actions: {
    /**
     * @description 设置开启状态
     * @param {Object} context
     * @param {Boolean} active 新的状态
     */
    async set(active: boolean) {
      // store 赋值
      this.active = active
      // 持久化
      await Cookies.set("transition", this.active)
    },
    /**
     * 从数据库读取页面过渡动画设置
     * @param {Object} context
     */
    async load() {
      // store 赋值
      this.active = await Cookies.get("transition")
    }
  },
});




export default useTransitionStore;
