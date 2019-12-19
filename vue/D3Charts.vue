<template lang="html">
  <div class=""
    v-loading="getRemoteDataAjaxState === AJAX_STATE.PENDDING"
    element-loading-text="数据加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.5)">
    <el-row type="flex" justify="space-around">
      <el-col :span="10">
        <funnel>
        </funnel>
      </el-col>
      <el-col :span="10">
        <ranking-list>
        </ranking-list>
      </el-col>
    </el-row>

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

import * as _ from 'lodash-es'

import axios from 'axios'
const AJAX_STATE = require('../json/ajax-state')
import DateTime from 'luxon/src/datetime'

import Funnel from './components/charts/Funnel'
import RankingList from './components/charts/RankingList'

export default {
  components: {
    Funnel,
    RankingList
  },
  data(){
    return {
      AJAX_STATE,
      getRemoteDataAjaxState: AJAX_STATE.ISNOTASKED
    }
  },
  computed: {
  },
  methods: {
  },
  watch: {
  },
  beforeRouteUpdate(){
  },
  mounted(){
    console.dir('d3 charts')
  }
}
</script>

<style lang="css">
</style>
