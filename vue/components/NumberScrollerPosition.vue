<template lang="html">
  <div :class="'scroller ' + scrollerClass" :style="getScrollerStyle()">
    <div class="scroller-inner-pane" ref="scrollerPane">
      <span class="scroller-span last">{{last}}</span>
      <span class="scroller-span current">{{current}}</span>
    </div>
  </div>
</template>

<script>
const UPPER_BOUND = 9;
const MODE = {
  COUNT_UP: 1,
  COUNT_DOWN: 2
};
export default {
  data(){
    return {
      nextNum: 0,
      last: 0,
      current: 0,
      step: 1
    };
  },
  props: {
    amount: {
      type: Number,
      default: 80
    },
    duration: {
      type: Number,
      default: 600
    },
    number: {
      type: Number,
      default: 0
    },
    scrollerClass: {
      type: String,
      default: ''
    },
    mode: {
      type: Number,
      default: 1
    }
  },
  watch: {
    'number': {
      handler: function(val, oldVal){
        this.revalidate();
        var stepIndex = 0;
        var vm = this;
        function loop(){
          if(stepIndex < vm.step){
            setTimeout(function(){
                vm.iterate();
                stepIndex += 1;
                loop();
            }, vm.stepInterval);
          }
        }
        if(vm.step < Infinity){
          vm.iterate();
          stepIndex += 1;
          loop();
        }
      }
    }
  },
  methods: {
    iterate(){
      if (this.nextNum != this.number || this.last != this.number) {
          // Below check is to ensure the UI is updated properly.
          // Sometimes when in low memory situation the nextNum
          // has been set to number, but the corresponding UI is
          // not updated to the number
          if (this.nextNum == this.number) {
              this.nextNum = this.last;
          }
          if(this.mode === MODE.COUNT_UP){
            this.nextNum = (this.nextNum == UPPER_BOUND) ? 0 : (this.nextNum + 1);
          }else{
            this.nextNum = (this.nextNum == 0) ? UPPER_BOUND : (this.nextNum - 1);
          }

          this.innerIterate();
      }
    },
    innerIterate(){
      // Swap first and last child
      this.current = this.last;
      this.last = this.nextNum;
      // Ensure UI repaint
      // this.lastChild.offsetHeight;
      var vm = this;
      vm.scroll();
    },
    scroll(){
      var vm = this;
      var minInterval = 50;
      var pStep = vm.amount / Math.ceil(vm.stepInterval / minInterval);
      var lastP = 0;
      function loop(){
        if(lastP <= vm.amount){
          setTimeout(function(){
            lastP += pStep;
            vm.setPosition(lastP);
            loop();
          }, minInterval);
        }else{
          vm.stop();
        }
      };
      loop();
    },
    revalidate(){
      if (this.nextNum != this.number) {
          if(this.mode === MODE.COUNT_UP){
            this.step = (this.number < this.nextNum) ? (this.number + (UPPER_BOUND + 1) - this.nextNum) : (this.number - this.nextNum);
          }else{
            this.step = (this.number > this.nextNum) ? (this.nextNum + (UPPER_BOUND + 1) - this.number) : (this.nextNum - this.number);
          }
      } else {
          this.step = Infinity;
      }
      this.innerRevalidate();
    },
    innerRevalidate(){
      this.stepInterval = Math.max(1, Math.floor(this.duration * 1.0 / this.step));
    },
    stop(){
      this.current = this.last;
      // Ensure UI repaint
      // this.lastChild.offsetHeight;

      // Sometimes when in low memory situation the nextNum
      // has been set to number, but the corresponding UI is
      // not updated to the number
      this.nextNum = this.last;

      // Here cannot use transitionend event is because the
      // transition duration is set to 0ms which may not trigger
      // the transitionend event in some browsers.
      // Initially the transition duration was set to 1ms so that
      // we can rely on the transitionend event to trigger next
      // iteration. But the scroll pane will have some flashing
      // effects which is not what we expected.
      // One disadvantage of this approach is that it has some
      // jump ship effects as it doesn't wait the transition to
      // completes to trigger next iteration.
      this.setPosition(0);
    },
    setPosition(value){
      this.$refs['scrollerPane'].style.top = value + 'px';
    },
    start(){
      this.last = this.number;
      this.current = this.number;
      this.nextNum = this.number;
    },
    getScrollerStyle(){
      return {
        height: `${this.amount}px`,
        lineHeight: `${this.amount}px`
      }
    }
  },
  mounted(){
    this.start();
  }
}
</script>

<style lang="css">
.scroller{
  border-radius: 4px;
  background-color: #f56c6c;
  width: 50px;
  text-align: center;
  position: relative;
  color: #fff;
  font-size: 24px;
  overflow: hidden;
}
.scroller-inner-pane{
  position: absolute;
  width: 100%;
  height: 100%;
  color: #fff;
}

.scroller-span{
  display: inline-block;
  position: absolute;
  left: 0;
  width: 100%;
  height: 100%;
}
.scroller-span.last{
  top: -100%;
}
.scroller-span.current{
  top: 0;
}
</style>
