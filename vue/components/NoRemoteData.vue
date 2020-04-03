<template lang="html">
  <div :style="{display: (remoteDataState === REMOTE_DATA_STATE.HAS_NO_DATA || remoteDataState === REMOTE_DATA_STATE.ERROR) ? 'block' : 'none'}" class="no-remote-data-wrapper">
    <div v-if="remoteDataState === REMOTE_DATA_STATE.HAS_NO_DATA" class="state-text no-data">
      <i class="iconfont iconno-data"></i><span class="desc-text">查无数据</span>
    </div>
    <div v-else-if="remoteDataState === REMOTE_DATA_STATE.ERROR" class="state-text remote-error">
      <i class="iconfont iconno-data"></i><span class="desc-text">网络或服务错误</span>
    </div>
  </div>
</template>

<script>
import { REMOTE_DATA_STATE } from '@/js/constant/remote-data-state.js';

export default {
  data(){
    return {
      REMOTE_DATA_STATE
    }
  },
  props: {
    remoteDataState: {
      type: Number,
      default: REMOTE_DATA_STATE.READY
    }
  }
}
</script>

<style lang="scss">
@import "@/css/sass/base.scss";

.no-remote-data-wrapper{
  min-height: 100px;
  position: relative;
  .state-text{
    @include transform-hv-center();
    font-size: 22px;
    color: $desc-font-color;
    > * {
      display: inline-block;
      vertical-align: baseline;
    }
    .iconfont{
      margin-right: 4px;
      font-size: 23px;
    }
  }
}
</style>
