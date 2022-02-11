<!--
 * @Author: zhangchuanzhong
 * @Date: 2021-04-26 15:57:40
 * @LastEditors: xu jun
 * @LastEditTime: 2021-05-31 18:11:49
 * @Description: 表格过滤框
 * @Copyright(c) 2021 CMIM Network Co.,Ltd. All Rights Reserved
-->
<template>
  <div class="table-selection-box">
    <div
      class="item"
      v-for="(item, index) in column.selections"
      @click="onSelect(item)"
      :key="index"
      :class="{ active: selection === item[props.value] }"
    >
      <i class="el-icon-check"></i>
      {{ item[props.label] }}
    </div>
  </div>
</template>
<script>
export default {
  props: {
    column: {
      type: Object,
      default: () => {}
    },
    value: {},
    props: {
      type: Object,
      default: function () {
        return {
          value: 'value',
          label: 'label'
        }
      }
    }
  },
  data() {
    return {
      selection: ''
    }
  },
  created() {
    this.selection = this.value
  },
  methods: {
    onSelect(item) {
      this.selection = item[this.props.value]

      this.$emit('select', this.column.prop, this.selection)
      this.$emit('close', this.column.prop)
    }
  }
}
</script>
<style lang="scss" scoped>
@import '~@/styles/variables.scss';
.table-selection-box {
  .item {
    cursor: pointer;
    height: 28px;
    line-height: 28px;
    i {
      font-size: 16px;
      color: transparent;
    }
  }
  .active {
    color: $themeColor;
    i {
      color: $themeColor;
    }
  }
}
</style>
