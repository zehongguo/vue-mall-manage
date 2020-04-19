<template>
  <div class="authority">
    <crumbs :crumbsArr="['权限管理','权限列表']" />
    <el-card>
      <div slot="header" class="clearfix">
        <span>权限列表</span>
      </div>
      <div class="text item">
        <el-table :data="rightList" stripe border style="width: 100%" height="70vh">
          <el-table-column type="index" align="center" width="60" label="序号"></el-table-column>
          <el-table-column prop="authName" label="权限名称"></el-table-column>
          <el-table-column prop="path" label="权限路径"></el-table-column>
          <el-table-column label="权限等级">
            <template slot-scope="scope">
              <el-tag type="success" v-if="scope.row.level==='0'">一级</el-tag>
              <el-tag v-if="scope.row.level==='1'">二级</el-tag>
              <el-tag v-if="scope.row.level==='2'" type="warning">三级</el-tag>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>
  </div>
</template>

<script>
import Crumbs from "components/crumbs/Crumbs";
import { getRightsList } from "network/authority.js";
export default {
  name: "Authority",
  data() {
    return {
      rightList: []
    };
  },
  created() {
    this.getRightsList();
  },
  methods: {
    async getRightsList() {
      const { data, meta } = await getRightsList();
      if (meta.status != 200) {
        return this.$message.error("获取权限列表错误," + meta.msg);
      }
      this.rightList = data;
    }
  },
  filters: {},
  components: {
    Crumbs
  }
};
</script>

<style lang='scss' scoped>
.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}
</style>