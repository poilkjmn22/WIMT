<template lang="html">
  <div class="main">
		<router-view></router-view>
  </div>
</template>

<script>
import Vue from 'vue';
import VueRouter from 'vue-router';
Vue.use(VueRouter);

import {Message} from 'element-ui'

import rtc from '../js/utils.js';
import store from '../js/store'
import routes from '../js/routes.js'

import _get from 'lodash/get.js'

const router = new VueRouter({
  mode: 'hash',
  routes
});

router.beforeEach((to, from, next) => {
  //
});

router.afterEach((to, from)=>{
  document.getElementsByTagName("title")[0].innerHTML = _get(NavItemsBLL.findByIndex(to.path.replace(/^\//, '')), 'title') || '首页';
});

export default {
  router,
	store
}
</script>

<style lang="css">
</style>
