<template>
  <div class="login">
    <div class="login-box">
      <el-form class="login-form" ref="loginFormRef" :model="loginForm" :rules="rules">
        <el-form-item prop="username">
          <el-input prefix-icon="el-icon-user" v-model="loginForm.username" class="form-input"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            type="password"
            prefix-icon="el-icon-lock"
            v-model="loginForm.password"
            class="form-input"
          ></el-input>
        </el-form-item>
        <el-button
          @click="submitForm"
          type="primary"
          v-loading.fullscreen.lock="fullscreenLoading"
        >登录</el-button>
        <el-button type="info" @click="resetForm">重置</el-button>
      </el-form>
    </div>
  </div>
</template>

<script>
import { toLogin } from "network/login";
export default {
  name: "Login",
  data() {
    return {
      loginForm: {
        username: "admin",
        password: ""
      },
      rules: {
        username: [
          { required: true, message: "请输入账号", trigger: "blur" },
          { min: 3, max: 10, message: "长度在 3 到 10 个字符", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6, max: 10, message: "长度在 6 到 10 个字符", trigger: "blur" }
        ]
      },
      fullscreenLoading: false
    };
  },
  methods: {
    submitForm() {
      // 预验证
      this.$refs.loginFormRef.validate(async valid => {
        if (!valid) {
          return;
        }
        try {
          // 发送请求并获取数据
          this.fullscreenLoading = true;
          const { data, meta } = await toLogin(
            this.loginForm.username,
            this.loginForm.password
          );
          if (meta.status == 200) {
            this.$message({
              message: `登录成功,欢迎${data.username}到来`,
              type: "success"
            });

            // 将token储存到浏览器
            window.sessionStorage.setItem("token", data.token);

            // 路由跳转
            this.$router.push({
              path: "/home",
              query: {
                data
              }
            });
          } else {
            this.$message.error("登录失败," + meta.msg);
          }
        } catch (error) {
          this.$message.error("网络请求超时");
        } finally {
          this.fullscreenLoading = false;
        }
      });
    },
    // 重置表单
    resetForm() {
      this.$refs.loginFormRef.resetFields();
    }
  },

  components: {}
};
</script>

<style lang="scss" scoped>
.login {
  background: linear-gradient(180deg, #1e90ff, #7bed9f);
  min-height: 100vh;
  .login-box {
    width: 450px;
    height: 300px;
    background-color: white;

    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);

    border-radius: 20px;
    box-shadow: 0px 0px 10px #eee;
    .login-form {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      .form-input {
        width: 300px;
      }
    }
  }
}
</style>
