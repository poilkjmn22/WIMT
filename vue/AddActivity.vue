<template lang="html">
  <div class=""
    v-loading="getRemoteDataAjaxState === AJAX_STATE.PENDDING"
    element-loading-text="数据加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.5)">
    <el-form ref="form" :model="form" label-width="120px" label-suffix="" :rules="formRules">
      <el-form-item label="活动日期">
        <el-date-picker type="date" placeholder="选择日期" v-model="ActivityRoundDate"></el-date-picker>
      </el-form-item>
      <el-row v-for="itemChunk in ActivityClassListChunk">
        <el-col v-for="item in itemChunk" :span="24 / ActivityClassListChunkSize">
          <el-form-item :label="item.Name" :prop="item.Name">
            <el-input v-model.trim="form[item.Name]" class="w-200" clearable :placeholder="'请输入' + item.Name">
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item label="">
          <el-button class="w-150" :loading="submitAjaxState === AJAX_STATE.PENDDING" @click="onSubmit" size="big" type="primary" title="提交">提交</el-button>
          <el-button class="w-150"  @click="onReset" size="big" type="primary" title="重置">
            <i class="iconfont icon-reset"></i>重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import Vue from 'vue'
import {Form, FormItem, Button,Input, DatePicker, Loading, Row, Col, Message} from 'element-ui'
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Button)
Vue.use(Input)
Vue.use(DatePicker)
Vue.use(Loading)
Vue.use(Row)
Vue.use(Col)

import wimt from '../js/utils'

import _isFunction from 'lodash/isFunction'
import _chunk from 'lodash/chunk'
import _merge from 'lodash/merge'
import _reduce from 'lodash/reduce'

import axios from 'axios'
const AJAX_STATE = require('../json/ajax-state.json')
import DateTime from 'luxon/src/datetime'

const validateActivityDuration = function(rule, value, callback){
  if(value){
    if(!/(\d+\.?\d*)h?/.test(value)){
      callback(new Error('请输入正确格式！'))
    }else{
      callback()
    }
  }else{
    callback()
  }
}

export default {
  data(){
    return {
      getRemoteDataAjaxState: AJAX_STATE.ISNOTASKED,
      submitAjaxState: AJAX_STATE.ISNOTASKED,
      AJAX_STATE,
      ActivityRoundDate: DateTime.local().minus({days: 1}).toJSDate(),
      form: {},
      ActivityClassList: [],
      ActivityClassListChunkSize: 2,
      formRules: {}
    }
  },
  computed: {
    ActivityClassListChunk(){
      return _chunk(this.ActivityClassList, this.ActivityClassListChunkSize)
    }
  },
  methods: {
    initForm(){
      this.form = _reduce(this.ActivityClassList, (res, d) => {
        res[d.Name] = ''
        return res
      }, {})
    },
    initFormRules(){
      this.formRules = _reduce(this.ActivityClassList, (res, d) => {
        res[d.Name] = {validator: validateActivityDuration, trigger: 'blur'}
        return res
      }, {})
    },
    onSubmit(){
      this.$refs.form.validate(valid => {
        if(valid){
          this.submitAjaxState = AJAX_STATE.PENDDING
          axios.request({
            method: 'put',
            url: '/addActivityRound',
            data: _merge(this.form, {
              ActivityRoundDate: DateTime.fromJSDate(this.ActivityRoundDate).toFormat('yyyy-MM-dd')
            })
          })
            .then(res => {
              this.submitAjaxState = AJAX_STATE.COMPLETE
              if(res.data.code === 0){
                Message({
                  type: 'success',
                  message: res.data.message
                })
                this.initForm()
              }else{
                Message({
                  type: 'error',
                  message: res.data.message
                })
              }
            })
            .catch(e => {
              this.submitAjaxState = AJAX_STATE.COMPLETE
            })
        }else{
          return false
        }
      })
    },
    onReset(){
      this.$refs.form.resetFields()
    },
    getRemoteData(success, error){
      this.getRemoteDataAjaxState = AJAX_STATE.PENDDING
      axios.request({
        method: 'get',
        url: '/getActivityClassList'
      })
        .then(res => {
          this.getRemoteDataAjaxState = AJAX_STATE.COMPLETE
          if(res.data.code === 0){
            if(_isFunction(success)){
              success.call(this, res.data.results)
            }
          }else {
            Message({
              type: 'error',
              message: res.data.message
            })
          }
        })
        .catch(e => {
          this.getRemoteDataAjaxState = AJAX_STATE.COMPLETE
          Message({
            type: 'error',
            message: '未知错误!'
          })
          if(_isFunction(error)){
            error.call(this, e)
          }
        })
    }
  },
  watch: {
    form: {
      deep: true,
      handler: function(val, oldVal){
        //确保总和是24h
        var last = ''
        var total = 0
        var emptyValCount = 0
        for (var key in val) {
          if (val.hasOwnProperty(key)) {
            if(val[key] == ''){
              last = key
              emptyValCount += 1
            }
            total += wimt.utils.parseDuration(val[key])
          }
        }
        if(emptyValCount === 1){
          val[last] = parseFloat((24 - total).toFixed(1))
        }
        // if(emptyValCount === 0 && parseInt(total) != 24){
        //   Message({
        //     type: 'warning',
        //     message: '总时间不是24h，请重新检查！'
        //   })
        // }
      }
    }
  },
  mounted(){
    this.getRemoteData(data => {
      this.ActivityClassList = data
      this.initForm()
      this.initFormRules()
    })
  }
}
</script>

<style lang="css">
</style>
