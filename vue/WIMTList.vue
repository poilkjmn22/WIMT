<template lang="html">
  <div class="list-container"
    v-loading="getRemoteDataAjaxState === AJAX_STATE.PENDDING"
    element-loading-text="数据加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.5)">
    <div class="chart-box" ref="WIMTChartBox">

    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import {Loading} from 'element-ui'
Vue.use(Loading)

import axios from 'axios'
import _isFunction from 'lodash/isFunction'
import _map from 'lodash/map'

import wimt from '../js/utils'

let echarts = require('echarts/lib/echarts')
require('echarts/lib/chart/themeRiver')
require('echarts/lib/component/tooltip')
require('echarts/lib/component/legend')

const AJAX_STATE = require('../json/ajax-state.json')
import * as COLOR from '../js/colors'
export default {
  data(){
    return {
      getRemoteDataAjaxState: AJAX_STATE.ISNOTASKED,
      AJAX_STATE
    }
  },
  methods: {
    getRemoteData(success, error){
      this.getRemoteDataAjaxState = AJAX_STATE.PENDDING
      axios.all([axios.request({
        method: 'get',
        url: '/getActivityList'
      }), axios.request({
        method: 'get',
        url: '/getActivityClassList'
      })])
        .then(axios.spread((resActivityList, resActivityClassList) => {
          this.getRemoteDataAjaxState = AJAX_STATE.COMPLETE
          if(_isFunction(success)){
            success.call(this, resActivityList.data, resActivityClassList.data)
          }
        }))
        .catch(e => {
          this.getRemoteDataAjaxState = AJAX_STATE.COMPLETE
          if(_isFunction(error)){
            error.call(this, e)
          }
        })
    },
    transformSeriesData(data){
      return [{
          type: 'themeRiver',
          itemStyle: {
              emphasis: {
                  shadowBlur: 20,
                  shadowColor: 'rgba(0, 0, 0, 0.8)'
              }
          },
          data: _map(data, d => [wimt.utils.extractDate(d.ActivityRoundDate), wimt.utils.parseDuration(d.Duration), d.Name])
      }]
    }
  },
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

        series: []
    }

    chart.setOption(chartOpt)

    this.getRemoteData((activityList, activityClassList) => {
      chart.setOption({
        color: _map(activityClassList, 'Color'),
        legend: {
          data: _map(activityClassList, 'Name'),
          bottom: 'bottom'
        },
        series: this.transformSeriesData(activityList)
      })
    })
  }
}
</script>

<style lang="css">
.chart-box{
  height: 640px;
}
</style>
