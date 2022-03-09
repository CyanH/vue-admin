<template>
  <div class="panel-search" flex="dir:top">
    <div
      class="panel-search__input-group"
      flex-box="0"
      flex="dir:top main:center cross:center"
      @click.self="handleEsc"
    >
      <svg-icon class="panel-search__logo" name="admin-text" />
      <el-autocomplete
        class="panel-search__input"
        ref="inputRef"
        v-model="searchText"
        :suffix-icon="Search"
        placeholder="搜索页面"
        :fetch-suggestions="querySearch"
        :trigger-on-focus="false"
        :clearable="true"
        @keydown.esc="handleEsc"
        @select="handleSelect"
      >
        <panel-search-item :item="item" />
      </el-autocomplete>
      <div class="panel-search__tip">
        您可以使用快捷键
        <span class="panel-search__key">{{ searchStore.hotkey.open }}</span>
        唤醒搜索面板，按
        <span class="panel-search__key">{{ searchStore.hotkey.close }}</span>
        关闭
      </div>
    </div>
    <div
      v-if="resultsList.length > 0"
      class="panel-search__results-group"
      flex-box="1"
    >
      <el-card shadow="never">
        <div class="panel-search__results-group-inner">
          <panel-search-item
            v-for="(item, index) in resultsList"
            :key="index"
            :item="item"
            :hover-mode="true"
            @click="handleResultsGroupItemClick(item.path)"
          />
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import panelSearchItem from "./item.vue";
import { defineEmits, defineExpose, ref, computed } from "vue";
import { useSearchStore } from "@/store";
import { useRoute, useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import { Search } from "@element-plus/icons-vue";
import Fuse from "fuse.js";

interface RestaurantItem {
  value: string;
  link: string;
}

const searchStore = useSearchStore();
const route = useRoute();
const router = useRouter();
let inputRef = ref();
let results = ref(<any>[]);
let searchText = ref("");
const emit = defineEmits(["close"]);

// 这份数据是展示在搜索面板下面的
const resultsList = computed(() => {
  return results.value.length === 0 && searchText.value === ""
    ? searchStore.pool.map((e) => ({
        value: e.fullTitle,
        ...e,
      }))
    : results.value;
});

const fuse = new Fuse(searchStore.pool, {
  shouldSort: true,
  threshold: 0.6,
  location: 0,
  distance: 100,
  minMatchCharLength: 1,
  keys: ["fullTitle", "path"],
});

/**
 * @description 过滤选项 这个方法在每次输入框的值发生变化时会触发
 */
const querySearch = (
  queryString: string | Fuse.Expression,
  callback: (arg: any) => void
) => {
  const result = fuse.search(queryString).map((e) => e.item);
  results.value = result;
  callback(result);
};

/**
 * @description 聚焦输入框
 */
const focus = () => {
  setTimeout(() => {
    if (inputRef.value) {
      inputRef.value.focus();
    }
    // 还原
    searchText.value = "";
    results.value = [];
  }, 500);
};

/**
 * @description 接收用户在下拉菜单中选中事件
 */
const handleSelect = async (item: RestaurantItem) => {
  // 如果用户选择的就是当前页面 就直接关闭搜索面板
  if (item.value === route.path) {
    handleEsc();
    return;
  }
  // 用户选择的是其它页面
  handleMenuSelect(item.value);
};

/**
 * @augments 关闭输入框的下拉菜单
 */
const closeSuggestion = () => {
  if (inputRef.value.activated) {
    inputRef.value.suggestions = [];
    inputRef.value.activated = false;
  }
};
/**
 * @augments 接收用户触发的关闭
 */
const handleEsc = async () => {
  closeSuggestion();
  emit("close");
};

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

defineExpose({
  focus,
});
</script>

<style lang="scss" scoped>
@import "@/assets/styles/public.scss";

.panel-search {
  margin: 20px;
  width: 100%;
  .panel-search__input-group {
    height: 240px;
    .panel-search__logo {
      width: 80px;
      height: 80px;
      margin-bottom: 20px;
    }
    :deep(.panel-search__input) {
      width: 500px;
      .el-input__inner {
        height: 40px;
        line-height: 40px;
      }
    }
    .panel-search__tip {
      @extend %unable-select;
      margin-top: 20px;
      margin-bottom: 40px;
      font-size: 12px;
      color: $color-text-sub;
      .panel-search__key {
        padding: 1px 5px;
        margin: 0px 2px;
        border-radius: 2px;
        background-color: $color-text-normal;
        color: $color-bg;
      }
    }
  }
  .panel-search__results-group {
    overflow: auto;
    margin-bottom: -20px;
    .panel-search__results-group-inner {
      margin: -20px;
    }
  }
}
</style>
