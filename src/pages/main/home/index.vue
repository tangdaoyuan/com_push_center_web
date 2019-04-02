<template>
  <div class="home-main">
    <div class="home-item">
      <div class="item-header">
        <div class="item-header-title">数据源监控</div>
        <div class="item-header-con">
          <ul class="item-header-ul">
            <li>
              <span>总计</span>
              <span @click="gotoCard($event, 'dataSource', 'total')">{{dataCount.total}}</span>
            </li>
            <li>
              <span>禁用</span>
              <span @click="gotoCard($event, 'dataSource', 'closed')">{{dataCount.closed}}</span>
            </li>
            <li>
              <span>异常</span>
              <span class="hl" @click="gotoCard($event, 'dataSource', 'failed')">{{dataCount.failed}}</span>
            </li>
            <li>
              <span>开启</span>
              <span @click="gotoCard($event, 'dataSource', 'open')">{{dataCount.open}}</span>
            </li>
          </ul>
        </div>
      </div>
      <div class="item-con">
        <div class="item-chart bar">
          <div class="chart-main" ref="data_bar"></div>
          <div class="chart-title">数据源类型统计</div>
        </div>
        <div class="item-chart pie">
          <div class="chart-main" ref="data_pie"></div>
          <div class="chart-title">数据源状态统计</div>
        </div>
      </div>
    </div>
    <div class="home-item">
      <div class="item-header">
        <div class="item-header-title">推送任务监控</div>
        <div class="item-header-con">
          <ul class="item-header-ul">
            <li>
              <span>总计</span>
              <span @click="gotoCard($event, 'pushTask', 'total')">{{taskCount.total}}</span>
            </li>
            <li>
              <span>正常</span>
              <span @click="gotoCard($event, 'pushTask', 'normal')">{{taskCount.normal}}</span>
            </li>
            <li>
              <span>异常</span>
              <span class="hl" @click="gotoCard($event, 'pushTask', 'error')">{{taskCount.error}}</span>
            </li>
            <li>
              <span>失效</span>
              <span @click="gotoCard($event, 'pushTask', 'failed')">{{taskCount.failed}}</span>
            </li>
            <li>
              <span>停用</span>
              <span @click="gotoCard($event, 'pushTask', 'closed')">{{taskCount.closed}}</span>
            </li>
          </ul>
        </div>
      </div>
      <div class="item-con">
        <div class="item-chart bar">
          <div class="chart-main" ref="task_bar"></div>
          <div class="chart-title">推送任务类型统计</div>
        </div>
        <div class="item-chart pie">
          <div class="chart-main" ref="task_pie"></div>
          <div class="chart-title">推送任务状态统计</div>
        </div>
      </div>
    </div>
    <div class="home-item">
      <div class="item-header">
        <div class="item-header-title">推送通道监控</div>
        <div class="item-header-con">
          <ul class="item-header-ul">
            <li>
              <span>总计</span>
              <span @click="gotoCard($event, 'pushNotify', 'total')">{{passCount.total}}</span>
            </li>
            <li>
              <span>正常通道</span>
              <span @click="gotoCard($event, 'pushNotify', 'normal')">{{passCount.normal}}</span>
            </li>
            <li>
              <span>异常通道</span>
              <span class="hl" @click="gotoCard($event, 'pushNotify', 'error')">{{passCount.error}}</span>
            </li>
            <li>
              <span>停用</span>
              <span @click="gotoCard($event, 'pushNotify', 'closed')">{{passCount.closed}}</span>
            </li>
          </ul>
        </div>
      </div>
      <div class="item-con">
        <div class="item-chart bar">
          <div class="chart-main" ref="channel_bar"></div>
          <div class="chart-title">推送任务类型统计</div>
        </div>
        <div class="item-chart pie">
          <div class="chart-main" ref="channel_pie"></div>
          <div class="chart-title">推送任务状态统计</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import ChartOption from '@/beans/chart.js'
