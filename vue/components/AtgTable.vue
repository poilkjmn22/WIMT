<!--
 * @Author: zhangchuanzhong
 * @Date: 2021-04-20 14:56:25
 * @LastEditors: xu jun, fangqi
 * @LastEditTime: 2022-01-06 15:20:33
 * @Description: 表格+分页组件封装
 * @Copyright(c) 2021 CMIM Network Co.,Ltd. All Rights Reserved
-->
<template>
  <div class="atg-table">
    <el-table
      v-if="show"
      v-loading="columnConfigLoading"
      ref="table"
      class="table-box"
      header-row-class-name="table-header"
      :highlight-current-row="highlightCurrentRow"
      tooltip-effect="light"
      :data="tableData"
      v-bind="$attrs"
      v-on="$listeners"
      stripe
    >
      <el-table-column v-if="index" type="index" label="序号" width="45"></el-table-column>
      <el-table-column v-if="selection" type="selection" :reserve-selection="reserveSelection" width="45"></el-table-column>
      <template v-for="{ slot, title, filters, selections, ...rest } in tableColumns">
        <el-table-column :width="rest.width" :key="rest.prop" :column-key="rest.prop" v-bind="rest" show-overflow-tooltip>
          <template #header>
            <slot v-if="slot && slot.header" :name="slot.header">{{ rest.label }}</slot>
            <slot v-else>
              <span :class="{ 'is-active': filterInfo[rest.prop] !== undefined }" :title="title || ''">
                {{ rest.label }}
                <el-popover
                  v-if="filters && filters.length"
                  :ref="`popover-${rest.prop}`"
                  placement="bottom"
                  trigger="click"
                  transition="el-zoom-in-top"
                  @show="handleFilterShow(rest.prop)"
                  @hide="handleFilterClose(rest.prop)"
                >
                  <AtgTableFilterPanel
                    v-if="filterPanelVisible[rest.prop]"
                    :filteredValue="filterInfo[rest.prop]"
                    :column="{ ...rest, filters }"
                    @confirm="handleFilterConfirm"
                    @close="handleFilterClose"
                  />
                  <i slot="reference" class="iconfont iconfilter" @click="$event => handleFilterClick($event)"></i>
                </el-popover>
                <el-popover
                  v-if="selections && selections.length"
                  popper-class="table-selections-popper"
                  :ref="`popover-${rest.prop}`"
                  placement="bottom"
                  trigger="click"
                  transition="el-zoom-in-top"
                  @show="handleFilterShow(rest.prop)"
                  @hide="handleFilterClose(rest.prop)"
                >
                  <AtgTableSelectionPanel
                    v-if="filterPanelVisible[rest.prop]"
                    :value="filterInfo[rest.prop]"
                    :column="{ ...rest, selections }"
                    @select="handleFilterConfirm"
                    @close="handleFilterClose"
                  />
                  <i slot="reference" class="icon el-icon-caret-bottom"></i>
                </el-popover>
              </span>
            </slot>
          </template>
          <template v-if="slot && slot.body" #default="scope">
            <slot :name="slot.body" :index="scope.$index" :row="scope.row">{{ formatEmptyValue(scope.row[rest.prop]) }}</slot>
          </template>
          <template v-else #default="scope">
            <slot v-if="slot && slot.expand" :name="slot.expand" :index="scope.$index" :row="scope.row">
              {{ formatEmptyValue(scope.row[rest.prop]) }}
            </slot>
            <template v-else>
              {{
                rest.formatter
                  ? formatEmptyValue(rest.formatter(scope))
                  : rest.extend
                  ? formatExtendFieldValue(scope.row, rest.prop)
                  : formatEmptyValue(scope.row[rest.prop])
              }}
            </template>
          </template>
        </el-table-column>
      </template>
      <template slot="empty">
        <div class="empty-box">
          <img src="~@/assets/common/empty.png" alt="" />
          <p>暂无数据</p>
        </div>
      </template>
      <slot></slot>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      class="pagination-box"
      background
      v-if="paging"
      :pager-count="5"
      :current-page="pageNum"
      :page-size="pageSize"
      :total="total"
      :page-sizes="pageSizes"
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    >
    </el-pagination>
    <!-- 表格列设置 -->
    <AtgTableColumn v-if="columnConfigVisible" :show.sync="columnConfigVisible" :columns="configColumns" @submit="tableColumnSubmit" />
  </div>
</template>
<script>
import AtgTableColumn from './AtgTableColumn.vue'
import AtgTableFilterPanel from './AtgTableFilterPanel.vue'
import AtgTableSelectionPanel from './AtgTableSelectionPanel'

