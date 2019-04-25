<template>
  <div class="step-body" v-show="step === 1">
    <task-filter
      v-model="taskFilterModal"
      :choose-index="chooseIndex"
      :filter-data="chooseFilter"
      :table-data="tableData"
      :table-map="tableMap"
      @ok="addFilter"
      @close="closeTaskFilter" />
    <div class="step-filter-body">
      <div class="ts-left ts-left-flow">
        <div class="ts-step-header">
          <span>选择流式数据表</span>
        </div>
        <div class="search-box">
          <input class="search-input" v-model="filterText" type="text" required>
          <Icon class="search-icon" type="md-search" />
        </div>
        <div class="left-body">
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
      </div>
      <div class="ts-content-flow">
        <div class="step-filter" :class="{'hide-body': filterToogle}">
          <div class="filter-header">
            <span>武汉铁路表</span>
          </div>
          <div class="filter-body" :class="{'hide-body': filterToogle}">
            <div class="filter-text">
              <span>条件筛选</span>
            </div>
            <div class="filter-con-head">
              <div class="filter-toa">
                <label class="filter-title">满足下列</label>
                <el-select class="filter-head-select" v-model="chooseFilterType">
                  <el-option v-for="item in CONSTANT.tsFilterTypeList" :key="item.value" :value="item.value" :label="item.name"></el-option>
                </el-select>
              </div>
              <el-button class="filter-btn" icon="el-icon-plus" circle type="primary" @click="addTaskFilter()" />
            </div>
            <div class="filter-con-body">
              <div class="filter-item" v-for="(item, index) in filterList" :key="index">
                <div class="title-box">
                  <span>{{(tableMap[item.field_id]) ? (tableMap[item.field_id].alias || tableMap[item.field_id].name) : ''}}</span>
                  &nbsp;
                  <span v-show="item.op !== 'range'">{{utils.getTaskOp(item.op)}}</span>
                  &nbsp;
                  <span v-show="item.op !== 'range'">{{item.value || ''}}</span>
                  &nbsp;
                  <span v-show="item.op === 'range'">
                    <span v-if="item.value && item.value[0] && item.value[1]">
                      在{{utils.momentDate(new Date(item.value[0]).getTime(), 'date_time')}}~{{utils.momentDate(new Date(item.value[1]).getTime(), 'date_time')}}之间
                    </span>
                    <span v-else-if="item.value && item.value[0]">
                      从{{utils.momentDate(new Date(item.value[0]).getTime(), 'date_time')}}开始
                    </span>
                    <span v-else-if="item.value && item.value[1]">
                      在{{utils.momentDate(new Date(item.value[1]).getTime(), 'date_time')}}之前
                    </span>
                  </span>
                </div>
                <div class="op-box">
                  <span class="icon icon-edit" @click="editFilter(item, index)"></span>
                  <el-popover
                    placement="top"
                    width="160"
                    v-model="item.deleteModal">
                    <p>确定删除该条匹配规则么？</p>
                    <div style="text-align: right; margin: 0">
                      <el-button size="mini" type="text" @click="item.deleteModal = false">取消</el-button>
                      <el-button type="primary" size="mini" @click="deleteFilter(item, index)">确定</el-button>
                    </div>
                    <div slot="reference" class="icon icon-del" @click.native="item.deleteModal = true"></div>
                  </el-popover>
                </div>
              </div>
            </div>
          </div>
          <div class="seperator"></div>
        </div>
        <div class="step-table">
          <div class="table-header">
            <span class="table-selection">选择纬度表</span>
            <div class="table-item">
              <span class="item-title">武汉铁路维度表</span>
              <span class="el-icon-close item-del"></span>
            </div>
            <span class="table-preview">数据预览</span>
          </div>
          <div class="table-body">
            <Tabs size="small" v-model="tabName" on-click="changeTab">
              <TabPane label="条件碰撞" name="first">
                <div class="table-panel">
                  <span class="source-table">武汉铁路流失表</span>
                  <span>&nbsp;</span>
                  <span class="target-table">武汉铁路纬度表</span>
                  <span>&nbsp;</span>
                  <el-select class="select" value="性别">
                    <el-option :key="1" value="性别" label="性别"></el-option>
                    <el-option :key="2" value="年龄" label="年龄"></el-option>
                  </el-select>
                  <span class="equal">等于</span>
                  <el-select class="select" value="男">
                    <el-option :key="1" value="男" label="男"></el-option>
                    <el-option :key="2" value="女" label="女"></el-option>
                  </el-select>
                  <div class="op-box">
                    <span class="el-icon-plus"></span>
                    <span class="el-icon-minus"></span>
                  </div>
                </div>
              </TabPane>
              <TabPane label="数据筛选" name="second">
                <div class="table-panel">
                  <el-select class="select" value="年龄">
                    <el-option :key="1" value="性别" label="性别"></el-option>
                    <el-option :key="2" value="年龄" label="年龄"></el-option>
                  </el-select>
                  <span class="equal">等于</span>
                  <el-select class="select" value="10">
                    <el-option :key="1" value="10" label="10"></el-option>
                    <el-option :key="2" value="20" label="20"></el-option>
                  </el-select>
                  <div class="op-box">
                    <span class="el-icon-plus"></span>
                    <span class="el-icon-minus"></span>
                  </div>
                </div>
              </TabPane>
            </Tabs>
          </div>
        </div>
      </div>
      <div class="ts-right-flow">
        <div class="step-filter">
          <div class="filter-header">
            <span>输出字段</span>
            <span class="el-icon-plus"></span>
          </div>
          <div class="filter-body">
            <div class="output-field selected">
              <span class="dot b-dot"></span>
              <span>字段一</span>
              <span class="el-icon-close"></span>
            </div>
            <div class="output-field">
              <span class="dot b-dot"></span>
              <span>字段一</span>
            </div>
            <div class="output-field">
              <span class="dot y-dot"></span>
              <span>字段一</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="step-footer">
      <el-button v-show="!$store.state.task.taskData" @click="prev()">上一步</el-button>
      <el-button type="primary" @click="next()">{{$store.state.task.taskData ? '完成修改' : '下一步'}}</el-button>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    step: Number
  },
  data () {
    return {
      tabName: 'first',
      filterText: '',
      treeList: [],
      chooseTag: [],
      filterToogle: false,
      taskFilterModal: false,
      filterDeleteModal: false,
      chooseFilterType: 1,
      chooseIndex: -1,
      tableMap: {},
      tableData: {
        title_list: [],
        data_list: []
      },
      chooseFilter: {},
      filterList: []
    }
  },
  methods: {
    init () {
      if (!this.treeList || this.treeList.length === 0) {
        this.wtService.getFolder().then(res => {
          if (res.status === 0) {
            this.treeList = res.data
          }
        })
      }
      if (this.$store.state.task.taskData) {
        const taskData = this.$store.state.task.taskData
        this.chooseTag = [taskData.table_id]
        this.chooseFilterType = taskData.filter_logic
        this.filterList = taskData.filter_list
        this.tbId = taskData.table_id
        this.tableData = {
          title_list: [],
          data_list: []
        }
        this.wtService.getprewData({
          page_no: 1,
          page_size: 100,
          tb_id: this.tbId
        }).then(res => {
          if (res.status === 0) {
            this.tableData = res.data
            this.$store.commit('setTaskTableData', res.data)
          }
        })
      }
    },
    closeTaskFilter () {
      this.taskFilterModal = false
    },
    changeTab (tab, event) {
      console.log(tab)
    },
    choose (node) {
      if (this.$store.state.task.taskData) {
        this.$message.warning('编辑过程中不允许更换数据表')
      } else {
        if (this.utils.getType(node.id) === 'field') {
          this.chooseTag = [node.id]
          this.chooseItem = node
          this.tbId = node.id
          this.tableData = {
            title_list: [],
            data_list: []
          }
          this.wtService.getprewData({
            page_no: 1,
            page_size: 100,
            tb_id: node.id
          }).then(res => {
            if (res.status === 0) {
              this.tableData = res.data
              this.filterList = []
              this.$store.commit('setTableId', node.id)
              this.$store.commit('setTaskTableData', res.data)
            }
          })
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
    editFilter (item, index) {
      this.chooseFilter = item
      this.chooseIndex = index
      this.taskFilterModal = true
      console.log(item)
    },
    addTaskFilter () {
      this.chooseIndex = -1
      this.taskFilterModal = true
    },
    addFilter (res) {
      if (res.chooseIndex > -1) {
        this.filterList.splice(res.chooseIndex, 1, {
          ...res,
          chooseIndex: undefined
        })
      } else {
        this.filterList = [...this.filterList, {
          ...res,
          chooseIndex: undefined
        }]
      }
    },
    deleteFilter (item, index) {
      item.deleteModal = false
      this.filterList.splice(index, 1)
    },
    prev () {
      this.$emit('prev')
    },
    next () {
      if (!this.tbId) {
        this.$message.error('请选择工作表!')
        return
      }
      if (!this.chooseFilterType && this.chooseFilterType !== 0) {
        this.$message.error('请配置全局条件')
        return
      }

      if (this.filterList && this.filterList.length > 0) {
        this.filterList = this.filterList.map(item => {
          return {
            ...item,
            deleteModal: undefined
          }
        })
      }

      const putData = {
        id: this.$store.state.task.taskId,
        table_id: this.tbId,
        filter_list: this.filterList,
        filter_logic: this.chooseFilterType
      }

      const service = this.$store.state.task.taskData ? this.tcService.editStep2(putData) : this.tcService.saveTask1Seting(putData)
      service.then(res => {
        if (res.status === 0) {
          this.$message.success('保存成功')
          if (!this.$store.state.task.taskData) {
            this.$emit('next', 1)
          } else {
            this.$emit('refresh')
          }
        } else {
          this.$message.error(res.msg || '保存失败')
        }
      })
    }
  },
  watch: {
    tableData () {
      if (this.tableData && this.tableData.title_list) {
        const tmp = {}
        this.tableData.title_list.forEach(item => {
          tmp[item.id] = item
        })
        this.tableMap = tmp
      }
    },
    step () {
      if (this.step === 1) {
        this.init()
      } else if (this.step === -1) {
        Object.assign(this.$data, this.$options.data())
      }
    }
  }
}
</script>
