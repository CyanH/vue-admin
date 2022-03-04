import { defineStore } from 'pinia';
import { fullState } from './types';
import screenfull from 'screenfull'

const fullScreenStore = defineStore('fullscreen', {
  state: (): fullState => ({
    active: false
  }),

  getters: {
    fullScreen(state: fullState): fullState {
      return { ...state };
    },
  },

  actions: {
    /**
     * @description 切换全屏
     */
    toggle() {
      if (screenfull.isFullscreen) {
        screenfull.exit()
        this.active = false
      } else {
        screenfull.request()
        this.active = true
      }
    }
  },
});

export default fullScreenStore;
