<template>
  <Modal class="manage-modal task-manage" v-model="value" fullscreen>
    <div class="manage-header" slot="header">
      <Icon type="md-arrow-back" @click="back($event)" />
      <span>{{(manageId !== '')?('编辑'):('新增')}}推送通道</span>
    </div>
    <div class="manage-body nm-modal-body">
      <div class="base-box">
          <div class="box-header">
            <span>通道设置</span>
          </div>
          <div class="box-body">
            <div class="box-item">
              <label class="item-title">通道类型</label>
              <div class="item-con">
                <RadioGroup v-model="pushPassData.type" >
                  <Radio v-for="(item, index) in  CONSTANT.nmRadioList" :disabled="manageId !== ''" :key="index" :label="item.value" v-show="item.value !== 0">{{item.name}}</Radio>
                  <Radio :label="0" v-show="manageId !== ''" disabled >web消息中心</Radio>
                </RadioGroup>
              </div>
            </div>
            <div class="box-item">
              <label class="item-title">通道名称</label>
              <div class="item-con seq">
                <Input type="text" v-model="pushPassData.name" :maxlength="10"/>
              </div>
              <label class="item-title">通道状态</label>
              <div class="item-con seq">
                <RadioGroup value v-model="pushPassData.status">
                  <Radio :label="1" >开启</Radio>
                  <Radio :label="0" >关闭</Radio>
                </RadioGroup>
              </div>
            </div>
            <div class="box-item">
              <label class="item-title">通道描述</label>
              <div class="item-con">
                <Input type="textarea" class="item-area" :maxlength="100" v-model="pushPassData.describe" placeholder="最多支持100字输入"/>
              </div>
            </div>
          </div>
        </div>
        <div class="expand-box" v-show="pushPassData.type === 6">
          <div class="box-header">
            <span>链接配置</span>
            <span>（政务微信说明：遵循政务微信平台开放API）</span>
          </div>
          <div class="box-body">
            <div class="box-item">
              <label class="item-title">接口地址</label>
              <div class="item-con">
                <Input type="text" v-model="pushPassData.params.url"/>
              </div>
            </div>
            <div class="box-item">
              <span class="item-tip">接口回调说明：1.post接口；  2.参数如下  message:消息概要，body:Json格式详细信息</span>
            </div>
          </div>
        </div>
        <div class="expand-box" v-show="pushPassData.type && pushPassData.type !== 1 && pushPassData.type !== 6">
          <div class="box-header">
            <span>链接配置</span>
            <span>（政务微信说明：遵循政务微信平台开放API）</span>
          </div>
          <div class="box-body">
            <div class="box-item">
              <label class="item-title">Access Key</label>
              <div class="item-con">
                <Input type="text"  disabled v-model="pushPassData.params.access_key" placeholder="点击刷新按钮自动生成"/>
                <i class="refresh-icon" @click="getAccKey($event)"></i>
              </div>
              <label class="item-title">Secret Key</label>
              <div class="item-con">
                <Input type="text" disabled v-model="pushPassData.params.secret_key" placeholder="点击刷新按钮自动生成"/>
                <i class="refresh-icon" @click="getSecKey($event)"></i>
              </div>
            </div>
            <div class="box-item">
              <label class="item-title">Topic</label>
              <div class="item-con">
                <Input type="text" v-model="pushPassData.params.topic"/>
              </div>
            </div>
            <div class="box-item">
              <span class="item-tip">政务微信说明：遵循政务微信平台开放API</span>
            </div>
          </div>
        </div>
    </div>
    <div class="manage-footer" slot=footer>
      <div class="step-footer">
        <Button type="primary" @click="createFinish($event)">完成{{(manageId !== '')?('编辑'):('创建')}}</Button>
      </div>
    </div>
  </Modal>
</template>
<script>
export default {
  props: {
    value: Boolean,
    manageId: String,
    pushPassData: Object
  },
  data () {
    return {
    }
  },
  methods: {
    close () {
      this.$emit('close')
    },
    back () {
      this.close()
      this.$emit('clear')
    },
    getAccKey (e) {
      this.nmService.getAKey().then(res => {
        if (res.status === 0) {
          this.pushPassData.params.access_key = res.data
        }
      })
    },
    getSecKey (e) {
      this.nmService.getSKey({}).then(res => {
        if (res.status === 0) {
          this.pushPassData.params.secret_key = res.data
        }
      })
    },
    createFinish (e) {
      e.stopPropagation()
      if (!this.pushPassData.name) {
        this.$message.error('通道名称不能为空')
        return
      }
      if (!this.pushPassData.status && this.pushPassData.status !== 0) {
        this.$message.error('通道状态不能为空')
        return
      }
      const putData = {
        name: this.pushPassData.name,
        status: this.pushPassData.status,
        describe: this.pushPassData.describe,
        params: this.pushPassData.params,
        type: this.pushPassData.type
      }
      let sMsg, saveService
      if (this.manageId) {
        putData.id = this.manageId
        sMsg = '编辑成功'
        saveService = this.nmService.editData
      } else {
        sMsg = '创建成功'
        saveService = this.nmService.createData
      }

      saveService(putData).then(res => {
        if (res.status === 0) {
          this.$message.success(sMsg)
          this.$emit('refresh')
          this.$emit('clear')
          this.$emit('close')
        } else {
          this.$message.error(res.msg)
        }
      })
    }
  },
  watch: {
    value () {
      if (!this.value) {
        Object.assign(this.$data, this.$options.data())
        this.$emit('input')
      }
    }
  }
}
</script>
