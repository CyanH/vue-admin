<template>
  <template v-for="menu in header" :key="menu.path">
    <el-sub-menu v-if="menu.children" :index="menu.path">
      <template #title>
        <item :iconSvg="menu.iconSvg" :icon="menu.icon" :title="menu.title" />
      </template>
      <sidebar-item :header="menu.children" />
    </el-sub-menu>

    <el-menu-item v-else :index="menu.path">
      <item :iconSvg="menu.iconSvg" :icon="menu.icon" :title="menu.title" />
    </el-menu-item>
  </template>
</template>


<script lang="ts">
import { defineComponent } from "vue";
import item from "./Item.vue";

export default defineComponent({
  components: {
    item,
  },
  props: {
    header: {
      type: Array,
      required: true,
    },
  },
});
</script>