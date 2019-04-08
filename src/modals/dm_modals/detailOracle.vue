<template>
  <Modal class="dm-main-detail" v-model="value">
    <div class="modal-header" slot="header">
      <span>{{`${detailOracleList.name} -- 详情信息`}}</span>
      <Icon type="md-close" @click="back($event)" />
    </div>
    <div class="md-con">
      <div class="body-detail">
        <div class="detail-header">
          <span>选择数据源</span>
        </div>
        <div class="detail-con">
          <div class="con-left con">
            <div class="con-title">
              <span>基础设置</span>
            </div>
            <div class="con-item">
              <span>数据源名称</span>
              <span>{{detailOracleList.name}}</span>
            </div>
            <div class="con-item">
              <span>数据源描述</span>
              <span>{{detailOracleList.desc}}</span>
            </div>
          </div>
          <div class="con-right con">
            <div class="con-title">
              <span>连接配置</span>
            </div>
            <div class="con-item">
              <span>数据库类型</span>
              <span>{{(detailOracleList.type === 5) ? ('Oracle') : ('MySql')}}</span>
            </div>
            <div class="con-item">
              <span>服务器</span>
              <span>{{detailOracleList.host}}</span>
            </div>
            <div class="con-item">
              <span>端口</span>
              <span>{{detailOracleList.port}}</span>
            </div>
            <div class="con-item">
              <span>用户名</span>
              <span>{{detailOracleList.username}}</span>
            </div>
            <div class="con-item">
              <span>数据库</span>
              <span>{{detailOracleList.database}}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="body-detail">
        <div class="detail-header">
          <span>数据表设置</span>
        </div>
        <div class="body-con">
          <div class="con-item">
            <span>数据表</span>
            <span>{{detailOracleList.table}}</span>
          </div>
          <div class="con-item">
            <span>已选数据字段</span>
            <span v-for="(item, index) in detailOracleList.sync_fields" :key="index" class="words">{{item}}</span>
          </div>
        </div>
      </div>
      <div class="body-detail">
        <div class="detail-header">
          <span>数据表设置</span>
        </div>
        <div class="body-con">
          <div class="con-item">
            <span>定时同步</span>
            <span>{{(detailOracleList.is_timed_sync) ? ('开启') : ('关闭')}}</span>
          </div>
          <div class="con-item" v-show="detailOracleList.is_timed_sync">
            <span>更新频率</span>
            <span>每{{detailOracleList.period}}{{utils.getPeriodType(detailOracleList.period_type)}}同步一次</span>
            <span>增量同步字段</span>
            <span>{{detailOracleList.increment_field}}</span>
            <span>增量同步类型</span>
            <span>{{(detailOracleList.increment_type) ? ('时间') : ('序列')}}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="modal-footer" slot="footer">
    </div>
  </Modal>
</template>
<script>
export default {
  props: {
    value: Boolean,
    detailID: String
  },
  data () {
    return {
      detailOracleList: {}
    }
  },
  methods: {
    close () {
      this.$emit('close')
    },
    search () {
      this.dmService.openDetail({
        id: this.detailID
      }).then(res => {
        if (res.status === 0) {
          this.detailOracleList = res.data.data_source
        }
      })
    },
    back (e) {
      e.stopPropagation()
      this.close()
    }
  },
  watch: {
    value () {
      if (this.value) {
        this.search()
      } else {
        Object.assign(this.$data, this.$options.data())
      }
    }
  }
}
</script>
