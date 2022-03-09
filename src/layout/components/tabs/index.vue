<template>
  <div class="multiple-page-control-group" flex>
    <div class="multiple-page-control-content" flex-box="1">
      <div class="multiple-page-control-content-inner">
        <!-- <context-menu
          :visible="state.contextmenuFlag"
          :x="contentmenuX"
          :y="contentmenuY"
        >
          <context-menu-list
            :menulist="
              state.tagName === '/index'
                ? state.contextmenuListIndex
                : state.contextmenuList
            "
            @rowClick="contextmenuClick"
          />
        </context-menu> -->
        <el-tabs
          class="multiple-page-control multiple-page-sort"
          v-model="pageStore.current"
          type="card"
          @tab-click="handleClick"
          @tab-remove="handleTabRemove"
          @contextmenu="handleContextmenu"
        >
          <el-tab-pane
            v-for="page in pageStore.opened"
            :key="page.fullPath"
            :label="page.meta.title || '未命名'"
            :name="page.fullPath"
            :closable="isTabClosable(page)"
          />
        </el-tabs>
      </div>
    </div>
    <div class="multiple-page-control-btn" flex-box="0">
      <el-dropdown
        size="large"
        split-button
        @click="pageStore.closeAll"
        @command="(command) => handleControlItemClick(command)"
      >
        <i class="fa fa-times-circle" />
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="left">
              <i class="fa fa-arrow-left" />
              关闭左侧
            </el-dropdown-item>
            <el-dropdown-item command="right">
              <i class="fa fa-arrow-right" />
              关闭右侧
            </el-dropdown-item>
            <el-dropdown-item command="other">
              <i class="fa fa-times" />
              关闭其它
            </el-dropdown-item>
            <el-dropdown-item command="all">
              <i class="fa fa-times-circle" />
              全部关闭
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive } from "vue";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
// import contextMenu from "../context-menu/index.vue";
// import contextMenuList from "../context-menu/list.vue";
import { usePageStore } from "@/store";
import Sortable from "sortablejs";

const router = useRouter();
const pageStore = usePageStore();
const state = reactive({
  contextmenuFlag: false,
  contentmenuX: 0,
  contentmenuY: 0,
  contextmenuListIndex: [
    { icon: "times-circle", title: "关闭全部", value: "all" },
  ],
  contextmenuList: [
    { icon: "refresh", title: "刷新", value: "refresh" },
    { icon: "arrow-left", title: "关闭左侧", value: "left" },
    { icon: "arrow-right", title: "关闭右侧", value: "right" },
    { icon: "times", title: "关闭其它", value: "other" },
    { icon: "times-circle", title: "关闭全部", value: "all" },
  ],
  tagName: "/index",
});

/**
 * @description 计算某个标签页是否可关闭
 * @param {Object} page 其中一个标签页
 */
const isTabClosable = (page: { name: string }) => {
  return page.name !== "index";
};
/**
 * @description 右键菜单功能点击
 * @param {Object} event 事件
 */
const handleContextmenu = (event: {
  target: any;
  preventDefault: () => void;
  stopPropagation: () => void;
  clientX: any;
  clientY: any;
}) => {
  let target = event.target;
  // fix https://github.com/projects/admin/issues/54
  let flag = false;
  if (target.className.indexOf("el-tabs__item") > -1) flag = true;
  else if (target.parentNode.className.indexOf("el-tabs__item") > -1) {
    target = target.parentNode;
    flag = true;
  }
  if (flag) {
    event.preventDefault();
    event.stopPropagation();
    state.contentmenuX = event.clientX;
    state.contentmenuY = event.clientY;
    state.tagName = target.getAttribute("aria-controls").slice(5);
    state.contextmenuFlag = true;
  }
};
/**
 * @description 右键菜单的 row-click 事件
 * @param {String} command 事件类型
 */
const contextmenuClick = (command: string) => {
  handleControlItemClick(command, state.tagName);
};
/**
 * @description 接收点击关闭控制上选项的事件
 * @param {String} command 事件类型
 * @param {String} tagName tab 名称
 */
const handleControlItemClick = (command: string, tagName: string) => {
  if (tagName) state.contextmenuFlag = false;

  switch (command) {
    case "refresh":
      router.push({ name: "refresh" });
      break;
    case "left":
      pageStore.closeLeft(tagName);
      break;
    case "right":
      pageStore.closeRight(tagName);
      break;
    case "other":
      pageStore.closeOther(tagName);
      break;
    case "all":
      pageStore.closeAll();
      break;
    default:
      ElMessage.error("无效的操作");
      break;
  }
};
/**
 * @description 接收点击 tab 标签的事件
 * @param {object} tab 标签
 * @param {object} event 事件
 */
const handleClick = (tab: { paneName: string }) => {
  debugger;
  // 找到点击的页面在 tag 列表里是哪个
  const page = pageStore.opened.find((page) => page.fullPath === tab.paneName);
  if (page) {
    const { name, params, query } = page;
    router.push({ name, params, query });
  }
};
/**
 * @description 点击 tab 上的删除按钮触发这里
 * @param {String} tagName tab 名称
 */
const handleTabRemove = (tagName: string) => {
  pageStore.close(tagName);
};

onMounted(() => {
  const el = document.querySelectorAll(".multiple-page-sort .el-tabs__nav")[0];
  Sortable.create(<HTMLElement>el, {
    onEnd: (evt) => {
      const { oldIndex, newIndex } = evt;
      pageStore.openedSort(<number>oldIndex, <number>newIndex);
    },
  });
});
</script>
