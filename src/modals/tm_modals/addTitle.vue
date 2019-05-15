<template>
  <Modal
    v-model="value"
    class="modal-sm add-logo-modal"
    :mask-closable="false"
    :closable="false">
    <div class="modal-header" slot="header">
      <span>新增标题</span>
      <Icon type="md-close" @click="close" />
    </div>
    <div class="modal-body">
      <div>
        <el-radio v-model="sysType" :label="1">推送中心</el-radio>
        <el-radio v-model="sysType" :label="2">消息中心</el-radio>
      </div>
      <div class="title-box">
          <el-input
            placeholder="请输入标题"
            v-model="title"
            clearable>
          </el-input>
      </div>
    </div>
    <div class="modal-footer" slot="footer" >
      <el-button type="text" class="sure-btn" @click="ok">确定</el-button>
      <el-button type="text" class="cancel-btn"  @click="close">取消</el-button>
    </div>
  </Modal>
</template>
<script>
import { setTimeout } from 'timers'
export default {
  props: {
    value: Boolean
  },
  data () {
    return {
      title: '',
      sysType: 1,
      params: {
        sys_type: this.CONSTANT.SYS_TYPE
      }
    }
  },
  created () {
  },
  methods: {
    ok () {
      const params = {
        id: '',
        title: this.title,
        sys_type: this.sysType
      }
      this.tmService.addTitle(params).then(res => {
        if (res.status === 0) {
          this.$message.success('添加成功')
          this.close()
          setTimeout(() => {
            this.$emit('refresh')
          }, 300)
        }
      })
    },
    close () {
      this.$emit('close')
      this.title = ''
    }
  }
}
</script>
