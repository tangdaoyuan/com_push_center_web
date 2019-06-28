<template>
  <div class="step-body" v-show="step === 2 && (taskStep === CONSTANT.taskStep.API || taskStep === CONSTANT.taskStep.N_API)">
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
          <input v-model="taskData.url" type="text">
        </div>
        <div class="item r-span">
          <span>起止时间</span>
        </div>
        <div class="item">
          <el-date-picker
            v-model="date"
            @change="changeDate"
            type="datetimerange"
            :editable="false"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </div>
         <div class="item r-span">
          <span>消息模板</span>
        </div>
        <div class="item">
          <textarea class="at-box" ref="at_box" cols="30" rows="10" @change="msgChange" v-model="taskData.msg" >
          </textarea>
           <div class="at-tips" :class="{'error': isError}">
          最多支持200字输入
        </div>
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
      isError: false,
      taskData: {
        url: '',
        start_time: undefined,
        end_time: undefined,
        msg: ''
      }
    }
  },
  methods: {
    init () {
      if (this.$store.getters.taskData) {
        this.taskData = { ...this.$store.getters.taskData.api }
        this.date = [new Date(this.taskData.start_time), new Date(this.taskData.end_time)]
      }

      let fieldList = []
      if (this.$store.state.task.tableData) {
        fieldList = this.$store.state.task.tableData.title_list
      }
      window.$(this.$refs.at_box).suggest('@', {
        data: fieldList.map(item => {
          return {
            ...item,
            text: item.name,
            value: item.name
          }
        })
      })
    },
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
      if (!this.taskData.url) {
        this.$message.error('API地址不可为空')
        return
      }

      if (!this.taskData.msg) {
        this.$message.error('消息模板不能为空')
        return null
      }
      if (this.taskData.msg.length > 200) {
        this.isError = true
        return null
      } else {
        this.isError = false
      }
      const pushData = {
        api: {
          ...this.taskData
        },
        id: this.$store.state.task.taskId
      }
      const service = this.$store.state.task.taskData ? this.tcService.editStep3ByDBorAPI(pushData) : this.tcService.saveTask3SettingByDBorAPI(pushData)

      service.then(res => {
        if (res.status === 0) {
          this.$message.success('保存成功')
          this.$emit('finish')
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    msgChange (val) {
      if (!this.taskData.msg) {
        this.taskData.msg = '您有一条预警消息，请注意查收！'
      }
      console.log(this.taskData.msg)
    }
  },
  watch: {
    step () {
      if (this.step === 2 &&
        (this.taskStep === this.CONSTANT.taskStep.API ||
        this.taskStep === this.CONSTANT.taskStep.N_API)) {
        this.init()
      } else if (this.step === -1) {
        Object.assign(this.$data, this.$options.data())
      }
    }
  }
}
</script>
