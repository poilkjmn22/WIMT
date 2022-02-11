<!--
 * @Author: fangqi
 * @Date: 2021-09-29 10:10:54
 * @LastEditors: fangqi
 * @LastEditTime: 2021-09-29 10:11:00
 * @Description: 链接按钮
 * @Copyright(c) 2021 CMIM Network Co.,Ltd. All Rights Reserved
-->
<template>
  <div :type="type" class="btn-link">
    <slot></slot>
    <em class="iconfont icon-you"></em>
  </div>
</template>
<script>
export default {
  props: {
    type: {
      type: String,
      default: 'primary'
    }
  }
}
</script>
<style lang="scss" scoped>
.btn-link {
  padding: 6px;
  display: inline-block;
  color: white;
  min-width: 100px;
  font-size: 14px;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  @media screen and (min-height: 1800px) {
    width: 200px;
    font-size: 28px;
    border-radius: 28px;
  }

  cursor: pointer;
  background: #1890ff;
  border-radius: 14px;
}
</style>
