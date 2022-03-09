<template>
  <div class="contextmenu" v-show="flag" :style="style">
    <slot />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, getCurrentInstance } from "vue";

export default defineComponent({
  name: "contextmenu",
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    x: {
      type: Number,
      default: 0,
    },
    y: {
      type: Number,
      default: 0,
    },
  },
  emits: ["update:visible"],
  setup(props, ctx) {
    const internalInstance = getCurrentInstance();
    let proxy: any;
    if (internalInstance) {
      proxy = internalInstance.proxy;
    }
    // 将菜单放置到body下
    const body = document.querySelector("body");
    if (body && proxy) {
      body.appendChild(proxy.$el);
    }

    const flag = computed(() => {
      get: () => {
        if (props.visible) {
          // 注册全局监听事件 [ 目前只考虑鼠标解除触发 ]
          window.addEventListener("mousedown", watchContextmenu);
        }
        return props.visible;
      };
      set: (newVal: boolean) => {
        ctx.emit("update:visible", newVal);
      };
    });

    const style = computed(() => {
      return {
        left: props.x + "px",
        top: props.y + "px",
        display: props.visible ? "block" : "none ",
      };
    });

    const watchContextmenu = (event: { target: any; button: number }) => {
      if (!proxy.$el.contains(event.target) || event.button !== 0)
        flag.value = false;
      window.removeEventListener("mousedown", watchContextmenu);
    };

    return {
      flag,
      style,
    };
  },
});
</script>

<style>
.contextmenu {
  position: absolute;
  padding: 5px 0;
  z-index: 2018;
  background: #fff;
  border: 1px solid #cfd7e5;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}
</style>
