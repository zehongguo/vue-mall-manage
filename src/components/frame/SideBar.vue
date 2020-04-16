<template>
  <el-aside width="auto">
    <div class="toggel-button" @click="toCollapse">
      <i :class="isCollapse ? 'el-icon-s-unfold':'el-icon-s-fold'"></i>
    </div>
    <!--菜单-->
    <el-menu
      v-if="menusData != []"
      background-color="#2f3542"
      text-color="#fff"
      active-text-color="#409EFF"
      class="el-menu-vertical-demo"
      :collapse="isCollapse"
      :unique-opened="true"
      :default-active="$route.path"
      router
    >
      <el-submenu v-for="(item, index) in menusData" :key="item.id" :index="index+1+''">
        <template slot="title">
          <i :class="iconfonts[index]"></i>
          <span>{{ item.authName }}</span>
        </template>
        <el-menu-item v-for="subItem in item.children" :key="subItem.id" :index="'/'+item.path">
          <template slot="title">
            <i class="el-icon-menu"></i>
            <span>{{ subItem.authName }}</span>
          </template>
        </el-menu-item>
      </el-submenu>
    </el-menu>
  </el-aside>
</template>
<script>
import { getMenuData } from "network/home.js";
export default {
  name: "SideBar",
  data() {
    return {
      menusData: [],
      isCollapse: false,
      iconfonts: [
        "el-icon-user-solid",
        "el-icon-key",
        "el-icon-s-goods",
        "el-icon-s-order",
        "el-icon-s-data"
      ]
    };
  },
  methods: {
    async getMenuDataInHome() {
      const { data, meta } = await getMenuData();
      if (meta.status != "200") {
        this.$message.error("获取菜单列表失败!" + meta.msg);
        return;
      }
      this.menusData = data;
    },
    toCollapse() {
      this.isCollapse = !this.isCollapse;
    }
  },
  created() {
    this.getMenuDataInHome();
  },
  components: {}
};
</script>

<style lang="scss" scoped>
.el-aside {
  background-color: #2f3542;
  border-right: none;
  // 展开，折叠按钮
  .toggel-button {
    height: 30px;
    background-color: #484f5d;
    text-align: center;
    line-height: 30px;
    color: white;
    padding-right: 10px;
    cursor: pointer;
  }
  // 菜单
  .el-menu-vertical-demo {
    min-height: 100vh;
    border-right: none;
    &:not(.el-menu--collapse) {
      width: 200px;
    }
  }
}
</style>
