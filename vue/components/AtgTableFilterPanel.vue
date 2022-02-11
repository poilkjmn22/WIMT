<!--
 * @Author: zhangchuanzhong
 * @Date: 2021-04-26 15:57:40
 * @LastEditors: xu jun
 * @LastEditTime: 2021-08-16 17:59:57
 * @Description: 表格过滤框
 * @Copyright(c) 2021 CMIM Network Co.,Ltd. All Rights Reserved
-->
<template>
  <div class="table-filter-box">
    <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
    <el-tree
      ref="tree"
      :data="filters"
      show-checkbox
      :node-key="props.key"
      :default-checked-keys="defaultCheckedKeys"
      :props="defaultProps"
      check-on-click-node
      @check-change="handleCheckChange"
    >
      <template slot-scope="{ node }">
        <span class="el-tree-node__label" :title="node.label">{{ node.label }}</span>
      </template>
    </el-tree>
    <div class="fliter-btns">
      <el-button type="primary" size="mini" @click="handleConfirm">确定</el-button>
      <el-button size="mini" @click="handleCancel">取消</el-button>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    column: {
      type: Object,
      default: function () {
        return {}
      }
    },
    filteredValue: {
      type: Array
    },
    props: {
      type: Object,
      default: function () {
        return {
          key: 'value',
          label: 'label'
        }
      }
    }
  },
  data() {
    return {
      checkAll: true,
      isIndeterminate: false,
      checkedKeys: []
    }
  },
  computed: {
    defaultProps() {
      return {
        label: this.props.label
      }
    },
    filters() {
      return this.column && this.column.filters
    },
    allKeys() {
      return this.filters && this.filters.map(item => item[this.props.key])
    },
    defaultCheckedKeys() {
      if (this.filteredValue) {
        return this.filteredValue
      } else {
        return this.allKeys
      }
    }
  },
  created() {
    if (this.filteredValue) {
      this.isIndeterminate = this.filteredValue.length > 0 && this.filteredValue.length < this.allKeys.length
    }
  },
  methods: {
    handleCheckAllChange(val) {
      this.setTreeChecked(this.allKeys, val)
      this.isIndeterminate = false
    },
    handleCheckChange() {
      const checkedLength = this.$refs.tree.getCheckedKeys().length
      const allLength = this.allKeys.length
      this.checkAll = checkedLength === allLength
      this.isIndeterminate = checkedLength > 0 && checkedLength < allLength
    },
    setTreeChecked(keys, flag) {
      keys.forEach(item => {
        this.$refs.tree.setChecked(item, flag)
      })
    },
    // 确定
    handleConfirm() {
      const checkedKeys = this.$refs.tree.getCheckedKeys()
      if (checkedKeys.length === 0) {
        this.$message.warning('需选择查询项')
        return
      }
      this.$emit('confirm', this.column.prop, checkedKeys, this.checkAll)
      this.$emit('close', this.column.prop)
    },
    // 取消
    handleCancel() {
      this.$emit('close', this.column.prop)
    }
  }
}
</script>
<style lang="scss" scoped>
.table-filter-box {
  overflow: hidden;
  /deep/.el-tree-node__label {
    min-width: 130px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .fliter-btns {
    border-top: 1px solid #f1f1f1;
    margin-top: 10px;
    padding-top: 10px;
    text-align: center;
  }
}
/deep/.el-checkbox__input.is-checked {
  & + .el-checkbox__label {
    color: #606266;
  }
}
</style>
