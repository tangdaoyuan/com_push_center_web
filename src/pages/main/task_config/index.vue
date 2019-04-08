<template>
  <div class="tc-main">
    <div class="tc-main-home">
      <div class="tc-header">
        <statistic-data :data-statistics='statistics' :abnormal="true" @showAbnormalList="showAbnormalList" @filetrStatus='filetrStatus'></statistic-data>
        <div class="operation-wrap">
          <filter-option :filter-items='filterItems' @filter-search="changeSearchData"></filter-option>
          <div class="dm-add-btn">
            <button class="btn" @click="addShortcutTask($event)">新建快捷任务</button>
            <button class="btn" @click="addPush($event)">新建任务</button>
          </div>
        </div>
      </div>
      <div class="tc-body">
        <pc-card
          :card-data="task_data"
          type="vertical"
          @addRefresh="addRefresh"
          @openDetail="openDetail"
          :gutter="20"
          :span="3">
          <template slot="v-header" slot-scope="item">
            <div class="v-header-title">
              <div class="header-box">
                <span class="header-title">{{item.data.name}}</span>
                <Tag v-show="item.data.status !== 1"
                  :class="{
                    'abnormal': item.data.status === 4,
                    'failed': item.data.status === 3,
                    'closed': item.data.status === 2
                  }">
                  {{utils.getTaskStatus(item.data.status)}}
                </Tag>
              </div>
              <div class="header-op" @click="stopDetail($event)">
                <el-dropdown>
                  <i class="op-menu-icon"></i>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item @click.native="editTask($event, item)">编辑任务</el-dropdown-item>
                    <el-dropdown-item @click.native="changeStatus($event, item.data)" v-show="item.data.status === 1 || item.data.status === 2">
                      {{(item.data.status === 1) ? ('关闭') : ((item.data.status === 2) ? ('开启') : (''))}}任务
                    </el-dropdown-item>
                    <el-dropdown-item @click.native="deleteTask($event, item)">删除任务</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </div>
            </div>
          </template>
          <template slot="v-body" slot-scope="item">
            <div class="body-con">
              <div class="con-item-tag">
                <Tag color="red">
                  {{item.data.type_name}}
                </Tag>
                <span>今日推送</span>
                <span>{{`${item.data.push_today}次`}}</span>
                <span>历史推送</span>
                <span>{{`${item.data.push_total}次`}}</span>
              </div>
              <div class="con-item">
                <span>起始时间：</span>
                <span>{{utils.momentDate(item.data.push_start_time, 'date_time')}}</span>
              </div>
              <div class="con-item">
                <span>结束时间：</span>
                <span>{{utils.momentDate(item.data.push_end_time, 'date_time')}}</span>
              </div>
              <div class="con-item">
                <span>最近推送：</span>
                <span>{{utils.momentDate(item.data.last_push_time, 'date_time')}}</span>
              </div>
            </div>
          </template>
        </pc-card>
      </div>
    </div>
    <task-manage
      @refresh="refresh"
      @close="closeTaskManage"
      v-model="modals.taskManageModal" />
    <shortcut-task
      @goTaskSet="addPush"
      @close="closeShortcutTask"
      v-model="modals.shortcutTaskModal"
      :type-list="filterTypeList" />
    <abnormal-reason type="task" v-model="modals.abnormalVisible" @close="closeAbnReason" ></abnormal-reason>
    <task-detail
      :detail-id="detailId"
      @close="closeTdModal"
      v-model="modals.tdModal" />
  </div>
