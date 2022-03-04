<template>
  <el-scrollbar>
    <el-menu
      :collapse="menuStore.asideCollapse"
      :collapse-transition="menuStore.asideTransition"
      :unique-opened="true"
      :default-active="route.fullPath"
      @select="handleMenuSelect"
    >
      <sidebar-item :header="menuStore.aside" />
    </el-menu>
  </el-scrollbar>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useMenuStore } from "@/store";
import { ElMessage } from "element-plus";
import SidebarItem from "./SidebarItem.vue";

const route = useRoute();
const router = useRouter();
const menuStore = useMenuStore();

// watch(
//   route,
//   (val) => {
//   const _side = menuAside.filter(menu => menu.path === matched[0].path)
//           this.$store.commit('d2admin/menu/asideSet', _side.length > 0 ? _side[0].children : [])
//   },
//   {
//     immediate: true,
//   }
// );

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
</script>
