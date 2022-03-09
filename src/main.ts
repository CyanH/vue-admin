import { createApp } from 'vue'

import ElementPlus from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import 'element-plus/dist/index.css'

import globalComponents from '@/components';

import 'normalize.css' // css初始化

import App from './App.vue'
import store from './store'
import router from './router'
import { frameInRoutes } from '@/router/routers'

import 'virtual:svg-icons-register'

const app = createApp(App)
app.use(ElementPlus, { locale: zhCn })
app.use(store)
app.use(router)
app.use(globalComponents);
app.mount('#app')

import { useThemeStore, usePageStore } from "@/store";
useThemeStore().load()
usePageStore().init(frameInRoutes)
