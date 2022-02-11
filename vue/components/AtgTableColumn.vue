<!--
 * @Author: zhangchuanzhong
 * @Date: 2021-04-20 14:56:25
 * @LastEditors: zhangchuanzhong
 * @LastEditTime: 2021-05-23 10:01:55
 * @Description: 表格列设置
 * @Copyright(c) 2021 CMIM Network Co.,Ltd. All Rights Reserved
-->
<template>
  <AtgDialog title="表格设置" :isRequesting="isRequesting" @close="closeWindow">
    <div class="atg-table-column">
      <el-checkbox-group v-model="checkList">
        <el-checkbox v-for="item in columns" :key="item.prop" :label="item.label" :title="item.label"></el-checkbox>
      </el-checkbox-group>
    </div>
    <template #footer>
      <el-button @click="reset">重 置</el-button>
      <el-button type="primary" :disabled="isRequesting" @click="submit">确 定</el-button>
    </template>
  </AtgDialog>
</template>
<script>
import { Message } from 'element-ui'
import AtgDialog from './AtgDialog.vue'

export default {
  inheritAttrs: false,
  components: {
    AtgDialog
  },
  props: {
    columns: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      isRequesting: false,
      checkList: []
    }
  },
  mounted() {
    // 初始化选中的字段
    this.checkList = this.columns.filter(item => item.isShow === true).map(item => item.label)
  },
  methods: {
    closeWindow() {
      this.$emit('update:show', false)
    },
    columnConfigSave() {
      this.closeWindow()
      this.$emit('submit', this.checkList)
    },
    async submit() {
      if (this.checkList.length === 0) {
        Message.warning('请选择至少一个展示列')
        return
      }

      this.isRequesting = true
      await this.columnConfigSave()
      this.isRequesting = false
    },
    reset() {
      this.checkList = this.columns
        .filter(item => item.defaultShow !== false)
        .map(item => {
          return item.label
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.atg-table-column {
  min-height: 50px;
  /deep/.el-checkbox {
    width: 100px;
    margin-bottom: 15px;
    .el-checkbox__label {
      text-overflow: ellipsis;
      width: 100%;
      overflow: hidden;
      vertical-align: middle;
    }
  }
}
</style>
