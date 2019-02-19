<template lang="html">
  <div class="not-found text-center">
    <h2 class="text-desc"><i class="iconfont icon-404"></i>
      <span class="ml-6 mr-6">页面没有找到！</span>
      </h2>
      <el-button @click="routeBack" type="primary">返回首页
    </el-button>
  </div>
</template>

<script>
import Vue from 'vue';
import {Button} from 'element-ui';
Vue.use(Button);
import routeMixin from '../js/routeMixin.js';

export default {
  mixins: [routeMixin]
}
</script>

<style lang="css">
  .not-found{
    padding-top: 120px;
  }
  .not-found h2{
    margin-bottom: 20px;
  }
  .not-found h2 > *{
    vertical-align: middle;
  }
  .not-found .icon-404{
    font-size: 40px;
    color: #ffd04b;
  }
</style>
