<template>
  <Modal class="psd-modal-main" v-model="value">
    <div class="modal-header" slot="header">
      <span>定时推送</span>
      <Icon type="md-close" @click="close" />
    </div>
    <div class="psd-body">
      <div class="ts-radio-box">
        <el-radio-group v-model="chooseType" @change.native="changeChoose">
          <el-radio v-for="n in CONSTANT.pushTypeList" :key="n.type" :label="n.type">{{n.name}}</el-radio>
        </el-radio-group>
      </div>
      <div class="item-box">
        <span>推送时段</span>
        <div class="ts-sjd-box">
          <div v-if="chooseType == 1">
            <el-radio-group v-model="period_list[0].period_time">
              <el-radio label="current_time">及时推送</el-radio>
              <el-radio label="work_day">工作日推送08：00 ~18：00</el-radio>
            </el-radio-group>
          </div>
          <div v-if="chooseType == 4">
            <el-time-picker
              is-range
              v-model="period_list[0].period_time"
              range-separator="至"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              placeholder="选择时间范围">
            </el-time-picker>
          </div>
          <div v-if="chooseType == 5 || chooseType == 7">
            <el-radio-group v-model="period_list[0].period_time">
              <el-radio label="work_day">工作日</el-radio>
              <el-radio label="all">全部</el-radio>
            </el-radio-group>
          </div>
          <div v-if="chooseType == 6">
            <el-select v-model="period_list[0].period_time">
              <el-option v-for="n in CONSTANT.weekDayList" :key="n.value" :value="n.value" :label="n.name"></el-option>
            </el-select>
          </div>
        </div>
        <span v-if="chooseType != 1">推送时间</span>
        <div v-if="chooseType != 1">
          <el-time-picker v-model="period_list[0].time" placeholder="请选择时间"></el-time-picker>
        </div>
      </div>
    </div>
    <div slot="footer" class="modal-footer">
      <Button type="text" @click="ok($event)">确定</Button>
      <Button type="text" @click="close">取消</Button>
    </div>
  </Modal>
</template>
<script>
export default {
  props: {
    value: Boolean,
    type: String,
    putData: Object
  },
  data () {
    return {
      chooseType: 1,
      period_list: [
        {
          period_time: 'current_time',
          time: ''
        }
      ],
      dateList: [
        {
          dates: []
        }
      ]
    }
  },
  methods: {
    close () {
      this.$emit('close')
    },
    changeChoose () {
      switch (this.chooseType) {
        case 1:
        case '1':
          this.period_list = [
            {
              period_time: 'current_time',
              time: ''
            }
          ]
          break
        case 4:
        case '4':
          this.period_list = [
            {
              period_time: [new Date(), new Date()],
              time: ''
            }
          ]
          break
        case 5:
        case '5':
          this.period_list = [
            {
              period_time: 'work_day',
              time: ''
            }
          ]
          break
        case 6:
        case '6':
          this.period_list = [
            {
              period_time: 'monday',
              time: ''
            }
          ]
          break
        case 7:
        case '7':
          this.period_list = [
            {
              period_time: 'work_day',
              time: ''
            }
          ]
          break
      }
    },
    ok (e) {
      e.stopPropagation()
      const putData = {
        period_type: this.chooseType,
        period_list: [
          {
            time: (typeof this.period_list[0].time === 'object') ? (this.utils.momentDate(this.period_list[0].time, 'time')) : (this.period_list[0].time),
            period_time: (typeof this.period_list[0].period_time === 'object') ? (this.period_list[0].period_time.map(n => {
              return this.utils.momentDate(n, 'time')
            }).join(',')) : (this.period_list[0].period_time)
          }
        ]
      }

      if (!putData.period_list[0].time && !putData.period_list[0].period_time) {
        this.$message.error('请选择定时推送属性')
        return
      }

      console.log(putData)
      this.$emit('changeMsgDate', putData)
      this.$message.success('设置成功')
      this.close()
    }
  },
  watch: {
    value () {
      if (this.value) {
        if (this.putData[this.type] && Object.keys(this.putData[this.type]).length > 0) {
          this.chooseType = this.putData[this.type].period_type
          if (this.putData[this.type].period_list && this.putData[this.type].period_list.length > 0 && (this.putData[this.type].period_list[0].period_time || this.putData[this.type].period_list[0].period_time)) {
            this.period_list = this.putData[this.type].period_list
          }
        } else {
          if (this.$store.state.task.taskData) {
            if (this.$store.state.task.taskData.task_channels[this.type]) {
              this.chooseType = this.$store.state.task.taskData.task_channels[this.type].period_type
              if (this.$store.state.task.taskData.task_channels[this.type].period_list && this.$store.state.task.taskData.task_channels[this.type].period_list.length > 0 && (this.$store.state.task.taskData.task_channels[this.type].period_list[0].period_time || this.$store.state.task.taskData.task_channels[this.type].period_list[0].period_time)) {
                this.period_list = this.$store.state.task.taskData.task_channels[this.type].period_list
              }
            }
          }
        }
      }
      if (!this.value) {
        Object.assign(this.$data, this.$options.data())
      }
    }
  }
}
</script>
