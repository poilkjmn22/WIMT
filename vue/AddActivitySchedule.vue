<template lang="html">
  <div class="">
    <el-button @click="onSubmitAddActivity" type="primary">提交
    </el-button>
    <div class="" ref="fullCalendarBox">

    </div>

    <el-dialog :visible="dialogVisible" :show-close="false">
      <el-form :model="addingActivityForm" label-width="100px" label-suffix="：">
        <el-from-item label="活动类别">
          <el-select v-model="addingActivityForm.activityClass">
            <el-option v-for="ac in activityClassList" :key="ac.Name" :label="ac.LocalName" :value="ac.Name">
            </el-option>
          </el-select>
        </el-from-item>
        <el-from-item label="">
          <el-button @click="onConfirmAddActivity" type="primary">确定
          </el-button>
        </el-from-item>

      </el-form>

    </el-dialog>
  </div>
</template>

<script>
// import ScheduleCalendar from './components/ScheduleCalendar'
import {Calendar} from '@fullcalendar/core'
import zhCnLocale from '@fullcalendar/core/locales/zh-cn'
import interaction from '@fullcalendar/interaction'
import timeGrid from '@fullcalendar/timegrid'

import '@fullcalendar/core/main.css'
import '@fullcalendar/timegrid/main.css'

import Vue from 'vue'
import {Dialog, Form, FormItem, Select, Option, Button} from 'element-ui'
Vue.use(Dialog)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Select)
Vue.use(Option)
Vue.use(Button)

import _ from 'lodash'
import axios from 'axios'
import DateTime from 'luxon/src/datetime.js'
export default {
  components: {
    // ScheduleCalendar
  },
  data(){
    return {
      dialogVisible: false,
      addingActivityForm: {
        activityClass: '',
        args: null
      }
    }
  },
  computed: {
    activityClassList(){
      return this.$store.state.activityClassList
    }
  },
  methods: {
    onConfirmAddActivity(){
      this.fc.addEvent({
        start: this.addingActivityForm.args.start,
        end: this.addingActivityForm.args.end,
        title: _.chain(this.activityClassList)
          .find(['Name', this.addingActivityForm.activityClass])
          .get('LocalName')
          .value(),
        id: this.addingActivityForm.activityClass
      })
      this.fc.unselect()
      this.dialogVisible = false
    },
    onSubmitAddActivity(){
      function getFormFromFullCalendar(fc, acl){
        let events = fc.getEvents()
        return _.chain(acl)
          .reduce((res, ac) => {
            let event = _.find(events, ['id', ac.Name])
            res[ac.Name] = event && `${event.start}~${event.end}` || '0'
            return res
          }, {})
          .value()
      }
      axios.request({
        method: 'put',
        url: '/addActivityRound',
        data: _.merge(getFormFromFullCalendar(this.fc, this.activityClassList), {
          ActivityRoundDate: DateTime.local().toFormat('yyyy-MM-dd')
        })
      })
        .then(res => {
          // this.submitAjaxState = AJAX_STATE.COMPLETE
          if(res.data.code === 0){
            Message({
              type: 'success',
              message: res.data.message
            })
            //通知保存的activityList状态应该要更新了
            this.$store.commit('shouldUpdateActivityList', true)
          }else{
            Message({
              type: 'error',
              message: res.data.message
            })
          }
        })
        .catch(e => {
          // this.submitAjaxState = AJAX_STATE.COMPLETE
        })
    }
  },
  mounted(){
    this.fc = new Calendar(this.$refs.fullCalendarBox, {
      plugins: [timeGrid, interaction],
      defaultView: 'timeGridDay',
      locale: zhCnLocale,
      selectable: true,
      selectMirror: true,
      selectOverlap: false,
      editable: true,
      select: (args) => {
          this.addingActivityForm.args = args
          this.dialogVisible = true
      },
      header: {
        left: 'prev,next today',
        center: 'title',
        right: 'timeGridWeek, timeGridDay'
      }
    })
    this.fc.render()

    this.$store.dispatch('getRDActivityClassList')
      .then(acl => {
        this.addingActivityForm.activityClass = _.get(acl, [0, 'Name'])
      })
  }
}
</script>

<style lang="css">
</style>
