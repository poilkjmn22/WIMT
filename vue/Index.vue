<template lang="html">
  <div class="index">
		<div class="header">
			<NavHeader>
			</NavHeader>
		</div>
		<div class="body w-1190">
			<keep-alive>
				<router-view>
				</router-view>
			</keep-alive>
		</div>
		<div class="footer">

		</div>
	</div>
</template>

<script>
import NavHeader from './NavHeader.vue';
export default {
  components: {
    NavHeader
  }
}
</script>

<style lang="css">
</style>
