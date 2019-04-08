<template>
  <Modal class="dm-main-detail" v-model="value">
    <div class="modal-header" slot="header">
      <span>{{`${detailListInfo.dataSource.name} -- 详情信息`}}</span>
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
              <span>选择数据源</span>
              <span>消息队列</span>
            </div>
            <div class="con-item">
              <span>数据源名称</span>
              <span>{{detailListInfo.dataSource.name}}</span>
            </div>
            <div class="con-item">
              <span>数据源描述</span>
              <span>{{detailListInfo.dataSource.desc}}</span>
            </div>
          </div>
          <div class="con-right con">
            <div class="con-title">
              <span>连接配置</span>
            </div>
            <div class="con-item">
              <span>Topic</span>
              <span>{{detailListInfo.dataSource.topic}}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="body-detail">
        <div class="detail-header">
          <span>接口参数设置</span>
        </div>
        <div class="body-con">
          <div class="con-item" v-for="(item, index) in detailListInfo.setting" :key="index">
            <span>参数名称</span>
            <span>{{item.name}}</span>
            <span>参数类型</span>
            <span>{{utils.getFieldType(item.origin_type)}}</span>
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
      detailListInfo: {
        dataSource: {},
        setting: []
      }
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
        this.detailListInfo.dataSource = res.data.data_source
        this.detailListInfo.setting = res.data.table_fields
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
