<template>
  <el-dropdown size="small" class="mr">
    <span class="btn-text">{{
      userStore.user.nickName ? `你好 ${userStore.user.nickName}` : "未登录"
    }}</span>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item>
          <i class="fa fa-user" />
          个人中心
        </el-dropdown-item>

        <el-dropdown-item @click="logOut">
          <i class="fa fa-power-off" />
          注销
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useUserStore } from "@/store";

export default defineComponent({
  setup() {
    const userStore = useUserStore();

    const logOut = () => {
      userStore.logOut().then(() => {
        location.reload();
      });
    };

    return { logOut, userStore };
  },
});
</script>
