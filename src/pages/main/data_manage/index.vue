<template>
  <div class="dm-main">
    <div class="dm-main-default">
      <div class="dm-header">
        <statistic-data :data-statistics="statistics" :abnormal="true" @showAbnormalList="showAbnormalList" @filetrStatus="filetrStatus"></statistic-data>
        <div class="operation-wrap">
          <filter-option :filter-items='filterItems' @filter-search="changeSearch"></filter-option>
          <div class="dm-add-btn">
            <button class="btn" @click="addDataManage($event)">新建数据源</button>
          </div>
        </div>
      </div>
      <div class="dm-body">
        <pc-card
          @addRefresh="addRefresh"
          :card-data="tableData"
          @openDetail="openDetail"
          type="horizontal"
          :gutter="20"
          :span="3">
          <template slot="img" slot-scope="item">
            <img :src="new Img(item.data.type_name).img" alt="">
          </template>
          <template slot="r-header" slot-scope="item">
            <div class="r-header-title">
              <div class="header-box">
                <span class="header-title">{{item.data.name}}</span>
                <Tag v-show="item.data.status !== 2"
                  :class="{
                    'closed': item.data.status === 3,
                    'abnormal': item.data.status === 0
                  }">
                  {{utils.getdmStatus(item.data.status)}}
                </Tag>
              </div>
              <div class="header-op"  @click="stopDetail($event)">
                <el-dropdown>
                  <i class="op-menu-icon"></i>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item @click.native="editData($event, item.data)">编辑数据源</el-dropdown-item>
                    <el-dropdown-item @click.native="gotoWorkTable($event, item.data)">管理工作表</el-dropdown-item>
                    <el-dropdown-item @click.native="changeStatus($event, item.data)" v-show="item.data.status === 2 || item.data.status === 3">
                      {{(item.data.status === 2) ? ('关闭') : ((item.data.status === 3) ? ('开启') : (''))}}数据源
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </div>
            </div>
          </template>
          <template slot="r-body" slot-scope="item">
            <div class="body-con">
              <div class="con-item">
                <span>同步次数：</span>
                <span>{{item.data.sync_count}}</span>
              </div>
              <div class="con-item">
                <span>创建时间：</span>
                <span>{{utils.momentDate(item.data.create_time, 'date_time')}}</span>
              </div>
              <div class="con-item">
                <span>最近同步：</span>
                <span>{{utils.momentDate(item.data.update_time, 'date_time')}}</span>
              </div>
            </div>
          </template>
        </pc-card>
      </div>
    </div>
    <detail-api v-model="modals.daModal" :detailID="detailID" @close="closeDaApi"></detail-api>
    <detail-info v-model="modals.diModal" :detailID="detailID" @close="closeDaInfo"></detail-info>
    <detail-oracle v-model="modals.doModal" :detailID="detailID" @close="closedoOracle"></detail-oracle>
    <abnormal-reason type="data" v-model="modals.abnormalVisible" @close="closeAbnReason"></abnormal-reason>
    <adm-syncbdp v-model="modals.admBdpModal" @refresh="init" :bdp-id="datasourceID.bdpID"/>
    <adm-mysql v-model="modals.admMysqlModal" @refresh="init" :mysql-id="datasourceID.mysqlID" @close="closeAdmMysql"/>
    <adm-oracle v-model="modals.admOracleModal" @refresh="init" :oracle-id="datasourceID.oracleID"  @close="closeAdmOracle"/>
    <adm-msg v-model="modals.admMsgModal" @refresh="init" :msg-id="datasourceID.msgID" @close="closeAdmMsg"/>
    <adm-api v-model="modals.admApiModal" @refresh="init" :api-item="apiData" @close="closeAdmApi"/>
  </div>
