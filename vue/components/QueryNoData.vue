<!--
 * @Author: fangqi
 * @Date: 2021-08-27 10:41:32
 * @LastEditors: fangqi
 * @LastEditTime: 2022-01-06 16:18:09
 * @Description: 查无数据
 * @Copyright(c) 2021 CMIM Network Co.,Ltd. All Rights Reserved
-->
<template>
  <div class="empty-box">
    <img src="~@/assets/common/empty.png" alt="" />
    <p>
      <slot>{{ $t('components.queryNoData') }}</slot>
    </p>
  </div>
</template>

<style lang="scss" scoped>
.empty-box {
  padding: 50px 0;
  font-size: 0;
  line-height: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  p {
    margin-top: 14px;
    color: #777;
    font-size: 14px;
    line-height: 20px;
  }
}
</style>
