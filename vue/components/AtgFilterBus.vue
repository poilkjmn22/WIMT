<!--
 * @Author: fangqi
 * @Date: 2021-07-14 11:37:15
 * @LastEditors: fangqi
 * @LastEditTime: 2022-01-26 11:32:04
 * @Description: 业务数据筛选器
 * @Copyright(c) 2021 CMIM Network Co.,Ltd. All Rights Reserved
-->
<template>
  <div class="filter-contaier">
    <slot name="leftBtns">
      <div class="filter-btns"></div>
    </slot>

    <el-form :model="formModel" ref="form" label-width="labelWidth" class="filter-box">
      <el-form-item
        v-for="filter in filters"
        :key="filter.field"
        :prop="filter.field"
        :rules="filter.rules"
        v-show="filter.hidden !== true"
      >
        <div class="filter-item">
          <div class="label">{{ $t(`filterBus.${filter.field}`) }}</div>

          <template v-if="filter.type === filterTypes.SELECT">
            <el-select
              :name="filter.field"
              :filterable="filter.filterable"
              :ref="getFilterBusItemRef(filter)"
              v-model="formModel[filter.field]"
              v-bind="{ placeholder: getPlaceHolder(filter), ...filter.elAttrs }"
              @focus="handleFocusSelect(filter)"
              @change="handleChangeSelect(filter)"
              @remote-query="handleRemoteQuery"
            >
              <el-option
                v-for="item in filter.options"
                :key="item[filter.valueK || 'value']"
                :label="item[filter.labelK || 'label']"
                :value="'type' in item ? item.type : item[filter.valueK || 'value']"
              ></el-option>
            </el-select>
          </template>

          <template v-else-if="filter.type === filterTypes.DATE">
            <el-date-picker
              v-model="formModel[filter.field]"
              v-bind="filter.elAttrs"
              :placeholder="getPlaceHolder(filter)"
              @change="handleChangeDate(filter)"
            >
            </el-date-picker>
          </template>

          <template v-else-if="filter.type === filterTypes.DATE_WITH_PERIOD">
            <el-select v-model="formModel[filter.field2]" placeholder="请选择" style="width: 100px">
              <el-option v-for="item in filter.options" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
            <DateSeasonPicker
              v-if="formModel[filter.field2] === 'season'"
              v-model="formModel[filter.field]"
              :picker-options="filter.elAttrs.pickerOptions"
              placeholder="选择日期"
              style="width: 150px"
            />
            <el-date-picker
              v-else
              v-model="formModel[filter.field]"
              :type="formModel[filter.field2]"
              v-bind="filter.elAttrs"
              :format="formModel[filter.field2] === 'week' ? 'yyyy年第WW周' : null"
            ></el-date-picker>
          </template>

          <template v-else-if="filter.type === filterTypes.REGION">
            <el-cascader
              v-model="formModel[filter.field]"
              :props="{ label: 'name', value: 'id' }"
              :options="regionList"
              placeholder="请选择省/市/区"
            ></el-cascader>
          </template>

          <template v-else>
            <slot :name="filter.type" v-bind="{ filter, formModel }">
              <el-input
                v-model.trim="formModel[filter.field]"
                v-bind="{ placeholder: getPlaceHolder(filter), clearable: true, ...filter.elAttrs }"
              ></el-input>
            </slot>
          </template>
        </div>
      </el-form-item>
    </el-form>

    <div class="query-btns">
      <el-button type="primary" :loading="loadingOptions" @click="loadData" v-enter>{{ $t('filterBus.btnQuery') }}</el-button>
      <el-button v-if="needReset" type="primary" :loading="loadingOptions" plain @click="btnReset">{{
        $t('filterBus.btnReset')
      }}</el-button>
      <template><slot name="extraButton"></slot></template>
    </div>
  </div>
</template>
<script>
import DateSeasonPicker from '@/components/DateSeasonPicker'
import request from '@/utils/request'
import { isArray, isFunction, isString, isDate, cloneDeep } from 'lodash-es'
import { DateTime } from 'luxon'
import { dateFormatType } from '@/utils/format.js'
import regionList from '@/utils/region.json'

const filterTypes = {
  SELECT: 'select',
  DATE: 'date',
  DATE_WITH_PERIOD: 'dateWithPeriod',
  REGION: 'region'
}

function remoteOptionsCbDefault(res, filter) {
  filter.options = res.result || []
}

