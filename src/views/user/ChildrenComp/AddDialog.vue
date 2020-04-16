<template>
  <el-dialog
    title="添加用户"
    :visible.sync="compDialogVisible"
    width="40%"
    @close="$refs.addUserFormRef.resetFields();"
    :destroy-on-close="true"
  >
    <el-form ref="addUserFormRef" label-width="70px" :model="userForm" :rules="userRules">
      <el-form-item label="用户名" prop="username">
        <el-input v-model="userForm.username" clearable></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="userForm.password" clearable></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="userForm.email" clearable></el-input>
      </el-form-item>
      <el-form-item label="手机" prop="mobile">
        <el-input v-model="userForm.mobile" clearable></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogClose ">取 消</el-button>
      <el-button type="primary" @click="submitUserForm">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { addUser } from "network/user.js";
export default {
  name: "AddDialong",
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    }
  },

  data() {
    // 邮箱验证规则
    let checkEmail = (rule, value, callback) => {
      // eslint-disable-next-line no-useless-escape
      let myreg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
      if (myreg.test(value)) {
        callback();
      } else {
        callback(new Error("输入邮箱不符合规则"));
      }
    };
    // 手机验证规则
    let checkMobile = (rule, value, callback) => {
      // eslint-disable-next-line no-useless-escape
      let myreg = /^1[3456789]\d{9}$/;
      if (myreg.test(value)) {
        callback();
      } else {
        callback(new Error("请输入正确的手机号码"));
      }
    };
    return {
      userForm: {
        username: "",
        password: "",
        email: "",
        mobile: ""
      },
      userRules: {
        username: [
          { required: true, message: "请输入账号", trigger: "blur" },
          { min: 3, max: 10, message: "长度在 3 到 10 个字符", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6, max: 10, message: "长度在 6 到 10 个字符", trigger: "blur" }
        ],
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { validator: checkEmail, trigger: "blur" }
        ],
        mobile: [
          { required: true, message: "请输入手机号码", trigger: "blur" },
          { validator: checkMobile, trigger: "blur" }
        ]
      }
    };
  },
  computed: {
    compDialogVisible: {
      get() {
        return this.dialogVisible;
      },
      set() {
        this.dialogClose();
      }
    }
  },
  methods: {
    dialogClose() {
      this.$emit("update:dialogVisible", false);
    },
    submitUserForm() {
      this.$refs.addUserFormRef.validate(async valid => {
        if (!valid) {
          return;
        }
        const { meta } = await addUser(this.userForm);
        if (meta.status !== 201) {
          return this.$message.error("添加用户失败" + meta.msg);
        }
        this.$message.closeAll();
        this.$message.success("创建用户成功");
        this.$emit("addUserSuccess");
        this.dialogClose();
      });
    }
  }
};
</script>

<style lang='scss' scoped>
.el-input {
  max-width: 500px;
}
</style>