export default {
  name: 'home',
  data () {
    return {
      dataList: [],
      taskList: [],
      passList: [],
      dataCount: {},
      taskCount: {},
      passCount: {}
    }
  },
  created () {
    this.init()
  },
  methods: {
    init () {
      this.search()
    },
    search () {
      this.homeService.getDmBarData().then(res => {
        if (res.status === 0) {
          const options = new ChartOption('bar')
          const XMap = ['api', 'bdp', 'excel', 'mysql', 'oracle', 'queue']
          const data = []

          options.tooltip.formatter = '{b0} <br /> 数据源个数： {c0}'
          options.xAxis.data = ['API', '同步客户端', 'excel', 'MySql', 'Oracle', ' 消息队列']
          XMap.forEach(item => {
            data.push(res.data[item])
          })
          options.series[0].data = data

          this.$echarts.init(this.$refs.data_bar).setOption(options)
        }
      })
      this.homeService.getTaskData().then(res => {
        if (res.status === 0) {
          const options = new ChartOption('bar')
          const data = []

          options.tooltip.formatter = '{b0} <br /> 任务个数： {c0}'
          options.xAxis.data = Object.keys(res.data)
          if (options.xAxis.data.length > 4) {
            options.xAxis.show = false
          }
          options.xAxis.data.forEach(item => {
            data.push(res.data[item])
          })
          options.series[0].data = data

          this.$echarts.init(this.$refs.task_bar).setOption(options)
        }
      })
      this.homeService.getChanneldata().then(res => {
        if (res.status === 0) {
          const options = new ChartOption('bar')
          const XMap = ['sms', 'web', 'wechat', 'app', 'bs', 'ding_talk', 'api']
          const data = []

          options.tooltip.formatter = '{b0} <br /> 通道个数： {c0}'
          options.xAxis.data = ['短信', 'web', '微信', 'APP', '业务系统', '钉钉', 'API']
          XMap.forEach(item => {
            data.push(res.data[item])
          })
          options.series[0].data = data

          this.$echarts.init(this.$refs.channel_bar).setOption(options)
        }
      })
      this.homeService.getDataPie().then(res => {
        if (res.status === 0) {
          const options = new ChartOption('pie')
          const MMap = [
            {
              key: 'failed',
              name: '异常',
              color: '#FA8F6D'
            }, {
              key: 'closed',
              name: '停用',
              color: '#466298'
            }, {
              key: 'open',
              name: '正常',
              color: '#6BC3EF'
            }
          ]
          const data = []

          options.tooltip.formatter = (params) => {
            let detail = ''
            if (res.data[`${MMap[params.dataIndex].key}_detail`]) {
              Object.keys(res.data[`${MMap[params.dataIndex].key}_detail`]).forEach((n, index, list) => {
                const tmp = res.data[`${MMap[params.dataIndex].key}_detail`]
                if (index !== (list.length - 1)) {
                  detail += `${this.CONSTANT.dataDic[n]}: ${tmp[n]} <br />`
                } else {
                  detail += `${this.CONSTANT.dataDic[n]}: ${tmp[n]}`
                }
              })
            }
            return `${MMap[params.dataIndex].name}-总计: ${params.data.value} <br /> ${detail}`
          }
          MMap.forEach(item => {
            data.push({
              name: item.name,
              value: res.data[item.key],
              itemStyle: {
                color: item.color
              }
            })
          })
          options.series[0].data = data

          this.$echarts.init(this.$refs.data_pie).setOption(options)
        }
      })
      this.homeService.getTaskPie().then(res => {
        if (res.status === 0) {
          const options = new ChartOption('pie')
          const MMap = [
            {
              key: 'error',
              name: '异常',
              color: '#FA8F6D'
            }, {
              key: 'closed',
              name: '停用',
              color: '#466298'
            }, {
              key: 'normal',
              name: '正常',
              color: '#6BC3EF'
            },
            {
              key: 'failed',
              name: '失效',
              color: '#3980D3'
            }
          ]
          const data = []

          options.tooltip.formatter = (params) => {
            let detail = ''
            if (res.data[`${MMap[params.dataIndex].key}_detail`]) {
              Object.keys(res.data[`${MMap[params.dataIndex].key}_detail`]).forEach((n, index, list) => {
                const tmp = res.data[`${MMap[params.dataIndex].key}_detail`]
                if (index !== (list.length - 1)) {
                  detail += `${n}: ${tmp[n]} <br />`
                } else {
                  detail += `${n}: ${tmp[n]}`
                }
              })
            }
            return `${MMap[params.dataIndex].name}-总计: ${params.data.value} <br /> ${detail}`
          }
          MMap.forEach(item => {
            data.push({
              name: item.name,
              value: res.data[item.key],
              itemStyle: {
                color: item.color
              }
            })
          })
          options.series[0].data = data

          this.$echarts.init(this.$refs.task_pie).setOption(options)
        }
      })
      this.homeService.getChannelPie().then(res => {
        if (res.status === 0) {
          const options = new ChartOption('pie')
          const MMap = [
            {
              key: 'error',
              name: '异常',
              color: '#FA8F6D'
            }, {
              key: 'closed',
              name: '停用',
              color: '#466298'
            }, {
              key: 'normal',
              name: '正常',
              color: '#6BC3EF'
            }
          ]
          const data = []

          options.tooltip.formatter = (params) => {
            let detail = ''
            if (res.data[`${MMap[params.dataIndex].key}_detail`]) {
              Object.keys(res.data[`${MMap[params.dataIndex].key}_detail`]).forEach((n, index, list) => {
                const tmp = res.data[`${MMap[params.dataIndex].key}_detail`]
                if (index !== (list.length - 1)) {
                  detail += `${this.CONSTANT.channelDic[n]}: ${tmp[n]} <br />`
                } else {
                  detail += `${this.CONSTANT.channelDic[n]}: ${tmp[n]}`
                }
              })
            }
            return `${MMap[params.dataIndex].name}-总计: ${params.data.value} <br /> ${detail}`
          }
          MMap.forEach(item => {
            data.push({
              name: item.name,
              value: res.data[item.key],
              itemStyle: {
                color: item.color
              }
            })
          })
          options.series[0].data = data

          this.$echarts.init(this.$refs.channel_pie).setOption(options)
        }
      })
      this.homeService.dataSourceStatus().then(res => {
        if (res.status === 0) {
          this.dataCount = res.data
        }
      })
      this.homeService.taskCount().then(res => {
        if (res.status === 0) {
          this.taskCount = res.data
        }
      })
      this.homeService.passCount().then(res => {
        if (res.status === 0) {
          this.passCount = res.data
        }
      })
    },
    gotoCard (e, type, filterType) {
      e.stopPropagation()
      if (this.$cookies.get('pc_data').role !== 1) {
        return
      }
      switch (type) {
        case 'dataSource':
          localStorage.setItem('routeType', filterType)
          if (this.dataCount[filterType] === 0) {
            this.$message.info('无数据展示')
          } else {
            this.$router.push({
              path: '/dm'
            })
          }
          break
        case 'pushTask':
          localStorage.setItem('routeType', filterType)
          if (this.taskCount[filterType] === 0) {
            this.$message.info('无数据展示')
          } else {
            this.$router.push({
              path: '/nw'
            })
          }
          break
        case 'pushNotify':
          localStorage.setItem('routeType', filterType)
          if (this.passCount[filterType] === 0) {
            this.$message.info('无数据展示')
          } else {
            this.$router.push({
              path: '/nm'
            })
          }
          break
      }
    }
  }
}
</script>
