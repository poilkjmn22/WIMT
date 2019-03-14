<script>
import {Tree} from '../../js/data-structure'

Array.prototype.insertRightAt = function(pos, obj){
  if(pos > (this.length - 1)){
    this.unshift(obj)
    return this
  }
  var left = this.slice(0, this.length - pos)
  var right = this.slice(this.length - pos)
  return left.concat([obj]).concat(right)
}

function getColorOfValueType(type){
  let colors= ['#8bbc21', '#910000', '#0d233a', '#1aadce','#492970', '#f28f43', '#77a1e5', '#c42525', '#a6c96a']
  let Types = {
    "[object String]": 0,
    "[object Number]": 1,
    "[object Null]": 2,
    "[object Undefined]": 3,
  }
  return colors[Types[type] || 0]
}
export default {
  data(){
    return {
      isAllCollapsed: false,
      isCompact: false
    }
  },
  props: {
    json: {}
  },
  computed: {
    jsonTree(){
      return Tree.parseJSON(this.json)
    }
  },
  watch: {
  },
  render(h) {
      let vm = this
      var vnodeToolbar = h('div', {
        class: 'toolbar'
      }, [h('span', {
        class: ['toolitem', vm.isCompact ? 'is-active' : ''],
        domProps: {
          innerHTML: '压缩'
        },
        on: {
          click(){
            vm.isCompact = !vm.isCompact
          }
        }
      }), h('span', {
        class: ['toolitem', vm.isAllCollapsed ? 'is-active' : ''],
        domProps: {
          innerHTML: '折叠'
        },
        on: {
          click(){
            vm.isAllCollapsed = !vm.isAllCollapsed
            Tree.traverseDFS(vm.jsonTree, treenode => {
              if(!treenode.isLeaf){
                treenode.isCollapsed = vm.isAllCollapsed
              }
            })

            vm.$forceUpdate()
          }
        }
      })])

      let wrapperVNode = h('div', {
          class: 'json-viewer-box'
      }, [vnodeToolbar])

      if(vm.isCompact){
        wrapperVNode.children.push(h('div', {
          class: 'json-string',
          domProps: {
            innerHTML: JSON.stringify(this.json)
          }
        }))
      }else{
        Tree.traverse(this.jsonTree, (treenode, parentnode) => {
            // if(parentnode && parentnode.isCollapsed){
            //   return
            // }
            treenode.VNode = createVNodeOfTreeNode(treenode, parentnode)
            if(!parentnode){
              return
            }
            parentnode.VNode.children = parentnode.VNode.children.insertRightAt(3, treenode.VNode)
        })
        wrapperVNode.children.push(this.jsonTree.VNode)
      }

      function createVNodeOfTreeNode(treenode, parentnode){
        function createKeyVNode(treenode, parentnode){
          return parentnode && parentnode.valueType === '[object Object]' && [h('span', {
            class: 'key',
            domProps: {
              innerHTML: `"${treenode.key}": `
            }
          })] || []
        }
        if(treenode.isCollapsed === true){
          return h('div', {
            class: ['json-parent-node', treenode.valueType]
          }, createKeyVNode(treenode, parentnode).concat([h('div', {
              class: 'collapsed-info'
          }, [h('i', {
            class: 'el-icon-circle-plus-outline',
            on: {
              click: function(e){
                treenode.isCollapsed = false
                treenode.children = treenode.childrenReplace
                treenode.childrenReplace = null
                vm.$forceUpdate()
              }
            }
          }), h('span', {
            domProps: {
              innerHTML: treenode.valueType === '[object Object]' ? 'Object' : 'Array'
            }
          }), h('span', {
            domProps: {
              innerHTML: treenode.valueType === '[object Object]' ? '{' : '['
            }
          }), h('span', {
            style: {
              color: getColorOfValueType(treenode.valueType)
            },
            domProps: {
              innerHTML: treenode.valueType === '[object Object]' ? '...' : treenode.childrenReplace.length
            }
          }), h('span', {
            domProps: {
              innerHTML: treenode.valueType === '[object Object]' ? '}' : ']'
            }
          }), h('span', {
              class: 'comma',
              domProps: {
                innerHTML: ','
              }
          })])]))
        }
        if(treenode.isLeaf){
          return h('div', {
            class: 'json-leaf-node'
          }, createKeyVNode(treenode, parentnode).concat([h('span', {
            class: 'value',
            style: {
              color: getColorOfValueType(treenode.valueType)
            },
            domProps: {
                innerHTML: typeof treenode.value == 'string' ? `"${treenode.value}"` : String(treenode.value)
            }
          }), h('span', {
              class: 'comma',
              domProps: {
                innerHTML: ','
              }
          })]))
        }else{
          return h('div', {
            class: ['json-parent-node', treenode.valueType]
          }, createKeyVNode(treenode, parentnode).concat([h('span', {
              class: 'prefix-wrapper'
          }, [h('i', {
            class: 'el-icon-remove-outline',
            on: {
              click: function(e){
                treenode.isCollapsed = true
                treenode.childrenReplace = treenode.children
                treenode.children = null
                vm.$forceUpdate()
              }
            }
          }), h('span', {
            domProps: {
              innerHTML: treenode.valueType === '[object Object]' ? '{' : '['
            }
          })]), h('br'), h('span', {
              class: 'suffix-wrapper',
              domProps: {
                innerHTML: treenode.valueType === '[object Object]' ? '}' : ']'
              }
          }), h('span', {
              class: 'comma',
              domProps: {
                innerHTML: ','
              }
          }), h('br')]))
        }
      }

      return wrapperVNode
  }
}
</script>

<style lang="css">
.json-parent-node > .key, .json-leaf-node > .key{
  color: #2f7ed8;
}

.json-parent-node > .key, .json-parent-node > [class*="-wrapper"], .json-parent-node > .comma{
  display: inline-block;
}
.json-parent-node > .json-parent-node, .json-parent-node > .json-leaf-node{
  margin-left: 40px;
}

.json-parent-node:nth-last-of-type(1) > .comma, .json-parent-node:nth-last-of-type(1) > .collapsed-info > .comma, .json-leaf-node:nth-last-of-type(1) > .comma{
  display: none;
}

.json-parent-node [class*="el-icon"]{
  cursor: pointer;
  font-size: 15px;
  margin-right: 2px;
}
.json-parent-node [class*="el-icon"]:hover{
  color: #1AA5FF;
  -webkit-transition: color 0.4s ease-in;
  transition: color 0.4s ease-in;
}

.toolbar{
  font-size: 12px;
}
.toolbar .toolitem{
  display: inline-block;
  cursor: pointer;
  border: 1px solid #dcdfe6;
  margin-right: 20px;
  padding: 0px 10px;
}
.toolbar .toolitem.is-active{
  color: #1AA5FF;
}
</style>
