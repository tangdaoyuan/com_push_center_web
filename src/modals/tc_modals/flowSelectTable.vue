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
    value: Boolean
  },
  data () {
    return {
      filterText: '',
      treeList: [
        {
          children: [],
          id: 'tb_1',
          is_deleted: 0,
          name: '时间测试数据',
          type: 4
        }
      ],
      chooseTag: []
    }
  },
  methods: {
    choose (node) {
      if (this.$store.state.task.taskData) {
        this.$message.warning('编辑过程中不允许更换数据表')
      } else {
        if (this.utils.getType(node.id) === 'field') {
          this.chooseTag = [node.id]
        }
      }
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
              'file-mysql': this.utils.getType(data.id) === 'field' && data.type === 5,
              'file-oracle': this.utils.getType(data.id) === 'field' && data.type === 6
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
      console.log('ok')
    },
    close () {
      this.$emit('close')
    }
  }
}
</script>