</template>
<script>
export default {
  created () {
    this.init()
  },
  data () {
    return {
      detailId: '',
      task_data: [],
      chooseTask: {},
      statistics: {},
      modals: {
        tdModal: false,
        taskManageModal: false,
        shortcutTaskModal: false,
        abnormalVisible: false
      },
      filterTypeList: [],
      searchParams: {
        type: '',
        status: '',
        offset: 0,
        count: 36,
        total: 0,
        sort_key: 'today_asc',
        name: ''
      },
      filterItems: [
        {
          itemName: '任务类型',
          placeholder: '任务类型',
          type: 'type',
          selectValue: '',
          options: []
        },
        {
          itemName: '排序方式',
          placeholder: '默认排序',
          type: 'sort',
          value: '',
          options: this.CONSTANT.tcOrderBy
        },
        {
          itemName: '任务名称',
          placeholder: '默认排序',
          type: 'name',
          in_type: 'input',
          value: ''
        }
      ]
    }
  },
  methods: {
    init () {
      this.task_data = []
      this.initTaskTypeList()
      this.searchData()
      this.searchStatusCount()
    },
    closeShortcutTask () {
      this.modals.shortcutTaskModal = false
    },
    closeAbnReason () {
      this.modals.abnormalVisible = false
    },
    closeTdModal () {
      this.modals.tdModal = false
    },
    closeTaskManage () {
      this.modals.taskManageModal = false
    },
    deleteTask (e, item) {
      this.$confirm(`是否删除   ${item.data.name}`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.tcService.deleteTaskItem({
          id: item.data.id
        }).then(res => {
          if (res.status === 0) {
            this.$message.success('删除成功')
            this.task_data = []
            this.searchData()
            this.searchStatusCount()
          }
        })
      }).catch(() => {
      })
    },
    showAbnormalList () {
      this.modals.abnormalVisible = true
    },

    initTaskTypeList () {
      // this.$store.dispatch('initUserDicData', {})
      this.$store.dispatch('getDicData', {
        type_id: 'dic_t_task_type'
      }).then(res => {
        this.filterItems[0].options = res.map(item => {
          return {
            label: item.content,
            value: item.id
          }
        })
        this.filterTypeList = res
      }).catch(() => {})
    },
    editTask (e, item) {
      e.stopPropagation()
      this.$store.commit('setTaskId', item.data.id)
      this.modals.taskManageModal = true
    },
    searchStatusCount () {
      this.tcService.getStatusCount().then(res => {
        if (res.status === 0) {
          const result = {}
          Object.keys(this.CONSTANT.tcStatistics).forEach(item => {
            result[item] = {
              label: this.CONSTANT.tcStatistics[item],
              data: res.data[item]
            }
          })
          this.statistics = result
        }
      })
    },
    searchData () {
      this.tcService.getTaskList({
        ...this.searchParams,
        total: undefined
      }).then(res => {
        if (res.status === 0) {
          this.searchParams.total = res.data.total_count
          this.task_data = [
            ...this.task_data,
            ...res.data.data
          ]
        }
      })
    },
    refresh () {
      this.task_data = []
      this.searchData()
      this.searchStatusCount()
    },
    openDetail (data) {
      this.modals.tdModal = true
      this.detailId = data.id
    },
    addPush (e) {
      if (e) {
        e.stopPropagation()
      }
      this.chooseTask = {}
      this.modals.taskManageModal = true
    },
    addShortcutTask (e) {
      e.stopPropagation()
      this.modals.shortcutTaskModal = true
    },
    changeStatus (e, item) {
      e.stopPropagation()
      this.tcService.changeStatus({
        status: (item.status === 2) ? 1 : 2,
        task_id: item.id
      }).then(res => {
        if (res.status === 0) {
          item.status = (item.status === 2) ? 1 : 2
          this.$message.success(`${(item.status === 1) ? ('开启成功') : ('关闭成功')}`)
          this.init()
        }
      })
    },
    filetrStatus (status) {
      this.searchParams = {
        ...this.searchParams,
        status: this.utils.convertTcStatus(status),
        offset: 0
      }
      this.task_data = []
      this.searchData()
    },
    changeSearchData (data) {
      this.searchParams = {
        ...this.searchParams,
        type: data[0].value || '',
        sort_key: data[1].value || 'today_asc',
        name: data[2].value || '',
        offset: 0
      }
      this.task_data = []
      this.searchData()
    },
    addRefresh () {
      if (this.task_data.length === this.searchParams.total) {
        this.$message.info('已经到底了！')
      } else {
        this.searchParams = {
          ...this.searchParams,
          offset: this.searchParams.offset + this.searchParams.count
        }
        this.searchData()
      }
    },
    stopDetail (e) {
      e.stopPropagation()
    }
  },
  watch: {
    '$route' () {
      this.init()
    }
  }
}
</script>
