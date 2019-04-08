<template>
  <Modal class="cnf-modal-main" v-model="value">
    <div class="modal-header" slot="header">
      <span>创建文件夹</span>
      <Icon type="md-close" @click="close" />
    </div>
    <div class="cnf-body">
      <div class="cnf-b-title">所属文件夹：<span>（默认选择根目录）</span></div>
      <div class="cnf-search-box">
        <input type="text" v-model="filterText" required>
        <Icon class="search-icon" type="md-search" />
      </div>
      <div class="cnf-tree-body">
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
      <div class="cnf-change-name">
        <span>文件夹名称</span>
        <Input type="text" v-model="folderName" :maxlength="16"/>
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
    folderList: Array
  },
  data () {
    return {
      folderName: '',
      filterText: '',
      chooseTag: []
    }
  },
  watch: {
    value () {
      if (!this.value) {
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

      if (!this.folderName) {
        this.$message({
          message: '文件夹名称不能为空',
          type: 'error'
        })
        return
      }

      const pushData = {
        name: this.folderName,
        parent_id: (this.chooseTag.length === 0) ? ('') : (this.chooseTag[0])
      }

      this.wtService.saveFolder(pushData).then(res => {
        if (res.status === 0) {
          this.$message({
            message: '新建成功',
            type: 'success'
          })
          this.$emit('refresh')
          this.close()
          this.folderName = ''
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
      })
    }
  }
}
</script>
