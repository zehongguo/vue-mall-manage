<template>
  <div class="rights">
    <el-row
      :class="['tabel-item','vcenter', 'border-padding-bottom']"
      v-for="item in haveRightChildren(roleData.children) "
      :key="item.id"
    >
      <!--如果二级菜单没有，则不显示这一模块的权限管理-->
      <el-col :span="5">
        <el-tag type="primary" closable @close="removeRight(roleData,item.id)">{{item.authName}}</el-tag>
        <i class="el-icon-caret-right"></i>
      </el-col>
      <el-col :span="19">
        <!--二级权限菜单-->
        <el-row
          v-for="(subItem,index) in item.children"
          :key="subItem.id"
          :class="['vcenter',index !== (item.children.length - 1) ?'border-bottom':'']"
        >
          <el-col :span="6">
            <el-tag
              type="success"
              closable
              @close="removeRight(roleData,subItem.id)"
            >{{subItem.authName}}</el-tag>
            <i class="el-icon-caret-right"></i>
          </el-col>
          <el-col :span="18">
            <!--三级权限菜单-->
            <el-tag
              v-for="grandItem in subItem.children"
              :key="grandItem.id"
              type="warning"
              closable
              @close="removeRight(roleData,grandItem.id)"
            >{{grandItem.authName}}</el-tag>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { deleteRightById } from "network/authority.js";

export default {
  name: "RightsMenu",
  props: {
    roleData: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  data() {
    return {};
  },
  computed: {
    haveRightChildren() {
      return function(rightsChildren) {
        rightsChildren = rightsChildren.filter(
          item => item.children.length !== 0
        );
        return rightsChildren;
      };
    }
  },
  methods: {
    async removeRight(role, Rightid) {
      // 等待弹框结果
      const result = await this.confirmDelete();
      if (result !== "confirm") return;
      const { data, meta } = await deleteRightById(role.id, Rightid);
      if (meta.status !== 200) {
        return this.$message.error("取消权限失败" + meta.msg);
      }
      role.children = data;
      this.$message.closeAll();
      this.$message.success("取消权限成功");
    },
    // 弹框
    async confirmDelete() {
      const result = await this.$confirm(
        "确定删除该权限吗, 是否继续?",
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
    }
  },
  components: {}
};
</script>

<style lang='scss' scoped>
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
</style>