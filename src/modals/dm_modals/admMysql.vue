<template>
  <Modal class="manage-modal task-manage" v-model="value" fullscreen>
    <div class="manage-header" slot="header">
      <Icon type="md-arrow-round-back" @click="close"/>
      <span>{{(mysqlId) ? ('编辑') : ('新增')}}Mysql数据源</span>
    </div>
    <div class="manage-body">
      <div class="step-box">
        <Steps :current="currentStep">
          <Step title="选择数据源" content="" @click.native="changeStep(0)"></Step>
          <Step title="数据表设置" content="" @click.native="changeStep(1)"></Step>
        </Steps>
      </div>
      <div class="adm-step-mysql adm-step1" v-show="currentStep === 0">
        <div class="step-body">
          <div class="step-item">
            <div class="title">
              基础设置
            </div>
            <div class="item-body">
              <div class="item-form">
                <label class="item-form-title">数据源</label>
                <el-select class="item-select" v-model="mysqlData.type" disabled filterable>
                  <el-option v-for="item in CONSTANT.dmTypeList" :value="item.value" :key="item.value" :label="item.label"></el-option>
                </el-select>
              </div>
              <div class="item-form">
                <label class="item-form-title"><span>*</span>数据源名称</label>
                <Input class="item-input" v-model="mysqlData.name" :maxlength="16" />
              </div>
              <div class="item-form-area">
                <Input class="item-input" v-model="mysqlData.desc" type="textarea" placeholder="请输入数据源描述" :maxlength="200" />
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
                <label class="item-form-title"><span>*</span>数据库地址</label>
                <Input class="item-input right" v-model="mysqlData.params.host" :maxlength="32" :disabled="mysqlId !== ''"/>
              </div>
              <div class="item-form">
                <label class="item-form-title"><span>*</span>数据库端口</label>
                <Input-number class="item-input right" :max="65535" :min="1"  v-model="mysqlData.params.port" :disabled="mysqlId !== ''"></Input-number>
              </div>
              <div class="item-form">
                <label class="item-form-title"><span>*</span>用户名</label>
                <Input class="item-input right" v-model="mysqlData.params.username" :disabled="mysqlId !== ''"/>
              </div>
              <div class="item-form">
                <label class="item-form-title"><span>*</span>密码</label>
                <Input class="item-input right" type="password" v-model="mysqlData.params.password" :disabled="mysqlId !== ''"/>
              </div>
              <div class="item-form">
                <label class="item-form-title"><span>*</span>数据库名</label>
                <Input class="item-input right" v-model="mysqlData.params.database" :disabled="mysqlId !== ''"/>
              </div>
              <div class="item-form">
                <label class="item-form-title"><span>*</span>数据表</label>
                <Input class="item-input right" v-model="mysqlData.params.table" :disabled="mysqlId !== ''"/>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="adm-step-mysql adm-step2" v-show="currentStep === 1">
        <word-setting
         :datas="chooseWords"
         :dataSchema="mysqlSchema"
         @finish="finishWordSetting"
         @close="closeWoSetting"
         v-model="wsModal" />
        <div class="step-body">
          <div class="item-body">
            <div class="item-form item-form1">
              <span>预览表格--{{mysqlSchema.table_name}}</span>
              <span @click="filedSetting"><i></i>字段设置</span>
            </div>
            <div class="item-form item-form2">
              <el-table :data="mysqlSchema.data"
                  border
                  stripe
                  width="100%">
                <el-table-column
                  v-for="(item, index) in mysqlSchema.fields"
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
              <RadioGroup v-model="mysqlData2.params.is_timed_sync" class="item-input">
                <Radio :label="1">开启</Radio>
                <Radio :label="0">关闭</Radio>
              </RadioGroup>
            </div>
            <div class="item-form form-select" v-show="mysqlData2.params.is_timed_sync">
              <label class="item-form-title">更新频率</label>
              <span class="per">每</span>
              <Input-number v-model="mysqlData2.params.period" :min="1" :max="9999" class="item-input double"></Input-number>
              <el-select v-model="mysqlData2.params.period_type" class="item-select double">
                <el-option v-for="(item, index) in CONSTANT.timeList" :value="item.value" :key="index" :label="item.label"></el-option>
              </el-select>
            </div>
            <div class="item-form form-select" v-show="mysqlData2.params.is_timed_sync">
              <label class="item-form-title">增量更新字段</label>
              <el-select v-model="mysqlData2.params.increment_field" class="item-select">
                <el-option v-for="(item, index) in mysqlSchema.fields" :value="item.name" :key="index" :label="item.name"></el-option>
              </el-select>
              <label class="mark">(增量更新字段只支持索引字段)</label>
            </div>
            <div class="item-form form-select" v-show="mysqlData2.params.is_timed_sync">
              <label class="item-form-title">增量类型</label>
              <RadioGroup v-model="mysqlData2.params.increment_type" class="item-input">
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
        <el-button type="primary" @click="finishMysql($event)" v-show="currentStep === 1">完成{{(mysqlId) ? ('编辑') : ('创建')}}</el-button>
      </div>
    </div>
  </Modal>
