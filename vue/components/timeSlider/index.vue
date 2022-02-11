<!--
 * @Author: fangqi
 * @Date: 2021-09-30 10:14:27
 * @LastEditors: fangqi
 * @LastEditTime: 2022-01-05 16:08:50
 * @Description: 时间滑块组件（用于图表的自定义时间轴）-扩展element-ui的Slider组件
 * @Copyright(c) 2021 CMIM Network Co.,Ltd. All Rights Reserved
-->
<template>
  <div
    class="el-slider time-slider"
    :class="{ 'is-vertical': vertical, 'el-slider--with-input': showInput }"
    role="slider"
    :aria-valuemin="min"
    :aria-valuemax="max"
    :aria-orientation="vertical ? 'vertical' : 'horizontal'"
    :aria-disabled="sliderDisabled"
  >
    <el-input-number
      v-model="firstValue"
      v-if="showInput && !range"
      class="el-slider__input"
      ref="input"
      @change="emitChange"
      :step="step"
      :disabled="sliderDisabled"
      :controls="showInputControls"
      :min="min"
      :max="max"
      :debounce="debounce"
      :size="inputSize"
    >
    </el-input-number>
    <slot name="minText" v-if="showText"
      ><span class="minmax-text min"
        >{{ minText }}<span>{{ $t('deviceStatus.takeOff') }}</span></span
      ></slot
    >
    <div
      class="el-slider__runway"
      :class="{ 'show-input': showInput, disabled: sliderDisabled }"
      :style="runwayStyle"
      @click="onSliderClick"
      ref="slider"
    >
      <div class="el-slider__bar" :style="barStyle"></div>
      <slider-button :vertical="vertical" v-model="firstValue" :tooltip-class="tooltipClass" ref="button1">
        <template class="time" slot="sliderButton">{{ valueText }}</template>
      </slider-button>
      <slider-button :vertical="vertical" v-model="secondValue" :tooltip-class="tooltipClass" ref="button2" v-if="range"> </slider-button>
      <template v-if="markList.length > 0">
        <div>
          <div
            v-for="(item, key) in markList"
            :style="getStopStyle(item.position)"
            class="el-slider__stop el-slider__marks-stop"
            :key="key"
          ></div>
        </div>
        <div class="el-slider__marks">
          <slider-marker :mark="item.mark" v-for="(item, key) in markList" :key="key" :style="getStopStyle(item.position)"> </slider-marker>
        </div>
      </template>
    </div>
    <slot name="maxText" v-if="isArrived"
      ><span class="minmax-text max"
        >{{ maxText }}<span>{{ $t('deviceStatus.arrive') }}</span></span
      ></slot
    >
  </div>
</template>
<script>
import { Slider } from 'element-ui'
import CustomSliderButton from './CustomSliderButton'
import { DateTime } from 'luxon'
export default {
  extends: Slider,
  components: {
    SliderButton: CustomSliderButton
  },
  props: {
    showText: {
      type: Boolean,
      default: true
    },
    isArrived: {
      type: Boolean,
      default: false
    },
    timeFormat: {
      type: String,
      default: 'H:mm'
    }
  },
  computed: {
    minText() {
      return DateTime.fromMillis(this.min).toFormat(this.timeFormat)
    },
    maxText() {
      return DateTime.fromMillis(this.max).toFormat(this.timeFormat)
    },
    valueText() {
      return DateTime.fromMillis(this.value).toFormat(this.timeFormat)
    }
  }
}
</script>
<style lang="scss" scoped>
@import '@/styles/variables.scss';
.time-slider {
  position: relative;
  font-size: 12px;
  .minmax-text {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  > *:not(:last-child) {
    margin-right: 6px;
  }
}
/deep/.el-slider__runway {
  z-index: 0;
  &.disabled {
    .el-slider__bar {
      background-color: $themeColor;
    }
    .el-slider__button {
      border-color: $themeColor;
    }
  }
}
/deep/.el-slider__button-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
}
/deep/.el-slider__button {
  border-radius: 8px;
  width: auto;
  padding: 2px 4px;
  background: $themeColor;
  display: flex !important;
  align-items: center;
  font-weight: 500;
}
.minmax-text {
  position: absolute;
  top: 0px;
  z-index: 9;
  &.min {
    left: 0;
  }
  &.max {
    right: 0;
  }
}
</style>
