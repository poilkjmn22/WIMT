<template lang="html">
  <div class="list-container">
    <div class="chart-box" ref="WIMTChartBox">

    </div>
  </div>
</template>

<script>
let echarts = require('echarts/lib/echarts')
require('echarts/lib/chart/themeRiver')
require('echarts/lib/component/tooltip')

import * as COLOR from '../js/colors'
import WIMTBLL from '../js/BLL/WIMTBLL'
export default {

  mounted(){
    let chart = echarts.init(this.$refs.WIMTChartBox)
    let chartOpt = {
        color: COLOR.COLOR_PIE_16,
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'line',
                lineStyle: {
                    color: 'rgba(0,0,0,0.2)',
                    width: 1,
                    type: 'solid'
                }
            }
        },
        legend: {
            data: ['DQ', 'TY', 'SS', 'QG', 'SY', 'DD']
        },
        singleAxis: {
            top: 50,
            bottom: 50,
            axisTick: {},
            axisLabel: {},
            type: 'time',
            axisPointer: {
                animation: true,
                label: {
                    show: true
                }
            },
            splitLine: {
                show: true,
                lineStyle: {
                    type: 'dashed',
                    opacity: 0.2
                }
            }
        },

        series: [{
            type: 'themeRiver',
            itemStyle: {
                emphasis: {
                    shadowBlur: 20,
                    shadowColor: 'rgba(0, 0, 0, 0.8)'
                }
            },
            data: WIMTBLL.getList()
        }]
    }

    chart.setOption(chartOpt)
  }
}
</script>

<style lang="css">
.chart-box{
  height: 640px;
}
</style>
