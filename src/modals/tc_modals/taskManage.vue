<template>
  <Modal
    class="manage-modal task-manage"
      v-model="value"
      fullscreen>
    <div class="manage-header" slot="header">
      <Icon type="md-arrow-round-back" @click="back($event)"/>
      <span>{{($store.state.task.taskId) ? '编辑' : '新建'}}任务</span>
    </div>
    <div class="manage-body">
      <div class="step-box" v-show="currentStep > 0">
        <Steps :current="currentStep">
          <Step
            title="创建基本信息"
            @click.native="editStep($event, 0)" content=""></Step>
          <Step
            v-if="taskStep === CONSTANT.taskStep.NORMAL"
            title="选择工作表"
            @click.native="editStep($event, 1)" content=""></Step>
          <Step
            v-if="taskStep != CONSTANT.taskStep.NORMAL"
            title="设置任务字段"
            @click.native="editStep($event, 1)" content=""></Step>
          <Step
            title="设置推送信息"
            @click.native="editStep($event, 2)" content=""></Step>
          <Step
            v-if="taskStep === CONSTANT.taskStep.DATABASE"
            title="设置字段映射" @click.native="editStep($event, 3)" content=""></Step>
          <Step
            v-if="taskStep === CONSTANT.taskStep.NORMAL || taskStep === CONSTANT.taskStep.USER"
            title="设置推送用户" @click.native="editStep($event, 3)" content=""></Step>
          <Step
            v-if="taskStep === CONSTANT.taskStep.NORMAL || taskStep === CONSTANT.taskStep.USER"
            title="设置推送通道" @click.native="editStep($event, 4)" content=""></Step>
        </Steps>
      </div>
      <task-step-first
        :task-step="taskStep"
        @refresh="refresh"
        :step="currentStep"
        @next="next"/>
      <task-step-second
        :task-step="taskStep"
        @refresh="refresh"
        :step="currentStep"
        @next="next" @prev="prev"/>
      <task-step-second-flow
        :task-step="taskStep"
        @refresh="refresh" :step="currentStep" @next="next" @prev="prev"/>
      <task-step-third
        :task-step="taskStep"
        @refresh="refresh"
        :step="currentStep"
        @next="next"
        @prev="prev"/>
      <task-step-third-fsys
        :task-step="taskStep"
        @refresh="refresh"
        :step="currentStep"
        @next="next"
        @prev="prev"/>
      <task-step-third-fapi
        :task-step="taskStep"
        @refresh="refresh"
        :step="currentStep"
        @next="next"
        @prev="prev"
        @finish="finish"/>
      <task-step-forth :task-step="taskStep" @refresh="refresh" :step="currentStep" @next="next" @prev="prev"/>
      <task-step-forth-fsys
        :task-step="taskStep"
        @refresh="refresh"
        :step="currentStep"
        @next="next"
        @prev="prev"
        @finish="finish"/>
      <task-step-fifth :task-step="taskStep" @refresh="refresh" :step="currentStep" @finish="finish" @prev="prev"/>
    </div>
    <div class="task-footer" v-show="false" slot="footer"></div>
  </Modal>
</template>
<script>
export default {
  props: {
    value: Boolean
  },
  data () {
    return {
      currentStep: -1,
      taskStep: -1
    }
  },
  methods: {
    close () {
      this.$emit('close')
    },
    back () {
      this.resetStore()
      this.currentStep = -1
      this.taskStep = -1
      this.close()
    },
    next (type, data) {
      console.log(`current task type: ${type}`)
      if (type === 0 && data !== undefined) {
        this.taskStep = data
      }
      this.currentStep++
    },
    refresh () {
      if (this.$store.state.task.taskId) {
        this.$store.dispatch('refreshTaskData', {
          id: this.$store.state.task.taskId
        })
      }
    },
    editStep (e, step) {
      e.stopPropagation()
      if (this.$store.state.task.taskId) {
        this.currentStep = step
      }
    },
    prev () {
      this.currentStep--
    },
    finish () {
      this.close()
      this.currentStep = -1
      this.taskStep = -1
      this.resetStore()
      this.$emit('refresh')
    },
    resetStore () {
      this.$store.commit('resetTaskEdit')
      this.$store.commit('resetOutputFields')
      this.$store.commit('resetSchemaFields')
    }
  },
  watch: {
    value () {
      if (this.value) {
        if (this.$store.state.task.taskId) {
          this.$store.dispatch('getEditDetail', {
            id: this.$store.state.task.taskId
          }).then((data) => {
            this.currentStep = 1
            console.log(this.utils.getTaskStep(data.table_type, data.target_type))
            this.taskStep = this.utils.getTaskStep(data.table_type, data.target_type)
          })
        } else {
          this.currentStep = 0
        }
      } else {
        Object.assign(this.$data, this.$options.data())
      }
    }
  }
}
</script>
