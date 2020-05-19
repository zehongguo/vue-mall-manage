<template>
  <div class="order">
    <crumbs :crumbsArr="['订单管理', '订单列表']" />
    <el-card class="box-card">
      <div slot="header"
        class="clearfix">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-input placeholder="请输入内容"
              v-model="queryInfo.query"
              class="input-with-select"
              @clear="getOrderList"
              clearable>
              <el-button slot="append"
                icon="el-icon-search"
                @click="searchByKeyWord"></el-button>
            </el-input>
          </el-col>
        </el-row>
      </div>
      <el-table :data="orderList"
        max-height="500"
        border
        v-loading="isLoading"
        style="width: 100%">
        <el-table-column type="index"
          label="#"
          width="50" />
        <el-table-column label="订单编号"
          prop="order_number" />
        <el-table-column label="订单价格"
          width="80"
          prop="order_price" />
        <el-table-column label="是否付款"
          width="80">
          <template slot-scope="scope">
            <el-tag type="success"
              v-if="scope.row.order_pay === '1'">已付款</el-tag>
            <el-tag type="danger"
              v-else>未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="是否发货"
          width="80"
          prop="is_send">
        </el-table-column>
        <el-table-column label="下单时间"
          width="180">
          <template slot-scope="scope">
            {{ scope.row.create_time | dataFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作"
          width="100">
          <template slot-scope="scope">
            <el-button type="primary"
              size="mini"
              icon="el-icon-edit"
              @click="editDialogVisible=true"
              circle></el-button>
            <el-button type="success"
              size="mini"
              icon="el-icon-location"
              @click="showProgressDialog(scope.row.order_id)"
              circle></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination @size-change="getOrderList"
        @current-change="getOrderList"
        :current-page.sync="queryInfo.pagenum"
        :page-sizes="[5, 10, 20, 30]"
        :page-size.sync="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>
    <el-dialog title="更改订单地址"
      :visible.sync="editDialogVisible">
      <el-form ref="form"
        :model="editAddressForm"
        label-width="100px">
        <el-form-item label="省市区/县"
          required="">
          <el-cascader v-model="selectAddressKey"
            :options="cityOptions"
            style="width:100%"
            clearable
            :props="{ expandTrigger: 'hover' }"></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址"
          required>
          <el-input v-model="editAddressForm.detailAddress"
            required></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer"
        class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary"
          @click="submitEditForm">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="物流信息"
      :visible.sync="progressVisible">
      <el-timeline reverse>
        <el-timeline-item v-for="(activity, index) in logisticsData"
          :key="index"
          :timestamp="activity.time"
          :color="activity.color">
          {{activity.context}}
        </el-timeline-item>
      </el-timeline>
      <span slot="footer"
        class="dialog-footer">
        <el-button @click="progressVisible = false">取 消</el-button>
        <el-button type="primary"
          @click="progressVisible=false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Crumbs from 'components/crumbs/Crumbs';
import { getOrderList, getLogisticsById } from '@/network/order';
import cityOptions from '@/plugins/city_data2017_element';
export default {
  name: "Order",
  data () {
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 5,
      },
      isLoading: false,
      orderList: [],
      total: 0,
      editDialogVisible: false,
      editAddressForm: {
        address: "",
        detailAddress: ""
      },
      selectAddressKey: [],
      cityOptions,
      // 物流对话框
      progressVisible: false,
      // 物流信息
      logisticsData: []
    };
  },
  created () {
    this.getOrderList();
  },
  methods: {
    async getOrderList () {
      this.isLoading = true
      const { data, meta } = await getOrderList(this.queryInfo)
      this.isLoading = false
      if (meta.status !== 200) {
        return this.$message.error("获取订单列表失败," + meta.msg)
      }
      this.orderList = data.goods
      this.total = data.total
    },
    searchByKeyWord () {
      this.queryInfo.pagenum = 1
      this.getOrderList()
    },
    submitEditForm () {
      if (this.selectAddressKey.length === 0 || this.editAddressForm.detailAddress.trim() === "") {
        return this.$message.error("请填写必要的信息")
      }
      this.editAddressForm.address = this.selectAddressKey.join(",")
      this.selectAddressKey = []
      this.$message.success("更改地址成功");
      this.getOrderList()
      this.editDialogVisible = false
    },
    async showProgressDialog (id) {
      id = "1106975712662";
      const { data, meta } = await getLogisticsById(id);
      if (meta.status !== 200) {
        return this.$message.error("获取物流信息出错")
      }
      data[0]['color'] = "#0bbd87"
      this.logisticsData = data
      this.progressVisible = true
    }

  },
  components: {
    Crumbs
  }
};
</script>

<style scoped lang="scss">
</style>
