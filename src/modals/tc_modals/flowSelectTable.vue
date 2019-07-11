<template>
  <Modal
      class="select-table-main"
      scrollable
      v-model="value"
      :mask-closable="false"
      :closable="false">
      <div
        class="modal-header flow-data-header"
        slot="header">
        <span>武汉铁路流式表</span>
        <Icon type="md-close" @click="close" />
      </div>
      <div class="flow-data-body">
        <div class="search-box">
          <input class="search-input" v-model="filterText" type="text" required>
          <Icon class="search-icon" type="md-search" />
        </div>
          <el-tree
            ref="treeList"
            node-key="id"
            :indent="8"
            :data="treeList"
            check-on-click-node
            :default-expanded-keys="chooseTag"
            auto-expand-parent
            highlight-current
            :default-checked-keys="chooseTag"
            @node-click="choose"
            :filter-node-method="filterNode"
            :render-content="renderContent">
          </el-tree>
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
    category: Number
  },
  data () {
    return {
      filterText: '',
      treeList: [],
      chooseTag: [],
      params: {
        id: '',
        name: ''
      }
    }
  },
  methods: {
    init () {
      if (!this.treeList || this.treeList.length === 0) {
        if (this.category) {
          this.wtService.getFolder({
            category: this.category
          }).then(res => {
            if (res.status === 0) {
              this.treeList = res.data
            }
          })
        } else {
          this.wtService.getFolder().then(res => {
            if (res.status === 0) {
              this.treeList = res.data
            }
          })
        }
      }
    },
    choose (node) {
      // if (this.$store.state.task.taskData) {
      //   this.$message.warning('编辑过程中不允许更换数据表')
      // } else {
      if (this.utils.getType(node.id) === 'field') {
        this.chooseTag = [node.id]
        this.params.id = node.id
        this.params.name = node.name
      }
      // }
    },
    filterNode (value, data) {
      if (!value) return true
      if (data.name) {
        return data.name.indexOf(value) !== -1
      }
    },
    renderContent (h, { node, data, store }) {
      const spanRes1 = {
        'class': {
          'item-list': true,
          'selected': data.id === this.chooseTag[0]
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
              'folder': this.utils.getType(data.id) === 'folder' || this.utils.getType(data.id) === 'ds',
              'file': this.utils.getType(data.id) === 'field',
              'file-ds': this.utils.getType(data.id) === 'field' && data.type === 1,
              'file-aggr': this.utils.getType(data.id) === 'field' && data.type === 2,
              'file-public': this.utils.getType(data.id) === 'field' && data.type === 3,
              'file-excel': this.utils.getType(data.id) === 'field' && data.type === 4,
              'file-oracle': this.utils.getType(data.id) === 'field' && (data.type === 5 || data.type === 8),
              'file-mysql': this.utils.getType(data.id) === 'field' && data.type === 6,
              'file-kafka': this.utils.getType(data.id) === 'field' && data.type === 7,
              'file-hive': this.utils.getType(data.id) === 'field' && data.type === 9,
              'file-datahub': this.utils.getType(data.id) === 'field' && data.type === 10,
              'file-set': this.utils.getType(data.id) === 'field' && data.type === 0
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
    ok () {
      if (this.chooseTag.length <= 0) {
        this.$message.error('请选择纬度表')
      }
      this.wtService.getprewData({
        page_no: 1,
        page_size: 100,
        tb_id: this.chooseTag[0]
      }).then(res => {
        if (res.status === 0) {
          const datas = {
            ...this.params,
            ...res.data
          }
          this.$emit('ok', datas)
        }
      })
    },
    close () {
      this.$emit('close')
    }
  },
  watch: {
    value () {
      if (this.value) {
        this.init()
      }
    },
    filterText (val) {
      this.$refs.treeList.filter(val)
    }
  }
}
</script>
