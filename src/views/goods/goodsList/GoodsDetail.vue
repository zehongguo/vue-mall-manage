<template>
  <div class="goods-detail">
    <el-form label-position="right"
      label-width="80px">
      <el-form-item label="商品名称:">
        {{goods.goods_name}}
      </el-form-item>
      <el-form-item label="商品价格:">
        {{goods.goods_price | priceFormat}}
      </el-form-item>
      <el-form-item label="数量:">
        {{goods.goods_number}}
      </el-form-item>
      <el-form-item label="重量:">
        {{goods.goods_weight}}
      </el-form-item>
      <el-form-item label="商品分类:">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item v-for="item in catNames"
            :key="item">{{item}}</el-breadcrumb-item>
        </el-breadcrumb>
      </el-form-item>
      <el-form-item label="商品参数:">
        <div v-if="paramList.length !== 0">
          <div v-for="item in paramList"
            :key="item.attr_id">
            <span v-if="item.attr_value!==''">{{item.attr_name}}---{{item.attr_value}}</span>
          </div>
        </div>
        <div v-else>
          暂无
        </div>
      </el-form-item>
      <el-form-item label="商品属性:">
        <div v-if="propList.length !== 0">
          <div v-for="item in propList"
            :key="item.attr_id">
            <span v-if="item.attr_value!==''">{{item.attr_name}}---{{item.attr_value}}</span>
          </div>
        </div>
        <div v-else>
          暂无
        </div>
      </el-form-item>
      <el-form-item label="商品状态:">
        <el-tag type="danger"
          v-if="goods.goods_state===0">未通过</el-tag>
        <el-tag type="success"
          v-else-if="goods.goods_state===1">已审核</el-tag>
        <el-tag type="warning"
          v-else>审核中</el-tag>
      </el-form-item>
      <el-form-item label="添加时间:">
        {{goods.add_time|dataFormat}}
      </el-form-item>
      <el-form-item label="商品图片:">
        <el-image class="my-image"
          v-for="item in goods.pics"
          :key="item.pics_id"
          :src="item.pics_sma_url"
          alt="商品图片"
          fit="contain"></el-image>
      </el-form-item>
      <el-form-item label="商品内容:">
        <div v-html="goods.goods_introduce"></div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
// import { getCategoryById } from 'network/goods'
export default {
  name: "GoodsDetail",
  props: {
    goods: {
      type: Object,
      default () {
        return {}
      }
    },
    catNames: {
      type: Array,
      default () {
        return []
      }
    }

  },
  data () {
    return {

    };
  },
  created () {

  },
  updated () {
  },
  methods: {
  },
  computed: {
    paramList () {
      if (this.goods.attrs === undefined) return []
      return this.goods.attrs.filter(item => item.attr_sel === 'many')
    },
    propList () {
      if (this.goods.attrs === undefined) return []
      return this.goods.attrs.filter(item => item.attr_sel === 'only')
    }
  },

  filters: {
    priceFormat (price) {
      return "￥" + price
    }
  }

};
</script>

<style scoped lang="scss">
.my-image {
  width: 90px;
  height: 90px;
  box-sizing: border-box;
  border: 1px dashed #ccc;
  margin: 5px;
}
.el-breadcrumb {
  line-height: 40px;
  margin-bottom: 0px;
}
</style>
