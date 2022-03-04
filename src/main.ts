import { createApp } from 'vue'

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

import globalComponents from '@/components';

import 'normalize.css' // css初始化

import App from './App.vue'
import store from './store'
import router from './router'

import 'virtual:svg-icons-register'

const app = createApp(App)
app.use(ElementPlus)
app.use(store)
app.use(router)
app.use(globalComponents);
app.mount('#app')

import { useThemeStore } from "@/store";
useThemeStore().load()