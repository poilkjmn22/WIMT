/*
 * @Author: fangqi
 * @Date: 2021-11-11 11:28:58
 * @LastEditors: fangqi
 * @LastEditTime: 2022-02-09 15:43:53
 * @Description: 树形结构数据工具方法
 * @Copyright(c) 2021 CMIM Network Co.,Ltd. All Rights Reserved
 */
'use strict'
import property from 'nested-property'
import { keyBy } from 'lodash-es'

function toArray(treeData, options = { children: 'child', expandable: true }) {
  const res = []
  if (!Array.isArray(treeData)) {
    return res
  }
  function innerWalk(child) {
    for (const d of child) {
      res.push(d)
      if (d[options.children] && d[options.children].length > 0) {
        if (!options.expandable || d.expand) {
          innerWalk(d[options.children])
        }
      }
    }
  }
  innerWalk(treeData)
  return res
}

function traverse(treeData, cb, options = { children: 'children' }) {
  function innerWalk(child, p) {
    if (!Array.isArray(child)) {
      return
    }
    for (const d of child) {
      cb(d, p)
      if (d[options.children] && d[options.children].length > 0) {
        innerWalk(d[options.children], d)
      }
    }
    return
  }
  innerWalk(treeData, null)
}

function findIndex(treeData, predicate, options = { children: 'child' }) {
  let index = -1
  let found = -1
  if (!Array.isArray(treeData)) {
    throw new Error('参数类型不正确（treeData应为数组）')
  }
  if (typeof predicate !== 'function') {
    throw new Error('参数类型不正确（predicate应为函数）')
  }
  const processing = [...treeData]
  while (processing.length) {
    const processed = processing.shift()
    index += 1
    if (predicate(processed)) {
      found = index
      break
    }
    if (Array.isArray(processed[options.children])) {
      processing.unshift(...processed[options.children])
    }
  }
  return found
}

function findNode(treeData, predicate, options = { children: 'child' }) {
  let found = null
  if (!Array.isArray(treeData)) {
    throw new Error('参数类型不正确（treeData应为数组）')
  }
  if (typeof predicate !== 'function') {
    throw new Error('参数类型不正确（predicate应为函数）')
  }
  const processing = [...treeData]
  while (processing.length) {
    const processed = processing.shift()
    if (predicate(processed)) {
      found = processed
      break
    }
    if (Array.isArray(processed[options.children])) {
      processing.unshift(...processed[options.children])
    }
  }
  return found
}

function findParents(node, options = { parent: '_parent' }) {
  const parents = []
  let tmp = node
  while (tmp) {
    tmp = tmp[options.parent]
    if (tmp) {
      parents.unshift(tmp)
    }
  }
  return parents
}

function createTree(array, rootNodes, customID, childrenProperty) {
  const tree = []

  let idx = 0
  for (const rootNode in rootNodes) {
    const node = rootNodes[rootNode]
    node._index = idx
    idx += 1
    const childNode = array[node[customID]]

    if (!node && !rootNodes.hasOwnProperty(rootNode)) {
      continue
    }

    if (childNode) {
      childNode.forEach(d => {
        d.level = node.level + 1
        d._parent = node
      })
      node[childrenProperty] = createTree(array, childNode, customID, childrenProperty)
    }

    tree.push(node)
  }

  return tree
}

function groupByParents(array, options) {
  const arrayByID = keyBy(array, options.customID)

  return array.reduce(function (prev, item) {
    let parentID = property.get(item, options.parentProperty)
    if (!parentID || !arrayByID.hasOwnProperty(parentID)) {
      parentID = options.rootID
    }

    if (parentID && prev.hasOwnProperty(parentID)) {
      prev[parentID].push(item)
      return prev
    }

    prev[parentID] = [item]
    return prev
  }, {})
}

function isObject(o) {
  return Object.prototype.toString.call(o) === '[object Object]'
}

function initTreeFields(data) {
  return data.map(d =>
    Object.assign(d, {
      expand: true
    })
  )
}

function deepClone(data) {
  if (Array.isArray(data)) {
    return data.map(deepClone)
  } else if (isObject(data)) {
    return Object.keys(data).reduce(function (o, k) {
      o[k] = deepClone(data[k])
      return o
    }, {})
  } else {
    return data
  }
}

function arrayToTree(data, options) {
  options = Object.assign(
    {
      parentProperty: 'parent_id',
      childrenProperty: 'children',
      customID: 'id',
      rootID: '00000'
    },
    options
  )

  if (!Array.isArray(data)) {
    throw new TypeError('Expected an array but got an invalid argument')
  }

  const grouped = groupByParents(deepClone(initTreeFields(data)), options)

  // 增加0层level属性
  grouped[options.rootID].forEach(d => {
    d.level = 0
  })

  return createTree(grouped, grouped[options.rootID], options.customID, options.childrenProperty)
}

export { toArray, findIndex, findNode, findParents, arrayToTree, traverse }
