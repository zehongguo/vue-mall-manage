<template>
  <div class="categories">
    <crumbs :crumbsArr="['商品管理','商品分类']" />
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>分类管理</span>
        <el-button
          style="float: right; padding: 3px 0"
          type="text"
          @click="isShowAddDialog = true"
        >添加分类</el-button>
      </div>
      <div class="text item">
        <el-table
          v-loading="isLoading"
          :data="categoriesData"
          style="width: 100%;margin-bottom: 20px;"
          row-key="cat_id"
          border
          :indent="24"
          ref="theTable"
          height="70vh"
          :tree-props="{children: 'children'}"
          @expand-change="isExpanded=true"
        >
          <el-table-column type="index" align="center" width="60px" label="#"></el-table-column>
          <el-table-column prop="cat_name" width="240px">
            <template slot="header">
              <span>商品类别</span>
              <el-button
                type="text"
                icon="el-icon-d-caret"
                style="color:#4c4c4c;font-size:12px;margin-left:4px"
                @click="expandAll"
              >全部展开</el-button>
              <el-button
                type="text"
                icon="el-icon-d-caret"
                style="color:#4c4c4c;font-size:12px;margin-left:4px"
                @click="shrinkAll"
              >全部收缩</el-button>
            </template>
          </el-table-column>
          <el-table-column label="是否有效">
            <template slot-scope="scope">
              <i class="el-icon-success" style="color:#67C23A" v-if="!scope.row.cat_deleted"></i>
              <i class="el-icon-error" style="color:#F56C6C" v-else></i>
            </template>
          </el-table-column>
          <el-table-column label="等级">
            <template slot-scope="scope">
              <el-tag type="success" v-if="scope.row.cat_level === 0">一级</el-tag>
              <el-tag type="primary" v-else-if="scope.row.cat_level === 1">二级</el-tag>
              <el-tag type="warning" v-else>三级</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="240px">
            <template>
              <el-button type="primary" size="mini" icon="el-icon-edit">编辑</el-button>
              <el-button type="danger" size="mini" icon="el-icon-delete">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!--分页-->
        <el-pagination
          @size-change="getCategories"
          @current-change="getCategories"
          :current-page.sync="queryInfo.pagenum"
          :page-sizes="[5, 10, 15, 20]"
          :page-size.sync="queryInfo.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </div>
    </el-card>
    <add-cate-dialog :dialogVisible.sync="isShowAddDialog" @addCategorySuccess="getCategories" />
  </div>
</template>

<script>
import Crumbs from "components/crumbs/Crumbs";
import AddCateDialog from "./chilrenComp/AddCateDialog";
import { getCategories } from "network/goods.js";
export default {
  name: "Categories",
  data() {
    return {
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      isLoading: false,
      total: 0,
      //是否选择展开行，如果展开商品分类表头变为全部收缩
      isExpanded: false,
      categoriesData: [],
      isShowAddDialog: false
    };
  },
  created() {
    this.getCategories();
  },
  methods: {
    async getCategories() {
      this.isLoading = true;
      const { data, meta } = await getCategories(this.queryInfo);
      this.isLoading = false;
      if (meta.status !== 200) return this.$message.error("获取数据失败");
      this.categoriesData = data.result;
      this.total = data.total;
      console.log(this.categoriesData);
    },
    //全部展开
    expandAll() {
      this.forArr(this.categoriesData, true);
    },
    // 全部收缩
    shrinkAll() {
      if (!this.isExpanded) return;
      this.forArr(this.categoriesData, false);
      this.isExpanded = false;
    },
    // 全部展开或全部收缩
    forArr(arr, isExpand) {
      arr.forEach(i => {
        this.$refs.theTable.toggleRowExpansion(i, isExpand);
        if (i.children) {
          this.forArr(i.children, isExpand);
        }
      });
    }
  },

  components: {
    Crumbs,
    AddCateDialog
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