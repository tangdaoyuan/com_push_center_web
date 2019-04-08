<template>
  <div class="nm-main">
    <div class="nd-main-default">
      <div class="nm-header">
        <statistic-data :data-statistics="statistics" @filetrStatus="filetrStatus"></statistic-data>
        <div class="operation-wrap">
          <filter-option :filter-items='filterItems' @filter-search="changeSearch"></filter-option>
          <div class="dm-add-btn">
            <button class="btn" @click="editItem($event, '')">新建推送通道</button>
          </div>
        </div>
      </div>
      <div class="nm-body">
        <pc-card
          :card-data="manageData"
          type="horizontal"
          @addRefresh="addRefresh"
          @openDetail="openDetail"
          :gutter="20"
          :span="3">
          <template slot="img" slot-scope="item">
            <img :src="new Img(utils.getTDType(item.data.type)).img" alt="">
          </template>
          <template slot="r-header" slot-scope="item">
            <div class="r-header-title">
              <div class="header-box">
                <span class="header-title">{{item.data.name}}</span>
                <Tag v-show="item.data.status !== 1"
                  :class="{
                    'abnormal': item.data.status === 2,
                    'closed': item.data.status === 0
                  }">
                  {{utils.getTDStatus(item.data.status)}}
                </Tag>
              </div>
              <div class="header-op" @click="stopDetail($event)">
                <el-dropdown>
                  <i class="op-menu-icon"></i>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item @click.native="editItem($event, item.data.id)">编辑推送通道</el-dropdown-item>
                    <el-dropdown-item @click.native="changeStatus($event, item.data)" v-show="item.data.status === 1 || item.data.status === 0">
                      {{(item.data.status === 1) ? ('关闭推送通道') : ('开启推送通道')}}
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </div>
            </div>
          </template>
          <template slot="r-body" slot-scope="item">
            <div class="body-con">
              <div class="con-item">
                <span>最近同步：</span>
                <span>{{utils.momentDate(item.data.update_time, 'data_h_time_h')}}</span>
              </div>
              <div class="con-item">
                <span>累计推送：</span>
                <span>{{`${item.data.total_push_count}次`}}</span>
              </div>
            </div>
          </template>
        </pc-card>
      </div>
    </div>
    <add-notify-manage
      v-model="modals.addModal"
      :manage-id="manageId"
      @refresh="init"
      @clear="clear"
      @close="closeAddManage"
      :push-pass-data="pushPassData"></add-notify-manage>
    <notify-detail
      :detailID="detailID"
      @close="closeNdDetail"
      v-model="modals.ndModal" />
  </div>
</template>
<script>
export default {
  created () {
    if (localStorage.getItem('routeType')) {
      switch (localStorage.getItem('routeType')) {
        case 'total':
          this.searchData.status = ''
          break
        case 'error':
          this.searchData.status = 2
          break
        case 'closed':
          this.searchData.status = 0
          break
        case 'normal':
          this.searchData.status = 1
          break
      }
    }
    this.init()
    localStorage.removeItem('routeType')
  },
  data () {
    return {
      detailID: '',
      manageId: '',
      manageData: [],
      statistics: {},
      modals: {
        ndModal: false,
        addModal: false
      },
      pageParams: {
        total: 0,
        currentPage: 1
      },
      searchData: {
        type: '',
        status: '',
        offset: 0,
        count: 36,
        sort_key: 'time_asc'
      },
      pushPassData: {
        type: '',
        name: '',
        status: '',
        describe: '',
        params: {
          access_key: '',
          secret_key: '',
          topic: '',
          url: ''
        }
      },
      filterItems: [
        {
          itemName: '通道类型',
          placeholder: '通道类型',
          type: 'sort',
          selectValue: '',
          options: this.CONSTANT.nmTypeList
        },
        {
          itemName: '排序方式',
          placeholder: '排序方式',
          type: 'type',
          selectValue: '',
          options: this.CONSTANT.nmOrderBy
        }
      ]
    }
  },
  methods: {
    init () {
      this.manageData = []
      this.search()
      this.searchCount()
    },
    closeAddManage () {
      this.modals.addModal = false
    },
    closeNdDetail () {
      this.modals.ndModal = false
    },
    changeSearch (data) {
      this.searchData = {
        ...this.searchData,
        offset: 0,
        type: data[0].value || '',
        sort_key: data[1].value || 'time_asc'
      }
      this.manageData = []
      this.search()
    },
    filetrStatus (status) {
      this.searchData = {
        ...this.searchData,
        offset: 0,
        status: this.utils.convertTDStatus(status)
      }
      this.manageData = []
      this.search()
    },
    search () {
      this.nmService.getNotifymanageData(this.searchData).then(res => {
        if (res.status === 0) {
          this.manageData = [
            ...this.manageData,
            ...res.data.data
          ]
          this.pageParams.total = res.data.total_count
          if (this.manageId !== '') {
            this.manageData.forEach(item => {
              if (item.id === this.manageId) {
                this.pushPassData = item
              }
            })
          }
        }
      })
    },
    searchCount () {
      this.homeService.passCount().then(res => {
        if (res.status === 0) {
          const result = {}
          Object.keys(this.CONSTANT.nmStatistics).forEach(item => {
            result[item] = {
              label: this.CONSTANT.nmStatistics[item],
              data: res.data[item]
            }
          })
          this.statistics = result
        }
      })
    },
    editItem (e, id) {
      e.stopPropagation()
      this.manageId = id
      if (this.manageId !== '') {
        this.search()
      }
      this.modals.addModal = true
    },
    changeStatus (e, item) {
      e.stopPropagation()
      this.nmService.changeStatus({
        status: (item.status === 0) ? 1 : 0,
        id: item.id
      }).then(res => {
        if (res.status === 0) {
          item.status = (item.status === 0) ? 1 : 0
          this.$message.success(`${(item.status === 1) ? ('开启成功') : ('关闭成功')}`)
          this.init()
        }
      })
    },
    openDetail (data) {
      this.detailID = data.id
      this.modals.ndModal = true
    },
    addRefresh () {
      if (this.manageData.length === this.pageParams.total) {
        this.$message.info('已经到底了！')
      } else {
        this.searchData = {
          ...this.searchData,
          offset: this.searchData.offset + this.searchData.count
        }
        this.search()
      }
    },
    stopDetail (e) {
      e.stopPropagation()
    },
    clear () {
      this.pushPassData = {
        type: '',
        name: '',
        status: '',
        describe: '',
        params: {
          access_key: '',
          secret_key: '',
          topic: '',
          url: ''
        }
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
