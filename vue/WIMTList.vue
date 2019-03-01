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
          <template slot-scope="scope">
            <span class=" opra-icon" title="编辑">
              <font-awesome-icon @click="onEditActivity(scope.row)" transform="grow-2" :style="{color: '#2DD8B1'}" :icon="['far', 'edit']" />
            </span>
            <span v-if="scope.row.Disable == 0" class=" opra-icon" title="删除">
              <font-awesome-icon @click="onDeleteActivity(scope.row)" transform="grow-2" :style="{color: '#f56c6c'}" :icon="['far', 'trash-alt']" />
            </span>
            <span v-if="scope.row.Disable == 1" class=" opra-icon" title="恢复">
              <font-awesome-icon @click="onRestoreActivity(scope.row)" transform="grow-2" :style="{color: '#2DD8B1'}" :icon="['fas', 'undo']" />
            </span>
          </template>

        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
// require('@fortawesome/fontawesome-free/css/all.css');
import Vue from 'vue'
import {Loading, Table, TableColumn, Message} from 'element-ui'
Vue.use(Loading)
Vue.use(Table)
Vue.use(TableColumn)

import { library } from '@fortawesome/fontawesome-svg-core'
import { faTable as fasFaTable, faEdit as fasFaEdit, faUndo as fasFaUndo } from '@fortawesome/free-solid-svg-icons'
import { faEdit as farFaEdit, faTrashAlt as farFaTrashAlt } from '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(fasFaTable, fasFaEdit, farFaEdit, farFaTrashAlt, fasFaUndo)

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
      showTable: false
    }
  },
  computed: {
      activityClassList(){
        return this.$store.state.activityClassList
      },
      activityListTable(){
        let {activityList, activityClassList} = this.$store.state
        return _.chain(activityList)
          .groupBy('ActivityRoundDate')
          .map((gv, gk) => {
            return _.merge({
              ActivityRoundDate: gk,
              Disable: _.get(gv, [0, 'Disable'])
            }, _.reduce(activityClassList, (res, ac) => {
              res[ac.Name] = _.get(_.find(gv, ['Name', ac.Name]), 'Duration') || ''
              return res
            }, {}))
          })
          .value()
      }
  },
  methods: {
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
    },
    onEditActivity(row){

    },
    onDeleteActivity(row){
      this.$store.dispatch('deleteActivity', {row, vmWIMTList: this})
        .then((res) => {
          Message({
            type: 'success',
            message: '删除成功！'
          })
        })
        .catch((res) => {
          Message({
            type: 'error',
            message: res.message
          })
        })
    },
    onRestoreActivity(row){
      this.$store.dispatch('restoreActivity', {row, vmWIMTList: this})
        .then((res) => {
          Message({
            type: 'success',
            message: '恢复成功！'
          })
        })
        .catch((res) => {
          Message({
            type: 'error',
            message: res.message
          })
        })
    }
  },
  mounted(){
    if (this.$store.state.shouldUpdateActivityList === true) {//状态被更新了
        this.$store.dispatch('getRDAllActivityListAndActivityClassList', this)
    }else{//状态被缓存了
      let {
          activityList,
          activityClassList
      } = this.$store.state
      chartHelper.drawChart('highcharts', this.$refs.WIMTChartBox, {
          activityList,
          activityClassList
      })
    }
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
