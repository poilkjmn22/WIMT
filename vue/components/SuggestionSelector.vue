<template lang="html">
  <span class="suggestion-selector-wrapper">
    <el-button plain type="primary" @click="suggestionDialogVisible = !suggestionDialogVisible">选择</el-button>
    <el-dialog @open="onSuggest" :title="dialogTitle" :visible.sync="suggestionDialogVisible" :before-close="onBeforeCloseSuggestionDialog">
      <el-input
        style="width: 100%;margin-bottom: 20px"
        v-model.trim="searchKWD"
        clearable
        :placeholder="searchPlaceholder">
        <el-button
          @click="onSuggest"
          @keyup-enter-query="onSuggest"
          slot="append"
          style="width: 60px">
          <i class="iconfont icon-icon_search"></i>
        </el-button>
      </el-input>
			<div class="suggestion-radio-group-wrapper"
        v-loading="fetchSuggestionsAjaxState === AJAX_STATES.PENDDING"
        element-loading-text=""
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(255, 255, 255, 0.8)">
        <div v-show="hasNoData" style="padding-top: 80px;text-align: center;" class="">
          查无数据
        </div>
				<el-radio-group
					class="suggestion-radio-group"
					v-model="selectValue"
					size="medium">
					<el-radio-button
						v-for="item in suggestions"
						:key="item.id"
						:label="item"
						@dblclick.native="onSelectValue">
						<span class="" style="margin-right: 10px">{{ item.name}}</span><span>{{ item.phone}}</span>
					</el-radio-button>
				</el-radio-group>
			</div>
			<div slot="footer" class="dialog-footer">
		    <el-button @click="suggestionDialogVisible = false">取 消</el-button>
		    <el-button type="primary" @click="onSelectValue">确 定</el-button>
		  </div>
		</el-dialog>
  </span>
</template>

<script>
import Vue from 'vue'
import {Button,Dialog,Input, RadioGroup, Radio, Loading} from 'element-ui'
Vue.use(Button)
Vue.use(Dialog)
Vue.use(Input)
Vue.use(RadioGroup)
Vue.use(Radio)
Vue.use(Loading)

const AJAX_STATES = require('../../json/ajax-states.json');

export default {
  data(){
    return {
      suggestionDialogVisible: false,
      searchKWD: '',
      suggestions: [],
      selectValue: null,
      fetchSuggestionsAjaxState: AJAX_STATES.ISNOTASKED,
      AJAX_STATES
    }
  },
  computed: {
    hasNoData(){
      return this.fetchSuggestionsAjaxState === AJAX_STATES.COMPLETE && (!this.suggestions || this.suggestions.length <= 0)
    }
  },
  props: {
    fetchSuggestions: Function,
    searchPlaceholder: {
      type: String,
      default: '输入老师姓名/手机号'
    },
    dialogTitle: {
      type: String,
      default: '请选择'
    }
  },
  methods: {
    onSuggest(){
      this.fetchSuggestionsAjaxState = AJAX_STATES.PENDDING
      this.fetchSuggestions(this.searchKWD, suggestions => {
        this.fetchSuggestionsAjaxState = AJAX_STATES.COMPLETE
        if (Array.isArray(suggestions)) {
          this.suggestions = suggestions;
        } else {
          console.error('[Element Error][Autocomplete]autocomplete suggestions must be an array');
        }
      })
    },
    onBeforeCloseSuggestionDialog(){
      this.suggestionDialogVisible = false;
    },
    onSelectValue(){
      this.suggestionDialogVisible = false;
      this.$emit('select-value', this.selectValue)
    }
  },
  watch: {
    searchKWD(val){
      this.onSuggest()
    }
  }
}
</script>

<style lang="scss">
  @import "@/element-variables.scss";
  .suggestion-selector-wrapper{
    display: inline-block;
    .el-button{
      padding: 12px 15px;
    }
    .el-input-group__append{
      background: $--color-primary;
      color: white;
    }
  }

  .suggestion-radio-group-wrapper {
    height: 350px;
    overflow: hidden;
    .el-radio-group {
      width: 100%;
      height: 100%;
      border-right: 1px solid #EBEBEB;
      overflow-y: auto;
      &:nth-last-of-type(1) {
        border-right: none;
      }
    }
    .el-radio-button {
      width: 100%;
    }
    .el-radio-button__inner {
      width: 100%;
      text-align: left;
      border: none;
      &:hover {
        color: #606266;
        background-color: #F6F7FB;
      }
    }
    .el-radio-button__orig-radio:checked + .el-radio-button__inner {
      color: #1AA5FF;
      background-color: #F6F7FB;
    }
    .el-radio-button:first-child .el-radio-button__inner {
      border-left: none;
    }
    .el-input-group__append {
        color: #fff;
        background-color: #1AA5FF;
        border-color: #1AA5FF;
        border-top-left-radius: 0 !important;
        border-bottom-left-radius: 0 !important;
    }
  }
</style>
