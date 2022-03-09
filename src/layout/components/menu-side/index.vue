<template>
  <el-scrollbar class="scrollbar" ref="scrollbar">
    <el-menu
      :collapse="menuStore.asideCollapse"
      :collapse-transition="menuStore.asideTransition"
      :unique-opened="true"
      :default-active="route.fullPath"
      @select="handleMenuSelect"
    >
      <sidebar-item :header="menuStore.aside" />
    </el-menu>
    <div
      v-if="menuStore.aside.length === 0 && !menuStore.asideCollapse"
      class="layout-header-aside-menu-empty"
      flex="dir:top main:center cross:center"
    >
      <i class="fa fa-inbox" />
      <span>没有侧栏菜单</span>
    </div>
  </el-scrollbar>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";
import { useMenuStore } from "@/store";
import { ElMessage } from "element-plus";
import SidebarItem from "./SidebarItem.vue";
import { onMounted, onBeforeUnmount, ref } from "vue";
import {
  addResizeListener,
  removeResizeListener,
} from "element-plus/lib/utils/dom/resize-event";

const route = useRoute();
const router = useRouter();
const menuStore = useMenuStore();
const scrollbar = ref();

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

onMounted(() => {
  addResizeListener(scrollbar.value.$el, scrollbar.value.update);
});

onBeforeUnmount(() => {
  removeResizeListener(scrollbar.value.$el, scrollbar.value.update);
});
</script>

<style lang="scss">
.d2-scrollbar {
  height: 100%;
  .el-scrollbar__wrap {
    overflow: auto;
  }
}
</style>