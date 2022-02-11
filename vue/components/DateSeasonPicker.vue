<!--
 * @Author: zhangchuanzhong
 * @Date: 2021-07-01 15:45:25
 * @LastEditors: xu jun
 * @LastEditTime: 2021-08-16 17:49:11
 * @Description: 季度选择
 * @Copyright(c) 2021 CMIM Network Co.,Ltd. All Rights Reserved
-->
<template>
  <div class="season-box">
    <mark class="mask" v-show="visible" @click.stop="hide"></mark>
    <el-input :placeholder="placeholder" v-model="showValue" @focus="show" readonly>
      <i slot="prefix" class="el-input__icon el-icon-date"></i>
    </el-input>
    <transition name="el-zoom-in-top">
      <el-card class="box-card" v-show="visible">
        <div slot="header" class="box-header">
          <button
            type="button"
            aria-label="前一年"
            class="el-picker-panel__icon-btn el-date-picker__prev-btn el-icon-d-arrow-left"
            @click="prev"
          ></button>
          <span role="button" class="el-date-picker__header-label">{{ year }}年</span>
          <button
            type="button"
            aria-label="后一年"
            @click="next"
            class="el-picker-panel__icon-btn el-date-picker__next-btn el-icon-d-arrow-right"
          ></button>
        </div>
        <div class="season-item">
          <el-button
            type="text"
            v-for="item in seasonArr"
            :key="item.value"
            @click="selectSeason(item.value)"
            :class="{ active: selectInfo.season === item.value && selectInfo.year === year, disabled: isDisabledDate(item.value) }"
            >{{ item.label }}</el-button
          >
        </div>
      </el-card>
    </transition>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: [String, Date],
      default: ''
    },
    placeholder: {
      type: String,
      default: '请选择季度'
    },
    pickerOptions: {}
  },
  data() {
    return {
      visible: false,
      year: new Date().getFullYear(),
      seasonArr: [
        { label: '第一季度', value: 1 },
        { label: '第二季度', value: 2 },
        { label: '第三季度', value: 3 },
        { label: '第四季度', value: 4 }
      ],
      selectInfo: {
        year: '',
        season: ''
      }
    }
  },
  created() {
    if (this.value) {
      this.setInfo(this.value)
    }
  },
  watch: {
    value: function (value) {
      if (value) {
        this.setInfo(value)
      }
    }
  },
  computed: {
    showValue() {
      return `${this.selectInfo.year}年第${this.selectInfo.season}季度`
    }
  },
  methods: {
    setInfo(value) {
      let d = value
      if (typeof value === 'string') {
        d = new Date(value.replace(/-/g, '/'))
      }
      const year = d.getFullYear()
      const month = d.getMonth() + 1
      this.year = year
      this.selectInfo.year = year
      this.selectInfo.season = this.getSeasonByMonth(month)
    },
    getSeasonByMonth(month) {
      return Math.ceil(month / 3)
    },
    getDateBySeasonStart(season) {
      const month = (season - 1) * 3 + 1
      return new Date(`${this.year}/${month}/01`)
    },
    isDisabledDate(season) {
      const date = this.getDateBySeasonStart(season)
      const disabledDate = this.pickerOptions.disabledDate

      if (typeof disabledDate === 'function') {
        return disabledDate(date)
      } else {
        return false
      }
    },
    prev() {
      this.year = this.year * 1 - 1
    },
    next() {
      this.year = this.year * 1 + 1
    },
    show() {
      this.visible = true
    },
    hide() {
      this.visible = false
    },
    selectSeason(season) {
      const isDisabledDate = this.isDisabledDate(season)
      if (!isDisabledDate) {
        this.selectInfo.year = this.year
        this.selectInfo.season = season
        this.$emit('input', this.getDateBySeasonStart(season))
        this.hide()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.season-box {
  display: inline-block;
  .mask {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0, 0, 0, 0);
    z-index: 999;
  }
  .el-input {
    width: 100%;
  }
  .box-card {
    width: 322px;
    margin-top: 10px;
    position: fixed;
    z-index: 9999;
    .box-header {
      text-align: center;
      padding: 0;
    }
  }
  .season-item {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    .el-button {
      width: 40%;
      color: #606266;
      font-size: 14px;
      margin: 0 5% 10px;
      &.active {
        color: #2fa4ff;
      }
      &.disabled {
        background-color: #f5f7fa;
        cursor: not-allowed;
        color: #c0c4cc;
        border-radius: 18px;
        &:hover {
          opacity: 1;
        }
      }
      &:hover {
        opacity: 0.8;
      }
    }
  }
}
</style>
