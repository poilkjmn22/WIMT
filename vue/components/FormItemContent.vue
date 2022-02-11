<!--
 * @Author: xu jun
 * @Date: 2021-05-06 16:31:06
 * @LastEditors: xu jun, fangqi
 * @LastEditTime: 2022-01-12 17:17:17
 * @Description:
 * Copyright(c) 2021 CMIM Network Co.,Ltd. All Rights Reserved
-->
<template>
  <div class="content" :title="value">
    {{ value }}
    <slot></slot>
  </div>
</template>

<script>
export default {
  props: {
    content: {
      type: [String, Number]
    }
  },
  computed: {
    value() {
      const content = this.content
      if (this.$slots.default) {
        return ''
      }
      return content === null || content === undefined ? '--' : content
    }
  }
}
</script>
