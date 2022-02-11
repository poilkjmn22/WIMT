<!--
 * @Author: fangqi
 * @Date: 2022-01-27 10:56:38
 * @LastEditors: fangqi
 * @LastEditTime: 2022-02-11 11:25:40
 * @Description: 支持高亮模糊查询的树形选择控件
 * @Copyright(c) 2021 CMIM Network Co.,Ltd. All Rights Reserved
-->
<template>
  <div class="searchable-tree-box">
    <el-input clearable class="mb-10" v-model.trim="searchKeyword" :maxlength="50" :placeholder="`请输入${title}查询`"> </el-input>
    <el-tree
      class="tree-line-box"
      ref="tree"
      node-key="nodeKey"
      default-expand-all
      show-checkbox
      :data="treeData"
      :check-strictly="!multiple"
      :props="defaultProps"
      @check="handleCheckTreeNode"
    >
      <HighlightSubtext slot-scope="{ data }" :text="defaultProps.label(data)" :subtext="searchKeyword" />
    </el-tree>
  </div>
</template>
<script>
import { findIndex } from '@/utils/treeData.js'
import HighlightSubtext from '@/components/HighlightSubtext.vue'

export default {
  components: {
    HighlightSubtext
  },
  props: {
    treeData: [Array],
    title: {
      type: String,
      default: '关键字'
    },
    nodeKey: {
      type: String,
      default: 'id'
    },
    // 支持多选
    multiple: {
      type: Boolean,
      default: false
    },
    selectedIds: {
      type: Array,
      default: () => []
    },
    defaultProps: {
      type: Object,
      default() {
        return {
          children: 'children',
          label(data) {
            return data.resourceName
          }
        }
      }
    }
  },
  data() {
    return {
      searchKeyword: '',
      checkedTreeNode: null
    }
  },
  watch: {
    searchKeyword(val) {
      const index = findIndex(this.treeData, d => this.defaultProps.label(d).indexOf(val) >= 0, { children: 'children' })
      this.scrollTreeItemIntoView(index)
    },
    checkedTreeNode(val) {
      this.$emit('change', val)
    },
    selectedIds(val) {
      this.$refs.tree.setCheckedKeys(val)
      console.log(val)
      this.checkedTreeNode = this.$refs.tree.getCheckedNodes()
    }
  },
  methods: {
    // 父节点单选
    handleCheckTreeNode(node, checked) {
      if (this.multiple) {
        this.checkedTreeNode = checked.checkedNodes
        return
      }
      const checkedNodes = []
      if (!node.checked && node !== this.checkedTreeNode) {
        checkedNodes.push(node)
      }
      this.$refs.tree.setCheckedNodes(checkedNodes)
      this.checkedTreeNode = checkedNodes[0]
    },
    scrollTreeItemIntoView(index) {
      if (this.$refs.tree.treeItems[index]) {
        this.$refs.tree.treeItems[index].scrollIntoView({ block: 'start' })
      }
    }
  }
}
</script>
<style lang="scss" scoped></style>
