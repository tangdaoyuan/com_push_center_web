<template>
  <Modal class="manage-modal task-manage" v-model="value" fullscreen>
    <div class="manage-header" slot="header">
      <Icon type="md-arrow-round-back" @click="cancel($event)"/>
      <span>{{(apiItem.id) ? ('编辑') : ('新建')}}API数据源</span>
    </div>
    <div class="manage-body">
      <div class="adm-step-api">
        <div class="adm-step-api-con">
          <div class="con-body">
            <div class="item-con">
              <div class="title">
                基础设置
              </div>
              <div class="item-body">
                <div class="item-form">
                  <label class="item-form-title">数据源</label>
                  <el-select class="item-select" disabled v-model="apiData.type" filterable>
                    <el-option
                      v-for="item in CONSTANT.dmTypeList"
                      :value="item.value"
                      :label="item.label"
                      :key="item.value">
                    </el-option>
                  </el-select>
                </div>
                <div class="item-form">
                  <label class="item-form-title">数据源名称</label>
                  <Input class="item-input" v-model="apiData.name" :maxlength="16"/>
                </div>
                <div class="item-form-area">
                  <Input class="item-input" v-model="apiData.desc" type="textarea" placeholder="请输入数据源描述" :maxlength="200"/>
                </div>
                <div class="item-form-tip">
                  最多支持200字输入
                </div>
              </div>
            </div>
            <div class="item-con">
              <div class="title">
                连接配置
              </div>
              <div class="item-body">
                <div class="item-form">
                  <label class="item-form-title">Secret Key</label>
                  <Input class="item-input right" disabled v-model="apiData.params.secret_key" placeholder="点击刷新按钮自动生成"/>
                  <i @click="getSecret($event)"></i>
                  <Icon type="ios-copy" @click="copyKey($event, 'Secret Key', apiData.params.secret_key)"/>
                </div>
                <div class="item-form">
                  <label class="item-form-title">来访IP列表</label>
                  <Input class="item-input right" v-model="apiData.params.ip" placeholder="多个IP间以逗号分隔"/>
                </div>
                <div class="item-form-tip right">
                  API数据说明：创建工作表方式请参照开发者中心。
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="manage-footer" slot=footer>
      <div class="step-footer">
        <Button type="primary" @click="apiFinish()">完成{{(apiItem.id) ? ('编辑') : ('创建')}}</Button>
        <Button type="primary" @click="cancel($event)">取消</Button>
      </div>
    </div>
  </Modal>
</template>
<script>
export default {
  props: {
    value: Boolean,
    apiItem: Object
  },
  data () {
    return {
      apiData: {
        type: 3,
        desc: '',
        params: {
          secret_key: '',
          ip: ''
        },
        name: ''
      }
    }
  },
  methods: {
    closeAdmApi () {
      this.$emit('close')
    },
    apiFinish () {
      if (!this.apiData.params.secret_key) {
        this.$message.error('secret_key不能为空')
        return
      }
      if (!this.apiData.name) {
        this.$message.error('数据源名称不能为空')
        return
      }
      if (this.apiItem.id) {
        this.dmService.editApiData({
          ...this.apiData,
          id: this.apiItem.id
        }).then(res => {
          if (res.status === 0) {
            this.$message.success('编辑api成功')
            this.$emit('refresh')
            this.closeAdmApi()
          } else {
            this.$message.error(res.msg)
          }
        })
      } else {
        this.dmService.saveApiData(this.apiData).then(res => {
          if (res.status === 0) {
            this.$message.success('新增api成功')
            this.$router.push('/dm')
            this.closeAdmApi()
          } else {
            this.$message.error(res.msg)
          }
        })
      }
      this.apiData = {
        type: 3,
        desc: '',
        params: {
          secret_key: '',
          ip: ''
        },
        name: ''
      }
    },
    getSecret (e) {
      this.utils.getSecret().then(res => {
        this.apiData.params.secret_key = res
      })
    },
    copyKey (e, title, text) {
      if (text) {
        this.$Modal.info({
          title: title,
          content: `<p style="word-break: break-all;">${text}</p>`
        })
      }
    },
    cancel (e) {
      e.stopPropagation()
      this.apiData = {
        desc: this.apiItem.desc,
        name: this.apiItem.name,
        type: 3,
        params: {
          secret_key: this.apiItem.secret_key,
          ip: this.apiItem.ip
        }
      }
      this.closeAdmApi()
    }
  },
  watch: {
    value () {
      if (!this.value) {
        Object.assign(this.$data, this.$options.data())
      } else {
        this.apiData = {
          desc: this.apiItem.desc,
          name: this.apiItem.name,
          type: 3,
          params: {
            secret_key: this.apiItem.secret_key,
            ip: this.apiItem.ip
          }
        }
      }
    }
  }
}
</script>
