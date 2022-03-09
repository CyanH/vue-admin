<template>
  <!-- -->
  <el-menu-item v-if="!menu.children" :index="menu.path">
    <item :iconSvg="menu.iconSvg" :icon="menu.icon" :title="menu.title" />
  </el-menu-item>

  <el-sub-menu v-else :index="menu.path">
    <template #title>
      <item :iconSvg="menu.iconSvg" :icon="menu.icon" :title="menu.title" />
    </template>
    <sidebar-item v-for="item in menu.children" :key="item.path" :menu="item" />
  </el-sub-menu>
</template>


<script lang="ts">
import { defineComponent } from "vue";
import item from "./Item.vue";

export interface obj {
  path: string;
  title: string;
  icon?: string;
  iconSvg?: string;
  children?: Array<obj>;
}

export default defineComponent({
  components: {
    item,
  },
  props: {
    menu: {
      type: Object,
      default() {
        return {};
      },
    },
  },
});
</script>