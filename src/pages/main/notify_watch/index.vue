<template>
  <div class="nw-main">
    <div class="nw-main-home">
      <div class="nw-header">
        <statistic-data :data-statistics='statistics' :abnormal="true" @showAbnormalList="showAbnormalList" @filetrStatus='filetrStatus'/>
        <div class="operation-wrap">
          <filter-option :filter-items='filterItems' @filter-search="changeSearch"></filter-option>
        </div>
      </div>
      <div class="nw-body">
        <pc-card
          :card-data="tableList"
          type="vertical"
          @addRefresh="addRefresh"
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
                  {{utils.taskStatus(item.data.status)}}
                </Tag>
              </div>
            </div>
          </template>
          <template slot="v-body" slot-scope="item">
            <div class="body-con">
              <div class="con-item-tag">
                <Tag color="red">{{item.data.type_name ? item.data.type_name.slice(0, 2) : '未知'}}</Tag>
                <span class="title">工作表</span>
                <span class="table" :title="item.data.table_name">{{item.data.table_name}}</span>
              </div>
              <div class="con-item">
                <span>最近推送</span>
                <span>{{utils.momentDate(item.data.last_push_time, 'date_time')}}</span>
              </div>
            </div>
          </template>
          <template slot="v-footer" slot-scope="item" >
            <div class="footer-con">
              <div class="footer-item">
                <label>匹配成功</label>
                <span @click="changeMenu($event, '1', '2', item.data, 'matched')">{{item.data.matched}}</span>
              </div>
              <div class="line"></div>
              <div class="footer-item">
                <label>匹配失败</label>
                <span @click="changeMenu($event, '0', '1', item.data, 'unmatched')">{{item.data.unmatched}}</span>
              </div>
              <div class="line"></div>
              <div class="footer-item">
                <label>推送成功</label>
                <span @click="changeMenu($event, '2', '1', item.data, 'push_succeed')">{{item.data.push_succeed}}</span>
              </div>
              <div class="line"></div>
              <div class="footer-item">
                <label>推送失败</label>
                <span @click="changeMenu($event, '3', '0', item.data, 'push_failed')">{{item.data.push_failed}}</span>
              </div>
            </div>
          </template>
        </pc-card>
      </div>
    </div>
    <watch-detail
      @refresh="init"
      @close="closeWdModal"
      :choose-item="chooseItem"
      :show-menu="showMenu"
      :table-data="tableData"
      v-model="wdModal" />
    <abnormal-reason type="data" v-model="modals.abnormalVisible" @close="closeAbnReason"></abnormal-reason>
  </div>
