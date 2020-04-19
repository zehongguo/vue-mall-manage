<template>
  <el-dialog title="角色分配" :visible.sync="compDialogVisible" width="30%" @close="dialogClose">
    <div>
      <p>用户id:{{currentUser.id}}</p>
      <p>用户名:{{currentUser.username}}</p>
      <p>当前角色:{{currentUser.role_name}}</p>
      <div>
        <span>新角色:</span>
        <el-select v-model="newRoleId" placeholder="请选择">
          <el-option
            v-for="item in roleList"
            :key="item.id"
            :label="item.roleName"
            :value="item.id"
          ></el-option>
        </el-select>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogClose">取 消</el-button>
      <el-button type="primary" @click="submitNewRole">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { getRoleList } from "network/authority.js";
import { distriNewRole } from "network/user.js";
export default {
  name: "NewRoleDialog",
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    currentUser: {
      type: Object,
      default() {
        return {};
      }
    }
  },

  data() {
    return {
      roleList: [],
      newRoleId: ""
    };
  },
  created() {
    this.getRoleListInUser();

    console.log("分配角色对话框");
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
      this.newRoleId = "";
      this.$emit("update:currentUser", {});
      this.$emit("update:dialogVisible", false);
    },
    async getRoleListInUser() {
      const { data, meta } = await getRoleList();
      if (meta.status !== 200)
        return this.$message.error("获取角色列表失败," + meta.msg);
      this.roleList = data;
    },
    async submitNewRole() {
      if (!this.newRoleId) return this.$message.warning("还未选择新角色");
      let { meta } = await distriNewRole(this.currentUser.id, this.newRoleId);
      if (meta.status !== 200)
        return this.$message.error("分配角色失败," + meta.msg);
      this.$emit("newRoleSuccess");
      this.dialogClose();
      this.$message.success("分配角色成功");
    }
  },
  components: {}
};
</script>

<style lang='scss' scoped>
</style>