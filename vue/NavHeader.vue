<template lang="html">
  <el-menu :default-active="activeIndex" mode="horizontal" :router="true">
    <el-menu-item :index="parseNavMenuItemIndex('list')" :route="{name: 'list'}">首页</el-menu-item>
    <el-submenu index="2">
      <template slot="title"><i class="el-icon-setting"></i>设置</template>
      <el-menu-item :index="parseNavMenuItemIndex('addActivity')" :route="{name: 'addActivity'}">添加活动</el-menu-item>
      <el-menu-item :index="parseNavMenuItemIndex('addActivitySchedule')" :route="{name: 'addActivitySchedule'}">添加活动(日程表)</el-menu-item>
    </el-submenu>
  </el-menu>
</template>

<script>
import Vue from 'vue'
import {Menu, MenuItem, Submenu} from 'element-ui'
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItem)

import _kebabCase from 'lodash/kebabCase'
export default {
  data(){
    return {
    }
  },
  computed: {
    activeIndex(){
      return _kebabCase(this.$route.name)
    }
  },
  methods: {
    parseNavMenuItemIndex(routeName){
      return _kebabCase(routeName)
    }
  }
}
</script>

<style lang="css">
</style>
