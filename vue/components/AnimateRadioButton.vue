<template lang="html">
    <label
      role="radio"
      :aria-checked="value === label"
      :aria-disabled="isDisabled"
      :class="['icon-radio-wrapper', isDisabled ? 'is-disabled' : '']">
      <input
        class="origin-radio"
        aria-hidden="true"
        type="radio"
        :disabled="isDisabled"
        :name="name"
        :value="label"
        v-model="value"
        @change="onCheck">
      <span :style="{color: isDisabled ? realColor : (value === label ? realColor : '')}" class="radio-label">
        <slot></slot>
        <template v-if="!$slots.default">{{label}}</template>
      </span>
      <svg ref="icon" viewBox="0 0 100 100" version="1.1" xmlns="http://www.w3.org/2000/svg">
        <path style="display: none;" d="M34.745,7.183C25.078,12.703,13.516,26.359,8.797,37.13 c-13.652,31.134,9.219,54.785,34.77,55.99c15.826,0.742,31.804-2.607,42.207-17.52c6.641-9.52,12.918-27.789,7.396-39.713 C85.873,20.155,69.828-5.347,41.802,13.379"></path>
      </svg>
    </label>
</template>

<script>
import Snap from 'snapsvg';
import Emitter from '../../js/EmitterMixin.js';
export default {
  name: 'AnimateRadioButton',
  props: {
    label: {},
    disabled: Boolean,
    color: String,
    name: String
  },
  mixins: [Emitter],
  data(){
    return {
      s: null
    };
  },
  computed: {
    value: {
      get() {
        return this._radioGroup.value;
      },
      set(value) {
        this._radioGroup.$emit('input', value);
      }
    },
    _radioGroup() {
      let parent = this.$parent;
      while (parent) {
        if (parent.$options.componentName !== 'AnimateRadioGroup') {
          parent = parent.$parent;
        } else {
          return parent;
        }
      }
      return false;
    },
    isDisabled(){
      return this._radioGroup ? (this._radioGroup.disabled || this.disabled) : this.disabled
    },
    realColor(){
      if(this.isDisabled){
        return "#c0c4cc";
      }
      return this.color || (this._radioGroup && this._radioGroup.color) || '#67c23a'
    }
  },
  watch:{
    value: function(val, oldVal){
      var s = this.s;
      if(s){
        if(s.select('.animate-line')){
          s.select('.animate-line').remove();
        }
        if(val === this.label){
          this.animate(s);
        }
      }
    }
  },
  methods: {
    onCheck(){
      this.$nextTick(() => {
        this.dispatch('AnimateRadioGroup', 'handleChange', this.value);
      });
    },
    animate(s){
      if(!s){return;}
      var originLine = s.select('path');
      var line = s.path().attr({
        fill: "none",
        strokeWidth: 6,
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
        stroke: this.realColor,
        class: "animate-line"
      });
      var len = Snap.path.getTotalLength(originLine.attr("d"));
      Snap.animate(0, len, function(l) {
          //
          line.attr({
              d: originLine.getSubpath(0, l)
          });
      }, 200, mina.easeinout);
    }
  },
  mounted(){
    var vm = this;
    var s = Snap(this.$refs.icon);
    vm.s = s;
    if(vm.value === vm.label){
      vm.animate(s);
    }
  }
}
</script>

<style lang="css">
.icon-radio-wrapper{
  position: relative;
  display: inline-block;
  cursor: pointer;
}
.icon-radio-wrapper.is-disabled{
  cursor: not-allowed;
}
.icon-radio-wrapper .origin-radio, .icon-radio-wrapper .radio-label::before{
  width: 14px;
  height: 14px;
  top: 50%;
  margin-top: -7px;
  left: 7px;
  position: absolute;
}
.icon-radio-wrapper svg{
  width: 20px;
  height: 20px;
  top: 50%;
  margin-top: -10px;
  left: 4px;
  position: absolute;
}
.icon-radio-wrapper .radio-label{
  display: inline-block;
  position: relative;
  padding: 0 0 0 30px;
  vertical-align: top;
  color: rgba(0,0,0,0.2);
  -webkit-transition: color 0.3s;
  transition: color 0.3s;
}
.origin-radio:checked + .radio-label::before{
  opacity: 0.6;
}
.icon-radio-wrapper .radio-label::before{
  content: '';
  border-radius: 50%;
  background-color: rgba(0,0,0,0.2);
  border: none;
  -webkit-transition: opacity 0.3s;
  transition: opacity 0.3s;
}
.icon-radio-wrapper .origin-radio{
  opacity: 0;
  -webkit-appearance: none;
  display: inline-block;
  vertical-align: middle;
  z-index: 100;
}
</style>
