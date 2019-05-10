<template>
  <div class="step-body" v-show="step === 2 && taskStep === CONSTANT.taskStep.DATABASE">
    <div class="flow-sys-main">
      <div class="sys-header">
        <span>连接配置</span>
        <span>推送数据库是默认实时推送</span>
      </div>
      <div class="grid-main sys-main">
        <div class="item r-span">
          <i class="red-dot"></i>
          <span>数据库种类</span>
        </div>
        <div class="item">
          <i class="red-dot"></i>
          <RadioGroup v-model="taskData.type">
            <Radio :label="1" >
              <span>mysql</span>
            </Radio>
            <Radio :label="2">
              <span>oracle</span>
            </Radio>
          </RadioGroup>
        </div>
        <div class="item"></div>
        <div class="item"></div>
        <div class="item r-span">
          <i class="red-dot"></i>
          <span>数据库地址</span>
        </div>
        <div class="item">
          <i class="red-dot"></i>
          <input v-model="taskData.host" type="text" required>
        </div>
        <div class="item r-span">
          <i class="red-dot"></i>
          <span>数据表</span>
        </div>
        <div class="item">
          <input v-model="taskData.table" type="text" required>
        </div>
        <div class="item r-span">
          <i class="red-dot"></i>
          <span>数据库端口</span>
        </div>
        <div class="item">
          <input v-model.number="taskData.port" type="number"  min="1" required>
        </div>
        <div class="item r-span">
          <i class="red-dot"></i>
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
        <div class="item r-span">
          <i class="red-dot"></i>
          <span>用户名</span>
        </div>
        <div class="item user-input">
          <input v-model="taskData.username" type="text" required>
        </div>
        <div class="item r-span pwd-label">
          <i class="red-dot"></i>
          <span>密码</span>
        </div>
        <div class="item pwd-input">
          <input v-model="taskData.password" type="text" required>
        </div>
        <div class="item r-span">
          <i class="red-dot"></i>
          <span>数据库名</span>
        </div>
        <div class="item">
          <input v-model="taskData.database" type="text" required>
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
        type: 1,
        host: '',
        port: 0,
        username: '',
        password: '',
        database: '',
        table: '',
        start_time: undefined,
        end_time: undefined
      }
    }
  },
  methods: {
    init () {
      if (this.$store.getters.taskData) {
        this.taskData = { ...this.$store.getters.taskData.database }
        this.date = [new Date(this.taskData.start_time), new Date(this.taskData.end_time)]
      }
    },
    prev () {
      this.$emit('prev')
    },
    next () {
      if (!this.taskData.host) {
        this.$message.error('数据库地址不可为空')
        return
      }
      if (!Number.isInteger(this.taskData.port) || this.taskData.port <= 0) {
        this.$message.error('端口号不合法')
        return
      }
      if (!this.taskData.username) {
        this.$message.error('用户名不能为空')
        return
      }
      if (!this.taskData.password) {
        this.$message.error('密码不能为空')
        return
      }
      if (!this.taskData.database) {
        this.$message.error('数据库名不能为空')
        return
      }
      if (!this.taskData.table) {
        this.$message.error('数据表名不能为空')
        return
      }
      if (!this.taskData.start_time || !this.taskData.end_time) {
        this.$message.error('起止时间不能为空')
        return
      }
      let extraData = {}
      if (this.taskData.type === 2) {
        extraData = {
          connection_type: 0,
          sid: 'xe'
        }
      }

      const pushData = {
        database: {
          ...this.taskData,
          ...extraData
        },
        id: this.$store.state.task.taskId
      }

      console.log(pushData)
      const service = this.$store.state.task.taskData ? this.tcService.editStep3ByDBorAPI(pushData) : this.tcService.saveTask3SettingByDBorAPI(pushData)
      service.then(res => {
        if (res.status === 0) {
          if (res.data.schema) {
            this.$store.commit('setSchemaFields', res.data.schema)
          }
          if (!this.$store.state.task.taskData) {
            this.$emit('next', 2)
          } else {
            this.$emit('refresh')
          }
        } else {
          this.$message.error(res.msg || '保存失败')
        }
      })
    },
    changeDate (dates) {
      if (dates) {
        this.taskData.start_time = dates[0].getTime()
        this.taskData.end_time = dates[1].getTime()
      }
    }
  },
  watch: {
    step () {
      if (this.step === 2 &&
        this.taskStep === this.CONSTANT.taskStep.DATABASE) {
        this.init()
      } else if (this.step === -1) {
        Object.assign(this.$data, this.$options.data())
      }
    }
  }
}
</script>
