<template>
  <Modal
    v-model="value"
    class="modal-sm add-logo-modal add-system-modal"
    :mask-closable="false"
    :closable="false">
    <div class="modal-header" slot="header">
      <span>新增第三方系统</span>
      <Icon type="md-close" @click="close" />
    </div>
    <div class="modal-body">
      <el-form :model="formData" :rules="rules" ref="addSystemForm" label-width="100px" class="title-box">
        <el-form-item label="系统名称" prop="name">
          <el-input
            placeholder="请输入系统名称"
            v-model="formData.name"
            clearable>
          </el-input>
        </el-form-item>
        <el-form-item label="secret key" prop="secret_key">
          <el-input disabled v-model="formData.secret_key" placeholder="点击刷新按钮自动生成" />
          <i class="refresh" @click="getSecret($event)"></i>
        </el-form-item>
      </el-form>
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
      formData: {
        name: '',
        secret_key: ''
      },
      rules: {
        name: { required: true, message: '系统名称不能为空', trigger: 'blur' },
        secret_key: { required: true, message: '请生成secret_key', trigger: 'blur' }
      }
    }
  },
  created () {
  },
  methods: {
    ok () {
      this.$refs.addSystemForm.validate((valid) => {
        if (valid) {
          this.save()
        }
      })
    },
    getSecret (e) {
      this.amService.getSecretKey().then(res => {
        if (res.status === 0) {
          this.formData.secret_key = res.data
        } else {
          this.$message.error(res.msg || '生成失败')
        }
      })
    },
    save () {
      this.amService.saveAuth(this.formData).then(res => {
        if (res.status === 0) {
          this.$message.success('添加成功')
          this.close()
          setTimeout(() => {
            this.$emit('finishSave')
          }, 300)
        }
      })
    },
    close () {
      this.$emit('close')
      this.$refs.addSystemForm.resetFields()
    }
  }
}
</script>
