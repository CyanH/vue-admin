<template>
  <div class="page container-component">
    <div class="container-full">
      <div class="container-full__body">
        <el-row :gutter="20">
          <el-col :xs="24" :sm="24" :md="8" :lg="6" :xl="5" style="margin-bottom: 10px">
            <el-card class="box-card">
              <template #header>
                <div class="clearfix">
                  <span>个人信息</span>
                </div>
              </template>
              <div>
                <div style="text-align: center">
                  <div class="el-upload">
                    <img :src="userStore.avatarName ? baseUrl + '/avatar/' + userStore.avatarName : Avatar" title="点击上传头像" class="avatar" @click="toggleShow">
                    <myUpload v-model="show" :headers="headers" :url="updateAvatarApi" @crop-upload-success="cropUploadSuccess" />
                  </div>
                </div>
                <ul class="user-info">
                  <li>
                    <div style="height: 100%">
                      <svg-icon name="login" class="svg-icon" /> 登录账号<div class="user-right">{{ userStore.user.username }}</div>
                    </div>
                  </li>
                  <li>
                    <svg-icon name="user1" class="svg-icon" /> 用户昵称 <div class="user-right">{{ userStore.user.nickName }}</div>
                  </li>
                  <li>
                    <svg-icon name="dept" class="svg-icon" /> 所属部门 <div class="user-right"> {{ userStore.user.dept.name }}</div>
                  </li>
                  <li>
                    <svg-icon name="phone" class="svg-icon" /> 手机号码 <div class="user-right">{{ userStore.user.phone }}</div>
                  </li>
                  <li>
                    <svg-icon name="email" class="svg-icon" /> 用户邮箱 <div class="user-right">{{ userStore.user.email }}</div>
                  </li>
                  <li>
                    <svg-icon name="anq" class="svg-icon" /> 安全设置
                    <div class="user-right">
                      <a @click="passRef.dialog = true">修改密码</a>
                      <a @click="emailRef.dialog = true" style="padding-left:5px">修改邮箱</a>
                    </div>
                  </li>
                </ul>
              </div>
            </el-card>
          </el-col>
          <el-col :xs="24" :sm="24" :md="16" :lg="18" :xl="19">
            <!--    用户资料    -->
            <el-card class="box-card">
              <el-tabs v-model="activeName" @tab-click="handleClick">
                <el-tab-pane label="用户资料" name="first">
                  <el-form ref="ruleFormRef" :model="form" :rules="rules" style="margin-top: 10px;" label-width="65px">
                    <el-form-item label="昵称" prop="nickName">
                      <el-input v-model="form.nickName" style="width: 35%" />
                      <span style="color: #C0C0C0;margin-left: 10px;">用户昵称不作为登录使用</span>
                    </el-form-item>
                    <el-form-item label="手机号" prop="phone">
                      <el-input v-model="form.phone" style="width: 35%;" />
                      <span style="color: #C0C0C0;margin-left: 10px;">手机号码不能重复</span>
                    </el-form-item>
                    <el-form-item label="性别">
                      <el-radio-group v-model="form.gender" style="width: 178px">
                        <el-radio label="男">男</el-radio>
                        <el-radio label="女">女</el-radio>
                      </el-radio-group>
                    </el-form-item>
                    <el-form-item label="">
                      <el-button :loading="saveLoading" color="#000" style="color: #fff" @click="doSubmit(ruleFormRef)">保存配置</el-button>
                    </el-form-item>
                  </el-form>
                </el-tab-pane>
                <!--    操作日志    -->
                <el-tab-pane label="操作日志" name="second">
                  <el-table v-loading="loading" :data="data" style="width: 100%;">
                    <el-table-column prop="description" label="行为" />
                    <el-table-column prop="requestIp" label="IP" />
                    <el-table-column :show-overflow-tooltip="true" prop="address" label="IP来源" />
                    <el-table-column prop="browser" label="浏览器" />
                    <el-table-column prop="time" label="请求耗时" align="center">
                      <template #default="scope">
                        <el-tag v-if="scope.row.time <= 300">{{ scope.row.time }}ms</el-tag>
                        <el-tag v-else-if="scope.row.time <= 1000" type="warning">{{ scope.row.time }}ms</el-tag>
                        <el-tag v-else type="danger">{{ scope.row.time }}ms</el-tag>
                      </template>
                    </el-table-column>
                    <el-table-column align="right">
                      <template #header>
                        <div style="display:inline-block;float: right;cursor: pointer" @click="init">创建日期<i class="el-icon-refresh" style="margin-left: 40px" /></div>
                      </template>
                      <template #default="scope">
                        <span>{{ scope.row.createTime }}</span>
                      </template>
                    </el-table-column>
                  </el-table>
                  <!--分页组件-->
                  <el-pagination :total="total" :current-page="page + 1" style="margin-top: 8px;" layout="total, prev, pager, next, sizes" @size-change="sizeChange" @current-change="pageChange" />
                </el-tab-pane>
              </el-tabs>
            </el-card>
          </el-col>
        </el-row>
        <updateEmail ref="emailRef" :email="userStore.user.email" />
        <updatePass ref="passRef" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from "vue";