</template>
<script>
export default {
  created () {
    if (localStorage.getItem('routeType')) {
      switch (localStorage.getItem('routeType')) {
        case 'error':
          this.searchData.status = 4
          break
        case 'total':
          this.searchData.status = ''
          break
        case 'failed':
          this.searchData.status = 3
          break
        case 'normal':
          this.searchData.status = 1
          break
        case 'closed':
          this.searchData.status = 2
          break
      }
    }
    this.init()
    localStorage.removeItem('routeType')
  },
  data () {
    return {
      showMenu: '',
      detailTaskId: '',
      wdModal: false,
      tableList: [],
      statistics: {},
      chooseItem: {},
      modals: {
        abnormalVisible: false
      },
      tableData: {
        headList: [],
        dataList: []
      },
      searchData: {
        type: '',
        status: '',
        offset: 0,
        count: 36,
        sort_key: 'push_asc'
      },
      listPageParams: {
        currentPage: 1,
        total: 0
      },
      matchPushData: {
        type: '',
        offset: 0,
        status: '0',
        count: 20
      },
      detailPageParams: {
        currentPage: 1,
        total: 0
      },
      filterItems: [
        {
          itemName: '任务类型',
          placeholder: '任务类型',
          selectValue: '',
          options: []
        },
        {
          itemName: '排序方式',
          placeholder: '排序方式',
          selectValue: '',
          options: this.CONSTANT.nwOrderBy
        },
        {
          itemName: '任务名称',
          type: 'name',
          in_type: 'input',
          value: ''
        }
      ]
    }
  },
  methods: {
    init () {
      this.tableList = []
      this.searchCount()
      this.search()
      this.initTaskTypeList()
    },
    closeWdModal () {
      this.wdModal = false
    },
    closeAbnReason () {
      this.modals.abnormalVisible = false
    },
    showAbnormalList () {
      this.modals.abnormalVisible = true
    },
    initTaskTypeList () {
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
    changeSearch (data) {
      this.searchData = {
        ...this.searchData,
        offset: 0,
        type: data[0].value || '',
        sort_key: data[1].value || 'push_asc',
        name: data[2].value || ''
      }
      this.tableList = []
      this.search()
    },
    filetrStatus (status) {
      this.searchData.status = this.utils.convertNwStatus(status)
      this.searchData = {
        ...this.searchData,
        offset: 0,
        status: this.utils.convertNwStatus(status)
      }
      this.tableList = []
      this.search()
    },
    search () {
      this.searchData.offset = (this.detailPageParams.currentPage - 1) * this.searchData.count
      this.nwService.getWatchData(this.searchData).then(res => {
        if (res.status === 0) {
          this.tableList = [
            ...this.tableList,
            ...res.data.data
          ]
          this.listPageParams.total = res.data.total_count
        }
      })
    },
    searchCount () {
      this.nwService.watchStatistics({}).then(res => {
        if (res.status === 0) {
          const result = {}
          Object.keys(this.CONSTANT.nwStatistics).forEach(item => {
            if (item === 'total') {
              result[item] = {
                label: this.CONSTANT.nwStatistics[item],
                data: 0
              }
            } else {
              result[item] = {
                label: this.CONSTANT.nwStatistics[item],
                data: res.data[item]
              }
            }
          })
          let totalCount = 0
          Object.keys(result).forEach(item => {
            totalCount = totalCount + result[item].data
          })
          result.total.data = totalCount
          this.statistics = result
        }
      })
    },
    changeMenu (e, type, status, item, menu) {
      e.stopPropagation()
      this.chooseItem = item
      this.matchPushData.type = type
      this.matchPushData.status = status
      this.matchPushData.count = 20
      if (item[menu] !== 0) {
        this.detailTaskId = item.id
        this.showMenu = menu
        this.searchDetail()
        this.wdModal = true
      } else {
        this.$message.info('无数据展示')
      }
    },
    searchDetail () {
      this.matchPushData.offset = (this.detailPageParams.currentPage - 1) * this.matchPushData.count
      const putData = {
        task_id: this.detailTaskId,
        offset: this.matchPushData.offset,
        count: this.matchPushData.count
      }
      let detailService
      switch (this.matchPushData.type) {
        case '0':
        case '1':
          putData.type = this.matchPushData.type
          detailService = this.nwService.matchList(putData)
          break
        case '2':
        case '3':
          putData.status = this.matchPushData.status
          detailService = this.nwService.pushList(putData)
          break
      }

      detailService.then(res => {
        if (res.status === 0) {
          this.detailPageParams.total = res.data.total
          this.tableData.headList = res.data.schema
          switch (this.matchPushData.type) {
            case '0':
            case '1':
              this.tableData.dataList = res.data.data_list
              break
            case '2':
            case '3':
              this.tableData.dataList = []
              this.tableData.headList.push({ 'name': '推送通道', 'id': 'fd_pushchannel' })
              res.data.push_list.forEach(item => {
                if (item && item.detail) {
                  item.detail['fd_pushchannel'] = item.channel_name
                }
              })
              res.data.push_list.forEach(item => {
                this.tableData.dataList.push(item.detail)
              })
              break
            default:
              this.tableData.dataList = res.data.data_list
              break
          }
        }
      })
    },
    addRefresh () {
      if (this.tableList.length === this.listPageParams.total) {
        this.$message.info('已经到底了！')
      } else {
        this.searchData = {
          ...this.searchData,
          offset: this.searchData.offset + this.searchData.count
        }
        this.search()
      }
    }
  },
  watch: {
    '$route' (to, from) {
      this.init()
    }
  }
}
</script>
