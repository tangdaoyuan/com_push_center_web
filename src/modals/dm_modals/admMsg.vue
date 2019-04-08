<template>
  <Modal class="manage-modal task-manage" v-model="value" fullscreen>
    <div class="manage-header" slot="header">
      <Icon type="md-arrow-round-back" @click="cancel()"/>
      <span>{{(msgId) ? ('编辑') : ('新增')}}消息队列</span>
    </div>
    <div class="manage-body">
      <div class="step-box">
        <Steps :current="currentStep">
          <Step title="选择数据源" content=""  @click.native="changeStep(0)"></Step>
          <Step title="数据表设置" content=""  @click.native="changeStep(1)"></Step>
        </Steps>
      </div>
      <div class="adm-step-msg1 adm-step1" v-show="currentStep === 0">
        <div class="step-body">
          <div class="step-item">
            <div class="title">
              基础设置
            </div>
            <div class="item-body">
              <div class="item-form">
                <label class="item-form-title">数据源</label>
                <el-select class="item-select" v-model="msgData1.type" disabled filterable>
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
                <Input class="item-input" v-model="msgData1.name" :maxlength="16" />
              </div>
              <div class="item-form-area">
                <Input class="item-input" v-model="msgData1.desc" type="textarea" placeholder="请输入数据源描述" :maxlength="200" />
              </div>
              <div class="item-form-tip">
                最多支持200字输入
              </div>
            </div>
          </div>
          <div class="step-item">
            <div class="title">
              连接配置
            </div>
            <div class="item-body">
              <div class="item-form" v-show="false">
                <label class="item-form-title">Access Key</label>
                <Input class="item-input right" disabled v-model="ak" placeholder="点击刷新按钮自动生成" />
                <i></i>
                <Icon type="ios-copy" @click="copyKey($event, 'Access Key', ak)" />
              </div>
              <div class="item-form" v-show="false">
                <label class="item-form-title">Secret Key</label>
                <Input class="item-input right" disabled v-model="sk" placeholder="点击刷新按钮自动生成" />
                <i></i>
                <Icon type="ios-copy" @click="copyKey($event, 'Secret Key', sk)" />
              </div>
              <div class="item-form">
                <label class="item-form-title">Topic</label>
                <Input class="item-input right" :maxlength="16" v-model="msgData1.params.topic" placeholder="5-16字母加数字组合" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="adm-step-msg2 adm-step2" v-show="currentStep === 1">
        <div class="step-body">
          <div class="item-body">
            <Form ref="api_list_form" :model="msgData2">
              <Row class="item-box"
                v-for="(item, index) in msgData2.params.table_fields"
                :key="index">
                <i-col class="item-con" span="8">
                  <label class="item-title">参数名称</label>
                  <FormItem>
                    <Input type="text" v-model="item.name" />
                  </FormItem>
                </i-col>
                <i-col class="item-con" span="8">
                  <label class="item-title">参数类型</label>
                  <el-form>
                    <el-select v-model="item.type" filterable>
                      <el-option
                        v-for="n in CONSTANT.dmFiledTypeList"
                        :label="n.label"
                        :value="n.value"
                        :key="n.value">
                      </el-option>
                    </el-select>
                  </el-form>
                </i-col>
                <i-col class="item-btn-box" span="4">
                  <Button shape="circle" @click="addItem($event, index)" icon="ios-add"></Button>
                  <Button shape="circle" @click="removeItem($event, index)" v-show="msgData2.params.table_fields && msgData2.params.table_fields.length > 1" icon="ios-remove"></Button>
                </i-col>
              </Row>
            </Form>
          </div>
        </div>
      </div>
    </div>
    <div class="manage-footer" slot=footer>
      <div class="step-footer">
        <el-button type="primary" @click="prev()" v-show="currentStep === 1">上一步</el-button>
        <el-button type="primary" @click="next()" v-show="currentStep === 0">下一步</el-button>
        <el-button type="primary" @click="finishMsg()" v-show="currentStep === 1">完成{{(msgId) ? ('编辑') : ('创建')}}</el-button>
      </div>
    </div>
  </Modal>
