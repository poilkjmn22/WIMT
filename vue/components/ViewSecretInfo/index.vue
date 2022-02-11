<!--
 * @Autor: fangqi
 * @Date: 2022-02-10 11:14:40
 * @LastEditors: fangqi
 * @LastEditTime: 2022-02-10 11:43:12
 * @Description: 查看脱敏信息
 * @Copyright: Copyright(c) 2019 CMIM Network Co.,Ltd. All Rights Reserved
-->
<template>
  <div class="view-secret-info-box">
    <el-button type="text" @click="btnView" style="font-size: 14px"><em class="iconfont icon-mima"></em></el-button>

    <FormSecretInfo
      v-if="codeVisible"
      :secretInfo="secretInfo"
      v-model="codeVisible"
      :show.sync="codeVisible"
      @view-secret-info="info => $emit('view-secret-info', info)"
    />
  </div>
</template>
<script>
import FormSecretInfo from './FormSecretInfo'
export default {
  data() {
    return {
      codeVisible: false
    }
  },
  components: {
    FormSecretInfo
  },
  props: {
    secretInfo: Object
  },
  methods: {
    btnView() {
      this.codeVisible = true
    }
  }
}
</script>
<style scoped>
.view-secret-info-box {
  display: inline-block;
  margin: 0 6px;
}
</style>
