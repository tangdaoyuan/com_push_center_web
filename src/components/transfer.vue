<template>
  <div class="transfer-main">
    <div class="tm-left">
      <div class="tm-left-header">
        <span>单位/组与用户</span>
      </div>
      <div class="filter-box">
        <input class="search-input" v-model="filterText" @keyup="searchTree" type="text" required>
        <Icon class="search-icon" type="md-search" />
      </div>
      <div class="tm-left-body">
        <el-tree
          ref="treeList"
          :props="props"
          :node-key="prKey"
          :indent="8"
          @node-click="choose"
          :data="pushList"
          :expand-on-click-node="false"
          lazy
          :default-expanded-keys="expandList"
          :load="loadNode"
          show-checkbox
          render-after-expand
          :render-content="renderContent"
          :filter-node-method="filterNode">
        </el-tree>
      </div>
    </div>
    <div class="tm-mid">
      <Button type="primary" @click="toRight($event)">
        <Icon type="ios-arrow-forward" />
      </Button>
      <Button type="default" @click="toLeft($event)">
        <Icon type="ios-arrow-back" />
      </Button>
    </div>
    <div class="tm-right">
      <div class="tm-right-header">
        <span>已添加</span>
      </div>
      <div class="tm-right-body">
        <ul class="tm-right-ul">
          <li v-for="(item, index) in triggerList" :key="index">
            <Checkbox label="twitter" v-model="item.isChoose">
              <span>{{item.name}}</span>
            </Checkbox>
            <Icon type="ios-close-circle" @click="removeItem(item, index)" />
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      filterText: '',
      triggerList: [],
      chooseTag: [],
      props: {
        label: this.showText
      },
      expandList: []
    }
  },
  created () {
    this.triggerList = this.pushList
  },
  props: {
    value: Array,
    pushList: Array,
    prKey: String,
    showText: String
  },
  watch: {
    triggerList () {
      this.$emit('changeList', this.triggerList)
    },
    value () {
      this.triggerList = this.value
    }
  },
  methods: {
    choose (data, node, event) {
      node.checked = !node.checked
    },
    searchTree (e) {
      if (e.keyCode === 13) {
        if (this.filterText.length > 1) {
          this.tcService.getSearchUser({
            search_content: this.filterText
          }).then(res => {
            if (res.status === 0) {
              this.$emit('changeTarget', res.data)
              this.$refs.treeList.filter(this.filterText)
              this.expandList = []
              const fuc = (list) => {
                list.forEach(n => {
                  if (n.children && n.children.length > 0) {
                    this.expandList.push(n.id)
                    fuc(n.children)
                  }
                })
              }
              fuc(res.data)
            }
          })
        } else if (!this.filterText) {
          this.tcService.getGroupList().then(res => {
            if (res.status === 0) {
              this.$emit('changeTarget', res.data)
            }
          })
        }
      }
    },
    filterNode (value, data, node) {
      if (!value) return true
      if (data.name.indexOf(value) !== -1) {
        return true
      }
      return false
    },
    toRight (e) {
      const tmpData = []
      const treeData = this.$refs.treeList
      treeData.getCheckedKeys().forEach(item => {
        tmpData.push(treeData.getNode(item).data)
      })
      tmpData.forEach(item => {
        if (!this.utils.checkListInner(this.triggerList, item, 'id')) {
          this.triggerList.push(item)
        }
      })
    },
    removeItem (item, index) {
      this.triggerList.splice(index, 1)
    },
    toLeft (e) {
      const tmpData = []
      this.triggerList.forEach(item => {
        if (!item.isChoose) {
          tmpData.push(item)
        }
      })
      this.triggerList = tmpData
    },
    renderContent (h, { node, data, store }) {
      // if (this.filterText.length > 1) {
      //   if (data.children && data.children.length > 0) {
      //     console.log(node, data)
      //     node.expanded = true
      //   }
      // }
      const element = {
        'class': {
          'item-con': true
        }
      }
      const children = [
        h('i', {
          'class': {
            'user-icon': data.type === 3,
            'home-icon': data.type === 1,
            'group-icon': data.type === 2
          }
        }),
        h('span', {
          domProps: {
            innerHTML: data.name
          },
          attrs: {
            title: `${data.name}${(data.identity) ? ('(' + data.identity + ')') : ('')}`
          }
        })
      ]
      return h('div', element, children)
    },
    loadNode (node, resolve) {
      if (node.data.id) {
        if (node.data.type === 3) {
          node.data.leaf = true
          return resolve([])
        } else {
          if (this.filterText.length > 1) {
            if (node.data.children && node.data.children.length > 0) {
              return resolve(node.data.children)
            } else {
              this.tcService.getGroupItem({
                parent_id: node.data.id
              }).then(res => {
                if (res.status === 0) {
                  res.data.forEach(item => {
                    if (item.type === 3) {
                      item.leaf = true
                    }
                  })
                  return resolve(res.data)
                } else {
                  return resolve([])
                }
              })
            }
          } else {
            this.tcService.getGroupItem({
              parent_id: node.data.id
            }).then(res => {
              if (res.status === 0) {
                res.data.forEach(item => {
                  if (item.type === 3) {
                    item.leaf = true
                  }
                })
                return resolve(res.data)
              } else {
                return resolve([])
              }
            })
          }
        }
      }
    }
  }
}
</script>
