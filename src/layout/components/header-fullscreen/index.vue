<template>
  <el-tooltip
    effect="dark"
    :content="fullscreen.active ? '退出全屏' : '全屏'"
    placement="bottom"
  >
    <el-button
      class="mr btn-text can-hover"
      type="text"
      @click="fullscreen.toggle"
    >
      <i v-if="fullscreen.active" class="fa fa-compress" />
      <i v-else class="fa fa-arrows-alt" style="font-size: 16px" />
    </el-button>
  </el-tooltip>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { fullScreenStore } from "@/store";

export default defineComponent({
  setup() {
    const fullscreen = fullScreenStore();
    return { fullscreen };
  },
});
</script>
