<template>
  <div class="goods-list">
    <crumbs :crumbsArr="['商品管理', '商品列表']" />
    <el-card class="box-card">
      <div slot="header"
        class="clearfix">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-input placeholder="请输入内容"
              v-model="queryInfo.query"
              class="input-with-select"
              @clear="getGoodsList"
              clearable>
              <el-button slot="append"
                icon="el-icon-search"
                @click="searchByKeyWord"></el-button>
            </el-input>
          </el-col>
          <el-col :span="4">
            <el-button type="primary"
              @click="toAddPage">添加商品</el-button>
          </el-col>
        </el-row>
      </div>
      <el-table :data="goodsList"
        max-height="500"
        border
        v-loading="isLoading"
        style="width: 100%">
        <el-table-column type="index"
          label="#"
          width="50" />
        <el-table-column label="商品名称"
          prop="goods_name" />
        <el-table-column label="商品价格"
          width="80"
          prop="goods_price" />
        <el-table-column label="商品数量"
          width="80"
          prop="goods_number" />
        <el-table-column label="商品重量"
          width="80"
          prop="goods_weight" />
        <el-table-column label="商品状态"
          width="80">
          <template slot-scope="scope">
            <el-tag type="danger"
              v-if="scope.row.goods_state === 0">未通过</el-tag>
            <el-tag type="success"
              v-else-if="scope.row.goods_state === 2">已审核</el-tag>
            <el-tag type="warning"
              v-else>审核中</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="创建时间"
          width="100">
          <template slot-scope="scope">
            {{ scope.row.add_time | dataFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作"
          width="130">
          <template slot-scope="scope">
            <el-button type="primary"
              size="mini"
              icon="el-icon-view"
              @click="showGoodsDetailDialog(scope.row)"
              circle></el-button>
            <el-button type="primary"
              size="mini"
              icon="el-icon-edit"
              circle></el-button>
            <el-button type="danger"
              size="mini"
              icon="el-icon-delete"
              @click="deleteGoods(scope.row.goods_id)"
              circle></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination @size-change="getGoodsList"
        @current-change="getGoodsList"
        :current-page.sync="queryInfo.pagenum"
        :page-sizes="[5, 10, 20, 30]"
        :page-size.sync="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>
    <el-dialog title="提示"
      :visible.sync="dialogVisible"
      width="50%"
      @close="closeDetailDialog">
      <goods-detail :goods="goodsDetailInfo"
        :catNames="cat_names" />
      <span slot="footer"
        class="dialog-footer">
        <el-button type="primary"
          @click="dialogVisible = false">关闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Crumbs from 'components/crumbs/Crumbs'
import { getGoodsList, deleteGoodsById, getGoodsById, getCategoryById } from 'network/goods'
import GoodsDetail from './GoodsDetail';
export default {
  name: 'GoodsList',
  data () {
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 5,
      },
      isLoading: false,
      goodsList: [],
      total: 0,
      dialogVisible: false,
      goodsDetailInfo: {},
      cat_names: []
    }
  },
  created () {
    this.getGoodsList()
  },
  methods: {
    async getGoodsList () {
      this.isLoading = true
      const { data, meta } = await getGoodsList(this.queryInfo)
      this.isLoading = false
      if (meta.status !== 200) {
        return this.$message.error('获取商品列表失败' + meta.msg)
      }
      this.goodsList = data.goods
      this.total = data.total
    },
    searchByKeyWord () {
      this.queryInfo.pagenum = 1
      this.getGoodsList()
    },
    async deleteGoods (id) {
      this.$confirm('确定删除该商品吗, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(async () => {
          const { meta } = await deleteGoodsById(id)
          if (meta.status !== 200) {
            return this.$message.error('删除失败' + meta.msg)
          }
          this.$message.success('删除成功')
          this.getGoodsList()
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除',
          })
        })
    },
    toAddPage () {
      this.$router.push('/addgoods')
    },
    getCatById () {
      const cats_id = this.goodsDetailInfo.goods_cat.split(",")
      cats_id.forEach(async item => {
        const { data, meta } = await getCategoryById(item);
        if (meta.status !== 200) {
          return this.$message.error("获取分类参数错误" + meta.msg)
        }
        this.cat_names.push(data.cat_name);
      });
    },
    async showGoodsDetailDialog ({ goods_id }) {
      const { data, meta } = await getGoodsById(goods_id);
      if (meta.status !== 200) {
        return this.$message.error("获取商品详情出错," + meta.msg);
      }
      this.goodsDetailInfo = data;
      this.getCatById()
      this.dialogVisible = true;
    },
    closeDetailDialog () {
      this.cat_names = []
    }
  },
  components: {
    Crumbs,
    GoodsDetail
  },
}
</script>

<style scoped lang="scss"></style>
