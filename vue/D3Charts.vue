<template lang="html">
  <div class=""
    v-loading="getRemoteDataAjaxState === AJAX_STATE.PENDDING"
    element-loading-text="数据加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.5)">
    d3 charts
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

export default {
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