export default {
  inheritAttrs: false,
  components: {
    AtgTableColumn,
    AtgTableFilterPanel,
    AtgTableSelectionPanel
  },
  props: {
    // 数据
    data: {
      type: [Object, Array],
      default: () => {
        return {
          list: [],
          pageNum: 1,
          pageSize: 10,
          total: 0
        }
      }
    },
    // 表格项
    columns: {
      type: Array,
      default: () => []
    },
    highlightCurrentRow: {
      type: Boolean,
      default: true
    },
    // 是否序号
    index: {
      type: Boolean,
      default: false
    },
    // 是否复选框
    selection: {
      type: Boolean,
      default: false
    },
    // 数据改变仍然保留之前选中
    reserveSelection: {
      type: Boolean,
      default: false
    },
    // 是否分页
    paging: {
      type: Boolean,
      default: true
    },
    // 每页分页条数大小
    pageSizes: {
      type: Array,
      default: () => {
        return [10, 15, 20, 30, 50]
      }
    },
    // 是否需要表格设置
    hasColumnConfig: {
      type: Boolean,
      default: false
    },
    // 表格设置是否保存
    isColumnConfigSave: {
      type: Boolean,
      default: false
    },
    // 节点code，hasColumnConfig为true时有效
    nodeCode: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      show: false,
      columnConfigVisible: false,
      columnConfigLoading: false,
      filterInfo: {},
      filterPanelVisible: {},
      fieldList: [], // 扩展字段
      tableColumns: [], // 实际展示的列
      configColumns: [] // 所有可配置的列
    }
  },
  computed: {
    pageNum: function () {
      if (this.paging) {
        return +this.data.pageNum
      } else {
        return 0
      }
    },
    pageSize: function () {
      if (this.paging) {
        return +this.data.pageSize
      } else {
        return 0
      }
    },
    total: function () {
      if (this.paging) {
        return +this.data.total
      } else {
        return 0
      }
    },
    tableData: function () {
      return this.data.list
    }
  },
  created() {
    this.filterPanels = {}
  },
  beforeDestroy() {
    const panels = this.filterPanels
    for (const prop in panels) {
      // eslint-disable-next-line no-prototype-builtins
      if (panels.hasOwnProperty(prop) && panels[prop]) {
        panels[prop].$destroy(true)
      }
    }
  },
  async mounted() {
    this.$nextTick(() => {
      this.show = true
    })

    if (this.hasColumnConfig) {
      this.columnConfigLoading = true
      await this.setAllTableColumns()
      this.setTableColumnsShow()
    } else {
      this.initTableColumns()
    }
  },
  watch: {
    columns() {
      this.initTableColumns()
      console.log(this.tableColumns)
    }
  },
  methods: {
    loadData(pageNum, pageSize) {
      this.$emit('refresh', pageNum, pageSize)
    },
    handleCurrentChange(page) {
      this.loadData(page, +this.data.pageSize)
    },
    handleSizeChange(limit) {
      this.loadData(1, limit)
    },
    // 清空排序
    clearSort() {
      this.$refs.table.clearSort()
    },
    // 清空过滤
    clearFilter() {
      this.filterInfo = {}
      this.$refs.table.clearFilter()
    },
    // 获取table ref
    getTableRef() {
      return this.$refs.table
    },
    // 点击filter
    handleFilterClick() {
      // event.stopPropagation()
    },
    // 确定表头过滤
    handleFilterConfirm(prop, data, checkAll) {
      this.$set(this.filterInfo, [prop], data)
      this.$emit(
        'filter-change',
        {
          key: prop,
          value: data instanceof Array ? [...data] : data
        },
        checkAll
      )
    },
    // 显示
    handleFilterShow(prop) {
      this.$set(this.filterPanelVisible, [prop], true)
    },
    // 关闭表头过滤
    handleFilterClose(prop) {
      const ref = this.$refs[`popover-${prop}`]
      if (ref && ref[0]) {
        ref.map(item => {
          item.doClose()
        })
        this.$set(this.filterPanelVisible, [prop], false)
      }
    },
    // null、undefined、空转为--
    formatEmptyValue(val) {
      let res = `${val === 0 || val === false || val ? val : '--'}`
      if (/[\u4e00-\u9fa5]+/.test(val) && this.$store.getters.locale !== 'zh') {
        const regDuration = /(\d+)时(\d+)分/
        if (regDuration.test(val)) {
          res = val.replace(regDuration, '$1h$2m')
        } else {
          res = this.$i18n.t(`tableData.${val}`)
        }
      }
      return res
    },
    // 获取扩展字段的值
    formatExtendFieldValue(row, id) {
      const extendList = row.extendList || []
      let result = ''
      if (extendList && extendList.length > 0) {
        for (const item of extendList) {
          if (item.id === id) {
            result = item.fieldValue
            break
          }
        }
      }

      return this.formatEmptyValue(result)
    },
    // 表格设置显示
    columnConfig() {
      this.columnConfigVisible = true
    },
    // 表格列提交，data为确定的表格列
    tableColumnSubmit(data) {
      this.tableColumns = this.configColumns.filter(item => data.indexOf(item.label) !== -1)
      this.configColumns = this.configColumns.map(item => {
        if (data.indexOf(item.label) !== -1) {
          item.isShow = true
        } else {
          item.isShow = false
        }
        return item
      })
    },
    // 设置所有的表格列
    async setAllTableColumns() {
      try {
        // const res = await getExtFieldList(this.nodeCode)
        const res = {}
        if (res) {
          this.fieldList = res.result || []
        }
      } catch (err) {
        console.warn(err)
      }

      // 扩展字段列
      const extColumns = this.fieldList.map(item => {
        return {
          prop: item.id,
          label: item.fieldName,
          defaultShow: false,
          extend: true // 标识为扩展字段
        }
      })
      // 非操作列
      const normalColumns = this.columns.filter(item => item.prop !== 'handle')
      // 操作列
      const handleColumns = this.columns.filter(item => item.prop === 'handle')
      // 所有可设置字段
      this.configColumns = [...normalColumns, ...extColumns, ...handleColumns]
    },
    // 初始化表格默认列设置
    initTableColumns() {
      this.tableColumns = this.columns
        .filter(item => item.defaultShow !== false)
        .map(item => {
          item.isShow = true
          return item
        })
    },
    // 获取显示的表格列
    async setTableColumnsShow() {
      try {
        if (this.isColumnConfigSave) {
          // const res = await getTableColumnsShow(this.nodeCode)
          const res = {}
          if (res.result) {
            // 之前设置过
            this.tableColumns = this.configColumns
              .filter(item => res.result.indexOf(item.label) !== -1)
              .map(item => {
                item.isShow = true
                return item
              })
          } else {
            this.initTableColumns()
          }
        } else {
          this.initTableColumns()
        }
      } catch (err) {
        // 之前没设置过，显示初始化列表
        this.initTableColumns()
      }

      this.columnConfigLoading = false
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@/styles/variables.scss';
.atg-table {
  width: 100%;
  .table-box {
    width: 100%;
    min-height: 50px;
  }
  /* 分页相关样式 */
  .pagination-box {
    text-align: right;
    margin-top: 20px;
  }
  /deep/.table-header th {
    height: 42px;
    background: #eceef2;
    font-size: 12px;
    font-weight: 450;
    padding: 4px 0;
    color: #333;
    .iconfont,
    .icon {
      font-size: 13px;
      color: #aaa;
      cursor: pointer;
    }
    .el-table__column-filter-trigger {
      display: none;
    }
    .is-active {
      color: $themeColor;
      .iconfont,
      .icon {
        color: $themeColor;
      }
    }
  }
  /deep/.el-table--small td {
    height: 40px;
    padding: 0;
    .cell {
      height: 40px;
      line-height: 40px;
    }
  }
  /deep/td .cell {
    .iconfont {
      padding: 8px;
      border-radius: 100%;
      font-size: 14px;
      cursor: pointer;
      margin-right: 8px;
      color: $themeColor;
      &:hover {
        color: #0e6cff;
        background: rgba(0, 0, 0, 0.05);
      }
      &.icondelete {
        color: #ff4b25;
      }
      &.warning {
        color: #ff4b25;
      }
      &.highlight {
        color: #13bc00;
      }
      &:last-child {
        margin-right: 0;
      }
    }
    .link {
      color: $themeColor;
      text-decoration: underline;
    }
    .icon-box {
      margin-right: 8px;
    }
  }
  // 空数据样式
  .empty-box {
    padding: 50px 0;
    font-size: 0;
    line-height: 1;
    p {
      margin-top: 14px;
      color: #777;
      font-size: 14px;
      line-height: 20px;
    }
  }
  /deep/tr.row-selected {
    td {
      background: #ebf5ff !important;
      border-bottom: 1px solid $themeColor;
      border-top: 1px solid $themeColor;
      &:first-child {
        border-left: 1px solid $themeColor;
      }
      &:last-child {
        border-right: 1px solid $themeColor;
      }
      .cell {
        color: $themeColor;
      }
    }
    & + tr.row-selected {
      td {
        border-top: 0;
      }
    }
  }
  /deep/.el-table__body {
    tr:last-child {
      &.row-selected {
        td {
          border-bottom: 2px solid $themeColor;
        }
      }
    }
  }

  // 表格展开收起
  /deep/.el-table__expand-icon {
    margin-top: 10px;
    .el-icon-arrow-right:before {
      content: '\e791';
      color: $themeColor;
    }
  }
}
</style>
