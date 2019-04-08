<template>
  <Modal class="ct-modal-main" v-model="value">
    <div class="ct-header" slot="header">
      <span>选择数据表</span>
      <Icon type="md-close" @click="close" />
    </div>
    <div class="ct-body">
      <div class="body-list">
        <el-tree
          node-key="ref"
          :props="tableProps"
          :indent="8"
          :data="bdpTreeList"
          check-on-click-node
          auto-expand-parent
          highlight-current
          @node-click="chooseTableList"
          :render-content="renderContent">
        </el-tree>
      </div>
      <div class="body-con">
        <div class="con-search">
          <div class="search-box">
            <input class="search-input" type="text" required v-model="searchContent">
            <Icon class="search-icon" type="md-search" />
          </div>
        </div>
        <div class="con-main">
          <el-checkbox-group v-model="table" ref="tableList">
            <el-checkbox v-for="(item, index) in utils.searchList(tableList, searchContent)" :key="index" :label="item">{{item.name}}</el-checkbox>
          </el-checkbox-group>
          <!-- <el-radio-group v-model="table" ref="tableList">
            <el-radio v-for="(item, index) in utils.searchList(tableList, searchContent)" :key="index" :label="item">{{item.name}}</el-radio>
          </el-radio-group> -->
        </div>
      </div>
    </div>
    <div slot="footer" class="ct-footer">
      <Button @click="nextSyncbdp2()">保存</Button>
      <Button @click="close">取消</Button>
    </div>
  </Modal>
</template>
<script>
export default {
  props: {
    value: Boolean,
    connectId: String,
    tables: Array
  },
  created () {},
  data () {
    return {
      radio2: 3,
      bdpTreeList: [],
      chooseTag: [],
      tableProps: {
        label: 'name',
        children: 'folder'
      },
      tableList: [],
      table: this.tables,
      tableInfo: [],
      searchContent: ''
    }
  },
  watch: {
    value () {
      if (!this.value) {
        Object.assign(this.$data, this.$options.data())
      }
    },
    connectId () {
      this.getBdpTree()
    }
  },
  methods: {
    init () {},
    close () {
      this.$emit('close')
    },
    nextSyncbdp2 () {
      if (this.table.length === 0) {
        this.$message.error('请选择数据表')
      } else {
        let chooseTables = []
        this.table.forEach(item => {
          chooseTables.push({
            ref: item.ref,
            table: item.name
          })
        })
        this.dmService.getTableInfo({
          connect_id: this.connectId,
          table_list: chooseTables
        }).then(res => {
          if (res.status === 0) {
            this.close()
            this.tableInfo = res.data
            this.$emit('saveBdptableData', this.tableInfo, this.table)
          } else {
            this.$message.error('获取表格失败')
          }
        })
      }
    },
    filterNode (value, data) {
      if (!value) return true
      if (data.name) {
        return data.name.indexOf(value) !== -1
      }
    },
    getBdpTree () {
      this.dmService.getBdpTree({
        connect_id: this.connectId
      }).then(res => {
        if (res.status === 0) {
          this.bdpTreeList = res.data.data
        } else {
          this.$message.error('获取失败')
        }
      })
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
              'alone': data.folder.length === 0,
              'more': data.folder.length !== 0
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
    chooseTableList (data, node) {
      this.tableList = data.table
    }
  }
}
</script>
