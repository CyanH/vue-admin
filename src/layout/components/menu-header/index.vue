<template>
  <div
    flex="cross:center"
    class="theme-header-menu"
    :class="{ 'is-scrollable': isScroll }"
  >
    <div
      ref="contentRef"
      class="theme-header-menu__content"
      flex-box="1"
      flex="true"
    >
      <div
        class="theme-header-menu__scroll"
        flex-box="0"
        :style="{ transform: `translateX(${currentTranslateX}px)` }"
        ref="scrollRef"
      >
        <el-menu
          mode="horizontal"
          :default-active="active"
          @select="handleMenuSelect"
        >
          <sidebar-item
            v-for="menu in menuStore.header"
            :key="menu.path"
            :menu="menu"
          />
        </el-menu>
      </div>
    </div>
    <template v-if="isScroll">
      <div
        class="theme-header-menu__prev"
        flex="main:center cross:center"
        flex-box="0"
        @click="hanldleScroll('left')"
      >
        <i class="el-icon-arrow-left"></i>
      </div>
      <div
        class="theme-header-menu__next"
        flex="main:center cross:center"
        flex-box="0"
        @click="hanldleScroll('right')"
      >
        <i class="el-icon-arrow-right"></i>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { DebouncedFunc, throttle } from "lodash";
import { onBeforeUnmount, onMounted, ref, nextTick, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useMenuStore } from "@/store";
import { ElMessage } from "element-plus";
import SidebarItem from "./SidebarItem.vue";

const menuStore = useMenuStore();

let active = ref("");
let isScroll = ref(false);
let scrollWidth = ref(0);
let contentWidth = ref(0);
let currentTranslateX = ref(0);
let contentRef = ref();
let scrollRef = ref();
const route = useRoute();
const router = useRouter();

watch(
  route,
  (val) => {
    active.value = val.path;
  },
  {
    immediate: true,
  }
);

const handleMenuSelect = (index: string) => {
  if (/^menu-empty-\d+$/.test(index) || index === undefined) {
    ElMessage.warning("临时菜单");
  } else if (/^https:\/\/|http:\/\//.test(index)) {
    openUrl(index);
  } else {
    router.push({
      path: index,
    });
  }
};

function openUrl(url: string) {
  let a = document.createElement("a");
  a.setAttribute("href", url);
  a.setAttribute("target", "_blank");
  a.setAttribute("id", "admin-link-temp");
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(
    <HTMLElement>document.getElementById("admin-link-temp")
  );
}

const hanldleScroll = (direction: string) => {
  if (direction === "left") {
    // 向右滚动
    currentTranslateX.value = 0;
  } else {
    // 向左滚动
    if (contentWidth.value * 2 - currentTranslateX.value <= scrollWidth.value) {
      currentTranslateX.value -= contentWidth.value;
    } else {
      currentTranslateX.value = contentWidth.value - scrollWidth.value;
    }
  }
};

const checkScroll = () => {
  let contentRefWidth = contentRef.value.clientWidth;
  let scrollRefWidth = scrollRef.value.clientWidth;

  if (isScroll.value) {
    // 页面依旧允许滚动的情况，需要更新width
    if (contentWidth.value - scrollWidth.value === currentTranslateX.value) {
      // currentTranslateX 也需要相应变化【在右端到头的情况时】
      currentTranslateX.value = contentRefWidth - scrollRefWidth;
      // 快速的滑动依旧存在判断和计算时对应的contentWidth变成正数，所以需要限制一下
      if (currentTranslateX.value > 0) {
        currentTranslateX.value = 0;
      }
    }
    // 更新元素数据
    contentWidth.value = contentRefWidth;
    scrollWidth.value = scrollRefWidth;
    // 判断何时滚动消失: 当scroll > content
    if (contentRefWidth > scrollRefWidth) {
      isScroll.value = false;
    }
  }
  // 判断何时滚动出现: 当scroll < content
  if (!isScroll.value && contentRefWidth < scrollRefWidth) {
    isScroll.value = true;
    // 注意，当isScroll变为true，对应的元素盒子大小会发生变化
    nextTick(() => {
      let contentRefWidth = contentRef.value.clientWidth;
      let scrollRefWidth = scrollRef.value.clientWidth;
      contentWidth.value = contentRefWidth;
      scrollWidth.value = scrollRefWidth;
      currentTranslateX.value = 0;
    });
  }
};

let throttledCheckScroll: DebouncedFunc<() => void>;
onMounted(() => {
  // 初始化判断
  // 默认判断父元素和子元素的大小，以确定初始情况是否显示滚动
  checkScroll();
  // 全局窗口变化监听，判断父元素和子元素的大小，从而控制isScroll的开关
  throttledCheckScroll = throttle(checkScroll, 300);
  window.addEventListener("resize", throttledCheckScroll);
});

onBeforeUnmount(() => {
  // 取消监听
  window.removeEventListener("resize", throttledCheckScroll);
});
</script>

