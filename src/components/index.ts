import { App } from 'vue';

// flex 布局库
import 'flex.css'
// 图标库
import '@/assets/icons/font-awesome-4.7.0/css/font-awesome.min.css'

import SvgIcon from './svg-icon/index.vue';

export default {
  install(Vue: App) {
    Vue.component('svg-icon', SvgIcon);
  },
};
