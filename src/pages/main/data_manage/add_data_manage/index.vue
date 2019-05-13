<template>
  <div class="adm-main">
    <div class="adm-step-main">
      <div class="step-title">
        <Icon type="md-arrow-back" @click="backToRoot($event)"/>
        <span>选择数据源</span>
      </div>
      <div class="adm-step-wrapper">
        <div class="adm-type-title">
          <div class="title">普通工作表</div>
        </div>
        <div class="adm-step-box">
          <div class="adm-item-box" @click="chooseType($event, 'syncbdp')">
            <div class="h-bg">
              <div class="add"></div>
            </div>
            <div class="item-icon">
              <i class="client"></i>
            </div>
            <div class="item-title">
              <span>同步客户端</span>
            </div>
          </div>
          <div class="adm-item-box" @click="chooseType($event, 'oracle')">
            <div class="h-bg">
              <div class="add"></div>
            </div>
            <div class="item-icon">
              <i class="oracle"></i>
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
              <i class="mysql"></i>
            </div>
            <div class="item-title">
              <span>MySQL</span>
            </div>
          </div>
          <div class="adm-item-box" @click="chooseType($event, 'hive')">
            <div class="h-bg">
              <div class="add"></div>
            </div>
            <div class="item-icon">
              <i class="hive"></i>
            </div>
            <div class="item-title">
              <span>Hive</span>
            </div>
          </div>
        </div>
        <div class="adm-type-title">
          <div class="title">流式工作表</div>
        </div>
        <div class="adm-step-box">
          <div class="adm-item-box" @click="chooseType($event, 'api')">
            <div class="h-bg">
              <div class="add"></div>
            </div>
            <div class="item-icon">
              <i class="api"></i>
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
              <i class="msg"></i>
            </div>
            <div class="item-title">
              <span>消息队列</span>
            </div>
          </div>
          <div class="adm-item-box" @click="chooseType($event, 'oracle','flow')">
            <div class="h-bg">
              <div class="add"></div>
            </div>
            <div class="item-icon">
              <i class="oracle"></i>
            </div>
            <div class="item-title">
              <span>Oracle</span>
            </div>
          </div>
          <div class="adm-item-box" @click="chooseType($event, 'msg','flow')">
            <div class="h-bg">
              <div class="add"></div>
            </div>
            <div class="item-icon">
              <i class="kafka"></i>
            </div>
            <div class="item-title">
              <span>Kafka</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <adm-syncbdp v-model="modals.admSyncbdpModal" :bdp-id="dataID" @close="closeSyncBdp"/>
    <adm-mysql v-model="modals.admMysqlModal" :mysql-id="dataID"  @close="closeAdmMysql" />
    <adm-oracle v-model="modals.admOracleModal" :oracle-id="dataID" @close="closeAdmOracle" :is-flow="isFlow.oracle"/>
    <adm-msg v-model="modals.admMsgModal" :msg-id="dataID" @close="closeAdmMsg" :is-flow="isFlow.msg"/>
    <adm-api v-model="modals.admApiModal" :api-item="apiData" @close="closeAdmApi" />
    <adm-hive v-model="modals.admHiveModal" :hive-id="dataID"  @close="closeAdmHive" />
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
        admApiModal: false,
        admHiveModal: false
      },
      isFlow: {
        oracle: false,
        msg: false
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
    closeAdmHive () {
      this.modals.admHiveModal = false
    },
    chooseType (e, type, subType) {
      switch (type) {
        case 'syncbdp':
          this.modals.admSyncbdpModal = true
          break
        case 'mysql':
          this.modals.admMysqlModal = true
          break
        case 'oracle':
          this.modals.admOracleModal = true
          this.isFlow.oracle = subType === 'flow'
          break
        case 'msg':
          this.modals.admMsgModal = true
          this.isFlow.msg = subType === 'flow'
          break
        case 'api':
          this.modals.admApiModal = true
          break
        case 'hive':
          this.modals.admHiveModal = true
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
