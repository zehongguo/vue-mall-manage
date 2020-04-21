<template>
  <div class="add-cate-dialog">
    <el-dialog title="添加分类" :visible.sync="compDialogVisible" width="40%" @open="openDialog">
      <el-form
        :model="cateDataForm"
        :rules="cateRules"
        ref="cateRuleFormRef"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="cateDataForm.cat_name" placeholder="活动名称"></el-input>
        </el-form-item>
        <el-form-item label="父目录">
          <div class="block">
            <el-cascader
              :options="cateList"
              style="width:100%"
              v-model="selectKeys"
              :props="{ checkStrictly: true,value:'cat_id',label:'cat_name',children:'children'}"
              placeholder="父目录,不选择则新增为一级目录"
              clearable
            ></el-cascader>
          </div>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogClose">取 消</el-button>
        <el-button type="primary" @click="submitCate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getCategories, addCategory } from "network/goods";
export default {
  name: "AddCateDialog",
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      cateDataForm: {
        cat_pid: 0,
        cat_name: "",
        cat_level: 0
      },
      selectKeys: [],
      cateList: [],
      cateRules: {
        cat_name: [{ required: true, message: "请输入分类", trigger: "blur" }]
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
    }
  },
  methods: {
    dialogClose() {
      this.$refs.cateRuleFormRef.resetFields();
      this.selectKeys = [];
      this.cateDataForm = { cat_pid: 0, cat_name: "", cat_level: 0 };
      this.$emit("update:dialogVisible", false);
    },
    async openDialog() {
      const { data, meta } = await getCategories({ type: 2 });
      if (meta.status !== 200)
        return this.$message.error("获取分类列表错误," + meta.msg);
      this.cateList = data;
    },
    submitCate() {
      this.$refs.cateRuleFormRef.validate(async valid => {
        if (!valid) {
          return;
        }
        let selectKeysLength = this.selectKeys.length;
        this.cateDataForm.cat_pid =
          selectKeysLength === 0 ? 0 : this.selectKeys[selectKeysLength - 1];
        this.cateDataForm.cat_level = selectKeysLength;
        const { meta } = await addCategory(this.cateDataForm);
        if (meta.status !== 201) {
          return this.$message.error("添加分类失败," + meta.msg);
        }
        this.$message.closeAll();
        this.$message.success("创建分类成功");
        this.$emit("addCategorySuccess");
        this.dialogClose();
      });
    }
  },

  components: {}
};
</script>

<style lang='scss' scoped>
</style>