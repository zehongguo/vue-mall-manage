<template>
  <el-dialog
    :title="'添加'+nameLabel"
    :visible.sync="compDialogVisible"
    width="40%"
    :destroy-on-close="true"
  >
    <el-form ref="addParamFormRef" label-width="120px" :model="paramData" :rules="paramRules">
      <el-form-item :label="nameLabel+'名称'" prop="attr_name">
        <el-input v-model="paramData.attr_name" clearable></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogClose ">取 消</el-button>
      <el-button type="primary" @click="submitAddParam">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { addParam } from "network/goods";
import { resultErr } from "util/error.js";
export default {
  name: "AddParamDialog",
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    currentTab: {
      type: String,
      default: ""
    },
    pid: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      paramData: {
        p_id: "",
        attr_name: "",
        attr_sel: "",
        attr_vals: ""
      },
      paramRules: {
        attr_name: [{ required: true, message: "请输入名称", trigger: "blur" }]
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
    },
    nameLabel() {
      return this.currentTab === "many" ? "动态参数" : "静态属性";
    }
  },
  methods: {
    dialogClose() {
      this.$refs.addParamFormRef.resetFields();
      this.paramData = {
        attr_name: "",
        attr_sel: "",
        attr_vals: ""
      };
      this.$emit("update:dialogVisible", false);
    },
    async submitAddParam() {
      this.$refs.addParamFormRef.validate(async valid => {
        if (!valid) {
          return;
        }
        this.paramData.attr_sel = this.currentTab;
        const { meta } = await addParam(this.pid, this.paramData);
        resultErr(meta, 201, "添加分类参数失败");
        this.$message.success("添加分类参数成功");
        this.$emit("addParamSuccess");
        this.dialogClose();
      });
    }
  },
  components: {}
};
</script>

<style lang='scss' scoped>
</style>