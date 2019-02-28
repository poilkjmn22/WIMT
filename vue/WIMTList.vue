<template lang="html">
  <div class="list-container relative"
    v-loading="getRemoteDataAjaxState === AJAX_STATE.PENDDING"
    element-loading-text="数据加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.5)">
    <div class="toolbox absolute">
        <span @click="onShowTable" class="toolitem">
          <font-awesome-icon class="fa-2x" :style="{color: showTable ? '#2DD8B1' : ''}" :icon="['fas', 'table']" />
        </span>
    </div>
    <div class="chart-box" ref="WIMTChartBox">
    </div>
    <div v-if="showTable" class="data-table-box mt-10">
      <el-table border :data="activityListTable">
        <el-table-column
          type="index"
          width="50">
        </el-table-column>
        <el-table-column prop="ActivityRoundDate" label="ActivityRoundDate" :formatter="formatColumn" align="center">
        </el-table-column>
        <el-table-column v-for="ac in activityClassList" :prop="ac.Name" :label="ac.Name" align="center">
        </el-table-column>
        <el-table-column label="操作" align="center">
          <span class=" opra-icon">
            <font-awesome-icon transform="grow-2" :style="{color: '#2DD8B1'}" :icon="['far', 'edit']" />
          </span>
          <span class=" opra-icon">
            <font-awesome-icon transform="grow-2" :style="{color: '#f56c6c'}" :icon="['far', 'trash-alt']" />
          </span>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
// require('@fortawesome/fontawesome-free/css/all.css');
import Vue from 'vue'
import {Loading, Table, TableColumn} from 'element-ui'
Vue.use(Loading)
Vue.use(Table)
Vue.use(TableColumn)

import { library } from '@fortawesome/fontawesome-svg-core'
import { faTable as fasFaTable, faEdit as fasFaEdit } from '@fortawesome/free-solid-svg-icons'
import { faEdit as farFaEdit, faTrashAlt as farFaTrashAlt } from '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(fasFaTable, fasFaEdit, farFaEdit, farFaTrashAlt)

Vue.component('font-awesome-icon', FontAwesomeIcon)

import DateTime from 'luxon/src/datetime.js'
import axios from 'axios'
import _ from 'lodash'

import chartHelper from '../js/helper/chartHelper'

const AJAX_STATE = require('../json/ajax-state.json')
const CHART_LIB = require('../json/chart-lib.json')
import * as COLOR from '../js/colors'
export default {
  data(){
    return {
      getRemoteDataAjaxState: AJAX_STATE.ISNOTASKED,
      AJAX_STATE,
      activityListTable: [],
      activityClassList: [],
      showTable: false
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
          if(_.isFunction(success)){
            success.call(this, resActivityList.data, resActivityClassList.data.results)
          }
        }))
        .catch(e => {
          this.getRemoteDataAjaxState = AJAX_STATE.COMPLETE
          if(_.isFunction(error)){
            error.call(this, e)
          }
        })
    },
    onShowTable(){
      this.showTable = !this.showTable;
    },
    formatColumn(row, cell, cellValue){
      var res = ''
      switch (cell.property) {
        case 'ActivityRoundDate':
          res = DateTime.fromISO(cellValue).toFormat('yyyy-MM-dd')
          break;
        default:

      }
      return res
    }
  },
  mounted(){
    this.getRemoteData((activityList, activityClassList) => {
      chartHelper.drawChart('echarts', this.$refs.WIMTChartBox, {activityList, activityClassList})
      this.activityListTable = _.chain(activityList)
        .groupBy('ActivityRoundDate')
        .map((gv, gk) => {
          return _.merge({
            ActivityRoundDate: gk
          }, _.reduce(activityClassList, (res, ac) => {
            res[ac.Name] = _.get(_.find(gv, ['Name', ac.Name]), 'Duration') || ''
            return res
          }, {}))
        })
        .value()
      this.activityClassList = activityClassList
    })
  }
}
</script>

<style lang="css">
.chart-box{
  height: 640px;
}

.toolbox{
  left: 10px;
  top: 10px;
  cursor: pointer;
  z-index: 99;
}

.toolitem,.opra-icon{
  cursor: pointer;
}
.opra-icon:not(:first-child){
  margin-left: 5px;
}
</style>