</template>
<script>
export default {
  props: {
    value: Boolean,
    mysqlId: String
  },
  data () {
    return {
      currentStep: 0,
      mysqlList: {},
      sync_fields: [],
      mysqlData: {
        type: 6,
        name: '',
        desc: '',
        params: {
          host: '',
          port: 23306,
          username: '',
          password: '',
          database: '',
          table: ''
        }
      },
      chooseWords: [],
      mysqlSchema: {},
      wsModal: false,
      mysqlData2: {
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
      }
    }
  },
  methods: {
    close () {
      this.$emit('close')
    },
    closeWoSetting () {
      this.wsModal = false
    },
    changeStep (step) {
      if (this.mysqlId) {
        this.currentStep = step
      } else {
        this.$message.error('新建不允许使用步骤条')
      }
    },
    search () {
      this.dmService.openDetail({
        id: this.mysqlId
      }).then(res => {
        this.mysqlList = res.data.data_source
        this.mysqlData = {
          type: 6,
          name: this.mysqlList.name,
          desc: this.mysqlList.desc,
          params: {
            host: this.mysqlList.host,
            port: this.mysqlList.port,
            username: this.mysqlList.username,
            password: this.mysqlList.password,
            database: this.mysqlList.database,
            table: this.mysqlList.table
          }
        }
        if (this.mysqlList.is_timed_sync) {
          this.mysqlData2.params = {
            is_timed_sync: 1,
            period: this.mysqlList.period,
            period_type: this.mysqlList.period_type,
            increment_type: this.mysqlList.increment_type,
            increment_field: this.mysqlList.increment_field
          }
        }
        this.editData2 = {
          tb_id: res.data.table_id,
          type: 6,
          ds_id: this.mysqlList.id
        }
      })
      this.dmService.getMysqlSchema({
        id: this.mysqlId
      }).then(res => {
        this.mysqlSchema = res.data.schema
        this.mysqlSchema.fields.forEach(item => {
          this.chooseWords.push(item.name)
        })
      })
    },
    next () {
      if (this.currentStep === 0) {
        if (!this.mysqlData.name) {
          this.$message.error('数据源名称不能为空')
          return null
        }

        if (!this.mysqlData.params.host) {
          this.$message.error('数据库地址不能为空')
          return null
        }

        if (!this.mysqlData.params.port) {
          this.$message.error('数据库端口不能为空')
          return null
        }

        if (!this.utils.portCheck(this.mysqlData.params.port)) {
          this.$message.error('数据库端口不合法')
          return null
        }

        if (!this.mysqlData.params.username) {
          this.$message.error('用户名不能为空')
          return null
        }

        if (!this.mysqlData.params.password) {
          this.$message.error('密码不能为空')
          return null
        }

        if (!this.mysqlData.params.database) {
          this.$message.error('数据库名不能为空')
          return null
        }

        if (!this.mysqlData.params.table) {
          this.$message.error('数据表不能为空')
          return null
        }

        if (this.mysqlId) {
          this.dmService.editApiData({
            ...this.mysqlData,
            params: undefined,
            id: this.mysqlList.id
          }).then(res => {
            if (res.status === 0) {
              this.currentStep = 1
            } else {
              this.$message.error(res.msg)
            }
          })
        } else {
          this.dmService.saveMsgTmpData(this.mysqlData).then(res => {
            if (res.status === 0) {
              this.mysqlSchema = res.data.schema
              this.mysqlData2.temp_id = res.data.temp_id
              this.mysqlSchema.fields.forEach(item => {
                this.chooseWords.push(item.name)
              })
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
    finishMysql () {
      const putData = {
        type: 6,
        temp_id: this.mysqlData2.temp_id,
        params: {}
      }

      if (this.chooseWords.length === 0) {
        this.$message.error('请配置同步字段')
        return
      }
      putData.params.sync_fields = (this.sync_fields.length > 0) ? (this.sync_fields) : (this.chooseWords)
      if (this.mysqlData2.params.is_timed_sync) {
        putData.params.is_timed_sync = true
        putData.params.period = this.mysqlData2.params.period
        putData.params.period_type = this.mysqlData2.params.period_type
        putData.params.increment_field = this.mysqlData2.params.increment_field
        putData.params.increment_type = this.mysqlData2.params.increment_type
      } else {
        putData.params.is_timed_sync = false
      }

      if (putData.params.period === null) {
        this.$message.error('请选择更新频率')
        return
      }

      if (this.mysqlId) {
        this.editData2.params = putData.params
        this.dmService.saveEditData(this.editData2).then(res => {
          if (res.status === 0) {
            // this.$router.push('/dm')
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
        if (this.mysqlId) {
          this.search()
        }
      }
    }
  }
}
</script>
