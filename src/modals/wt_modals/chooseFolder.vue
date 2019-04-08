<template>
  <Modal class="mf-modal-main" v-model="value">
    <div class="modal-header" slot="header">
      <span>选择文件夹</span>
      <Icon type="md-close" @click="close" />
    </div>
    <div class="mf-body">
      <div class="mf-b-title">
        <span>选择文件夹</span>
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
          @node-click="choose"
          :filter-node-method="filterNode"
          :render-content="renderContent">
        </el-tree>
      </div>
    </div>
    <div slot="footer" class="modal-footer">
      <Button type="text" @click="ok($event)">确定</Button>
      <Button type="text" @click="close">取消</Button>
    </div>
  </Modal>
</template>
<script>
export default {
  props: {
    value: Boolean,
    folderList: Array,
    folderId: String
  },
  data () {
    return {
      filterText: '',
      chooseTag: []
    }
  },
  watch: {
    value () {
      if (this.value) {
        if (this.folderId) {
          this.chooseTag = [this.folderId]
        }
      }
      if (this.value) {
        if (this.folderId) {
          this.chooseTag = [this.folderId]
        }
      } else {
        Object.assign(this.$data, this.$options.data())
      }
    },
    filterText (val) {
      this.$refs.treeList.filter(val)
    }
  },
  methods: {
    close () {
      this.$emit('close')
    },
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
    ok (e) {
      e.stopPropagation()
      if (this.chooseTag.length === 0) {
        this.$message({
          message: '请选择文件夹',
          type: 'success'
        })
        return
      }

      let pushData = {
        id: this.chooseTag[0]
      }
      this.$message({
        message: '选择成功',
        type: 'success'
      })
      this.$emit('changeFolder', pushData)
      this.chooseTag = []
      this.close()
    }
  }
}
</script>
