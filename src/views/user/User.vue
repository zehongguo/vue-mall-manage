<template>
  <div class="user">
    <!--面包屑-->
    <crumbs :crumbsArr="['用户管理','用户列表']" />
    <el-card class="box-card">
      <!--搜索-->
      <div slot="header" class="clearfix">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-input
              placeholder="输入搜索内容"
              @clear="getUserListInfoUser"
              v-model="queryInfo.query"
              clearable
            >
              <el-button slot="append" @click="search" icon="el-icon-search"></el-button>
            </el-input>
          </el-col>
          <el-col :span="6">
            <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
          </el-col>
        </el-row>
      </div>
      <!--数据展示表格-->
      <div class="text item">
        <el-table :data="userListData" border style="width: 100%" v-loading="loading">
          <el-table-column type="index"></el-table-column>
          <el-table-column prop="username" label="姓名"></el-table-column>
          <el-table-column prop="email" label="邮箱"></el-table-column>
          <el-table-column prop="mobile" label="电话号码"></el-table-column>
          <el-table-column prop="role_name" label="角色"></el-table-column>
          <el-table-column prop="mg_state" label="状态">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.mg_state"
                @change="changeStatus(scope.row)"
                active-color="#13ce66"
                inactive-color="#ccc"
              ></el-switch>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="200px">
            <template slot-scope="scope">
              <el-button
                type="primary"
                size="mini"
                icon="el-icon-edit"
                circle
                @click="showEditDialog(scope.row.id)"
              ></el-button>
              <el-button
                type="danger"
                size="mini"
                icon="el-icon-delete"
                circle
                @click="deleteUser(scope.row.id)"
              ></el-button>
              <el-tooltip effect="dark" content="分配角色" :enterable="false" placement="top">
                <el-button
                  type="warning"
                  size="mini"
                  icon="el-icon-s-custom"
                  @click="openNewRoleDialog(scope.row)"
                  circle
                ></el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>

        <!--分页-->
        <el-pagination
          @size-change="getUserListInfoUser"
          @current-change="getUserListInfoUser"
          :current-page.sync="queryInfo.pagenum"
          :page-sizes="[5, 10, 15, 20]"
          :page-size.sync="queryInfo.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </div>
    </el-card>
    <add-dialog :dialogVisible.sync="addDialogVisible" @addUserSuccess="getUserListInfoUser" />
    <edit-dialog
      :dialogVisible.sync="editDialogVisible"
      @editUserSuccess="getUserListInfoUser"
      :editId="editId"
    />
    <new-role-dialog
      :dialogVisible.sync="newRoleDialogVisible"
      :currentUser.sync="currentUser"
      @newRoleSuccess="getUserListInfoUser"
    />
  </div>
</template>

<script>
import { getUserList, updateState, deleteUserById } from "network/user.js";

import AddDialog from "./ChildrenComp/AddDialog";
import EditDialog from "./ChildrenComp/EditDialog";
import NewRoleDialog from "./ChildrenComp/NewRoleDialog";
import Crumbs from "components/crumbs/Crumbs";
export default {
  name: "User",
  data() {
    return {
      searchData: "",
      queryInfo: {
        // 搜索参数
        query: "",
        // 当前页面
        pagenum: 1,
        // 一页显示多少条
        pagesize: 5
      },
      // 总共有多少条
      total: 0,
      // 用户数据
      userListData: [],
      // 加载
      loading: false,
      // 显示加载框
      addDialogVisible: false,
      // 显示编辑框
      editDialogVisible: false,
      // 显示分配角色框
      newRoleDialogVisible: false,
      // 需要修改的id
      editId: 0,
      // 选中需要分配角色的信息
      currentUser: {}
    };
  },
  created() {
    this.getUserListInfoUser();
  },

  methods: {
    // 获取用户列表
    async getUserListInfoUser() {
      try {
        this.loading = true;
        const { data, meta } = await getUserList(this.queryInfo);
        if (meta.status !== 200) {
          return this.$message.error("用户列表获取失败" + meta.msg);
        }
        this.total = data.total;
        this.queryInfo.pagenum = data.pagenum;
        this.userListData = data.users;
      } catch (err) {
        this.$message.error("网络请求超时!");
      } finally {
        this.loading = false;
      }
    },
    // 改变用户状态
    async changeStatus({ id, mg_state }) {
      const { meta } = await updateState(id, mg_state);
      if (meta.status !== 200) {
        return this.$message.error("更改状态失败" + meta.msg);
      }
      this.$message.closeAll();
      this.$message({
        type: "success",
        message: "更改用户状态成功"
      });
    },
    // 搜索
    search() {
      // 重置pagenum为1
      this.queryInfo.pagenum = 1;
      this.getUserListInfoUser();
    },
    // 删除
    deleteUser(uid) {
      this.$confirm("确定删除该用户吗, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          const { meta } = await deleteUserById(uid);
          if (meta.status !== 200) {
            return this.$message.error("删除失败" + meta.msg);
          }
          this.$message.success("删除成功");
          this.getUserListInfoUser();
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },

    // 展示编辑用户框
    showEditDialog(uid) {
      this.editDialogVisible = true;
      this.editId = uid;
    },

    // 显示分配角色对话框
    openNewRoleDialog(user) {
      this.currentUser = user;
      this.newRoleDialogVisible = true;
    }
  },
  components: {
    AddDialog,
    EditDialog,
    NewRoleDialog,
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

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both;
}
</style>