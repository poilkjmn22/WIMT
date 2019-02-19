<template lang="html">
  <div class="main">
    <router-view>
    </router-view>
  </div>
</template>

<script>
import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)

import store from '../js/store'
import routes from '../js/routes.js'

const router = new VueRouter({
  mode: 'history',
  routes
});
router.beforeEach((to, from, next) => {
  //
});

router.afterEach((to, from)=>{
  // document.getElementsByTagName("title")[0].innerHTML = _get(NavItemsBLL.findByIndex(to.path.replace(/^\//, '')), 'title') || '首页';
});
export default {
  router,
  store
}
</script>

<style lang="css">
</style>
