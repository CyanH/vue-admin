<template>
  <div class="layout-header-aside-group" :style="styleLayoutMainGroup()">
    <!-- 半透明遮罩 -->
    <div class="layout-header-aside-mask"></div>
    <!-- 主体内容 -->
    <div class="layout-header-aside-content" flex="dir:top">
      <!-- 顶栏 -->
      <div
        class="theme-header"
        :style="{
          opacity: searchStore.active ? 0.5 : 1,
        }"
        flex-box="0"
        flex
      >
        <router-link
          to="/"
          :class="{
            'logo-group': true,
            'logo-transition': menuStore.asideTransition,
          }"
          :style="{
            width: menuStore.asideCollapse ? asideWidthCollapse : asideWidth,
          }"
          flex-box="0"
        >
          <img
            v-if="menuStore.asideCollapse"
            :src="`${baseUrl}image/theme/${themeStore.themeActiveSetting.name}/logo/icon-only.png`"
          />
          <img
            v-else
            :src="`${baseUrl}image/theme/${themeStore.themeActiveSetting.name}/logo/all.png`"
          />
        </router-link>

        <div
          class="toggle-aside-btn"
          @click="menuStore.asideCollapseToggle()"
          flex-box="0"
        >
          <i class="fa fa-bars" />
        </div>
        <menu-header flex-box="1" />
        <!-- 顶栏右侧 -->
        <div class="header-right" flex-box="0">
          <header-search @click="handleSearchClick" />
          <header-fullscreen />
          <header-theme />
          <header-user />
        </div>
      </div>
      <!-- 下面 主体 -->
      <div class="theme-container" flex-box="1" flex>
        <!-- 主体 侧边栏 -->
        <div
          flex-box="0"
          ref="aside"
          :class="{
            'theme-container-aside': true,
            'theme-container-transition': menuStore.asideTransition,
          }"
          :style="{
            width: menuStore.asideCollapse ? asideWidthCollapse : asideWidth,
            opacity: searchStore.active ? 0.5 : 1,
          }"
        >
          <menu-side />
        </div>
        <!-- 主体 -->
        <div class="theme-container-main" flex-box="1" flex>
          <!-- 搜索 -->
          <transition name="fade-scale">
            <div
              v-if="searchStore.active"
              class="theme-container-main-layer"
              flex
            >
              <panel-search ref="searchRef" @close="searchPanelClose" />
            </div>
          </transition>
          <!-- 内容 -->
          <router-view :key="routerViewKey" v-slot="{ Component }">
            <transition name="fade-scale">
              <div
                v-if="!searchStore.active"
                class="theme-container-main-layer"
                flex="dir:top"
              >
                <!-- tab -->
                <div class="theme-container-main-header" flex-box="0">
                  <tabs />
                </div>
                <!-- 页面 -->
                <div class="theme-container-main-body" flex-box="1">
                  <transition
                    :name="transitionStore.active ? 'fade-transverse' : ''"
                  >
                    <keep-alive :include="pageStore.keepAlive">
                      <component :is="Component" />
                    </keep-alive>
                  </transition>
                </div>
              </div>
            </transition>
          </router-view>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import menuHeader from "./components/menu-header/index.vue";
import headerSearch from "./components/header-search/index.vue";
import headerFullscreen from "./components/header-fullscreen/index.vue";
import headerTheme from "./components/header-theme/index.vue";
import headerUser from "./components/header-user/index.vue";
import menuSide from "./components/menu-side/index.vue";
import panelSearch from "./components/panel-search/index.vue";
import tabs from "./components/tabs/index.vue";
import {
  useSearchStore,
  useMenuStore,
  useThemeStore,
  usePageStore,
  useTransitionStore,
} from "@/store";
import { useRoute } from "vue-router";
import hotkeys from "hotkeys-js";

const baseUrl = <string>import.meta.env.BASE_URL;
const searchStore = useSearchStore();
const menuStore = useMenuStore();
const themeStore = useThemeStore();
const pageStore = usePageStore();
const transitionStore = useTransitionStore();
const route = useRoute();
const searchRef = ref();

// [侧边栏宽度] 正常状态
let asideWidth = ref("200px");
// [侧边栏宽度] 折叠状态
let asideWidthCollapse = ref("65px");

/**
 * @description 用来实现带参路由的缓存
 */
const routerViewKey = () => {
  // 默认情况下 key 类似 __transition-n-/foo
  // 这里的字符串操作是为了最终 key 的格式和原来相同 类似 __transition-n-__stamp-time-/foo
  const stamp = route.meta[`__stamp-${route.path}`] || "";
  return `${stamp ? `__stamp-${stamp}-` : ""}${route.path}`;
};

const handleSearchClick = () => {
  searchStore.toggle();
  if (searchStore.active) {
    setTimeout(() => {
      if (searchRef.value) {
        searchRef.value.focus();
      }
    }, 500);
  }
};

const searchPanelOpen = () => {
  if (!searchStore.active) {
    searchStore.set(true);
    setTimeout(() => {
      if (searchRef.value) {
        searchRef.value.focus();
      }
    }, 500);
  }
};

const searchPanelClose = () => {
  if (searchStore.active) {
    searchStore.set(false);
  }
};

/**
 * @description 最外层容器的背景图片样式
 */
const styleLayoutMainGroup = () => {
  return themeStore.themeActiveSetting.backgroundImage
    ? {
        backgroundImage: `url('${baseUrl}${themeStore.themeActiveSetting.backgroundImage}')`,
      }
    : {};
};

// 绑定搜索功能快捷键 [ 打开 ]
hotkeys(searchStore.hotkey.open, (event) => {
  event.preventDefault();
  searchPanelOpen();
});
// 绑定搜索功能快捷键 [ 关闭 ]
hotkeys(searchStore.hotkey.close, (event) => {
  event.preventDefault();
  searchPanelClose();
});
</script>

<style lang="scss">
// 注册主题
@import "@/assets/styles/theme/register.scss";
</style>
