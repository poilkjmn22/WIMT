<!--
 * @Author: fangqi
 * @Date: 2021-09-28 15:01:32
 * @LastEditors: fangqi
 * @LastEditTime: 2021-09-28 15:01:38
 * @Description: 状态小图标
 * @Copyright(c) 2021 CMIM Network Co.,Ltd. All Rights Reserved
-->
<template>
  <span class="status-icon" :style="{ color: finalColor }">
    <em v-if="showIcon" :style="iconStyle"></em>
    <slot>{{ text }}</slot>
  </span>
</template>
<script>
import { alphaHex } from '@/utils/color.js'
const statusMap = {
  success: '#12c486',
  warning: '#e6a23c',
  danger: '#f54f57',
  info: '#909399'
}

const statusCodeMap = {
  0: 'danger',
  1: 'success',
  2: 'info',
  3: 'danger'
}

export default {
  props: {
    status: {
      type: [String, Number],
      default: 'success'
    },
    color: String,
    text: [String, Number],
    showIcon: {
      type: Boolean,
      default: true
    },
    withShadow: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    finalColor() {
      const status = typeof this.status === 'number' ? statusCodeMap[this.status] : this.status
      return this.color || statusMap[status]
    },
    iconStyle() {
      const shadowColor = alphaHex(this.finalColor, 0.6)
      const obj = {
        backgroundColor: this.finalColor
      }
      if (this.withShadow) {
        obj.boxShadow = `0 0 3px 3px ${shadowColor}`
      }
      return obj
    }
  }
}
</script>

<style lang="scss" scoped>
.status-icon {
  display: flex;
  align-items: center;
  font-size: 16px;
  @media screen and (min-height: 1800px) {
    font-size: 32px;
  }
  em,
  i {
    width: 8px;
    height: 8px;
    @media screen and (min-height: 1800px) {
      width: 16px;
      height: 16px;
    }
    border-radius: 999px;
    vertical-align: middle;
    display: inline-block;
    margin-right: 10px;
  }
}
</style>
