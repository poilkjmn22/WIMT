<template lang="html">
  <div class="list-container relative"
    v-loading="getRemoteDataAjaxState === AJAX_STATE.PENDDING"
    element-loading-text="数据加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.5)">
    <div class="toolbox absolute">
          <font-awesome-icon @click="onShowTable" class="fa-2x toolitem" :style="{color: showTable ? '#2DD8B1' : ''}" :icon="['fas', 'table']" />
          <span @click="onShowJSON" :class="['toolitem', 'text-button', showJSON && 'is-active' || '']">JSON</span>
          <animate-radio-group @change="onChangeDatePeriodMode" class="toolitem" v-model="datePeriodMode">
            <animate-radio v-for="dpm in DATE_PERIOD_MODE" :label="dpm.name">
              <!-- <font-awesome-icon v-if="dpm.name === 'day'" :icon="['fas', 'calendar-day']" /> -->
              <!-- <font-awesome-icon v-else-if="dpm.name === 'week'" :icon="['fas', 'calendar-week']" /> -->
              <span>{{dpm.title}}</span>
            </animate-radio>
          </animate-radio-group>
          <download-menu class="toolitem" :data-rows="downloadDataRows" />
    </div>
    <div class="chart-box mb-10" ref="WIMTChartBox">
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
    <json-viewer v-if="showJSON" :json="activityListTable"></json-viewer>
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
import { faTable as fasFaTable, faEdit as fasFaEdit, faUndo as fasFaUndo, faFileDownload as fasFaFileDownload, faCalendarDay as fasFaCalendarDay, faCalendarWeek as fasFaCalendarWeek } from '@fortawesome/free-solid-svg-icons'
import { faEdit as farFaEdit, faTrashAlt as farFaTrashAlt } from '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(fasFaTable, fasFaEdit, farFaEdit, farFaTrashAlt, fasFaUndo, fasFaFileDownload, fasFaCalendarDay, fasFaCalendarWeek)

Vue.component('font-awesome-icon', FontAwesomeIcon)
import DownloadMenu from './components/DownloadMenu'
import AnimateRadioGroup from './components/AnimateRadioGroup'
import AnimateRadio from './components/AnimateRadio'
import JsonViewer from './components/JsonViewer'

import DateTime from 'luxon/src/datetime.js'
import axios from 'axios'
import * as _ from 'lodash'

import chartHelper from '../js/helper/chartHelper'

const AJAX_STATE = require('../json/ajax-state.json')
const CHART_LIB = require('../json/chart-lib.json')
const DATE_PERIOD_MODE = require('../json/date-period-mode.json')
import * as COLOR from '../js/colors'
export default {
  data(){
    return {
      getRemoteDataAjaxState: AJAX_STATE.ISNOTASKED,
      AJAX_STATE,
      DATE_PERIOD_MODE,
      datePeriodMode: this.$store.state.activeDatePeriodMode,
      showTable: false,
      showJSON: false
    }
  },
  components: {
    DownloadMenu,
    AnimateRadioGroup,
    AnimateRadio,
    JsonViewer
  },
  computed: {
      activityClassList(){
        return this.$store.state.activityClassList
      },
      activeDatePeriodMode(){
        return this.$store.state.activeDatePeriodMode
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
      },
      downloadDataRows(){
        return [['序号', '日期'].concat(_.map(this.activityClassList, 'LocalName')).concat(['是否禁用'])]
          .concat(_.map(this.activityListTable, (d, i) => [i + 1, DateTime.fromISO(d.ActivityRoundDate).toFormat('yyyy-MM-dd')].concat(_.map(this.activityClassList, (ac) => d[ac.Name])).concat([d.Disable])))
      }
  },
  methods: {
    updateData(){
      this.getRemoteDataAjaxState = AJAX_STATE.PENDDING
      Promise.all([this.$store.dispatch('getRDActivityList'), this.$store.dispatch('getRDActivityClassList')])
        .then(results => {
          this.getRemoteDataAjaxState = AJAX_STATE.COMPLETE
          chartHelper.drawChart('highcharts', this.$refs.WIMTChartBox, {
              activityList: _.filter(results[0], a => a.Disable == 0),
              activityClassList: results[1],
              datePeriodMode: this.activeDatePeriodMode
          })
          this.$store.commit('shouldUpdateActivityList', false)
        })
        .catch(reason => {
          this.getRemoteDataAjaxState = AJAX_STATE.COMPLETE
        })
    },
    onShowTable(){
      this.showTable = !this.showTable
      this.showJSON = false
    },
    onShowJSON(){
      this.showJSON = !this.showJSON
      this.showTable = false
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
      this.$router.push({
        name: 'editActivity',
        params: {
          activitydate: DateTime.fromISO(row.ActivityRoundDate).toFormat('yyyy-MM-dd')
        }
      })
    },
    onDeleteActivity(row){
      axios.request({
              method: 'put',
              url: '/deleteActivity',
              data: {
                  ActivityRoundDate: DateTime.fromISO(row.ActivityRoundDate).toFormat('yyyy-MM-dd')
              }
          })
          .then(res => {
              if (res.data.code === 0) {
                Message({
                  type: 'success',
                  message: '删除成功！'
                })
                this.updateData()
              } else {
                Message({
                  type: 'error',
                  message: res.data.message
                })
              }
          })
          .catch(e => {
            Message({
              type: 'error',
              message: '未知错误！'
            })
          })
    },
    onRestoreActivity(row){
      axios.request({
              method: 'put',
              url: '/restoreActivity',
              data: {
                  ActivityRoundDate: DateTime.fromISO(row.ActivityRoundDate).toFormat('yyyy-MM-dd')
              }
          })
          .then(res => {
              if (res.data.code === 0) {
                  Message({
                    type: 'success',
                    message: '恢复成功！'
                  })
                  this.updateData()
              } else {
                Message({
                  type: 'error',
                  message: res.data.message
                })
              }
          })
          .catch(e => {
            Message({
              type: 'error',
              message: '未知错误！'
            })
          })
    },
    onChangeDatePeriodMode(dpm){
      let {
          activityList,
          activityClassList
      } = this.$store.state
      this.$store.commit('activeDatePeriodMode', dpm)
      this.$nextTick(() => {
        chartHelper.drawChart('highcharts', this.$refs.WIMTChartBox, {
            activityList,
            activityClassList,
            datePeriodMode: dpm
        })
      })
    }
  },
  mounted(){
    if (this.$store.state.shouldUpdateActivityList === true) {//状态被更新了
      this.updateData()
    }else{//状态被缓存了
      let {
          activityList,
          activityClassList
      } = this.$store.state
      chartHelper.drawChart('highcharts', this.$refs.WIMTChartBox, {
          activityList,
          activityClassList,
          datePeriodMode: this.activeDatePeriodMode
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
.toolbox .toolitem{
  display: inline-block;
  vertical-align: middle;
  margin-right: 10px;
}
.toolitem,.opra-icon{
  cursor: pointer;
}
.opra-icon:not(:first-child){
  margin-left: 5px;
}
</style>
