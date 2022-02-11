<!--
 * @Author: zhangchuanzhong
 * @Date: 2021-04-20 14:56:25
 * @LastEditors: xu jun
 * @LastEditTime: 2022-01-26 11:23:51
 * @Description: 弹框组件
 * @Copyright(c) 2021 CMIM Network Co.,Ltd. All Rights Reserved
-->
<template>
  <div v-drag>
    <el-dialog
      class="atg-dialog"
      ref="dialog"
      v-bind="$attrs"
      :visible="visible"
      :title="title"
      :width="width"
      append-to-body
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :top="top"
      @close="close"
      @open="open"
      @opened="opened"
    >
      <div v-loading="isRequesting">
        <slot></slot>
      </div>

      <template #footer v-if="footer">
        <div class="dialog-footer">
          <slot name="footer">
            <el-button type="primary" plain @click="close">取 消</el-button>
            <el-button type="primary" @click="submit" :disabled="isRequesting">{{ confirmText }}</el-button>
          </slot>
        </div>
      </template>
    </el-dialog>
  </div>
</template>
<script>
export default {
  inheritAttrs: false,
  props: {
    visible: {
      type: Boolean,
      default: true
    },
    confirmText: {
      type: String,
      default: '保存'
    },
    title: {
      type: String,
      required: true
    },
    width: {
      type: String,
      default: '600px'
    },
    top: {
      type: String,
      default: '0'
    },
    isRequesting: {
      type: Boolean,
      default: false
    },
    footer: {
      type: Boolean,
      default: true
    },
    data: {
      default: () => {
        return {}
      }
    }
  },
  watch: {
    data: {
      handler: function () {
        //数据发生变化，可能dom发生改变
        this.adjustPosition()
      },
      deep: true
    },
    visible() {
      this.adjustPosition()
    }
  },
  mounted() {
    this.adjustPosition()
  },
  methods: {
    adjustPosition() {
      this.$nextTick(() => {
        const $el = this.$refs.dialog.$el.querySelector('.el-dialog')
        const dialogHeight = $el.clientHeight
        const screenHeight = document.body.clientHeight
        const top = (screenHeight - dialogHeight) / 2

        $el.style.setProperty('top', `${Math.max(0, top)}px`)
      })
    },
    close() {
      this.$emit('close')
    },
    open() {
      this.$emit('open')
    },
    opened() {
      this.$emit('opened')
    },
    submit() {
      this.$emit('submit')
    }
  }
}
</script>
<style lang="scss" scoped>
.dialog-footer {
  text-align: center;
  .el-button {
    margin: 0 5px;
  }
}
</style>
