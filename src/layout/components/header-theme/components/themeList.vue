<template>
  <el-table :data="themeStore.list" v-bind="table">
    <el-table-column prop="title" align="center" width="160" />
    <el-table-column label="预览" width="120">
      <template #default="scope">
        <div
          class="theme-preview"
          :style="{ backgroundImage: `url(${baseUrl}${scope.row.preview})` }"
        />
      </template>
    </el-table-column>
    <el-table-column prop="address" align="center">
      <template #default="scope">
        <el-button
          v-if="themeStore.activeName === scope.row.name"
          type="success"
          :icon="Check"
          round
          >已激活</el-button
        >
        <el-button v-else round @click="themeStore.set(scope.row.name)"
          >使用</el-button
        >
      </template>
    </el-table-column>
  </el-table>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useThemeStore } from "@/store";
import { Check } from "@element-plus/icons-vue";
const baseUrl = <string>import.meta.env.BASE_URL;

export default defineComponent({
  setup() {
    const themeStore = useThemeStore();

    const table = {
      showHeader: false,
      border: true,
    };

    return {
      Check,
      table,
      baseUrl,
      themeStore,
    };
  },
});
</script>

<style lang="scss" scoped>
@import "@/assets/styles/unit/color.scss";

.theme-preview {
  height: 50px;
  width: 100px;
  border-radius: 4px;
  background-size: cover;
  border: 1px solid $color-border-1;
}
</style>
