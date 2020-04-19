<template>
  <div class="crumbs">
    <el-breadcrumb v-if="crumbsArr != []" separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{path: '/home'}">首页</el-breadcrumb-item>
      <el-breadcrumb-item v-for="item in crumbsArr" :key="item">{{item}}</el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<script>
export default {
  name: "Crumbs",
  props: {
    crumbsArr: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  data() {
    return {};
  },
  methods: {},
  components: {}
};
</script>

<style lang='scss' scoped>
</style>