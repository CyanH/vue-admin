import { createPinia } from 'pinia';
import useUserStore from './modules/user';
import useSearchStore from './modules/search';
import useMenuStore from './modules/menu';
import fullScreenStore from './modules/fullscreen';
import useThemeStore from './modules/theme';
import usePageStore from './modules/page';
import useTransitionStore from './modules/transtion';
import permissionStore from './modules/permission';

const pinia = createPinia();

export { useUserStore, useSearchStore, useMenuStore, fullScreenStore, useThemeStore, usePageStore, useTransitionStore, permissionStore };
export default pinia;
