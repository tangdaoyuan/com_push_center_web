<template>
  <div class="step-body" v-show="step === 1 && taskStep === CONSTANT.taskStep.API">
    <div class="flow-api-main">
      <div class="api-header">
        <span>连接配置</span>
        <span>推送API是默认实时推送</span>
      </div>
      <div class="grid-main api-main">
        <div class="item r-span">
          <i class="red-dot"></i>
          <span>API地址</span>
        </div>
        <div class="item">
          <input v-model="taskData.host" type="text">
        </div>
        <div class="item r-span">
          <span>起止时间</span>
        </div>
        <div class="item">
          <el-date-picker
            v-model="date"
            @change="changeDate"
            type="daterange"
            :editable="false"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </div>
      </div>
    </div>
    <div class="step-footer">
      <el-button v-show="!$store.state.task.taskData" @click="prev()">上一步</el-button>
      <el-button type="primary" @click="next()">{{$store.state.task.taskData ? '完成修改' : '下一步'}}</el-button>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    step: Number,
    taskStep: Number
  },
  data () {
    return {
      date: null,
      taskData: {
        host: '',
        start_time: undefined,
        end_time: undefined
      }
    }
  },
  methods: {
    changeDate (dates) {
      if (dates) {
        this.taskData.start_time = dates[0].getTime()
        this.taskData.end_time = dates[1].getTime()
      }
    },
    prev () {
      this.$emit('prev')
    },
    next () {
      if (!this.taskData.host) {
        this.$message.error('API地址不可为空')
        return
      }
      const pushData = {
        api: {
          ...this.taskData
        },
        id: this.$store.state.task.taskData ? this.$store.state.task.taskId : undefined
      }

      console.log(pushData)
      const service = this.$store.state.task.taskData ? this.tcService.editStep2ByDBorAPI(pushData) : this.tcService.saveTask2SettingByDBorAPI(pushData)

      service.then(res => {
        if (res.state === 0) {
          this.$message.success('保存成功')
          if (!this.$store.state.task.taskData) {
            this.$emit('next', 1)
          } else {
            this.$emit('refresh')
          }
        }
      })
    }
  },
  watch: {
    step () {
      if (this.step === -1) {
        Object.assign(this.$data, this.$options.data())
      }
    }
  }
}
</script>
