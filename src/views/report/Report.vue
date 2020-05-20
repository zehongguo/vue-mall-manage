<template>
  <div class="report">
    <crumbs :crumbsArr="['数据统计', '数据报表']" />
    <div id="main" style="width: 100%;height:400px;"></div>
  </div>
</template>

<script>
import Crumbs from 'components/crumbs/Crumbs'
import echarts from 'echarts'
import { getReportData } from 'network/report'
import _ from 'lodash'
export default {
  name: 'Report',
  data() {
    return {
      options: {
        title: {
          text: '用户来源',
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#E9EEF3',
            },
          },
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true,
        },
        xAxis: [
          {
            boundaryGap: false,
          },
        ],
        yAxis: [
          {
            type: 'value',
          },
        ],
      },
    }
  },
  created() {},
  mounted() {
    this.mountedEcharts()
  },
  methods: {
    async mountedEcharts() {
      const myChart = echarts.init(document.getElementById('main'))
      const { data = {}, meta } = await getReportData()
      if (meta.status !== 200) {
        return this.$message.error('获取数据报表错误,' + meta.msg)
      }
      const result = _.merge(data, this.options)

      console.log(result)
      myChart.setOption(result)
    },
  },
  components: {
    Crumbs,
  },
}
</script>

<style scoped lang="scss"></style>
