<template>
  <div class="params-table">
    <el-table :data="paramList" border stripe style="width: 100%">
      <el-table-column type="expand">
        <template slot-scope="spoce">
          <el-tag
            v-for="(item,index) in spoce.row.attr_vals"
            :key="index"
            closable
            @close="removeTag(spoce.row,index)"
          >{{item}}</el-tag>
          <el-input
            class="input-new-tag"
            v-if="spoce.row.inputVisible"
            v-model="spoce.row.inputVal"
            ref="saveTagInput"
            size="small"
            @keyup.enter.native="handleInputConfirm(spoce.row)"
            @blur="handleInputConfirm(spoce.row)"
          ></el-input>
          <el-button
            v-else
            class="button-new-tag"
            size="small"
            @click="showInput(spoce.row)"
          >+ New Tag</el-button>
        </template>
      </el-table-column>
      <el-table-column type="index" align="center" label="#"></el-table-column>
      <el-table-column prop="attr_name" :label="label"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            type="primary"
            size="mini"
            @click="openEditDialog(scope.row)"
            icon="el-icon-edit"
          >编辑</el-button>
          <el-button
            type="danger"
            size="mini"
            icon="el-icon-delete"
            @click="deleteParamByIdInParm(scope.row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      :title="'编辑'+nameLabel"
      :visible.sync="isShowEditDialog"
      width="40%"
      @close="dialogClose"
    >
      <el-form
        :model="editParamData"
        :rules="editParamRules"
        ref="editParamruleForm"
        label-width="120px"
        class="demo-ruleForm"
      >
        <el-form-item :label="nameLabel + '名称'" prop="attr_name">
          <el-input v-model="editParamData.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isShowEditDialog = false">取 消</el-button>
        <el-button type="primary" @click="submitEditParam">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { resultErr } from "util/error.js";
import { editParamById, deleteParamById } from "network/goods";

export default {
  name: "ParamsTable",
  props: {
    label: {
      type: String,
      default: ""
    },
    paramList: {
      type: Array,
      default() {
        return [];
      }
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
      editParamData: {
        attr_name: "",
        attr_sel: ""
      },
      id: 0,
      attrId: 0,
      isShowEditDialog: false,
      editParamRules: {
        attr_name: [
          { required: true, message: "请输入分类参数名", trigger: "blur" }
        ]
      }
    };
  },
  computed: {
    nameLabel() {
      return this.currentTab === "many" ? "动态参数" : "静态属性";
    }
  },
  methods: {
    openEditDialog(paramsData) {
      // 打开编辑对话框，初始化数据
      this.id = this.pid;
      this.attrId = paramsData.attr_id;
      this.editParamData.attr_name = paramsData.attr_name;
      this.editParamData.attr_sel = this.currentTab;
      this.isShowEditDialog = true;
    },
    async submitEditParam() {
      this.$refs.editParamruleForm.validate(async valid => {
        if (!valid) {
          return;
        }
        const { meta } = await editParamById(
          this.id,
          this.attrId,
          this.editParamData
        );
        resultErr(meta, 200, "编辑参数分类失败");
        this.$message.success("编辑分类参数成功");
        this.$emit("editParamSuccess");
        this.isShowEditDialog = false;
      });
    },
    deleteParamByIdInParm({ attr_id }) {
      this.$confirm("确定删除该参数吗, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          const { meta } = await deleteParamById(this.pid, attr_id);
          resultErr(meta, 200, "删除参数分类失败");
          this.$emit("editParamSuccess");
          this.$message.success("删除成功");
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    //关闭编辑对话框
    dialogClose() {
      this.$refs.editParamruleForm.resetFields();
      this.id = 0;
      (this.attrId = 0),
        (this.editParamData = {
          attr_name: "",
          attr_sel: ""
        });
    },
    showInput(paramsData) {
      paramsData.inputVisible = true;
      this.$nextTick(() => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    // 添加标签
    async handleInputConfirm(paramData) {
      let inputValue = paramData.inputVal.trim();
      if (inputValue) {
        let p_data = {
          attr_name: paramData.attr_name,
          attr_sel: paramData.attr_sel,
          attr_vals: paramData.attr_vals.join(",")
        };

        p_data.attr_vals +=
          paramData.attr_vals.length !== 0 ? "," + inputValue : inputValue;
        const { meta } = await editParamById(
          paramData.cat_id,
          paramData.attr_id,
          p_data
        );

        if (!resultErr(meta, 200, "添加标签失败")) return;
        paramData.attr_vals.push(inputValue);
        this.$message.closeAll();
        this.$message.success("添加便签成功");
      }
      paramData.inputVisible = false;
      paramData.inputVal = "";
    },
    // 删除标签
    removeTag(tag, index) {
      // console.log(tag);
      this.$confirm("此操作将永久删除该标签吗, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          let p_data = {
            attr_name: tag.attr_name,
            attr_sel: tag.attr_sel,
            attr_vals: ""
          };
          let tempArr = JSON.parse(JSON.stringify(tag.attr_vals));
          tempArr.splice(index, 1);
          p_data.attr_vals = tempArr.join(",");
          const { meta } = await editParamById(tag.cat_id, tag.attr_id, p_data);
          if (!resultErr(meta, 200, "删除标签失败")) return;
          tag.attr_vals.splice(index, 1);
          this.$message.closeAll();
          this.$message.success("删除标签成功");
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    }
  },
  components: {}
};
</script>

<style lang='scss' scoped>
.params-table {
  margin-top: 20px;
}
.el-tag + .el-tag {
  margin: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  margin-top: 10px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  margin-top: 10px;
  vertical-align: bottom;
}
</style>