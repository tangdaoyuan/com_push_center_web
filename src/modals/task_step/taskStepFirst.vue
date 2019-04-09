<template>
  <div class="step-body" v-show="step === 0">
    <div class="add-task-step">
      <div class="np-item">
        <span class="item-title">推送名称</span>
        <Input class="item-con" v-model="taskData.name" type="text" :maxlength="16" />
      </div>
      <div class="np-item">
        <span class="item-title">推送分类</span>
        <el-select class="item-con" v-model="taskData.type">
          <el-option
            v-for="item in taskTypelist"
            :key="item.id"
            :value="item.id"
            :label="item.content"></el-option>
        </el-select>
      </div>
      <div class="np-item area">
        <Input type="textarea" :rows="4" v-model="taskData.describe" placeholder="请输入推送描述" :maxlength="500" />
      </div>
      <div class="np-item tip">
        最多支持500字输入
      </div>
    </div>
    <div class="step-footer">
      <el-button type="primary" @click="next()">{{$store.state.task.taskData ? '完成修改' : '下一步'}}</el-button>
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
      taskData: {
        name: '',
        type: '',
        describe: '',
        id: ''
      },
      taskTypelist: []
    }
  },
  methods: {
    init () {
      this.dicService.getDicConData({
        type_id: 'dic_t_task_type'
      }).then(res => {
        if (res.status === 0) {
          this.taskTypelist = res.data.list
        }
      })
      if (this.$store.state.task.taskData) {
        this.taskData = {
          ...this.$store.state.task.taskData
        }
      }
    },
    next () {
      if (!this.taskData.name) {
        this.$message.error('推送名称不可为空')
        return
      }
      if (!this.taskData.type) {
        this.$message.error('推送分类不可为空')
        return
      }

      const putData = {
        ...this.taskData,
        id: this.$store.state.task.taskData ? this.$store.state.task.taskId : undefined
      }

      const service = this.$store.state.task.taskData ? this.tcService.saveTaskEdit(putData) : this.tcService.addTask(putData)
      service.then(res => {
        if (res.status === 0) {
          this.$message.success('保存成功')
          if (!this.$store.state.task.taskData) {
            this.$store.commit('setTaskId', res.data.task_id)
            this.$emit('next', 0)
          } else {
            this.$emit('refresh')
          }
        } else {
          this.$message.error(res.msg)
        }
      })
    }
  },
  watch: {
    step () {
      if (this.step === 0) {
        this.init()
      } else if (this.step === -1) {
        Object.assign(this.$data, this.$options.data())
      }
    }
  }
}
</script>
