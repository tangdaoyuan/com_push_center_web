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
      <task-step-first @refresh="refresh" :step="currentStep" @next="next"/>
      <div class="step-box" v-show="currentStep > 0">
        <Steps :current="currentStep">
          <!-- <Step title="创建基本信息" @click.native="editStep($event, 0)" content=""></Step> -->
          <Step title="选择工作表" v-show="false" @click.native="editStep($event, 1)" content=""></Step>
          <Step title="设置任务字段" v-show="true" @click.native="editStep($event, 1)" content=""></Step>
          <Step title="设置推送信息" @click.native="editStep($event, 2)" content=""></Step>
          <Step title="设置推送用户" @click.native="editStep($event, 3)" content=""></Step>
          <Step title="设置推送通道" @click.native="editStep($event, 4)" content=""></Step>
        </Steps>
      </div>
      <task-step-second @refresh="refresh" :step="currentStep" @next="next" @prev="prev"/>
      <!-- <task-step-second-fuser  v-show="false" @refresh="refresh" :step="currentStep" @next="next" @prev="prev"/> -->
      <!-- <task-step-second-fsys v-show="false" @refresh="refresh" :step="currentStep" @next="next" @prev="prev"/> -->
      <!-- <task-step-second-fapi v-show="false" @refresh="refresh" :step="currentStep" @next="next" @prev="prev"/> -->
      <task-step-third @refresh="refresh" :step="currentStep" @next="next" @prev="prev"/>
      <task-step-forth @refresh="refresh" :step="currentStep" @next="next" @prev="prev"/>
      <task-step-fifth @refresh="refresh" :step="currentStep" @finish="finish" @prev="prev"/>
    </div>
    <div class="task-footer" v-show="false" slot="footer">
      <div class="footer">
        <el-button v-show="!$store.state.task.taskData" @click="prev()">上一步</el-button>
        <el-button type="primary" @click="next()">{{$store.state.task.taskData ? '完成修改' : '下一步'}}</el-button>
      </div>
    </div>
  </Modal>
</template>
<script>
export default {
  props: {
    value: Boolean
  },
  data () {
    return {
      currentStep: -1
    }
  },
  methods: {
    close () {
      this.$emit('close')
    },
    back () {
      this.$store.commit('resetTaskEdit')
      this.currentStep = -1
      this.close()
    },
    next (type, data) {
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
      this.$store.commit('resetTaskEdit')
      this.$emit('refresh')
    }
  },
  watch: {
    value () {
      if (this.value) {
        if (this.$store.state.task.taskId) {
          this.$store.dispatch('getEditDetail', {
            id: this.$store.state.task.taskId
          }).then(() => {
            this.currentStep = 1
          })
        } else {
          this.currentStep = 0
        }
      }
      if (!this.value) {
        Object.assign(this.$data, this.$options.data())
      }
    }
  }
}
</script>
