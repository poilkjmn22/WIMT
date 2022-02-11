<!--
 * @Author: fangqi
 * @Date: 2022-01-13 11:06:58
 * @LastEditors: fangqi
 * @LastEditTime: 2022-01-13 11:07:30
 * @Description: 高亮一段文本中的目标子串
 * @Copyright(c) 2021 CMIM Network Co.,Ltd. All Rights Reserved
-->
<template>
  <span class="highlight-subtext-box" v-html="convertedTextHtml"> </span>
</template>
<script>
export default {
  props: {
    text: String,
    subtext: String
  },
  computed: {
    convertedTextHtml() {
      if (!this.subtext) {
        return this.text
      }
      return this.text.replace(new RegExp(this.subtext, 'g'), match => {
        return `<span class="is-highlight">${match}</span>`
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.highlight-subtext-box {
  display: inline-block;
  /deep/.is-highlight {
    display: inline-block;
    padding: 2px 0;
    color: #1379ff;
    background: #e8f3ff;
  }
}
</style>
