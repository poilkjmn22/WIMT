<script>
const VALUE_TYPE = {
  obj: 0,
  arr: 1,
  oth: 2
}
function getValueType(obj){
  if(Object.prototype.toString.call(obj) === '[object Object]'){
    return VALUE_TYPE.obj
  }else if(Object.prototype.toString.call(obj) === '[object Array]'){
    return VALUE_TYPE.arr
  }
  return VALUE_TYPE.oth
}
Array.prototype.insertRightAt = function(pos, obj){
  if(pos > (this.length - 1)){
    this.unshift(obj)
    return this
  }
  var left = this.slice(0, this.length - pos)
  var right = this.slice(this.length - pos)
  return left.concat([obj]).concat(right)
}
function walkObj(obj, cb, parentVNode){
  if(!parentVNode.children){
    parentVNode.children = []
  }
  if(Object.prototype.toString.call(obj) === '[object Object]'){
    for (var key in obj) {
      if (obj.hasOwnProperty(key)) {
        var tmpVNode = cb.call(this, key, VALUE_TYPE.obj, getValueType(obj[key]))
        parentVNode.children = parentVNode.children.insertRightAt(1, tmpVNode)
        walkObj(obj[key], cb, tmpVNode)
      }
    }
  }else if(Object.prototype.toString.call(obj) === '[object Array]'){
    for (var variable of obj) {
      var tmpVNode = cb.call(this, variable, VALUE_TYPE.arr, getValueType(variable))
      //加入到倒数第二个位置
      parentVNode.children = parentVNode.children.insertRightAt(1, tmpVNode)
      walkObj(variable, cb, tmpVNode)
    }
  }else{
    parentVNode.children.push(cb.call(this, obj, VALUE_TYPE.oth))
  }
}
export default {
  props: {
    json: {}
  },
  render(h) {
      let rootVNode = createVNode('', getValueType(this.json), getValueType(this.json))
      let wrapperVNode = h('div', {
          class: 'json-viewer-box'
      }, [rootVNode])

      function createVNode(value, valueType, leafValueType) {
          let res = h('div')
          function generateWrapperIcon(ValueType){
            let res = []
            switch (ValueType) {
              case VALUE_TYPE.obj:
                res = [h('div', {
                    class: 'obj-prefix-wrapper'
                }, [h('i', {
                  class: 'el-icon-remove-outline',
                  on: {
                    click: function(e){
                      onToggleExpand(e)
                    }
                  }
                }), h('span', {
                  domProps: {
                    innerHTML: '{'
                  }
                })]), h('br'), h('div', {
                    class: 'obj-suffix-wrapper',
                    domProps: {
                      innerHTML: '}'
                    }
                })]
                break;
              case VALUE_TYPE.arr:
                res = [h('div', {
                    class: 'arr-prefix-wrapper'
                }, [h('i', {
                  class: 'el-icon-remove-outline',
                  on: {
                    click: function(e){
                      onToggleExpand(e)
                    }
                  }
                }), h('span', {
                  domProps: {
                    innerHTML: '['
                  }
                })]), h('br'), h('div', {
                    class: 'arr-suffix-wrapper',
                    domProps: {
                      innerHTML: ']'
                    }
                })]
                break;
              default:

            }
            return res
          }
          switch (valueType) {
              case VALUE_TYPE.obj:
                  res = h('div', {
                      class: 'json-parent-node obj'
                  }, [h('div', {
                      class: 'key',
                      domProps: {
                          innerHTML: value && `${value}：` || ''
                      }
                  })].concat(generateWrapperIcon(leafValueType)))
                  break;
              case VALUE_TYPE.arr:
                  res = h('div', {
                      class: 'json-parent-node arr'
                  }, generateWrapperIcon(leafValueType))
                  break;
              case VALUE_TYPE.oth:
                  res = h('div', {
                      class: 'value',
                      domProps: {
                          innerHTML: value || String(value)
                      }
                  })
                  break;
              default:

          }
          return res
      }

      //节点收缩与隐藏
      function onToggleExpand(e){
        var elTar = e.target || e.srcElement
        var isCollapsed = /\bis-collapsed\b/.test(elTar.parentNode.parentNode.className)
        if(isCollapsed){
          elTar.parentNode.parentNode.className = elTar.parentNode.parentNode.className.replace(/[\b|\s]*is-collapsed\b/, '')
          elTar.className = 'el-icon-remove-outline'
        }else{
          elTar.parentNode.parentNode.className = elTar.parentNode.parentNode.className.replace(/([\b|\s]*)$/, '$1 is-collapsed')
          elTar.className = 'el-icon-circle-plus-outline'
        }
      }

      walkObj(this.json, createVNode, rootVNode)
      return wrapperVNode
  }
}
</script>

<style lang="css">
.json-parent-node{

}
.json-parent-node.is-collapsed > .json-parent-node{
  display: none;
}
.json-parent-node .key, .json-parent-node .value, .json-parent-node [class*="prefix-wrapper"]{
  display: inline-block;
}
.json-parent-node .value{
}
.json-parent-node > .json-parent-node{
  margin-left: 40px;
}

[class*="-prefix-wrapper"] > [class*="el-icon"]{
  cursor: pointer;
  font-size: 15px;
}
[class*="-prefix-wrapper"] > [class*="el-icon"]:hover{
  color: #1AA5FF;
  -webkit-transition: color 0.4s ease-in;
  transition: color 0.4s ease-in;
}
</style>
