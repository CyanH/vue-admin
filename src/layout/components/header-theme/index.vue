<template>
  <div>
    <el-tooltip effect="dark" content="主题" placement="bottom">
      <el-button
        class="ml-0 mr btn-text can-hover"
        type="text"
        @click="dialogVisible = true"
      >
        <i class="fa fa-diamond" style="font-size: 16px" />
      </el-button>
    </el-tooltip>
    <el-dialog
      title="主题"
      width="600px"
      v-model="dialogVisible"
      :append-to-body="true"
    >
      <theme-list style="margin-top: -25px" />
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import themeList from "./components/themeList.vue";
export default defineComponent({
  components: {
    themeList,
  },
  setup() {
    let dialogVisible = ref(false);

    return { dialogVisible };
  },
});
</script>
