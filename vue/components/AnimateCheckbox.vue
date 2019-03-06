<template lang="html">
    <label
      role="checkbox"
      :aria-checked="isChecked"
      :aria-disabled="isDisabled"
      :class="['icon-checkbox-wrapper', isDisabled ? 'is-disabled' : '']">
      <input
        v-if="trueLabel || falseLabel"
        class="origin-checkbox"
        type="checkbox"
        :disabled="isDisabled"
        :name="name"
        :true-value="trueLabel"
        :false-value="falseLabel"
        v-model="model"
        @change="onCheck">
      <input
        v-else
        class="origin-checkbox"
        aria-hidden="true"
        type="checkbox"
        :disabled="isDisabled"
        :name="name"
        :value="label"
        v-model="model"
        @change="onCheck">
      <span :style="{color: isDisabled ? realColor : (isChecked ? realColor : '')}" class="checkbox-label">
        <slot></slot>
        <template v-if="!$slots.default">{{label}}</template>
      </span>
      <svg ref="icon" viewBox="0 0 100 100" version="1.1" xmlns="http://www.w3.org/2000/svg">
        <path style="display: none;" d="M16.667,62.167c3.109,5.55,7.217,10.591,10.926,15.75 c2.614,3.636,5.149,7.519,8.161,10.853c-0.046-0.051,1.959,2.414,2.692,2.343c0.895-0.088,6.958-8.511,6.014-7.3 c5.997-7.695,11.68-15.463,16.931-23.696c6.393-10.025,12.235-20.373,18.104-30.707C82.004,24.988,84.802,20.601,87,16">
        </path>
      </svg>
    </label>
</template>

<script>
import Snap from 'snapsvg';
import Emitter from '../../js/EmitterMixin.js';
export default {
  props: {
    value: {},
    label: {},
    trueLabel: [String, Number],
    falseLabel: [String, Number],
    color: String,
    checked: Boolean,
    disabled: Boolean,
    name: String
  },
  mixins: [Emitter],
  data(){
    return {
      s: null,
      selfModel: false
    };
  },
  computed: {
    model: {
      get() {
        return this._checkboxGroup
          ? this.store : this.value !== undefined
            ? this.value : this.selfModel;
      },
      set(val) {
        if (this._checkboxGroup) {
          this.dispatch('AnimateCheckboxGroup', 'input', [val]);
        } else if(val !== undefined){
          this.$emit('input', val);
        } else {
          this.selfModel = val;
        }
      }
    },
    _checkboxGroup() {
      let parent = this.$parent;
      while (parent) {
        if (parent.$options.componentName !== 'AnimateCheckboxGroup') {
          parent = parent.$parent;
        } else {
          return parent;
        }
      }
      return false;
    },
    store() {
      return this._checkboxGroup ? this._checkboxGroup.value : this.value;
    },
    isChecked() {
      if ({}.toString.call(this.model) === '[object Boolean]') {
        return this.model;
      } else if ({}.toString.call(this.model) === '[object Array]') {
        return this.model.indexOf(this.label) > -1;
      } else if (this.model !== null && this.model !== undefined) {
        return this.model === this.trueLabel;
      }
    },
    realColor(){
      if(this.isDisabled){
        return "#c0c4cc";
      }
      return this.color || (this._checkboxGroup && this._checkboxGroup.color)
    },
    isDisabled(){
      return this._checkboxGroup ? (this._checkboxGroup.disabled || this.disabled) : this.disabled
    }
  },
  watch:{
    isChecked: function(val, oldVal){
      var s = this.s;
      if(s){
        if(s.select('.animate-line')){
          s.select('.animate-line').remove();
        }
        if(val){
          this.animate(s);
        }
      }
    }
  },
  methods: {
    addToStore() {
      if (
        {}.toString.call(this.model) === '[object Array]' &&
        this.model.indexOf(this.label) === -1
      ) {
        this.model.push(this.label);
      } else {
        this.model = this.trueLabel || true;
      }
    },
    onCheck(ev){
      let value;
      if (ev.target.checked) {
        value = this.trueLabel === undefined ? true : this.trueLabel;
      } else {
        value = this.falseLabel === undefined ? false : this.falseLabel;
      }
      this.$emit('change', value, ev);
      this.$nextTick(() => {
        if (this._checkboxGroup) {
          this.dispatch('AnimateCheckboxGroup', 'change', [this._checkboxGroup.value]);
        }
      });
    },
    animate(s){
      if(!s){return;}
      var originLine = s.select('path');
      var line = s.path().attr({
        fill: "none",
        strokeWidth: 10,
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
        stroke: this.realColor || "#67c23a",
        class: "animate-line"
      });
      var len = Snap.path.getTotalLength(originLine.attr("d"));
      Snap.animate(0, len, function(l) {
          //
          line.attr({
              d: originLine.getSubpath(0, l)
          });
      }, 200, mina.easeinout);;
    }
  },
  created(){
    this.checked && this.addToStore();
  },
  mounted(){
    var vm = this;
    var s = Snap(this.$refs.icon);
    vm.s = s;
    if(vm.isChecked){
      vm.animate(s);
    }
  }
}
</script>

<style lang="css">
.icon-checkbox-wrapper{
  position: relative;
  display: inline-block;
  cursor: pointer;
}
.icon-checkbox-wrapper.is-disabled{
  cursor: not-allowed;
}
.icon-checkbox-wrapper .origin-checkbox, .icon-checkbox-wrapper .checkbox-label::before{
  width: 14px;
  height: 14px;
  top: 50%;
  margin-top: -7px;
  left: 7px;
  position: absolute;
}
.icon-checkbox-wrapper svg{
  width: 14px;
  height: 14px;
  top: 50%;
  margin-top: -7px;
  left: 8px;
  position: absolute;
}
.icon-checkbox-wrapper .checkbox-label{
  display: inline-block;
  position: relative;
  padding: 0 0 0 30px;
  vertical-align: top;
  -webkit-transition: color 0.2s;
  transition: color 0.2s;
}
.icon-checkbox-wrapper .checkbox-label::before{
  content: '';
  background-color: #fff;
  border: 1px solid #dcdfe6;
}
.icon-checkbox-wrapper .origin-checkbox{
  opacity: 0;
  -webkit-appearance: none;
  display: inline-block;
  vertical-align: middle;
  z-index: 100;
}
</style>
