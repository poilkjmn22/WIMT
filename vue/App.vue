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

import routes from '../js/routes.js'
import store from '../js/store/index'
import NavHeader from './NavHeader'

const router = new VueRouter({
  mode: 'hash',
  routes
});
export default {
  router,
  store,
  components: {
    NavHeader
  }
}
</script>

<style lang="css">
</style>
