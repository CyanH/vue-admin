<template>
  <svg-icon v-if="iconSvg" :name="iconSvg" />
  <template v-else>
    <i v-if="icon" :class="`fa fa-${icon}`" />
    <i v-else class="fa fa-file-o" />
  </template>
  <span>{{ title || "未命名菜单" }}</span>
</template>


<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    iconSvg: {
      type: String,
    },
    icon: {
      type: String,
    },
    title: {
      type: String,
    },
  },
});
</script>