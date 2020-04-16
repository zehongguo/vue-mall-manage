<template>
  <el-dialog
    title="编辑用户"
    :visible.sync="compDialogVisible"
    width="40%"
    @close="$refs.editUserFormRef.resetFields();"
    @open="getUserDetailById"
    :destroy-on-close="true"
  >
    <el-form ref="editUserFormRef" label-width="70px" :model="userForm" :rules="userRules">
      <el-form-item label="用户名" prop="username">
        <el-input v-model="userForm.username" :disabled="true" clearable></el-input>
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
import { getDetailById, editUserById } from "network/user.js";
export default {
  name: "AddDialong",
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    editId: {
      type: Number,
      default: 0
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
        email: "",
        mobile: ""
      },
      userRules: {
        username: [
          { required: true, message: "请输入账号", trigger: "blur" },
          { min: 3, max: 10, message: "长度在 3 到 10 个字符", trigger: "blur" }
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
    async getUserDetailById() {
      const { data, meta } = await getDetailById(this.editId);
      if (meta.status !== 200) {
        return this.$message.error("获取用户信息失败," + meta.msg);
      }
      this.userForm.username = data.username;
      this.userForm.email = data.email;
      this.userForm.mobile = data.mobile;
    },
    submitUserForm() {
      this.$refs.editUserFormRef.validate(async valid => {
        if (!valid) {
          return;
        }

        const { meta } = await editUserById(
          this.editId,
          this.userForm.email,
          this.userForm.mobile
        );
        if (meta.status !== 200) {
          return this.$message.error("编辑用户失败" + meta.msg);
        }
        this.$message.closeAll();
        this.$message.success("编辑用户成功");
        this.$emit("editUserSuccess");
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