</template>
<script>
export default {
  props: {
    value: Boolean,
    msgId: String
  },
  data () {
    return {
      currentStep: 0,
      ak: '',
      sk: '',
      tbID: '',
      dataSource: {},
      setting: [],
      msgData1: {
        name: '',
        desc: '',
        type: 2,
        params: {
          topic: ''
        }
      },
      msgData2: {
        type: 2,
        temp_id: '',
        params: {
          table_fields: [
            // {
            //   name: '',
            //   type: 1,
            //   id: ''
            // }
          ]
        }
      }
    }
  },
  methods: {
    close () {
      this.$emit('close')
    },
    changeStep (step) {
      if (this.msgId) {
        this.currentStep = step
      } else {
        this.$message.info('新建不允许使用步骤条')
      }
    },
    search () {
      this.dmService.openDetail({
        id: this.msgId
      }).then(res => {
        this.dataSource = res.data.data_source
        this.setting = res.data.table_fields
        this.msgData1 = {
          name: this.dataSource.name,
          desc: this.dataSource.desc,
          type: 2,
          params: {
            topic: this.dataSource.topic
          }
        }
        this.setting.forEach(item => {
          this.msgData2.params.table_fields.push({
            id: item.id,
            name: item.name,
            type: item.origin_type
          })
        })
        this.tbID = res.data.table_id
      })
    },
    next () {
      if (this.currentStep === 0) {
        if (!this.msgData1.name) {
          this.$message.error('数据源名称不能为空')
          return
        }
        if (!this.msgData1.params.topic) {
          this.$message.error('Topic不能为空')
          return
        }

        if (this.msgId) {
          this.dmService.editApiData({
            ...this.msgData1,
            id: this.dataSource.id
          }).then(res => {
            if (res.status === 0) {
              this.currentStep = 1
            } else {
              this.$message.error(res.msg)
            }
          })
        } else {
          this.msgData2.params.table_fields = [
            {
              name: '',
              type: 1,
              id: ''
            }
          ]
          this.dmService.saveMsgTmpData(this.msgData1).then(res => {
            if (res.status === 0) {
              this.msgData2.temp_id = res.data.temp_id
              this.currentStep = 1
            } else {
              this.$message.error(res.msg)
            }
          })
        }
      }
    },
    prev () {
      this.currentStep--
    },
    copyKey (e, title, text) {
      if (text) {
        this.$Modal.info({
          title: title,
          content: `<p style="word-break: break-all;">${text}</p>`
        })
      }
    },
    addItem (e, index) {
      this.msgData2.params.table_fields.splice(index + 1, 0, {
        name: '',
        type: ''
      })
    },
    removeItem (e, index) {
      this.msgData2.params.table_fields.splice(index, 1)
    },
    finishMsg () {
      if (this.msgId) {
        this.dmService.saveEditData({
          ...this.msgData2,
          temp_id: undefined,
          ds_id: this.dataSource.id,
          tb_id: this.tbID
        }).then(res => {
          if (res.status === 0) {
            this.$message.success('编辑消息队列成功')
            this.$emit('refresh')
            this.close()
          } else {
            this.$message.error(res.msg)
          }
        })
      } else {
        const putData = JSON.parse(JSON.stringify(this.msgData2))
        let fields = []
        this.msgData2.params.table_fields.forEach(item => {
          if (item.name && (item.type || item.type === 0)) {
            fields.push({
              name: item.name,
              type: item.type
            })
          }
        })
        putData.params.table_fields = fields
        if (putData.params.table_fields.length === 0) {
          this.$message.error('参数设置不能为空')
          return
        }
        this.dmService.saveApiData(putData).then(res => {
          if (res.status === 0) {
            this.$router.push('/dm')
            this.$message.success('保存消息队列成功')
          } else {
            this.$message.error(res.msg)
          }
        })
      }
      this.clear()
    },
    cancel () {
      this.close()
      this.clear()
    },
    clear () {
      this.msgData1 = {
        name: '',
        desc: '',
        type: 2,
        params: {
          topic: ''
        }
      }
      this.msgData2 = {
        temp_id: '',
        params: {
          table_fields: []
        }
      }
    }
  },
  watch: {
    value () {
      if (!this.value) {
        Object.assign(this.$data, this.$options.data())
      } else {
        this.currentStep = 0
        if (this.msgId) {
          this.search()
        }
      }
    }
  }
}
</script>
