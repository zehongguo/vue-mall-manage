<template>
  <el-dialog
    title="分配权限"
    @open="dialogOpen"
    :visible.sync="compDialogVisible"
    width="40%"
    class="right-dialig-body"
    @close="dialogClose"
    :destroy-on-close="true"
  >
    <el-tree
      :data="rightsTreeData"
      show-checkbox
      :props="defaultProps"
      default-expand-all
      node-key="id"
      ref="treeRightsRef"
      :default-checked-keys="checkedKeys"
    />
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogClose ">取 消</el-button>
      <el-button type="primary" @click="sumbitRights">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import {
  getRightsTreeList,
  updateRightsByRoleIdAndRights
} from "network/authority";
export default {
  name: "RightsDialog",
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    currentRole: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  data() {
    return {
      // 树形节点数据
      rightsTreeData: [],
      // 树形结构对应节点与下级目录对应的变量名
      defaultProps: {
        label: "authName",
        children: "children"
      },
      checkedKeys: []
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
  created() {
    this.getRightsTreeListInDialog();
  },
  methods: {
    // 对话框关闭
    dialogClose() {
      this.checkedKeys.splice(0);
      this.$emit("update:dialogVisible", false);
    },
    // 获取树形权限数据
    async getRightsTreeListInDialog() {
      const { data, meta } = await getRightsTreeList();
      if (meta.status !== 200) {
        return this.$message.error("获取权限列表失败," + meta.msg);
      }
      this.rightsTreeData = data;
    },
    // 对话框打开时
    dialogOpen() {
      // TODO:为什么要这样赋值才有响应
      let arr = [];
      this.getCheckedKeys(this.currentRole, arr);
      this.checkedKeys = arr;
    },
    // 获取已经选中的权限
    getCheckedKeys(node, arr) {
      if (!node.children) {
        return arr.push(node.id);
      }

      node.children.forEach(item => {
        this.getCheckedKeys(item, arr);
      });
    },
    // 提交数据
    async sumbitRights() {
      const ref = this.$refs.treeRightsRef;
      let rightsStr = ref
        .getCheckedKeys()
        .concat(ref.getHalfCheckedKeys())
        .join(",");
      const { meta } = await updateRightsByRoleIdAndRights(
        this.currentRole.id,
        rightsStr
      );
      if (meta.status !== 200) {
        this.$message.error("更新权限失败," + meta.msg);
      }
      this.$message.success("更新权限成功");
      this.$emit("updateSuccess");
      this.dialogClose();
    }
  },
  components: {}
};
</script>

<style lang='scss'>
.right-dialig-body {
  .el-dialog__body {
    height: 50vh;
    overflow: auto;
  }
}
</style>