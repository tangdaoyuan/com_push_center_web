<template>
  <Modal
    class="modal-md group-allot-modal"
    v-model="value"
    :mask-closable="false"
    :closable="false">
    <div class="modal-header" slot="header">
      <span>选择组织机构</span>
      <Icon type="md-close" @click="close" />
    </div>
    <div class="modal-body">
      <div class="transfer-main">
        <div class="tm-left">
          <div class="tm-left-header">
            <span>单位/组</span>
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
              :data="sourceList"
              :expand-on-click-node="false"
              :default-expanded-keys="expandList"
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
                  <span :title="item.name">{{item.name}}</span>
                </Checkbox>
                <Icon type="ios-close-circle" @click="removeItem(item, index)" />
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <div class="modal-footer" slot="footer">
      <el-button type="text" class="sure-btn" @click="ok">确定</el-button>
      <el-button type="text" class="cancel-btn"  @click="close">取消</el-button>
    </div>
  </Modal>
</template>
<script>
export default {
  props: {
    value: Boolean,
    prKey: String,
    showText: String,
    changeList: Array
  },
  data () {
    return {
      props: {
        label: this.showText
      },
      sourceList: [],
      expandList: [],
      filterText: '',
      triggerList: [],
      chooseTag: []
    }
  },
  methods: {
    ok () {
      this.$emit('ok', [].concat(this.triggerList))
    },
    close () {
      this.$emit('close')
    },
    choose (data, node, event) {
      node.checked = !node.checked
    },
    searchTree (e) {
      if (e.keyCode === 13) {
        this.$refs.treeList.filter(this.filterText)
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
        if (!this.utils.checkListInner(this.triggerList, item, this.prKey)) {
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
    }
  },
  watch: {
    value () {
      if (this.value) {
        this.$store.dispatch('getUserGroupList', {
          level: -1
        }).then(res => {
          this.sourceList = res
          if (this.$store.state.user.userEditData) {
            const editData = this.$store.state.user.userEditData
            this.userService.getOrgData({
              user_id: editData.id
            }).then(response => {
              if (response.status === 0 && response.data) {
                this.triggerList = [...response.data.organization_code_list.map((item, index) => {
                  return {
                    code: item,
                    name: response.data.organization_name_list[index],
                    type: 1
                  }
                })]
              }
            })
          }
        })
      } else {
        Object.assign(this.$data, this.$options.data())
      }
    }
  }
}
</script>
