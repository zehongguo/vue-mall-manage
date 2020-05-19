<template>
  <div class="AddGoods">
    <crumbs :crumbsArr="['商品管理', '商品列表', '添加商品']" />
    <el-card class="box-card">
      <el-page-header @back="goBack"
        content="添加商品页">
      </el-page-header>
      <el-steps :active="+currentTab"
        align-center
        finish-status="success"
        class="my-step">
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <el-form label-position="top"
        label-width="80px"
        :model="addGoodsForm"
        :rules="addGoodsRules"
        ref="addGoodsRuleForm">
        <el-tabs tabPosition="left"
          v-model="currentTab"
          :before-leave="tabBeforLeave"
          @tab-click="tabClick">
          <el-tab-pane name="0"
            label="基本信息">
            <el-form-item label="商品名称"
              prop="goods_name">
              <el-input v-model="addGoodsForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格(￥)"
              prop="goods_price">
              <el-input v-model="addGoodsForm.goods_price"
                type="Number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量"
              prop="goods_number">
              <el-input v-model.number="addGoodsForm.goods_number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量(kg)"
              prop="goods_weight">
              <el-input v-model="addGoodsForm.goods_weight"
                type="Number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类">
              <el-cascader v-model="catSelectKey"
                :options="categoryList"
                :props="{
                  children: 'children',
                  value: 'cat_id',
                  label: 'cat_name',
                }"
                style="width:300px"
                @change="catChange"
                clearable></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane name="1"
            label="商品参数">
            <el-form-item v-for="item in paramList"
              :key="item.attr_id"
              :label="item.attr_name">
              <el-checkbox-group v-model="item.attr_vals"
                v-if="item.attr_vals.length !== 0">
                <el-checkbox :label="subItem"
                  v-for="(subItem, index) in item.attr_vals"
                  :key="index">
                </el-checkbox>
              </el-checkbox-group>
              <el-tag type="warning"
                v-else>暂无参数</el-tag>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane name="2"
            label="商品属性">
            <el-form-item :label="item.attr_name"
              v-for="item in propList"
              :key="item.attr_id">
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane name="3"
            label="商品图片">
            <el-upload class="upload-demo"
              action="http://47.115.124.102:8888/api/private/v1/upload"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :file-list="fileList"
              list-type="picture"
              :limit="5"
              :headers="token"
              :on-success="uploadSuccess"
              :on-exceed="handleExceed">
              <el-button size="small"
                type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane name="4"
            label="商品内容">
            <quill-editor v-model="addGoodsForm.goods_introduce"
              ref="myQuillEditor"
              class="my-editor">
            </quill-editor>
            <el-button type="primary"
              style="margin-top:20px"
              @click="addGoodsBtn">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%"
        :src="dialogImageUrl"
        alt="图片" />
    </el-dialog>
  </div>
</template>

<script>
import Crumbs from 'components/crumbs/Crumbs'
import { getCategories, getCatePamramList, addGoods } from 'network/goods'
export default {
  name: 'AddGoods',
  data () {
    return {
      // 当前tab页
      currentTab: '0',
      addGoodsForm: {
        goods_name: '',
        goods_cat: '',
        goods_price: 0.0,
        goods_number: 0,
        goods_weight: 0,
        goods_introduce: '',
        pics: [],
        attrs: [],
      },
      addGoodsRules: {
        goods_name: [
          { required: true, message: '商品名称不能为空', trigger: 'blur' },
        ],
        goods_price: [
          { required: true, message: '商品价格不能为空', trigger: 'blur' },
        ],
        goods_number: [
          { required: true, message: '商品数量不能为空', trigger: 'blur' },
        ],

        goods_weight: [
          { required: true, message: '商品重量不能为空', trigger: 'blur' },
        ],
      },
      // 已选分类
      catSelectKey: [],
      // 分类列表
      categoryList: [],
      //动态参数列表
      paramList: [],
      propList: [],
      fileList: [],
      token: {
        Authorization: window.sessionStorage.getItem('token'),
      },
      dialogVisible: false,
      dialogImageUrl: '',
    }
  },
  created () {
    this.getCategoryList()
  },
  computed: {
    catSelectKeyLen () {
      return this.catSelectKey.length
    },
  },
  methods: {
    async getCategoryList () {
      const { data, meta } = await getCategories()
      if (meta.status !== 200) {
        return this.$message.error('获取分类列表失败')
      }
      this.categoryList = data
    },
    // tab触发前回调钩子
    tabBeforLeave () {
      if (this.catSelectKeyLen === 0) {
        this.$message.error('请先选择商品分类')
        return false
      }
    },
    // tab切换钩子
    async tabClick () {
      // 如果为属性面板获取动态参数
      if (this.currentTab === '1') {
        const { data, meta } = await getCatePamramList(
          this.catSelectKey[2],
          'many'
        )
        if (meta.status !== 200) {
          this.$message.error('获取商品参数列表错误')
        }
        data.forEach((item) => {
          item.attr_vals =
            item.attr_vals !== '' ? item.attr_vals.split(',') : []
        })
        this.paramList = data
      } else if (this.currentTab === '2') {
        const { data, meta } = await getCatePamramList(
          this.catSelectKey[2],
          'only'
        )
        if (meta.status !== 200) {
          this.$message.error('获取商品属性列表错误')
        }
        this.propList = data
      }
    },
    // 分类选择器发生改变
    catChange () {
      if (this.catSelectKeyLen !== 3) {
        this.catSelectKey = []
        this.$message.error('只能选择第三级的分类')
        return
      }
    },
    // 图片预览
    handlePreview ({ response }) {
      this.dialogImageUrl = response.data.url
      this.dialogVisible = true
    },
    // 图片删除
    handleRemove ({ response }) {
      this.addGoodsForm.pics = this.addGoodsForm.pics.filter(
        (item) => item.pic !== response.data.tmp_path
      )
    },

    handleExceed (files, fileList) {
      this.$message.warning(
        `当前限制选择 5 个文件，本次选择了 ${
        files.length
        } 个文件，共选择了 ${files.length + fileList.length} 个文件`
      )
    },
    uploadSuccess (response) {
      this.addGoodsForm.pics.push({
        pic: response.data.tmp_path,
      })
    },
    addGoodsBtn () {
      this.$refs.addGoodsRuleForm.validate(async (vaild) => {
        if (!vaild) {
          return this.$message.error('请填写必要信息')
        }
        this.addGoodsForm.goods_cat = this.catSelectKey.join(',')
        this.paramList.forEach((item) => {
          const attrObj = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals.join(','),
          }
          this.addGoodsForm.attrs.push(attrObj)
        })
        this.propList.forEach((item) => {
          const attrObj = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals,
          }
          this.addGoodsForm.attrs.push(attrObj)
        })
        const { meta } = await addGoods(this.addGoodsForm)
        if (meta.status !== 201) {
          return this.$message.error('创建商品失败' + meta.msg)
        }
        this.$message.success('创建商品成功')
        this.$router.push('/goods')
      })
    },
    goBack () {
      this.$router.go(-1);
    }
  },

  components: {
    Crumbs,
  },
}
</script>

<style lang="scss" scoped>
.my-step {
  margin: 20px 0px;
}
.my-editor /deep/ .ql-container {
  height: 300px;
}
</style>
