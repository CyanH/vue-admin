<template>
  <div style="display: inline-block">
    <el-dialog v-model="dialog" :close-on-click-modal="false" :before-close="cancel" title="修改密码" append-to-body width="500px" @close="cancel">
      <el-form ref="ruleFormRef" :model="form" :rules="rules" label-width="88px">
        <el-form-item label="旧密码" prop="oldPass">
          <el-input v-model="form.oldPass" type="password" auto-complete="on" style="width: 370px;" />
        </el-form-item>
        <el-form-item label="新密码" prop="newPass">
          <el-input v-model="form.newPass" type="password" auto-complete="on" style="width: 370px;" />
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPass">
          <el-input v-model="form.confirmPass" type="password" auto-complete="on" style="width: 370px;" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="text" style="color: #000" @click="cancel">取消</el-button>
          <el-button :loading="loading" color="#000" style="color: #fff" @click="doSubmit(ruleFormRef)">确认</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from "vue";
import { ElNotification } from "element-plus";
import type { ElForm } from "element-plus";
import { useUserStore } from "@/store";
import { updatePass } from "@/api/system/user";
type FormInstance = InstanceType<typeof ElForm>;

export default defineComponent({
  setup() {
    const userStore = useUserStore();
    const ruleFormRef = ref<FormInstance>();
    const loading = ref(false);
    const dialog = ref(false);

    let form = reactive({
      oldPass: "",
      newPass: "",
      confirmPass: "",
    });

    const confirmPass = (rule: any, value: string, callback: any) => {
      if (value) {
        if (form.newPass !== value) {
          callback(new Error("两次输入的密码不一致"));
        } else {
          callback();
        }
      } else {
        callback(new Error("请再次输入密码"));
      }
    };

    const rules = reactive({
      oldPass: [{ required: true, message: "请输入旧密码", trigger: "blur" }],
      newPass: [
        { required: true, message: "请输入新密码", trigger: "blur" },
        {
          min: 6,
          max: 20,
          message: "长度在 6 到 20 个字符",
          trigger: "blur",
        },
      ],
      confirmPass: [
        { required: true, validator: confirmPass, trigger: "blur" },
      ],
    });

    const cancel = () => {
      resetForm(ruleFormRef.value);
    };
    const doSubmit = (formEl: FormInstance | undefined) => {
      if (!formEl) return;
      formEl.validate((valid) => {
        if (valid) {
          loading.value = true;
          updatePass(form)
            .then((res) => {
              resetForm(ruleFormRef.value);
              ElNotification({
                title: "密码修改成功，请重新登录",
                type: "success",
                duration: 1500,
              });
              setTimeout(() => {
                userStore.logOut().then(() => {
                  location.reload(); // 为了重新实例化vue-router对象 避免bug
                });
              }, 1500);
            })
            .catch((err) => {
              loading.value = false;
              console.log(err.response.data.message);
            });
        } else {
          return false;
        }
      });
    };
    const resetForm = (formEl: FormInstance | undefined) => {
      dialog.value = false;
      if (formEl) formEl.resetFields();
      form = { oldPass: "", newPass: "", confirmPass: "" };
    };

    return {
      ruleFormRef,
      loading,
      dialog,
      form,
      rules,
      cancel,
      doSubmit,
    };
  },
});
</script>

