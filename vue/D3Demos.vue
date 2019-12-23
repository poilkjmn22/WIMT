<template lang="html">
  <div class="">
    <el-row v-for="chunk in chunkDemoModules" class="chunk-module-row" type="flex" justify="space-between">
      <el-col v-for="item in chunk" :span="Math.floor(22 / chunkSize)">
        <div class="d3-demo-chart-box" :ref="getRefName(item)">

        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Vue from 'vue'
import {
  Row,
  Col
} from 'element-ui'
Vue.use(Row)
Vue.use(Col)

import * as _ from 'lodash-es'
import * as d3DemoModule from '../js/d3DemoModule'

export default {
  data(){
    return {
      demoModules: [],
      chunkSize: 2
    }
  },
  computed: {
    chunkDemoModules(){
      return _.chunk(this.demoModules, this.chunkSize)
    }
  },
  methods: {
    getRefName(item){
      return _.camelCase(`d3-demo-${item.name}-box`)
    }
  },
  watch: {
    demoModules(val){
      // console.dir(val)

      this.$nextTick(() => {
        _.each(val, v => {
          d3DemoModule[_.camelCase(`draw-${v.name}-demo`)](this.$refs[this.getRefName(v)][0])
        })
      })
    }
  },
  mounted() {
    this.demoModules = d3DemoModule.demoModules
  }
}
</script>

<style lang="scss">
.chunk-module-row{
  margin-bottom: 20px;
}
</style>
