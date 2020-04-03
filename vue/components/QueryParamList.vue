<template lang="html">
  <div class="query-param-list-wrapper">
    <el-form :inline="true" size="small" :model="queryFormModel" ref="queryParamListForm" label-suffix="："
     :label-width="`${formStyle.labelWidth}px`">
     <el-row type="flex" justify="space-between">
       <div class="el-col">
         <el-form-item v-for="queryParam in queryParamList" :key="queryParam.name" :label="queryParam.title" :prop="queryParam.name">
           <el-input v-if="queryParam.comp_type === QUERY_PARAM_COMP_TYPE.INPUT" :style="queryParam.style || 'width: 150px;'" v-model="queryFormModel[queryParam.name]" placeholder="" :clearable="queryParam.clearable">
           </el-input>
           <el-select v-else-if="queryParam.comp_type === QUERY_PARAM_COMP_TYPE.SELECT" :style="queryParam.style || 'width: 90px;'" v-model="queryFormModel[queryParam.name]" :placeholder="queryParam.clearable ? '请选择' : ''" :clearable="!!queryParam.clearable">
             <el-option v-for="opt in queryParam.options" :label="opt.title" :key="opt.key" :value="opt.key">
             </el-option>
           </el-select>
    			 <el-date-picker v-else-if="queryParam.comp_type === QUERY_PARAM_COMP_TYPE.DATE" class="w-150" v-model="queryFormModel[queryParam.name]" type="date" align="right" :placeholder="queryParam.title"
    				:picker-options="pickerOptions">
    			 </el-date-picker>
           <el-date-picker v-else-if="queryParam.comp_type === QUERY_PARAM_COMP_TYPE.DATE_RANGE" v-model="queryFormModel[queryParam.name]" type="daterange" align="right" :placeholder="queryParam.title"
    				:picker-options="pickerOptions">
    			 </el-date-picker>
           <div v-else class="unknown-query-param-comp-type">
             comp_type未知
           </div>
         </el-form-item>
       </div>
       <div class="el-col">
         <div class="query-param-btns">
         <el-form-item label="">
           <el-button @click.native="onResetQueryParams" size="mini" title="重置" icon="el-icon-reset">重置</el-button>
           <el-button v-keyup-enter-query @click="onSearch" size="mini" type="primary" title="查询" icon="el-icon-search">查询</el-button>
         </el-form-item>
         </div>
       </div>
     </el-row>

    </el-form>
  </div>
</template>

<script>
import Vue from 'vue';
import {
  Form,
  FormItem,
  Select,
  Option,
  Input,
  InputNumber,
  DatePicker,
  Button,
  Row,
  Col
} from 'element-ui';

Vue.use(Form);
Vue.use(FormItem);
Vue.use(Select);
Vue.use(Option);
Vue.use(Input);
Vue.use(InputNumber);
Vue.use(DatePicker);
Vue.use(Button);
Vue.use(Row);
Vue.use(Col);

import * as _ from 'lodash-es';
import {
  pickerOptions
} from '@/js/constant/common-config.js'
import { QUERY_PARAM_COMP_TYPE } from '@/js/constant/query-param-comp-type.js';
import rtc from '@/js/utils.js'

export default {
  data(){
    return {
      QUERY_PARAM_COMP_TYPE,
      queryFormModel: {},
      pickerOptions
    }
  },
  computed: {

  },
  props: {
    queryParamList: {
      type: Array,
      default: function(){
        return []
      }
    },
    formStyle: {
      type: Object,
      default: function(){
        return {
          labelWidth: 90
        }
      }
    }
  },
  methods: {
    onResetQueryParams(){
      this.$refs.queryParamListForm.resetFields()
    },
    onSearch(){
      const params = rtc.utils.compactPlainObject(this.queryFormModel)
      this.$emit('on-search', params)
    }
  },
  created(){
    this.queryFormModel = _.reduce(this.queryParamList, (res, qp) => {
      res[qp.name] = qp.defaultValue
      return res
    }, {})
  }
}
</script>

<style lang="scss">
@import "@/css/sass/base.scss";
.unknown-query-param-comp-type{
  color: map-get($status-colors, warning);
}

.query-param-btns{
  text-align: center;
  button.el-button{
    &:not(:last-child){
      margin-bottom: 10px;
    }
    width:90px;
    display: block;
    margin: 0 auto;
  }
}

</style>
