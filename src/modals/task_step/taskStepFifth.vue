<template>
  <div class="step-body" v-show="step === 4">
    <push-setting
      :list="choosePushMsgList"
      :putData="tdPutData"
      @changeSetting="changeMsgSetting"
      @close="closePsModal"
      :field-list="tbList"
      :type="choosePushType"
      v-model="psModal" />
    <push-setting-date
      v-model="psdModal"
      :putData="tdPutData"
      :type="choosePushType"
      @close="closePsdModal"
      @changeMsgDate="changeMsgDateSetting" />
    <div class="step-module-body">
      <div class="step-item" >
        <div class="item-title">推送通道</div>
        <div class="item-con">
          <ul class="step-item-ul">
            <li v-for="(item, key) in tstdList" :key="key" v-show="item.length !== 0">
              <div class="list-title">{{CONSTANT.tsTdMap[key]}}</div>
              <div class="list-con">
                <Checkbox v-for="(n, i) in item" :key="i" v-model="n.isChoose" >{{n.name}}</Checkbox>
              </div>
              <div class="list-btn">
                <Button type="text" @click="setPushMsg($event, key, item)">设置推送消息</Button>
                <Button type="text" @click="setPushMsgDate($event, key, item)">设置推送周期</Button>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="step-item">
        <div class="item-title">消息提醒状态</div>
        <div class="item-con">
          <Icon class="noti-icon on" title="消息提醒" type="ios-notifications" v-if="sValue" @click="sValue = !sValue" />
          <Icon class="noti-icon" title="消息免打扰" type="ios-notifications-off" v-if="!sValue" @click="sValue = !sValue" />
        </div>
      </div>
      <div class="step-item">
        <div class="item-title">任务起止时间</div>
        <div class="item-con">
          <span>起止时间</span>
          <el-date-picker
            class="con-choose"
            type="datetimerange"
            v-model="pushMsgDate"
            start-placeholder="开始日期"
            end-placeholder="结束日期"  />
        </div>
      </div>
      <div class="step-item">
        <div class="item-title">反馈设置</div>
        <div class="item-con">
          <span>反馈字典</span>
          <el-select
            v-model="dic_type_id"
            class="con-choose dictionary-select"
            placeholder="请选择字典">
            <el-option
              v-for="item in dicList"
              :value="item.id"
              :label="item.name"
              :key="item.id">
            </el-option>
          </el-select>
        </div>
      </div>
    </div>
    <div class="step-footer">
      <el-button @click="prev()" v-show="!$store.state.task.taskData">上一步</el-button>
      <el-button type="primary" :disabled="pushing" @click="ok()">{{(pushing) ? ('提交中') : (($store.state.task.taskData) ? ('完成修改') : ('完成'))}}</el-button>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    step: Number
  },
  data () {
    return {
      pushing: false,
      psModal: false,
      psdModal: false,
      sValue: true,
      channels: null,
      tbList: [],
      tstdList: {},
      pushMsgDate: [],
      choosePushMsgList: [],
      choosePushType: '',
      tdPutData: {
        api: {},
        app: {},
        bs: {},
        ding_talk: {},
        sms: {},
        wechat: {},
        web: {}
      },
      dic_type_id: '',
      dicList: []
    }
  },
  methods: {
    init () {
      const pro = []

      if (this.$store.state.task.tableData) {
        this.tbList = this.$store.state.task.tableData
      } else {
        this.sValue = (() => {
          if (!this.$store.state.task.taskData.msg_notify && this.$store.state.task.taskData.msg_notify !== 0) {
            return true
          } else if (this.$store.state.task.taskData.msg_notify === 1) {
            return true
          } else if (this.$store.state.task.taskData.msg_notify === 0) {
            return false
          }
          return true
        })()
        pro.push(new Promise((resolve, reject) => {
          this.wtService.getprewData({
            page_no: 1,
            page_size: 100,
            tb_id: this.$store.state.task.tableId || (this.$store.state.task.taskData && this.$store.state.task.taskData.table_id)
          }).then(res => {
            if (res.status === 0) {
              this.tbList = res.data.title_list
              this.$store.commit('setTaskTableData', res.data)
              resolve()
            }
          })
        }))
      }

      this.dicService.getDicData().then(res => {
        if (res.status === 0) {
          this.dicList = res.data.list
        }
      })

      Promise.all([
        ...pro,
        new Promise((resolve, reject) => {
          this.tcService.getChannelsData().then(res => {
            if (res.status === 0) {
              this.tstdList = res.data
              resolve()
            }
          })
        })
      ]).then(() => {
        if (this.$store.state.task.taskData) {
          this.dic_type_id = this.$store.state.task.taskData.dic_type_id
          Object.keys(this.tstdList).forEach((k, i) => {
            if (this.$store.state.task.taskData.task_channels[k]) {
              this.tstdList[k].forEach(n => {
                if (this.utils.checkListInner(this.$store.state.task.taskData.task_channels[k].channel_id_list, n.id)) {
                  n.isChoose = true
                }
              })
              this.tdPutData[k] = this.$store.state.task.taskData.task_channels[k]
            }
          })
          this.pushMsgDate = [
            new Date(this.$store.state.task.taskData.task_channels.push_start_time),
            new Date(this.$store.state.task.taskData.task_channels.push_end_time)
          ]
        }
      })
    },
    closePsModal () {
      this.psModal = false
    },
    closePsdModal () {
      this.psdModal = false
    },
    changeMsgSetting (data) {
      this.tdPutData[this.choosePushType] = {
        ...this.tdPutData[this.choosePushType],
        tpl_type: data.tpl_type,
        msg: data.msg
      }
    },
    changeMsgDateSetting (data) {
      this.tdPutData[this.choosePushType].period_type = data.period_type
      this.tdPutData[this.choosePushType].period_list = data.period_list
    },
    setPushMsg (e, key, list) {
      e.stopPropagation()
      this.choosePushType = key
      const tmpList = []
      list.forEach(item => {
        if (item.isChoose) {
          tmpList.push(item)
        }
      })
      if (tmpList.length === 0) {
        this.$message.error('请先选择消息通道')
        return null
      }
      this.choosePushMsgList = tmpList
      this.psModal = true
    },
    setPushMsgDate (e, key, list) {
      e.stopPropagation()
      this.choosePushType = key
      const tmpList = []
      list.forEach(item => {
        if (item.isChoose) {
          tmpList.push(item)
        }
      })
      if (tmpList.length === 0) {
        this.$message.error('请先选择消息通道')
        return null
      }
      this.choosePushMsgList = tmpList
      this.psdModal = true
    },
    prev () {
      this.$emit('prev')
    },
    ok () {
      this.pushing = true
      const pushOverData = {
        task_id: this.$store.state.task.taskId,
        dic_type_id: this.dic_type_id,
        msg_notify: this.sValue ? 1 : 0
      }
      if (this.pushMsgDate.length === 0) {
        this.$message.error('请选择推送时间')
        this.pushing = false
        return null
      } else {
        if (!this.pushMsgDate[0] || !this.pushMsgDate[1]) {
          this.$message.error('请选择推送时间')
          this.pushing = false
          return null
        }
      }
      pushOverData.push_start_time = this.pushMsgDate[0].getTime()
      pushOverData.push_end_time = this.pushMsgDate[1].getTime()

      let allHas = false
      Object.keys(this.tstdList).forEach(item => {
        let has = false
        const tmp = []
        this.tstdList[item].forEach(n => {
          if (n.isChoose) {
            has = true
            allHas = true
            tmp.push(n.id)
          }
        })
        if (has) {
          if (!this.tdPutData[item].period_type) {
            this.tdPutData[item].period_type = 1
          }
          if (this.tdPutData[item].period_list && this.tdPutData[item].period_list.length > 0) {
            if (!this.tdPutData[item].period_list[0] || (!this.tdPutData[item].period_list[0].time && !this.tdPutData[item].period_list[0].period_time)) {
              this.tdPutData[item].period_list = [
                {
                  period_time: 'current_time',
                  time: ''
                }
              ]
            }
          }
          if (!this.tdPutData[item].tpl_type) {
            this.tdPutData[item].tpl_type = 1
            this.tdPutData[item].msg = '您有一条预警信息，请注意查收！'
          }
          pushOverData[item] = this.tdPutData[item]
          pushOverData[item].channel_id_list = tmp
        }
      })

      if (!allHas) {
        this.$message.error('请至少选择一个推送通道')
        this.pushing = false
        return null
      } else {
        Object.keys(this.tdPutData).forEach(item => {
          if (Object.keys(this.tdPutData[item]).length > 0) {
            pushOverData[item] = this.tdPutData[item]
          }
          if (pushOverData[item]) {
            pushOverData[item].id = (this.$store.state.task.taskData)
              ? (this.$store.state.task.taskData.task_channels[item] && this.$store.state.task.taskData.task_channels[item].id)
              : (undefined)
          }
        })
      }

      ((this.$store.state.task.taskData) ? (this.tcService.editstep4(pushOverData)) : (this.tcService.saveTask5Setting(pushOverData))).then(res => {
        if (res.status === 0) {
          this.$message.success('保存成功')
          this.trigger = false
          this.pushing = false
          this.$emit('finish')
        } else {
          this.$message.error(res.msg)
          this.pushing = false
        }
      })
    }
  },
  watch: {
    step () {
      if (this.step === 4) {
        this.init()
      } else if (this.step === -1) {
        Object.assign(this.$data, this.$options.data())
      }
    }
  }
}
</script>
