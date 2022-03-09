<template>
  <div style="display: inline-block;">
    <el-dialog v-model="dialog" :close-on-click-modal="false" :before-close="cancel" title="修改邮箱" append-to-body width="475px" @close="cancel">
      <el-form ref="ruleFormRef" :model="form" :rules="rules" label-width="88px">
        <el-form-item label="新邮箱" prop="email">
          <el-input v-model="form.email" auto-complete="on" style="width: 200px;" />
          <el-button style="margin-left:5px" :loading="codeLoading" :disabled="isDisabled" @click="sendCode">{{ buttonName }}</el-button>
        </el-form-item>
        <el-form-item label="验证码" prop="code">
          <el-input v-model="form.code" style="width: 320px;" />
        </el-form-item>
        <el-form-item label="当前密码" prop="pass">
          <el-input v-model="form.pass" type="password" style="width: 320px;" />
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
import { ElMessage, ElNotification } from "element-plus";
import type { ElForm } from "element-plus";
import { useUserStore } from "@/store";
import { validEmail } from "@/utils/validate";
import { updateEmail } from "@/api/system/user";
import { resetEmail } from "@/api/system/code";
type FormInstance = InstanceType<typeof ElForm>;

export default defineComponent({
  props: {
    email: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const ruleFormRef = ref<FormInstance>();
    const loading = ref(false);
    const dialog = ref(false);
    const codeLoading = ref(false);
    const buttonName = ref("获取验证码");
    const isDisabled = ref(false);
    const time = ref(60);
    const timer = ref();
    const userStore = useUserStore();

    let form = reactive({
      pass: "",
      email: "",
      code: "",
    });

    const validMail = (rule: any, value: string | null, callback: any) => {
      if (value === "" || value === null) {
        callback(new Error("新邮箱不能为空"));
      } else if (value === props.email) {
        callback(new Error("新邮箱不能与旧邮箱相同"));
      } else if (validEmail(value)) {
        callback();
      } else {
        callback(new Error("邮箱格式错误"));
      }
    };

    const rules = reactive({
      pass: [{ required: true, message: "当前密码不能为空", trigger: "blur" }],
      email: [{ required: true, validator: validMail, trigger: "blur" }],
      code: [{ required: true, message: "验证码不能为空", trigger: "blur" }],
    });

    const cancel = () => {
      resetForm(ruleFormRef.value);
    };

    const sendCode = () => {
      if (form.email && form.email !== props.email) {
        codeLoading.value = true;
        buttonName.value = "验证码发送中";

        resetEmail(form.email)
          .then((res) => {
            ElMessage({
              showClose: true,
              message: "发送成功，验证码有效期5分钟",
              type: "success",
            });
            codeLoading.value = false;
            isDisabled.value = true;
            buttonName.value = time.value-- + "秒后重新发送";
            timer.value = window.setInterval(() => {
              buttonName.value = time.value + "秒后重新发送";
              --time.value;
              if (time.value < 0) {
                buttonName.value = "重新发送";
                time.value = 60;
                isDisabled.value = false;
                window.clearInterval(timer.value);
              }
            }, 1000);
          })
          .catch((err) => {
            resetForm(ruleFormRef.value);
            codeLoading.value = false;
            console.log(err.response.data.message);
          });
      }
    };
    const doSubmit = (formEl: FormInstance | undefined) => {
      if (!formEl) return;
      formEl.validate((valid) => {
        if (valid) {
          loading.value = true;
          updateEmail(form)
            .then(() => {
              resetForm(ruleFormRef.value);
              ElNotification({
                title: "邮箱修改成功",
                type: "success",
                duration: 1500,
              });
              userStore.getInfo();
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
      window.clearInterval(timer.value);
      time.value = 60;
      buttonName.value = "获取验证码";
      isDisabled.value = false;
      form = { pass: "", email: "", code: "" };
    };

    return {
      ruleFormRef,
      loading,
      dialog,
      codeLoading,
      buttonName,
      isDisabled,
      form,
      rules,
      cancel,
      sendCode,
      doSubmit,
    };
  },
});
</script>

