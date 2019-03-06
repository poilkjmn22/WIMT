<template lang="html">
  <span class="dot-list">
    <transition v-for="dotStatus in dotStatusList" name="dot-fade">
      <span v-show="dotStatus.show" class="dot-list-item"></span>
    </transition>
  </span>
</template>

<script>
import AnimateHelper from '../../js/AnimateHelper.js';
import _each from 'lodash/each.js';

export default {
  data(){
    return {
      dotStatusList: [{show: false}, {show: false}, {show: false}],
      cancel: false
    };
  },
  mounted(){
    let vm = this;
    function loopOuter(){
      if(vm.cancel){
        return;
      }
      let i = 0;
      function loopInner(){
        vm.dotStatusList[i].show = true;
        AnimateHelper.setTimeoutEffectively(function(){
          i+=1;
          if(i < vm.dotStatusList.length){
            loopInner();
          }else{
            //complete();
            _each(vm.dotStatusList, dotStatus => {
              dotStatus.show = false;
            });
            if(!vm.cancel){
              AnimateHelper.setTimeoutEffectively(loopOuter, 100);
            }
          }
        }, 200)
      }
      loopInner();
    }
    loopOuter();
  },
  beforeDestroy(){
    this.cancel = true;
  }
}
</script>

<style lang="css">
.dot-fade-enter-active {
  transition: opacity 200ms;
}
.dot-fade-leave-active{
  transition: opacity 100ms;
}
.dot-fade-enter, .dot-fade-leave-to {
  opacity: 0;
}
.dot-list{
  display: inline-block;
  text-align: left;
  width: 11px;
}
.dot-list-item{
  display: inline-block;
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background-color: #fff;
  vertical-align: middle;
}
.dot-list-item:not(:last-child){
  margin-right: 1px;
}
</style>
