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
      <div class="ts-left">
        <div class="ts-step-header">
          <span>选择工作表</span>
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
      <div class="ts-right">
        <div class="step-filter" :class="{'hide-body': filterToogle}">
          <div class="filter-header">
            <span>条件筛选</span>
          </div>
          <div class="filter-body" :class="{'hide-body': filterToogle}">
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
                  <span v-show="item.op !== 'range'">{{utils.getTaskOp(item.op)}}</span>
                  <span v-show="item.op !== 'range'">{{item.value || ''}}</span>
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
                  <i class="el-icon-edit" @click="editFilter(item, index)"></i>
                  <el-popover
                    placement="top"
                    width="160"
                    v-model="item.deleteModal">
                    <p>确定删除该条匹配规则么？</p>
                    <div style="text-align: right; margin: 0">
                      <el-button size="mini" type="text" @click="item.deleteModal = false">取消</el-button>
                      <el-button type="primary" size="mini" @click="deleteFilter(item, index)">确定</el-button>
                    </div>
                    <i slot="reference" class="el-icon-delete" @click="item.deleteModal = true"></i>
                  </el-popover>

                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="ts-step-header">
          <div class="title">
            <span>数据预览</span>
            <i class="sync" @click="syncData()"></i>
            <span>显示最新 <em>{{(tableData.total > 50) ? (50) : (tableData.total)}}</em> 条数据，共 <em>{{tableData.total}}</em> 条数据</span>
            <i class="seq"></i>
            <span>最近更新时间：<em>{{utils.momentDate(tableData.update_time, 'date_time')}}</em></span>
          </div>
          <Icon :class="{'hide-body': filterToogle}" @click="filterToogle = !filterToogle" type="ios-arrow-down" />
        </div>
        <div class="ts-step-body" :class="{'hide-body': filterToogle}">
          <div class="step-table">
            <div class="table-con">
              <div class="wt-right-wm" id="wt_con">
                <watermark dom-key="wt_con"></watermark>
              </div>
              <el-table
                :data="tableData.data_list"
                stripe
                border
                height="100%">
                <el-table-column
                  v-for="(item, index) in tableData.title_list"
                  min-width="120"
                  :key="index"
                  show-overflow-tooltip
                  :label="item.alias || item.name">
                  <template slot-scope="scope">
                    <span v-if="item.origin_type === 2">{{utils.momentDate(scope.row[item.id], 'date_time')}}</span>
                    <span v-else>{{scope.row[item.id]}}</span>
                  </template>
                </el-table-column>
              </el-table>
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
    choose (node) {
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
            this.$store.commit('setTableId', node.id)
            this.$store.commit('setTaskTableData', res.data)
          }
        })
      }
    },
    syncData () {
      if (this.tbId) {
        this.wtService.getprewData({
          page_no: 1,
          page_size: 100,
          tb_id: this.tbId
        }).then(res => {
          if (res.status === 0) {
            this.tableData = res.data
            this.tbList = this.tableData.title_list
          }
        })
      } else {
        this.$message.error('请选择数据表')
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
