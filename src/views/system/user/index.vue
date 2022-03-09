<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!--侧边部门数据-->
      <el-col :xs="9" :sm="6" :md="5" :lg="4" :xl="4">
        <div class="head-container">
          <el-input v-model="deptName" clearable size="small" placeholder="输入部门名称搜索" prefix-icon="el-icon-search" class="filter-item" @input="getDeptDatas" />
        </div>
        <el-tree :data="deptDatas" :load="getDeptDatas" :props="defaultProps" :expand-on-click-node="false" lazy @node-click="handleNodeClick" />
      </el-col>

    </el-row>
  </div>
</template>

<script setup lang="ts">
import crudUser from "@/api/system/user";
import { isvalidPhone } from "@/utils/validate";
import { getDepts, getDeptSuperior } from "@/api/system/dept";
import { getAll, getLevel } from "@/api/system/role";
import { getAllJob } from "@/api/system/job";
import CRUD, { presenter, header, form, crud } from "@crud/crud";
import rrOperation from "@crud/RR.operation";
import crudOperation from "@crud/CRUD.operation";
import udOperation from "@crud/UD.operation";
import pagination from "@crud/Pagination";
import DateRangePicker from "@/components/DateRangePicker";
import Treeselect from "@riophae/vue-treeselect";
import { mapGetters } from "vuex";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import { LOAD_CHILDREN_OPTIONS } from "@riophae/vue-treeselect";
let userRoles = [];
let userJobs = [];
const defaultForm = {
  id: null,
  username: null,
  nickName: null,
  gender: "男",
  email: null,
  enabled: "false",
  roles: [],
  jobs: [],
  dept: { id: null },
  phone: null,
};
export default {
  name: "User",
  components: {
    Treeselect,
    crudOperation,
    rrOperation,
    udOperation,
    pagination,
    DateRangePicker,
  },
  cruds() {
    return CRUD({
      title: "用户",
      url: "api/users",
      crudMethod: { ...crudUser },
    });
  },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  // 数据字典
  dicts: ["user_status"],
  data() {
    // 自定义验证
    const validPhone = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请输入电话号码"));
      } else if (!isvalidPhone(value)) {
        callback(new Error("请输入正确的11位手机号码"));
      } else {
        callback();
      }
    };
    return {
      height: document.documentElement.clientHeight - 180 + "px;",
      deptName: "",
      depts: [],
      deptDatas: [],
      jobs: [],
      level: 3,
      roles: [],
      jobDatas: [],
      roleDatas: [], // 多选时使用
      defaultProps: { children: "children", label: "name", isLeaf: "leaf" },
      permission: {
        add: ["admin", "user:add"],
        edit: ["admin", "user:edit"],
        del: ["admin", "user:del"],
      },
      enabledTypeOptions: [
        { key: "true", display_name: "激活" },
        { key: "false", display_name: "锁定" },
      ],
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            min: 2,
            max: 20,
            message: "长度在 2 到 20 个字符",
            trigger: "blur",
          },
        ],
        nickName: [
          { required: true, message: "请输入用户昵称", trigger: "blur" },
          {
            min: 2,
            max: 20,
            message: "长度在 2 到 20 个字符",
            trigger: "blur",
          },
        ],
        email: [
          { required: true, message: "请输入邮箱地址", trigger: "blur" },
          { type: "email", message: "请输入正确的邮箱地址", trigger: "blur" },
        ],
        phone: [{ required: true, trigger: "blur", validator: validPhone }],
      },
    };
  },
  computed: {
    ...mapGetters(["user"]),
  },
  created() {
    this.crud.msg.add = "新增成功，默认密码：123456";
  },
  mounted: function () {
    const that = this;
    window.onresize = function temp() {
      that.height = document.documentElement.clientHeight - 180 + "px;";
    };
  },
  methods: {
    changeRole(value) {
      userRoles = [];
      value.forEach(function (data, index) {
        const role = { id: data };
        userRoles.push(role);
      });
    },
    changeJob(value) {
      userJobs = [];
      value.forEach(function (data, index) {
        const job = { id: data };
        userJobs.push(job);
      });
    },
    deleteTag(value) {
      userRoles.forEach(function (data, index) {
        if (data.id === value) {
          userRoles.splice(index, value);
        }
      });
    },
    // 新增与编辑前做的操作
    [CRUD.HOOK.afterToCU](crud, form) {
      this.getRoles();
      if (form.id == null) {
        this.getDepts();
      } else {
        this.getSupDepts(form.dept.id);
      }
      this.getRoleLevel();
      this.getJobs();
      form.enabled = form.enabled.toString();
    },
    // 新增前将多选的值设置为空
    [CRUD.HOOK.beforeToAdd]() {
      this.jobDatas = [];
      this.roleDatas = [];
    },
    // 初始化编辑时候的角色与岗位
    [CRUD.HOOK.beforeToEdit](crud, form) {
      this.getJobs(this.form.dept.id);
      this.jobDatas = [];
      this.roleDatas = [];
      userRoles = [];
      userJobs = [];
      const _this = this;
      form.roles.forEach(function (role, index) {
        _this.roleDatas.push(role.id);
        const rol = { id: role.id };
        userRoles.push(rol);
      });
      form.jobs.forEach(function (job, index) {
        _this.jobDatas.push(job.id);
        const data = { id: job.id };
        userJobs.push(data);
      });
    },
    // 提交前做的操作
    [CRUD.HOOK.afterValidateCU](crud) {
      if (!crud.form.dept.id) {
        this.$message({
          message: "部门不能为空",
          type: "warning",
        });
        return false;
      } else if (this.jobDatas.length === 0) {
        this.$message({
          message: "岗位不能为空",
          type: "warning",
        });
        return false;
      } else if (this.roleDatas.length === 0) {
        this.$message({
          message: "角色不能为空",
          type: "warning",
        });
        return false;
      }
      crud.form.roles = userRoles;
      crud.form.jobs = userJobs;
      return true;
    },
    // 获取左侧部门数据
    getDeptDatas(node, resolve) {
      const sort = "id,desc";
      const params = { sort: sort };
      if (typeof node !== "object") {
        if (node) {
          params["name"] = node;
        }
      } else if (node.level !== 0) {
        params["pid"] = node.data.id;
      }
      setTimeout(() => {
        getDepts(params).then((res) => {
          if (resolve) {
            resolve(res.content);
          } else {
            this.deptDatas = res.content;
          }
        });
      }, 100);
    },
    getDepts() {
      getDepts({ enabled: true }).then((res) => {
        this.depts = res.content.map(function (obj) {
          if (obj.hasChildren) {
            obj.children = null;
          }
          return obj;
        });
      });
    },
    getSupDepts(deptId) {
      getDeptSuperior(deptId).then((res) => {
        const date = res.content;
        this.buildDepts(date);
        this.depts = date;
      });
    },
    buildDepts(depts) {
      depts.forEach((data) => {
        if (data.children) {
          this.buildDepts(data.children);
        }
        if (data.hasChildren && !data.children) {
          data.children = null;
        }
      });
    },
    // 获取弹窗内部门数据
    loadDepts({ action, parentNode, callback }) {
      if (action === LOAD_CHILDREN_OPTIONS) {
        getDepts({ enabled: true, pid: parentNode.id }).then((res) => {
          parentNode.children = res.content.map(function (obj) {
            if (obj.hasChildren) {
              obj.children = null;
            }
            return obj;
          });
          setTimeout(() => {
            callback();
          }, 200);
        });
      }
    },
    // 切换部门
    handleNodeClick(data) {
      if (data.pid === 0) {
        this.query.deptId = null;
      } else {
        this.query.deptId = data.id;
      }
      this.crud.toQuery();
    },
    // 改变状态
    changeEnabled(data, val) {
      this.$confirm(
        '此操作将 "' +
          this.dict.label.user_status[val] +
          '" ' +
          data.username +
          ", 是否继续？",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(() => {
          crudUser
            .edit(data)
            .then((res) => {
              this.crud.notify(
                this.dict.label.user_status[val] + "成功",
                CRUD.NOTIFICATION_TYPE.SUCCESS
              );
            })
            .catch(() => {
              data.enabled = !data.enabled;
            });
        })
        .catch(() => {
          data.enabled = !data.enabled;
        });
    },
    // 获取弹窗内角色数据
    getRoles() {
      getAll()
        .then((res) => {
          this.roles = res;
        })
        .catch(() => {});
    },
    // 获取弹窗内岗位数据
    getJobs() {
      getAllJob()
        .then((res) => {
          this.jobs = res.content;
        })
        .catch(() => {});
    },
    // 获取权限级别
    getRoleLevel() {
      getLevel()
        .then((res) => {
          this.level = res.level;
        })
        .catch(() => {});
    },
    checkboxT(row, rowIndex) {
      return row.id !== this.user.id;
    },
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
::v-deep .vue-treeselect__control,
::v-deep .vue-treeselect__placeholder,
::v-deep .vue-treeselect__single-value {
  height: 30px;
  line-height: 30px;
}
</style>
