<template>
  <el-container class="home-container">
    <!--头部信息-->
    <el-header>
      <img src="~assets/images/logo.png" alt />
      <el-button @click="logout">退出登录</el-button>
    </el-header>
    <el-container>
      <!--侧边栏-->
      <side-bar />
      <el-container>
        <!--主要内容-->
        <el-main>
          <router-view></router-view>
        </el-main>
        <!--页脚-->
        <el-footer height="20px">copyright@gzh</el-footer>
      </el-container>
    </el-container>
  </el-container>
</template>

<script>
import SideBar from "./SideBar";
export default {
  name: "Frame",
  data() {
    return {};
  },
  methods: {
    logout() {
      window.sessionStorage.removeItem("token");
      this.$router.push("/login");
    }
  },
  components: {
    SideBar
  }
};
</script>

<style lang='scss' scoped>
.home-container {
  min-height: 100vh;
}

.el-header {
  background-color: #57606f;
  display: flex;
  justify-content: space-between;
  align-items: center;
  img {
    width: 20%;
    height: 100%;
  }
}
.el-main {
  background-color: #edeff3;
}
.el-footer {
  background-color: #edeff3;
  text-align: center;
  font-size: 14px;
  color: rgb(147, 147, 147);
  line-height: 20px;
}
</style>