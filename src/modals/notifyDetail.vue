<template>
  <Modal class="nd-modal-main" v-model="trigger">
    <div class="modal-header" slot="header">
      <span>推送通道详情</span>
      <Icon type="md-close" @click="trigger = false" />
    </div>
    <div class="nd-body">
      <div class="nd-item">
        <label>通道类型</label>
        <span>{{utils.getTDType(detailData.type)}}</span>
      </div>
      <div class="nd-item">
        <label>通道名称</label>
        <span>{{detailData.name}}</span>
      </div>
      <div class="nd-item">
        <label>通道状态</label>
        <span>{{utils.getTDStatus(detailData.status)}}</span>
      </div>
      <div class="nd-item">
        <label>通道描述</label>
        <span>{{detailData.describe}}</span>
      </div>
      <div class="nd-item">
        <label>Access Key</label>
        <span>{{detailData.params.access_key}}</span>
      </div>
      <div class="nd-item">
        <label>Secret Key</label>
        <span>{{detailData.params.secret_key}}</span>
      </div>
      <div class="nd-item">
        <label>APPID</label>
        <span>{{detailData.id}}</span>
      </div>
    </div>
    <div slot="footer" class="nd-footer">
    </div>
  </Modal>
</template>
<script>
export default {
  props: {
    value: Boolean,
    detailID: String
  },
  created () {
    this.trigger = this.value
  },
  data () {
    return {
      trigger: false,
      detailData: {
        params: {
          access_key: '',
          secret_key: ''
        }
      }
    }
  },
  methods: {
    search () {
      this.nmService.detailData({
        id: this.detailID
      }).then(res => {
        if (res.status === 0) {
          this.detailData = res.data
        }
      })
    }
  },
  watch: {
    value () {
      this.trigger = this.value
    },
    trigger () {
      this.$emit('input', this.trigger)
      if (this.trigger) {
        this.search()
      }
    }
  }
}
</script>
