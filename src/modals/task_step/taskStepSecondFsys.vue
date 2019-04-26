<template>
  <div class="step-body" v-show="step === 1">
    <div class="flow-sys-main">
      <div class="sys-header">
        <span>连接配置</span>
        <span>推送数据库是默认实时推送</span>
      </div>
      <div class="grid-main sys-main">
        <div class="item r-span">
          <i class="red-dot"></i>
          <span>数据库地址</span>
        </div>
        <div class="item">
          <i class="red-dot"></i>
          <input type="text">
        </div>
        <div class="item r-span">
          <i class="red-dot"></i>
          <span>数据表</span>
        </div>
        <div class="item">
          <input type="text">
        </div>
        <div class="item r-span">
          <i class="red-dot"></i>
          <span>数据库端口</span>
        </div>
        <div class="item">
          <input type="text">
        </div>
        <div class="item r-span">
          <span>起止时间</span>
        </div>
        <div class="item">
          <input type="text">
        </div>
        <div class="item r-span">
          <i class="red-dot"></i>
          <span>用户名</span>
        </div>
        <div class="item user-input">
          <input type="text">
        </div>
        <div class="item r-span pwd-label">
          <i class="red-dot"></i>
          <span>密码</span>
        </div>
        <div class="item pwd-input">
          <input type="text">
        </div>
        <div class="item r-span">
          <i class="red-dot"></i>
          <span>数据库名</span>
        </div>
        <div class="item">
          <input type="text">
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
    step: Number
  },
  data () {
    return {

    }
  },
  methods: {
    prev () {
      this.$emit('prev')
    },
    next () {
      this.$emit('next')
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
