<template>
  <Modal class="manage-modal task-manage" v-model="value" fullscreen>
    <div class="manage-header" slot="header">
      <Icon type="md-arrow-round-back" @click="close"/>
      <span>{{(oracleId) ? ('编辑') : ('新增')}}Oracle数据源</span>
    </div>
    <div class="manage-body">
      <div class="step-box">
        <Steps :current="currentStep">
          <Step title="选择数据源" content="" @click.native="changeStep(0)"></Step>
          <Step title="数据表设置" content="" @click.native="changeStep(1)"></Step>
        </Steps>
      </div>
      <div class="adm-step-oracle adm-step1" v-show="currentStep === 0">
        <div class="step-body">
          <div class="step-item">
            <div class="title">
              基础设置
            </div>
            <div class="item-body">
              <div class="item-form">
                <label class="item-form-title">数据源</label>
                <el-select class="item-select" v-model="oracleData.type" disabled filterable>
                  <el-option v-for="item in CONSTANT.dmTypeList" :value="item.value" :key="item.value" :label="item.label"></el-option>
                </el-select>
              </div>
              <div class="item-form">
                <label class="item-form-title"><span>*</span>数据源名称</label>
                <Input class="item-input" v-model="oracleData.name" :maxlength="16" />
              </div>
              <div class="item-form-area">
                <Input class="item-input" v-model="oracleData.desc" type="textarea" placeholder="请输入数据源描述" :maxlength="200" />
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
              <div class="item-form">
                <label class="item-form-title">
                  <span>*</span>连接方式
                </label>
                <el-select class="item-input right" v-model="oracleData.params.connection_type" :disabled="oracleId !== ''">
                  <el-option
                    v-for="item in CONSTANT.connectList"
                    :value="item.value"
                    :key="item.value"
                    :label="item.label">
                  </el-option>
                </el-select>
              </div>
              <div class="item-form" v-show="oracleData.params.connection_type === 0">
                <label class="item-form-title"><span>*</span>数据库地址</label>
                <Input class="item-input right" v-model="oracleData.params.host" :maxlength="32" :disabled="oracleId !== ''" />
              </div>
              <div class="item-form" v-show="oracleData.params.connection_type === 0">
                <label class="item-form-title"><span>*</span>数据库端口</label>
                <Input-number class="item-input right" :max="65535" :min="1" v-model="oracleData.params.port" :disabled="oracleId !== ''"></Input-number>
              </div>
              <div class="item-form">
                <label class="item-form-title"><span>*</span>用户名</label>
                <Input class="item-input right" v-model="oracleData.params.username" :disabled="oracleId !== ''" />
              </div>
              <div class="item-form">
                <label class="item-form-title"><span>*</span>密码</label>
                <Input class="item-input right" type="password" v-model="oracleData.params.password" :disabled="oracleId !== ''" />
              </div>
              <div class="item-form" v-show="oracleData.params.connection_type === 0">
                <label class="item-form-title"><span>*</span>服务器类型</label>
                <RadioGroup v-model="serveType" class="item-input right" :disabled="oracleId !== ''">
                  <Radio label="SERVERNAME"></Radio>
                  <Radio label="SID"></Radio>
                </RadioGroup>
              </div>
              <div class="item-form">
                <label class="item-form-title"><span>*</span>{{(serveType === 'SID') ? ('SID') : ((serveType === 'SERVERNAME') ? ('服务名') : (''))}}</label>
                <Input class="item-input right" v-model="typeName" :disabled="oracleId !== ''" />
              </div>
              <div class="item-form" v-show="oracleData.params.connection_type === 0">
                <label class="item-form-title"><span>*</span>数据库名</label>
                <Input class="item-input right" v-model="oracleData.params.database" :disabled="oracleId !== ''" />
              </div>
              <div class="item-form" v-show="oracleData.params.connection_type === 0">
                <label class="item-form-title"><span>*</span>数据表</label>
                <Input class="item-input right" v-model="oracleData.params.table" :disabled="oracleId !== ''" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="adm-step-oracle adm-step2" v-show="currentStep === 1">
        <word-setting :datas="chooseWords" :dataSchema="oracleSchema" @finish="finishWordSetting" v-model="wsModal" />
        <div class="step-body">
          <div class="item-body">
            <div class="item-form item-form1">
              <span>预览表格--{{oracleSchema.table_name}}</span>
              <span @click="filedSetting"><i></i>字段设置</span>
            </div>
            <div class="item-form item-form2">
              <el-table :data="oracleSchema.data"
                border
                stripe
                width="100%">
                <el-table-column
                  v-for="(item, index) in oracleSchema.fields"
                  :key="index"
                  show-overflow-tooltip
                  min-width="120"
                  :label="item.name">
                  <template slot-scope="scope">
                    <span v-if="item.sql_type === 'DATETIME' || item.sql_type === 'DATE'">{{utils.momentDate(scope.row[index], 'date_time')}}</span>
                    <span v-else>{{scope.row[index]}}</span>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <div class="item-form form-select">
              <label class="item-form-title">定时同步</label>
              <RadioGroup v-model="oracleData2.params.is_timed_sync" class="item-input">
                <Radio :label="1">开启</Radio>
                <Radio :label="0">关闭</Radio>
              </RadioGroup>
            </div>
            <div class="item-form form-select" v-show="oracleData2.params.is_timed_sync">
              <label class="item-form-title">更新频率</label>
              <span class="per">每</span>
              <Input-number v-model="oracleData2.params.period" :min="1" :max="9999" class="item-input double"></Input-number>
              <el-select v-model="oracleData2.params.period_type" class="item-select double">
                <el-option v-for="(item, index) in CONSTANT.timeList" :value="item.value" :key="index" :label="item.label"></el-option>
              </el-select>
            </div>
            <div class="item-form form-select" v-show="oracleData2.params.is_timed_sync">
              <label class="item-form-title">增量更新字段</label>
              <el-select v-model="oracleData2.params.increment_field" class="item-select">
                <el-option v-for="(item, index) in oracleSchema.fields" :value="item.name" :key="index" :label="item.name"></el-option>
              </el-select>
              <label class="mark">(增量更新字段只支持索引字段)</label>
            </div>
            <div class="item-form form-select" v-show="oracleData2.params.is_timed_sync">
              <label class="item-form-title">增量类型</label>
              <RadioGroup v-model="oracleData2.params.increment_type" class="item-input">
                <Radio :label="0">序列</Radio>
                <Radio :label="1">时间</Radio>
              </RadioGroup>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="manage-footer" slot=footer>
      <div class="step-footer">
        <el-button type="primary" @click="prev()" v-show="currentStep === 1">上一步</el-button>
        <el-button type="primary" @click="next()" v-show="currentStep === 0">下一步</el-button>
        <el-button type="primary" @click="finishOracle()" v-show="currentStep === 1">完成{{(oracleId) ? ('编辑') : ('创建')}}</el-button>
      </div>
    </div>
  </Modal>
