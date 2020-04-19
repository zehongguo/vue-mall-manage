<template>
  <div class="role">
    <crumbs :crumbsArr="['权限管理','角色管理']" />
    <el-card>
      <div slot="header" class="clearfix">
        <span>角色管理列表</span>
        <el-button
          type="text"
          style="float: right; padding: 3px 0"
          @click="isShowAddDialog = true"
        >添加角色</el-button>
      </div>
      <div class="text item">
        <el-table
          v-loading="isLoading"
          :data="roleList"
          v-if="roleList!=[]"
          stripe
          border
          style="width: 100%"
        >
          <el-table-column type="expand" :index="1" label="详细" width="60">
            <template slot-scope="scope">
              <rights-menu :roleData="scope.row" />
            </template>
          </el-table-column>
          <el-table-column type="index" align="center" width="60" label="序号"></el-table-column>
          <el-table-column prop="roleName" label="角色名称"></el-table-column>
          <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
          <el-table-column label="操作" width="300px">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="primary"
                icon="el-icon-edit"
                @click="editRoleByInRole(scope.row)"
              >编辑</el-button>
              <el-button
                size="mini"
                type="danger"
                icon="el-icon-delete"
                @click="deleteRoleByIdInRole(scope.row)"
              >删除</el-button>
              <el-button
                size="mini"
                type="warning"
                icon="el-icon-setting"
                @click="openRightsDialong(scope.row)"
              >分配权限</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>
    <!--增加权限框-->
    <rights-dialog
      :dialogVisible.sync="isShowRightsDiaLog"
      :currentRole="currentRole"
      @updateSuccess="getRoleListInRole"
    />
    <!--添加角色框-->
    <el-dialog
      title="添加用户"
      @close="$refs.addRoleFormRef.resetFields();"
      :visible.sync="isShowAddDialog"
      width="40%"
    >
      <el-form :model="roleData" ref="addRoleFormRef" :rules="roleRules">
        <el-form-item label="角  色  名" prop="roleName">
          <el-input v-model="roleData.roleName" clearable placeholder="请输入角色名"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="roleData.roleDesc" clearable placeholder="请输入角色描述"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isShowAddDialog = false">取 消</el-button>
        <el-button type="primary" @click="sumbitAddRole">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="编辑角色"
      @close="$refs.editRoleFormRef.resetFields();"
      :visible.sync="isShowEditDialog"
      width="40%"
    >
      <el-form :model="roleEditRoleData" ref="editRoleFormRef" :rules="roleRules">
        <el-form-item label="角色ID">
          <el-input v-model="roleEditRoleData.roleId" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="角  色  名" prop="roleName">
          <el-input v-model="roleEditRoleData.roleName" clearable placeholder="请输入角色名"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="roleEditRoleData.roleDesc" clearable placeholder="请输入角色描述"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isShowEditDialog = false">取 消</el-button>
        <el-button type="primary" @click="sumbitEditRole">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Crumbs from "components/crumbs/Crumbs.vue";
import RightsMenu from "./childrenComp/RightsMenu";
import RightsDialog from "./childrenComp/RightsDialog";
import {
  getRoleList,
  deleteByRoleId,
  addRole,
  getRoleById,
  editRoleById
} from "network/authority.js";
export default {
  name: "Role",
  data() {
    return {
      // 角色列表
      roleList: [],
      // 显示分配权限对话框
      isShowRightsDiaLog: false,
      // 当前选中角色的数据
      currentRole: {},
      // 加载动画
      isLoading: false,
      // 显示增加角色框
      isShowAddDialog: false,
      // 显示编辑角色对话框
      isShowEditDialog: false,
      // 角色数据
      roleData: {
        roleName: "",
        roleDesc: ""
      },
      roleEditRoleData: {
        roleId: 0,
        roleName: "",
        roleDesc: ""
      },
      roleRules: {
        roleName: [
          { required: true, message: "请输入角色名", trigger: "blur" },
          { min: 3, max: 10, message: "长度在 3 到 10 个字符", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getRoleListInRole();
  },
  computed: {},
  methods: {
    async getRoleListInRole() {
      this.isLoading = true;
      const { data, meta } = await getRoleList();
      this.isLoading = false;
      if (meta.status !== 200) {
        return this.$message.error("获取角色列表失败" + meta.msg);
      }
      this.roleList = data;
    },
    openRightsDialong(role) {
      this.currentRole = role;
      this.isShowRightsDiaLog = true;
    },
    async deleteRoleByIdInRole({ id }) {
      const result = await this.confirmDelete();
      if (result !== "confirm") return;
      const { meta } = await deleteByRoleId(id);
      if (meta.status !== 200) {
        return this.$message.error("删除角色失败" + meta.msg);
      }
      this.roleList = this.roleList.filter(item => item.id != id);
      this.$message.closeAll();
      this.$message.success("删除角色成功");
    },
    // 弹框
    async confirmDelete() {
      const result = await this.$confirm(
        "确定删除该角色吗, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).catch(() => {
        this.$message({
          type: "info",
          message: "已取消删除"
        });
      });
      return result;
    },
    sumbitAddRole() {
      this.$refs.addRoleFormRef.validate(async valid => {
        if (!valid) {
          return;
        }
        const { meta } = await addRole(this.roleData);
        if (meta.status !== 201) {
          return this.$message.error("添加角色失败" + meta.msg);
        }
        this.getRoleListInRole();
        this.$message.closeAll();
        this.$message.success("添加角色成功");
        this.isShowAddDialog = false;
      });
    },
    async editRoleByInRole({ id }) {
      this.isShowEditDialog = true;
      const { data, meta } = await getRoleById(id);
      if (meta.status !== 200)
        return this.$message.error("获取角色数据失败," + meta.msg);
      this.roleEditRoleData = data;
    },
    async sumbitEditRole() {
      this.$refs.editRoleFormRef.validate(async valid => {
        if (!valid) {
          return;
        }
        const { data, meta } = await editRoleById(this.roleEditRoleData);
        if (meta.status !== 200) {
          return this.$message.error("修改角色失败" + meta.msg);
        }
        let indexOf = this.roleList.findIndex(item => item.id === data.roleId);
        this.roleList[indexOf].roleName = data.roleName;
        this.roleList[indexOf].roleDesc = data.roleDesc;
        this.$message.closeAll();
        this.$message.success("修改角色成功");
        this.isShowEditDialog = false;
      });
    }
  },
  components: {
    Crumbs,
    RightsMenu,
    RightsDialog
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
.table-item {
  margin: 7px;
}
.vcenter {
  display: flex;
  align-items: center;
}
.border-bottom {
  border-bottom: 1px solid #ececec;
}
.border-padding-bottom {
  border-bottom: 1px solid #ececec;
  padding: 8px 0px;
}
.el-tag {
  margin: 7px;
}
.el-input {
  max-width: 400px;
}
</style>