<template lang="html">
  <el-menu :default-active="activeIndex" class="" mode="horizontal" @select="handleSelect" :router="true">
    <el-menu-item index="index" :route="{path: '/'}">首页</el-menu-item>
    <el-menu-item index="list" :route="{name: 'list'}">列表</el-menu-item>
  </el-menu>
</template>

<script>
import Vue from 'vue'
import {Menu, MenuItem} from 'element-ui'
Vue.use(Menu)
Vue.use(MenuItem)
export default {
  data(){
    return {
      activeIndex: '/'
    }
  },
  methods: {
    handleSelect(index, indexPath){
      this.activeIndex = index
    }
  }
}
</script>

<style lang="css">
</style>
