<template lang="html">
  <div class="index">
		<div class="header">
      <div class="header-inner w-1190 clearfix">
        <div class="logo float-left">
          WIM<b class="logo-green mr-3">Time</b><font-awesome-icon class="logo-green" :icon="['fas', 'history']" />
        </div>
        <div class="nav-menu float-right">
          <NavHeader>
    			</NavHeader>
        </div>
      </div>
		</div>
		<div class="body w-1190">
			<!-- <keep-alive> -->
				<router-view>
				</router-view>
			<!-- </keep-alive> -->
		</div>
		<div class="footer">

		</div>
	</div>
</template>

<script>
import Vue from 'vue'
import NavHeader from './NavHeader'

import { library } from '@fortawesome/fontawesome-svg-core'
import { faHistory as fasFaHistory } from '@fortawesome/free-solid-svg-icons'
// import { faFacebookF as fabFaFacebookF } from '@fortawesome/free-brands-svg-icons'
// import { faBell as farFaBell, faAddressBook as farFaAddressBook, faCircle as farFaCircle } from '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(fasFaHistory)

Vue.component('font-awesome-icon', FontAwesomeIcon)

export default {
  components: {
    NavHeader
  }
}
</script>

<style lang="css">
.header{
  border-top: 6px solid #2DD8B1;
}
.header-inner .logo{
  height: 56px;
  line-height: 56px;
}

.logo-green{
  color: #2DD8B1;
}

.body{
  padding-top: 50px;
}
</style>
