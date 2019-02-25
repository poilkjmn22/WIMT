<template lang="html">
  <el-menu :default-active="activeIndex" mode="horizontal" @select="handleSelect" :router="true">
    <el-menu-item index="1" :route="{name: 'index'}">首页</el-menu-item>
    <el-submenu index="2">
      <template slot="title"><i class="el-icon-setting"></i>设置</template>
      <el-menu-item index="2-1" :route="{name: 'addActivity'}">添加活动</el-menu-item>
    </el-submenu>
  </el-menu>
</template>

<script>
import Vue from 'vue'
import {Menu, MenuItem, Submenu} from 'element-ui'
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItem)
export default {
  data(){
    return {
      activeIndex: '1'
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
