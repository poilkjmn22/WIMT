<!--
 * @Author: fangqi
 * @Date: 2021-07-15 14:46:06
 * @LastEditors: fangqi
 * @LastEditTime: 2021-07-15 14:46:06
 * @Description: 数据图表(基于echarts)
 * @Copyright(c) 2021 CMIM Network Co.,Ltd. All Rights Reserved
-->
<template>
  <div v-loading="loading" class="atg-chart-contaier">
    <div v-if="title" class="chart-title">{{ title }}</div>
    <div class="chart-box" ref="chartBox"></div>
  </div>
</template>
<script>
import { merge } from 'lodash-es'
import { debounce } from '@/utils/index.js'

const baseOptions = {
  title: {
    subtext: 'atg-chart',
    subtextStyle: {
      fontSize: 13,
      color: '#555',
      lineHeight: 20
    }
  },
  grid: {
    left: 0,
    right: 30,
    bottom: 0,
    containLabel: true
  },
  tooltip: {
    trigger: 'axis',
    formatter: (params, ticket, callback) => {
      let str = `${params[0].name}`
      params.forEach(({ marker, seriesName, value }) => {
        str += `<br />${marker} ${seriesName}：${value}`
      })
      callback(ticket, str)
    }
  },
  xAxis: {
    type: 'category',
    data: [],
    name: '时间',
    nameRotate: 90,
    axisLabel: {
      formatter: value => {
        return value.split(' ').join('\n')
      }
    }
  },
  yAxis: {
    type: 'value',
    minInterval: 1
  },
  series: []
}

function defaultConvertDataSeries() {
  const { dataSource: data, subtitle } = this
  let xData = []
  const yData = []
  data.forEach(({ customerName, orderStatisticsMonthBoList: months }) => {
    const name = `${customerName}`
    if (xData.length === 0) {
      xData = months.map(item => item.month)
    }
    yData.push({
      name,
      value: months.map(item => Number(item.orderAmount))
    })
  })

  const seriesOption = {
    type: 'line',
    smooth: true,
    showSymbol: false,
    emphasis: {
      focus: 'series'
    }
  }

  let series = []
  if (yData.length > 0) {
    series = yData.map(({ name, value }) => {
      return {
        name,
        data: value,
        ...seriesOption
      }
    })
  }
  return {
    title: {
      subtext: subtitle
    },
    xAxis: {
      data: xData
    },
    series
  }
}

export default {
  components: {},
  props: {
    dataSource: [Array],
    updateTag: [Number],
    title: String,
    subtitle: String,
    convertDataSeries: {
      type: Function,
      default: defaultConvertDataSeries
    },
    customOptions: {
      type: Object,
      default: function () {
        return {
          title: {
            subtext: this.subtitle
          }
        }
      }
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      /* chart: null */
    }
  },
  methods: {
    updateChart() {
      if (!this.chart) {
        throw new Error('图表未实例化')
      }
      const lastOption = this.chart.getOption()
      this.chart.clear()
      const option = merge({}, baseOptions, this.customOptions, this.convertDataSeries(this.updateTag, lastOption))
      this.chart.setOption(option)
    },
    initChart() {
      this.chart = this.$echarts.init(this.$refs.chartBox)
      const option = merge({}, baseOptions, this.customOptions, this.convertDataSeries(this.updateTag))
      this.chart.setOption(option)
    },
    clearChart() {
      if (!this.chart) {
        throw new Error('图表未实例化')
      }
      this.chart.clear()
    },
    resizeChart() {
      if (this.chart) {
        this.chart.resize()
      }
    }
  },
  watch: {
    dataSource() {
      this.updateChart()
    },
    updateTag() {
      this.updateChart()
    }
  },
  created() {
    this.resize = debounce(() => this.chart && this.chart.resize())
  },
  mounted() {
    this.initChart()
    window.addEventListener('resize', this.resize)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.resize)
  }
}
</script>
<style lang="scss" scoped>
.chart-title {
  height: 42px;
  line-height: 42px;
  background: #eceef2;
  font-size: 14px;
  font-weight: 600;
  padding-left: 10px;
}
.chart-box {
  min-height: 246px;
  height: 100%;
  margin-bottom: 20px;
}
</style>
