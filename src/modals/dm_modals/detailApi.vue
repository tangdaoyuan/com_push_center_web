<template>
  <Modal class="dm-main-detail" v-model="value">
    <div class="modal-header" slot="header">
      <span>{{`${detailListAPI.name} -- 详情信息`}}</span>
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
              <span>API</span>
            </div>
            <div class="con-item">
              <span>数据源名称</span>
              <span>{{detailListAPI.name}}</span>
            </div>
            <div class="con-item">
              <span>数据源描述</span>
              <span>{{detailListAPI.desc}}</span>
            </div>
          </div>
          <div class="con-right con">
            <div class="con-title">
              <span>连接配置</span>
            </div>
            <div class="con-item">
              <span>Secret Key</span>
              <span>{{detailListAPI.secret_key}}</span>
            </div>
            <div class="con-item">
              <span>来访IP列表</span>
              <span>{{detailListAPI.ip}}</span>
            </div>
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
      detailListAPI: {}
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
          this.detailListAPI = res.data.data_source
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
