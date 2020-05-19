<template>
  <div class="param">
    <crumbs :crumbsArr="['商品管理', '商品参数']" />
    <el-card class="box-card">
      <el-alert
        title="注意:只允许为第三级分类设置相关参数"
        type="warning"
        show-icon
        :closable="false"
      ></el-alert>
      <div class="param-content">
        <div class="block">
          <span class="demonstration" style="margin-right:10px"
            >选择商品分类:</span
          >
          <el-cascader
            :options="cateList"
            v-model="selectKeys"
            @change="cascaderChange"
            style="width:300px"
            :props="{
              value: 'cat_id',
              label: 'cat_name',
              children: 'children',
            }"
            placeholder="请选择"
            clearable
          ></el-cascader>
        </div>
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="动态参数" name="many">
            <el-button
              type="primary"
              size="small"
              @click="isShowAddDialog = true"
              :disabled="!selectKeysLen"
              >添加参数</el-button
            >

            <params-table
              label="参数名称"
              v-show="!!selectKeysLen"
              :paramList="catePamramList"
              :currentTab="activeName"
              :pid="selectKeys[selectKeysLen - 1]"
              @editParamSuccess="getCatePamramList"
            />
          </el-tab-pane>
          <el-tab-pane label="静态属性" name="only">
            <el-button
              type="primary"
              size="small"
              @click="isShowAddDialog = true"
              :disabled="!selectKeysLen"
              >添加属性</el-button
            >
            <params-table
              label="属性名称"
              :currentTab="activeName"
              v-show="!!selectKeysLen"
              :paramList="catePamramList"
              :pid="selectKeys[selectKeysLen - 1]"
              @editParamSuccess="getCatePamramList"
            />
          </el-tab-pane>
          <el-alert
            title="请先选择分类信息"
            :closable="false"
            style="margin-top:20px"
            type="warning"
            v-show="!selectKeysLen"
          />
        </el-tabs>
      </div>
    </el-card>
    <add-param-dialog
      :dialogVisible.sync="isShowAddDialog"
      :currentTab="activeName"
      :pid="selectKeys[selectKeysLen - 1]"
      @addParamSuccess="getCatePamramList"
    />
  </div>
</template>

<script>
import Crumbs from 'components/crumbs/Crumbs'
import { getCategories, getCatePamramList } from 'network/goods'
import { resultErr } from 'util/error.js'
import ParamsTable from './childrenComp/ParamsTable'
import AddParamDialog from './childrenComp/AddParamDialog'
export default {
  name: 'Param',
  data() {
    return {
      // 分类列表
      cateList: [],
      // 选中的分类
      selectKeys: [],
      // 面板的激活的状态
      activeName: 'many',
      // 分类参数列表
      catePamramList: [],

      isShowAddDialog: false,
    }
  },
  created() {
    this.getCateList()
  },
  computed: {
    // 计算级联已选择的长度
    selectKeysLen() {
      return this.selectKeys.length
    },
  },
  methods: {
    //获取分类列表
    async getCateList() {
      const { data, meta } = await getCategories({ type: 3 })
      resultErr(meta, 200, '获取分类别表失败')
      this.cateList = data
    },
    // 选择完级联分类器触发的事件
    cascaderChange() {
      // 未选择三级分类
      if (this.selectKeysLen !== 3) {
        this.selectKeys = []
        this.$message.warning('只能选择第三级的分类')
        return
      }
      //选择三级分类后获取
      this.getCatePamramList()
    },
    async getCatePamramList() {
      let cat_id = this.selectKeys[this.selectKeysLen - 1]
      const { data, meta } = await getCatePamramList(cat_id, this.activeName)
      resultErr(meta, 200, '获取分类参数列表失败')
      this.catePamramList = data.map((item) => {
        if (item.attr_vals !== '') {
          item.attr_vals = item.attr_vals.split(',')
        } else {
          item.attr_vals = []
        }
        item.inputVisible = false
        item.inputVal = ''
        return item
      })
    },
    // 切换tab时,重新获取数据
    handleClick() {
      if (!this.selectKeysLen) {
        return
      }
      this.getCatePamramList()
    },
  },
  components: {
    Crumbs,
    ParamsTable,
    AddParamDialog,
  },
}
</script>

<style lang="scss" scoped>
.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}
.param-content {
  margin-top: 20px;
}
.el-tabs {
  margin-top: 20px;
}
</style>