</template>
<script>
export default {
  created () {
    if (localStorage.getItem('routeType')) {
      switch (localStorage.getItem('routeType')) {
        case 'closed':
          this.pageParams.status = 3
          break
        case 'total':
          this.pageParams.status = ''
          break
        case 'failed':
          this.pageParams.status = 0
          break
        case 'open':
          this.pageParams.status = 2
          break
      }
    }
    this.init()
    localStorage.removeItem('routeType')
  },
  data () {
    return {
      detailID: '',
      tableData: [],
      statistics: {},
      apiData: {},
      modals: {
        daModal: false,
        diModal: false,
        doModal: false,
        abnormalVisible: false,
        admBdpModal: false,
        admMysqlModal: false,
        admOracleModal: false,
        admMsgModal: false,
        admApiModal: false
      },
      pageParams: {
        type: '',
        status: '',
        page_size: 36,
        page_no: 1,
        total: 0,
        sort_key: 'count_asc'
      },
      filterItems: [
        {
          itemName: '数据源类型',
          placeholder: '全部',
          type: 'filter',
          value: '',
          options: this.CONSTANT.dmTypeList
        },
        {
          itemName: '排序方式',
          placeholder: '默认排序',
          type: 'sort',
          value: '',
          options: this.CONSTANT.dmOrderBy
        }
      ],
      datasourceID: {
        msgID: '',
        mysqlID: '',
        oracleID: '',
        bdpID: ''
      }
    }
  },
  methods: {
    init () {
      this.tableData = []
      this.searchData()
      this.searchCount()
    },
    closedoOracle () {
      this.modals.doModal = false
    },
    closeDaInfo () {
      this.modals.diModal = false
    },
    closeDaApi () {
      this.modals.daModal = false
    },
    closeAdmOracle () {
      this.modals.admOracleModal = false
    },
    closeAdmMysql () {
      this.modals.admMysqlModal = false
    },
    closeAdmMsg () {
      this.modals.admMsgModal = false
    },
    closeAdmApi () {
      this.modals.admApiModal = false
    },
    closeAbnReason () {
      this.modals.abnormalVisible = false
    },
    searchData () {
      this.dmService.getWorktableData({
        ...this.pageParams,
        total: undefined
      }).then(res => {
        if (res.status === 0) {
          this.pageParams.total = res.data.total
          this.tableData = [
            ...this.tableData,
            ...res.data.list
          ]
        }
      })
    },
    searchCount () {
      this.dmService.searchCount().then(res => {
        if (res.status === 0) {
          const result = {}
          Object.keys(this.CONSTANT.dmStatistics).forEach(item => {
            result[item] = {
              label: this.CONSTANT.dmStatistics[item],
              data: res.data[item]
            }
          })
          this.statistics = result
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    gotoWorkTable (e, item) {
      e.stopPropagation()
      this.dmService.getDmTable({
        ds_id: item.id
      }).then(res => {
        let tableList = res.data.list
        if (tableList.length > 0) {
          let tbId = tableList[0].id
          this.$router.push(`/wt?folder=table&table_type=prew&fieldId=${tbId}`)
        } else {
          this.$message.info('该数据源无工作表')
        }
      })
    },
    openDetail (data) {
      this.detailID = data.id
      let type = data.type
      switch (type) {
        case 1:
          this.$message.info('BDP同步客户端无详情页')
          break
        case 2:
          // info详情
          this.modals.diModal = true
          break
        case 3:
          // Api详情
          this.modals.daModal = true
          break
        case 4:
          this.$message.info('excel表格无详情页')
          break
        case 5:
        case 6:
          this.modals.doModal = true
          // this.detailID = id
          break
      }
    },
    addDataManage (e) {
      e.stopPropagation()
      this.$router.push('/dm/adm')
    },
    changeSearch (data) {
      this.pageParams = {
        ...this.pageParams,
        type: data[0].value || '',
        sort_key: data[1].value || 'count_asc',
        page_no: 1
      }
      this.tableData = []
      this.searchData()
    },
    filetrStatus (status) {
      this.pageParams = {
        ...this.pageParams,
        status: this.utils.convertDmStatus(status),
        page_no: 1
      }
      this.tableData = []
      this.searchData()
    },
    editData (e, item) {
      e.stopPropagation()
      switch (item.type) {
        case 3:
          this.modals.admApiModal = true
          this.apiData = item
          break
        case 2:
          this.modals.admMsgModal = true
          this.datasourceID.msgID = item.id
          break
        case 5:
          this.modals.admOracleModal = true
          this.datasourceID.oracleID = item.id
          break
        case 6:
          this.modals.admMysqlModal = true
          this.datasourceID.mysqlID = item.id
          break
        case 1:
          this.modals.admBdpModal = true
          this.datasourceID.bdpID = item.id
          break
      }
    },
    changeStatus (e, item) {
      e.stopPropagation()
      this.dmService.changeStatus({
        id: item.id,
        is_open: (item.is_open === 1) ? 0 : 1
      }).then(res => {
        if (res.status === 0) {
          item.status = (item.status === 2) ? 3 : 2
          this.$message.success(`${(item.status === 2) ? ('开启成功') : ('关闭成功')}`)
          this.init()
        }
      })
    },
    showAbnormalList () {
      this.modals.abnormalVisible = true
    },
    addRefresh () {
      if (this.tableData.length === this.pageParams.total) {
        this.$message.info('已经到底了!')
      } else {
        this.pageParams.page_no++
        this.searchData()
      }
    },
    stopDetail (e) {
      e.stopPropagation()
    }
  },
  watch: {
    '$route' (to, from) {
      this.init()
    }
  }
}
</script>
