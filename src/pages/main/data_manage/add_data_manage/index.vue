<template>
  <div class="adm-main">
    <div class="adm-step-main">
      <div class="step-title">
        <Icon type="md-arrow-back" @click="backToRoot($event)"/>
        <span>选择数据源</span>
      </div>
      <div class="adm-step-box">
        <div class="adm-item-box" @click="chooseType($event, 'syncbdp')">
          <div class="h-bg">
            <div class="add"></div>
          </div>
          <div class="item-icon">
            <i></i>
          </div>
          <div class="item-title">
            <span>同步客户端</span>
          </div>
        </div>
        <div class="adm-item-box" @click="chooseType($event, 'api')">
          <div class="h-bg">
            <div class="add"></div>
          </div>
          <div class="item-icon">
            <i></i>
          </div>
          <div class="item-title">
            <span>开放API</span>
          </div>
        </div>
        <div class="adm-item-box" @click="chooseType($event, 'msg')">
          <div class="h-bg">
            <div class="add"></div>
          </div>
          <div class="item-icon">
            <i></i>
          </div>
          <div class="item-title">
            <span>消息队列</span>
          </div>
        </div>
        <div class="adm-item-box" @click="chooseType($event, 'oracle')">
          <div class="h-bg">
            <div class="add"></div>
          </div>
          <div class="item-icon">
            <i></i>
          </div>
          <div class="item-title">
            <span>Oracle</span>
          </div>
        </div>
        <div class="adm-item-box" @click="chooseType($event, 'mysql')">
          <div class="h-bg">
            <div class="add"></div>
          </div>
          <div class="item-icon">
            <i></i>
          </div>
          <div class="item-title">
            <span>MySQL</span>
          </div>
        </div>
      </div>
    </div>
    <adm-syncbdp v-model="modals.admSyncbdpModal" :bdp-id="dataID" @close="closeSyncBdp"/>
    <adm-mysql v-model="modals.admMysqlModal" :mysql-id="dataID"  @close="closeAdmMysql"/>
    <adm-oracle v-model="modals.admOracleModal" :oracle-id="dataID" @close="closeAdmOracle"/>
    <adm-msg v-model="modals.admMsgModal" :msg-id="dataID" @close="closeAdmMsg"/>
    <adm-api v-model="modals.admApiModal" :api-item="apiData" @close="closeAdmApi" />
  </div>
</template>
<script>
export default {
  name: 'adm',
  data () {
    return {
      dataID: '',
      apiData: {},
      modals: {
        admSyncbdpModal: false,
        admMysqlModal: false,
        admOracleModal: false,
        admMsgModal: false,
        admApiModal: false
      }
    }
  },
  methods: {
    closeSyncBdp () {
      this.modals.admSyncbdpModal = false
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
    chooseType (e, type) {
      switch (type) {
        case 'syncbdp':
          this.modals.admSyncbdpModal = true
          break
        case 'mysql':
          this.modals.admMysqlModal = true
          break
        case 'oracle':
          this.modals.admOracleModal = true
          break
        case 'msg':
          this.modals.admMsgModal = true
          break
        case 'api':
          this.modals.admApiModal = true
          break
      }
    },
    backToRoot (e) {
      e.stopPropagation()
      this.$router.push('/dm')
    }
  }
}
</script>