export default {
  components: {
    DateSeasonPicker
  },
  props: {
    filters: Array,
    convertFormModel: {
      type: Function,
      default: obj => obj
    },
    needReset: {
      type: Boolean,
      default: true
    },
    labelWidth: {
      type: String,
      default: '10px'
    }
  },
  data() {
    return {
      formModel: {},
      filterTypes,
      loadingOptions: false,
      exportLoading: false
    }
  },
  created() {
    //  填充默认值
    this.filters.forEach(item => {
      if (item.type === 'select' && !item.options) {
        this.$set(item, 'options', [])
      }
      if (item.elAttrs && item.elAttrs.remote) {
        item.elAttrs.remoteMethod = function (query) {
          this.$emit('remote-query', query, this.name)
        }
      }
    })
    this.formModel = Object.assign(
      {},
      this.filters.reduce((res, item) => {
        res[item.field] = item.defaultValue || ''
        if ('field2' in item) {
          res[item.field2] = item.defaultValue2 || ''
        }
        return res
      }, {})
    )
    /* console.log(this.filters) */
    this.regionList = regionList
  },
  async mounted() {
    const frp = this.filters.filter(f => !!f.remoteOptions)
    if (frp.length === 0) {
      return
    }
    this.loadingOptions = true
    try {
      const res = await Promise.all(
        frp.map(f => {
          let remoteOptions
          if (isString(f.remoteOptions)) {
            remoteOptions = () => request({ url: f.remoteOptions })
          } else if (isFunction(f.remoteOptions)) {
            remoteOptions = f.remoteOptions
          } else {
            remoteOptions = () => request(f.remoteOptions || null)
          }
          return remoteOptions()
        })
      )
      res.forEach((r, i) => {
        let remoteOptionsCb = remoteOptionsCbDefault
        const f = frp[i]
        if (isFunction(f.remoteOptionsCb)) {
          remoteOptionsCb = f.remoteOptionsCb
        }
        remoteOptionsCb(r, f, this)
      })
      this.$emit('remote-options-complete')
    } catch (e) {
      console.error(e)
    }
    this.loadingOptions = false
  },
  methods: {
    getFilterBusItemRef(filter) {
      return `filterBusItem${filter.field}`
    },
    handleChangeSelect(val) {
      this.$emit('change-select', val, this.formModel, this.filters)
    },
    handleChangeDate(val) {
      this.$emit('change-date', val, this.formModel)
    },
    async loadData() {
      const valid = await this.$refs.form.validate()
      if (valid) {
        this.$emit('load-data')
      }
    },
    formatFieldValues(obj) {
      for (const k in obj) {
        if (isArray(obj[k]) && obj[k].length === 0) {
          obj[k] = ''
        }
        if (isDate(obj[k])) {
          obj[k] = DateTime.fromJSDate(obj[k]).toFormat(dateFormatType.day)
        }
        if (obj[k] && isDate(obj[k][0]) && isDate(obj[k][1])) {
          //日期范围
          obj[k.replace(/Range/, 'Start')] = DateTime.fromJSDate(obj[k][0]).toFormat(dateFormatType.day)
          obj[k.replace(/Range/, 'End')] = DateTime.fromJSDate(obj[k][1]).toFormat(dateFormatType.day)
          delete obj[k]
        }
        //...
      }
      return obj
    },
    getConvertedFormModel() {
      const obj = cloneDeep(this.formModel)
      return this.formatFieldValues(this.convertFormModel(obj))
    },
    btnReset() {
      this.$refs.form.resetFields()
      this.filters.forEach(a => {
        if ('field2' in a) {
          this.formModel[a.field2] = a.defaultValue2 || ''
        }
        if (a.type === 'select' && a.elAttrs.remote === true) {
          a.options = []
        }
      })
      this.$emit('reset-filter')
      this.$emit('load-data')
    },
    handleRemoteQuery(query, name) {
      this.$emit(
        'remote-query-select',
        query,
        this.filters.find(f => f.field === name),
        this.formModel
      )
    },
    handleFocusSelect(filter) {
      if (!filter.elAttrs || !filter.elAttrs.remoteMethod || filter.options.length > 0) {
        return //已经查询过，不需再次查询
      }
      const ref = this.$refs[this.getFilterBusItemRef(filter)][0]
      ref.remoteMethod(ref.query)
    },
    find(field) {
      return this.filters.find(f => f.field === field)
    },
    getValue(field) {
      return this.formModel[field]
    },
    remove(field) {
      const fd = this.filters.findIndex(f => f.field === field)
      if (fd > -1) {
        this.filters.splice(fd, 1)
      }
    },
    getPlaceHolder(filter) {
      const place = this.$store.getters.locale === 'zh' ? '请输入' : ''
      const holder = this.$i18n.t(`filterBus.${filter.field}`)
      return `${place}${holder}`
    }
  }
}
</script>
<style lang="scss" scoped>
/* 列表查询条件 */
.filter-contaier {
  display: flex;
  padding-top: 20px;
  .filter-box {
    position: relative;
    flex: 1;
    display: flex;
    justify-content: flex-end;
    flex-wrap: wrap;
  }
  $filterWidth: 245px;
  .el-input,
  .el-date-editor.el-input,
  .el-date-editor.el-input__inner {
    width: $filterWidth;
  }
  .el-date-editor.el-date-editor--datetimerange {
    width: 335px;
  }
  .el-select {
    width: 148px;
    .el-input {
      width: 100%;
    }
  }
  .el-select-dropdown {
    max-width: 300px;
  }
  .el-date-editor--daterange.el-input,
  .el-date-editor--daterange.el-input__inner {
    width: 210px;
  }
  .el-date-editor--date.el-input,
  .el-date-editor--date.el-input__inner {
    width: 152px;
  }
  .el-form-item__label {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    padding-left: 5px;
    padding-right: 8px;
  }
  .filter-btns {
    .iconfont {
      font-size: 12px;
      margin-right: 5px;
    }
  }

  .query-btns {
    display: flex;
    align-items: flex-start;
  }
}

.filter-item {
  display: inline-table;
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  line-height: normal;
  .label {
    background-color: #f7f7f7;
    color: #666;
    vertical-align: middle;
    display: table-cell;
    position: relative;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    padding: 0 20px;
    width: 1px;
    white-space: nowrap;
    border-right: 0;
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
    font-size: 13px;
  }
  /deep/.el-input__inner {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }

  /deep/.el-select__tags-text {
    display: inline-block;
    max-width: 45px;
    overflow: hidden;
    text-overflow: ellipsis;
    vertical-align: middle;
  }
  [class^='el-'] {
    width: 170px;
  }
  /deep/.el-cascader {
    width: 245px;
  }

  /deep/ + .el-form-item__error {
    left: 92px;
  }
}

/deep/.el-form-item {
  margin-right: 15px;
}
</style>
