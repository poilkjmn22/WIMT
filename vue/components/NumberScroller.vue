<template lang="html">
  <div :class="'scroller ' + scrollerClass" :style="getScrollerStyle()">
    <div class="scroller-inner-pane" ref="scrollerPane">
      <span class="scroller-span last">{{last}}</span>
      <span class="scroller-span current">{{current}}</span>
    </div>
  </div>
</template>

<script>
const _props = {};
const _cssPropMap = {
  "transition-timing-function": "TransitionTimingFunction",
  "transition-duration": "TransitionDuration",
  "transform": "Transform"
};
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
        this.iterate();
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
      setTimeout(function(){
        vm.scroll();
      }, 0);
    },
    scroll(){
      var rand = 1.0 + (Math.random() / 100000); // This ensures "transitionend" event will always
      var elem = this.$refs['scrollerPane'];
      // be fired when applied to transform.scaleY().
      var transformProperty = "translateY(" + this.amount + "px) scaleX(" + rand + ")";
      var durationProperty = (this.stepInterval) + "ms";
      this.setStyle(elem, "transition-duration", durationProperty);
      this.setStyle(elem, "transform", transformProperty);
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
    addTransitionEndListener(elem){
      var vm = this;
      var transitions = {
          'WebkitTransition': 'webkitTransitionEnd',
          'MozTransition': 'transitionend',
          'MSTransition': 'msTransitionEnd',
          'OTransition': 'oTransitionEnd',
          'transition': 'transitionend'
      };
      for (var t in transitions) {
          if (elem.style[t] !== undefined) {
              elem.addEventListener(transitions[t], function(event) {
                  var transitionDuration = elem.style.transitionDuration || elem.style.webkitTransitionDuration;
                  if (transitionDuration != "0ms") {
                      vm.onTransitionEnd();
                  }
              }, false);
              break;
          }
      }
    },
    onTransitionEnd(){
      var rand = 1.0 + (Math.random() / 100000);
      var transformProperty = "translateY(0px) scaleX(" + rand + ")";
      var durationProperty = "0ms";

      this.current = this.last;
      // Ensure UI repaint
      // this.lastChild.offsetHeight;

      // Sometimes when in low memory situation the nextNum
      // has been set to number, but the corresponding UI is
      // not updated to the number
      this.nextNum = this.last;

      var elem = this.$refs['scrollerPane'];
      this.setStyle(elem, "transition-duration", durationProperty);
      this.setStyle(elem, "transform", transformProperty);

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
      var vm = this;
      setTimeout(function(){
        vm.iterate();
      }, 1);
    },
    setStyle(elem, type, value){
      if (_props[type]) {
          elem.style.setProperty(_props[type], value, "important");
      } else {
          var modes = "-webkit- -moz- -ms- -o-".split(" ");
          _props[type] = type;
          for (var i = 0, len = modes.length; i < len; ++i) {
              var mode = modes[i].replace(/-/g, "");
              mode = (mode == "moz") ? "Moz" : mode;
              if (elem.style[(mode + _cssPropMap[type])] !== undefined) {
                  _props[type] = modes[i] + type;
                  break;
              }
          }
          this.setStyle(elem, type, value);
      }
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
    this.addTransitionEndListener(this.$refs['scrollerPane']);
    this.setStyle(this.$refs['scrollerPane'], "transition-timing-function", "linear");
    this.start();
  }
}
</script>

<style lang="css">
.scroller{
  border-radius: 8px;
  border-radius: 0.5rem;
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
