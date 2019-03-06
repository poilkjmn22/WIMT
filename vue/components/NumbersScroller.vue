<template lang="html">
  <div class="number-scroller-list">
    <template v-for="numberStr,i in numberStrArray">
      <NumberScroller :number="parseInt(numberStr)" :mode="mode" :amount="amount" :duration="duration" :scrollerClass="scrollerClass">
      </NumberScroller>
      <!-- <div v-if="((numberStrArray.length - 1 - i) > 0 && (numberStrArray.length - 1 - i) % 3) === 0" class="number-seperator" :style="getScrollerStyle()">,</div> -->
    </template>
  </div>
</template>

<script>
import rtc from '../../js/utils.js';
import NumberScroller from './NumberScroller.vue';
import NumberScrollerPosition from './NumberScrollerPosition.vue';
const IS_TRANSITION_SUPPORT = rtc.domHelper._detectTransformSupport('transition');
// const IS_TRANSITION_SUPPORT = false;
const MODE = {
  COUNT_UP: 1,
  COUNT_DOWN: 2
};
export default {
  components: {
    NumberScroller: IS_TRANSITION_SUPPORT ? NumberScroller: NumberScrollerPosition
  },
  data(){
    return {
      mode: MODE.COUNT_UP
    };
  },
  props: {
    number: {
      type: Number,
      default: 0
    },
    amount: {
      type: Number,
      default: 80
    },
    duration: {
      type: Number,
      default: 600
    },
    scrollerClass: {
      type: String,
      default: ''
    }
  },
  computed: {
    numberStrArray(){
      var arr = [];
      var numStr = (this.number+'');
      for (var c of numStr) {
        arr.push(c);
      }
      return arr;
    }
  },
  methods: {
    getScrollerStyle(){
      return {
        height: `${this.amount}px`,
        lineHeight: `${this.amount}px`
      }
    }
  },
  watch: {
    number: {
      handler(val, oldVal){
        this.mode = val > oldVal ? MODE.COUNT_UP : MODE.COUNT_DOWN;
      }
    }
  }
}
</script>

<style lang="css">
.number-scroller-list::after{
  content: ".";
  visibility: hidden;
  display: block;
  height: 1px;
  clear: both;
}
.number-scroller-list .scroller{
  float: left;
  margin-left: 6px;
}
/* .number-scroller-list .number-seperator{
  font-size: 30px;
  display: inline-block;
  vertical-align: bottom;
  float: left;
} */
</style>
