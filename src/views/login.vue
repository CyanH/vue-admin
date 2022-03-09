<template>
  <div class="login" :style="'background-image:url(' + Background + ');'">
    <el-form
      ref="ruleFormRef"
      :model="loginForm"
      :rules="loginRules"
      label-position="left"
      label-width="0px"
      class="login-form"
    >
      <h3 class="title">后台管理系统</h3>
      <el-form-item prop="username">
        <el-input
          v-model="loginForm.username"
          type="text"
          auto-complete="off"
          placeholder="账号"
        >
          <template #prefix>
            <svg-icon name="user" class="el-input__icon input-icon" />
          </template>
        </el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input
          v-model="loginForm.password"
          type="password"
          auto-complete="off"
          placeholder="密码"
          @keyup.enter="handleLogin(ruleFormRef)"
        >
          <template #prefix>
            <svg-icon name="password" class="el-input__icon input-icon" />
          </template>
        </el-input>
      </el-form-item>
      <el-form-item prop="code">
        <el-input
          v-model="loginForm.code"
          auto-complete="off"
          placeholder="验证码"
          style="width: 63%"
          @keyup.enter="handleLogin(ruleFormRef)"
        >
          <template #prefix>
            <svg-icon name="validCode" class="el-input__icon input-icon" />
          </template>
        </el-input>
        <div class="login-code">
          <img :src="codeUrl" @click="getCode" />
        </div>
      </el-form-item>
      <el-form-item style="width: 100%">
        <el-button
          :loading="loading"
          type="primary"
          style="width: 100%"
          @click.prevent="handleLogin(ruleFormRef)"
        >
          <span v-if="!loading">登 录</span>
          <span v-else>登 录 中...</span>
        </el-button>
      </el-form-item>
    </el-form>
    <!--  底部  -->
    <div class="el-login-footer">
      <span> 金土信息科技有限公司 </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ElForm } from "element-plus";
type FormInstance = InstanceType<typeof ElForm>;
import { ref, reactive, watch } from "vue";
import { getCodeImg } from "@/api/login";
import { useUserStore } from "@/store";
import { useRoute, useRouter } from "vue-router";
import { encrypt } from "@/utils/rsaEncrypt";
import Background from "@/assets/images/background.jpg";

let codeUrl = ref("");
let ruleFormRef = ref<FormInstance>();
let loginForm = reactive({
  username: "admin",
  password: "123456",
  code: "",
  uuid: "",
});
const loginRules = reactive({
  username: [{ required: true, trigger: "blur", message: "用户名不能为空" }],
  password: [{ required: true, trigger: "blur", message: "密码不能为空" }],
  code: [{ required: true, trigger: "change", message: "验证码不能为空" }],
});
let loading = ref(false);
const redirect = ref();
const route = useRoute();
const router = useRouter();

const getCode = () => {
  getCodeImg().then((res: any) => {
    codeUrl.value = res.img;
    loginForm.uuid = res.uuid;
  });
};

const handleLogin = (formEl: FormInstance) => {
  formEl.validate((valid) => {
    const user = {
      username: loginForm.username,
      password: encrypt(loginForm.password),
      code: loginForm.code,
      uuid: loginForm.uuid,
    };

    if (valid) {
      loading.value = true;

      useUserStore()
        .login(user)
        .then(() => {
          loading.value = false;
          router.push({ path: redirect.value || "/" });
        })
        .catch(() => {
          loading.value = false;
          getCode();
        });
    } else {
      console.log("error submit!!");
      return false;
    }
  });
};

getCode();
</script>

<style rel="stylesheet/scss" lang="scss" scope>
.login {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  background-size: cover;
}
.title {
  margin: 0 auto 30px auto;
  text-align: center;
  color: #707070;
}

.login-form {
  border-radius: 6px;
  background: #ffffff;
  width: 335px;
  padding: 25px 25px 5px 25px;
  .el-input {
    height: 38px;
    input {
      height: 38px;
    }
  }
  .input-icon {
    height: 39px;
    width: 14px;
    margin-left: 2px;
  }
}
.login-tip {
  font-size: 13px;
  text-align: center;
  color: #bfbfbf;
}
.login-code {
  width: 33%;
  display: inline-block;
  height: 38px;
  img {
    cursor: pointer;
    vertical-align: middle;
  }
}

.el-login-footer {
  height: 40px;
  line-height: 40px;
  position: fixed;
  bottom: 0;
  width: 100%;
  text-align: center;
  color: #fff;
  font-family: Arial, serif;
  font-size: 12px;
  letter-spacing: 1px;
}
</style>