import type { ElForm } from "element-plus";
type FormInstance = InstanceType<typeof ElForm>;
import myUpload from "vue-image-crop-upload";
import updatePass from "./center/updatePass.vue";
import updateEmail from "./center/updateEmail.vue";
import { useUserStore } from "@/store";
import useCrud from "@/hooks/crud";
import { getToken } from "@/utils/auth";
import { isvalidPhone } from "@/utils/validate";
import { editUser } from "@/api/system/user";
import { initData } from "@/api/data";
import Avatar from "@/assets/images/avatar.png";

const baseUrl = <string>import.meta.env.BASE_URL;
const updateAvatarApi = "/api/users/updateAvatar";
const userStore = useUserStore();
//mixins
const {
  data,
  page,
  total,
  loading,
  setUrl,
  init,
  pageChange,
  sizeChange,
  editSuccessNotify,
} = useCrud();
setUrl("api/logs/user");

const ruleFormRef = ref<FormInstance>();
const emailRef = ref();
const passRef = ref();

const show = ref(false);
const activeName = ref("first");
const saveLoading = ref(false);
const headers = reactive({
  Authorization: getToken(),
});
const form = reactive({
  id: userStore.user.id,
  nickName: userStore.user.nickName,
  gender: userStore.user.gender,
  phone: userStore.user.phone,
});

// 自定义验证
const validPhone = (rule: any, value: string, callback: any) => {
  if (!value) {
    callback(new Error("请输入电话号码"));
  } else if (!isvalidPhone(value)) {
    callback(new Error("请输入正确的11位手机号码"));
  } else {
    callback();
  }
};

const rules = reactive({
  nickName: [
    { required: true, message: "请输入用户昵称", trigger: "blur" },
    {
      min: 2,
      max: 20,
      message: "长度在 2 到 20 个字符",
      trigger: "blur",
    },
  ],
  phone: [{ required: true, trigger: "blur", validator: validPhone }],
});

const toggleShow = () => {
  show.value = !show.value;
};
const handleClick = (tab: { paneName: string }) => {
  if (tab.paneName === "second") {
    init();
  }
};

const cropUploadSuccess = () => {
  userStore.getInfo();
};

const doSubmit = (formEl: FormInstance | undefined) => {
  if (formEl) {
    formEl.validate((valid) => {
      if (valid) {
        saveLoading.value = true;
        editUser(form)
          .then(() => {
            editSuccessNotify();
            userStore.getInfo();
            saveLoading.value = false;
          })
          .catch(() => {
            saveLoading.value = false;
          });
      }
    });
  }
};
</script>

<style rel="stylesheet/scss" lang="scss">
.avatar {
  width: 120px;
  height: 120px;
  border-radius: 50%;
}
.user-info {
  padding-left: 0;
  list-style: none;
  li {
    border-bottom: 1px solid #f0f3f4;
    padding: 11px 0;
    font-size: 13px;
  }
  .user-right {
    float: right;
    a {
      color: #317ef3;
    }
  }
}

.svg-icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
</style>
