<template>
  <Modal class="mf-modal-main" v-model="trigger">
    <div class="modal-header" slot="header">
      <span>移动工作表</span>
      <Icon type="md-close" @click="trigger = false" />
    </div>
    <div class="mf-body">
      <div class="mf-b-title">
        <span>将{{folderType}}</span>
        <span class="em">{{wtData.name}}</span>
        <span>移动至：</span>
      </div>
      <div class="mf-search-box">
        <input type="text" v-model="filterText" required>
        <Icon class="search-icon" type="md-search" />
      </div>
      <div class="mf-tree-body">
        <el-tree
          ref="treeList"
          node-key="id"
          :indent="8"
          :data="folderList"
          check-on-click-node
          highlight-current
          :default-checked-keys="chooseTag"
          @node-click="choose"
          :filter-node-method="filterNode"
          :render-content="renderContent">
        </el-tree>
      </div>
    </div>
    <div slot="footer" class="modal-footer">
      <Button type="text" @click="ok($event)">确定</Button>
      <Button type="text" @click="trigger = false">取消</Button>
    </div>
  </Modal>
</template>
<script>
export default {
  props: {
    value: Boolean,
    wtData: Object,
    folderList: Array
  },
  data () {
    return {
      trigger: false,
      folderType: '',
      filterText: '',
      chooseTag: []
    }
  },
  watch: {
    value () {
      this.trigger = this.value
      this.folderType = ((this.utils.getType(this.wtData.id) === 'folder') ? ('文件夹') : ('工作表'))
    },
    trigger () {
      if (!this.trigger) {
        Object.assign(this.$data, this.$options.data())
      }
      this.$emit('input', this.trigger)
    },
    filterText (val) {
      this.$refs.treeList.filter(val)
    }
  },
  created () {
    this.trigger = this.value
  },
  methods: {
    filterNode (value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },
    choose (node) {
      this.chooseTag = [node.id]
    },
    renderContent (h, { node, data, store }) {
      const spanRes1 = {
        'class': {
          'item-list': true
        }
      }
      const innerSpan = [
        h('div', {
          'class': {
            'item-con': true
          }
        }, [
          h('i', {
            'class': {
              'folder': true
            }
          }),
          h('span', {
            attrs: {
              title: data.name
            },
            domProps: {
              innerHTML: data.name
            }
          })
        ])]

      return h('div', spanRes1, innerSpan)
    },
    refresh (res) {
      if (res.status === 0) {
        this.$message({
          message: '移动成功',
          type: 'success'
        })
        this.$emit('refresh')
        this.trigger = false
        this.$emit('input', this.trigger)
      } else {
        this.$message({
          message: res.msg,
          type: 'error'
        })
      }
    },
    ok (e) {
      e.stopPropagation()

      if (this.chooseTag.length === 0) {
        this.$message({
          message: '请选择文件夹',
          type: 'success'
        })
        return
      }
      let pushData = {}

      switch (this.utils.getType(this.wtData.id)) {
        case 'folder':
          pushData = {
            id: this.wtData.id,
            parent_id: this.chooseTag[0]
          }
          this.wtService.saveFolder(pushData).then(res => {
            this.refresh(res)
          })
          break
        case 'field':
          pushData = {
            id: this.wtData.id,
            folder_id: this.chooseTag[0]
          }
          this.wtService.saveReName(pushData).then(res => {
            this.refresh(res)
          })
          break
      }
    }
  }
}
</script>