</template>
<script>
export default {
  props: {
    value: Boolean,
    oracleId: String
  },
  data () {
    return {
      currentStep: 0,
      chooseWords: [],
      mysqlSchema: {},
      oracleList: {},
      wsModal: false,
      oracleData: {
        type: 5,
        name: '',
        desc: '',
        params: {
          connection_type: 0,
          host: '',
          port: 1521,
          username: '',
          password: '',
          database: '',
          table: ''
        }
      },
      oracleData2: {
        temp_id: '',
        params: {
          is_timed_sync: 0,
          period: 5,
          period_type: 1,
          increment_type: 0,
          increment_field: ''
        }
      },
      editData2: {
        // tb_id: '',
        // type: 6,
        // ds_id: '',
        // params: {
        //   sync_fields: [],
        //   is_timed_sync: '',
        //   period: '',
        //   period_type: '',
        //   increment_field: '',
        //   increment_type: ''
        // }
      },
      typeName: '',
      sync_fields: [],
      oracleSchema: {},
      serveType: 'SID'
    }
  },
  methods: {
    close () {
      this.$emit('close')
    },
    changeStep (step) {
      if (this.oracleId) {
        this.currentStep = step
      } else {
        this.$message.error('新建不能使用步骤条')
      }
    },
    search () {
      this.dmService.openDetail({
        id: this.oracleId
      }).then(res => {
        if (res.status === 0) {
          this.oracleList = res.data.data_source
          const result = {}
          Object.keys(this.oracleData).forEach(item => {
            if (item !== 'params') {
              result[item] = this.oracleList[item]
            }
          })
          const params = {}
          Object.keys(this.oracleData.params).forEach(item => {
            params[item] = this.oracleList[item]
          })
          this.oracleData = result
          this.oracleData.params = params
          if (this.oracleList.sid) {
            this.typeName = this.oracleList.sid
            this.serveType = 'SID'
          } else if (this.oracleList.server_name) {
            this.typeName = this.oracleList.server_name
            this.serveType = 'SERVERNAME'
          }
          if (this.oracleList.is_timed_sync) {
            this.oracleData2.params = {
              is_timed_sync: 1,
              period: this.oracleList.period,
              period_type: this.oracleList.period_type,
              increment_type: this.oracleList.increment_type,
              increment_field: this.oracleList.increment_field
            }
          }
          this.editData2 = {
            tb_id: res.data.table_id,
            type: 5,
            ds_id: this.oracleList.id
          }
        }
      })
      this.dmService.getMysqlSchema({
        id: this.oracleId
      }).then(res => {
        if (res.status === 0) {
          this.oracleSchema = res.data.schema
          this.oracleSchema.fields.forEach(item => {
            this.chooseWords.push(item.name)
          })
        }
      })
    },
    next () {
      if (this.currentStep === 0) {
        if (!this.oracleData.name) {
          this.$message.error('数据源名称不能为空')
          return null
        }

        if (!this.oracleData.params.username) {
          this.$message.error('用户名不能为空')
          return null
        }

        if (!this.oracleData.params.password) {
          this.$message.error('密码不能为空')
          return null
        }

        if (!this.typeName) {
          if (this.serveType === 'SID') {
            this.$message.error('SID不能为空')
            return null
          } else {
            this.$message.error('服务名不能为空')
            return null
          }
        }

        if (this.oracleData.params.connection_type === 0) {
          if (!this.oracleData.params.host) {
            this.$message.error('数据库地址不能为空')
            return null
          }

          if (!this.oracleData.params.database) {
            this.$message.error('数据库名不能为空')
            return null
          }

          if (!this.oracleData.params.table) {
            this.$message.error('数据表不能为空')
            return null
          }
        }

        const putData = this.oracleData
        if (this.serveType === 'SID') {
          putData.params.sid = this.typeName
        } else if (this.serveType === 'SERVERNAME') {
          putData.params.server_name = this.typeName
        }

        if (putData.params.port === null) {
          this.$message.error('数据库端口号不能为空')
          return
        }

        if (this.oracleId) {
          this.dmService.editApiData({
            ...putData,
            params: undefined,
            id: this.oracleList.id
          }).then(res => {
            if (res.status === 0) {
              this.currentStep = 1
            } else {
              this.$message.error(res.msg)
            }
          })
        } else {
          this.dmService.saveMsgTmpData(putData).then(res => {
            if (res.status === 0) {
              this.oracleSchema = res.data.schema
              this.oracleSchema.fields.forEach(item => {
                this.chooseWords.push(item.name)
              })
              this.oracleData2.temp_id = res.data.temp_id
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
    finishOracle () {
      const putData = {
        type: 5,
        temp_id: this.oracleData2.temp_id,
        params: {}
      }
      if (this.chooseWords.length === 0) {
        this.$message.error('请配置同步字段')
        return
      }
      putData.params.sync_fields = (this.sync_fields.length > 0) ? (this.sync_fields) : (this.chooseWords)
      if (this.oracleData2.params.is_timed_sync) {
        putData.params.is_timed_sync = true
        putData.params.period = this.oracleData2.params.period
        putData.params.period_type = this.oracleData2.params.period_type
        putData.params.increment_field = this.oracleData2.params.increment_field
        putData.params.increment_type = this.oracleData2.params.increment_type
      } else {
        putData.params.is_timed_sync = false
      }
      if (this.oracleId) {
        this.editData2.params = putData.params
        this.dmService.saveEditData(this.editData2).then(res => {
          if (res.status === 0) {
            this.$message.success('编辑数据源成功')
            this.$emit('refresh')
            this.close()
          } else {
            this.$message.error(res.msg)
          }
        })
      } else {
        this.dmService.saveApiData(putData).then(res => {
          if (res.status === 0) {
            this.$message.success('保存成功')
            this.$router.push('/dm')
          } else {
            this.$message.error(res.msg)
          }
        })
      }
    },
    finishWordSetting (data) {
      this.sync_fields = data.sync_fields
      // this.chooseWords = data.sync_fields
    },
    filedSetting () {
      this.wsModal = true
    }
  },
  watch: {
    value () {
      if (!this.value) {
        Object.assign(this.$data, this.$options.data())
      } else {
        this.currentStep = 0
        if (this.oracleId) {
          this.search()
        }
      }
    }
  }
}
</script>
