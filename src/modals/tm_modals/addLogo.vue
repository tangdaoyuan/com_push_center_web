<template>
  <Modal
    v-model="value"
    class="modal-sm add-logo-modal"
    :mask-closable="false"
    :closable="false">
    <div class="modal-header" slot="header">
      <span>新增图标</span>
      <Icon type="md-close" @click="close" />
    </div>
    <div class="modal-body">
      <div class="upload-box">
        <Upload
          ref="logoUpload"
          :action="`/api/logo_title/upload?sys_type=${CONSTANT.SYS_TYPE}`"
          type="drag"
          name="upload"
          :headers="fileHead"
          :show-upload-list="false"
          :format="['jpg', 'jpeg', 'png', 'svg', 'gif']"
          :before-upload="fileCheck"
          :on-format-error="fileCheckErr"
          :on-success="uploadSuccess"
          class="upload">
          <div class="pre-upload" v-show="!base64Img">
            <Icon type="ios-camera" size="50"></Icon>
          </div>
          <div class="upload-img" v-show="base64Img">
            <img :src="base64Img"/>
          </div>
        </Upload>
      </div>
    </div>
    <div class="modal-footer" slot="footer" v-show="false">
      <el-button type="text" class="sure-btn" @click="ok">确定</el-button>
      <el-button type="text" class="cancel-btn"  @click="close">取消</el-button>
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
      fileHead: null,
      files: [],
      base64Img: null
    }
  },
  methods: {
    init () {
      this.fileHead = {
        'Authorization': 'Bearer ' + this.$cookies.get('pc_token'),
        'userId': this.$cookies.get('pc_user_id')
      }
    },
    close () {
      this.$emit('close')
      this.base64Img = ''
    },
    ok () {

    },
    fileCheckErr () {
      this.$message({
        message: '图片格式错误',
        type: 'error'
      })
    },
    fileCheck (file) {
      if (file.type.indexOf('image') > -1) {
        const reader = new FileReader()

        reader.readAsDataURL(file)
        reader.onload = () => { this.base64Img = reader.result }
      }
    },
    uploadSuccess (res, file, filelist) {
      if (filelist.length > 1) {
        filelist.shift()
      }
      this.files = filelist
      this.$message.success('上传成功')
      this.close()
      setTimeout(() => {
        this.$emit('refresh')
      }, 300)
    }
  },
  watch: {
    value () {
      if (this.value) {
        this.init()
      }
    }
  }
}
</script>
