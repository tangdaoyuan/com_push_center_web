<template>
  <Modal class="manage-modal task-manage" v-model="value" fullscreen>
    <div class="manage-header" slot="header">
      <Icon type="md-arrow-round-back" @click="close"/>
      <span>{{(hiveId) ? ('编辑') : ('新增')}}Hive数据源</span>
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
          <div class="step-item hive-left">
            <div class="title">
              Hive数据源设置
            </div>
            <div class="item-body">
              <div class="item-form">
                <label class="item-form-title">数据源</label>
                <el-select class="item-select" v-model="hiveData.type" disabled filterable>
                  <el-option v-for="item in CONSTANT.dmTypeList" :value="item.value" :key="item.value" :label="item.label"></el-option>
                </el-select>
              </div>
              <div class="item-form">
                <label class="item-form-title"><span>*</span>数据源名称</label>
                <Input class="item-input" v-model="hiveData.name" :maxlength="16" />
              </div>
              <div class="item-form">
                <label class="item-form-title"><span>*</span>数据库地址</label>
                <Input class="item-input right" v-model="hiveData.params.host" :maxlength="32" :disabled="hiveId !== ''"/>
              </div>
              <div class="item-form">
                <label class="item-form-title"><span>*</span>数据库端口</label>
                <Input-number class="item-input right" :max="65535" :min="1"  v-model="hiveData.params.port" :disabled="hiveId !== ''"></Input-number>
              </div>
              <div class="item-form">
                <label class="item-form-title"><span>*</span>数据库名</label>
                <Input class="item-input right" v-model="hiveData.params.database" :disabled="hiveId !== ''"/>
              </div>
              <div class="item-form">
                <label class="item-form-title">用户名</label>
                <Input class="item-input right" v-model="hiveData.params.username"/>
              </div>
              <div class="item-form">
                <label class="item-form-title">密码</label>
                <Input class="item-input right" type="password" v-model="hiveData.params.password"/>
              </div>
            </div>
          </div>
          <div class="step-item hive-right">
            <div class="title">
              <!-- <span class="import">导入已有链接设置</span> -->
            </div>
            <div class="item-body">
              <div class="item-form">
                <label class="item-form-title">krb_user</label>
                <Input class="item-input right" v-model="hiveData.params.krb_user" :maxlength="32"/>
              </div>
              <div class="item-form">
                <label class="item-form-title">krb5_path</label>
                <Input class="item-input right" v-model="hiveData.params.krb5_path"/>
              </div>
              <div class="item-form">
                <label class="item-form-title">keytab_path</label>
                <Input class="item-input right" v-model="hiveData.params.keytab_path"/>
              </div>
              <!-- <div class="item-form">
                <label class="item-form-title">krb_path</label>
                <Input class="item-input right" type="password" v-model="hiveData.params.krb_path"/>
              </div>
              <div class="item-form">
                <label class="item-form-title">kerberos_jdbc_str</label>
                <Input class="item-input right" v-model="hiveData.params.kerberos_jdbc_str"/>
              </div> -->
            </div>
          </div>
        </div>
      </div>
      <div class="adm-step-mysql adm-step2 hive" v-show="currentStep === 1">
        <word-setting
         :datas="allWords"
         :dataSchema="hiveSchema"
         @finish="finishWordSetting"
         @close="closeWoSetting"
         v-model="wsModal" />
        <div class="table-list" v-if="!hiveId">
          <ul>
            <li @click="chooseTable(item,index)" v-for="(item,index) in hiveTables" :key="index" :class="{'active': item.active}">{{item.name}}</li>
          </ul>
        </div>
        <div class="step-body">
          <div class="item-body">
            <div class="item-form item-form1">
              <span>预览表格--{{tableName}}</span>
              <span @click="filedSetting"><i></i>字段设置</span>
            </div>
            <div class="item-form item-form2">

              <el-table :data="hiveSchema.data"
                  border
                  stripe
                  width="100%">
                <el-table-column
                  v-for="(item, index) in hiveSchema.fields"
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
              <RadioGroup v-model="hiveData2.params.is_timed_sync" class="item-input">
                <Radio :label="1">开启</Radio>
                <Radio :label="0">关闭</Radio>
              </RadioGroup>
            </div>
            <div class="item-form form-select" v-show="hiveData2.params.is_timed_sync">
              <label class="item-form-title">更新频率</label>
              <span class="per">每</span>
              <Input-number v-model="hiveData2.params.period" :min="1" :max="9999" class="item-input double"></Input-number>
              <el-select v-model="hiveData2.params.period_type" class="item-select double">
                <el-option v-for="(item, index) in CONSTANT.timeList" :value="item.value" :key="index" :label="item.label"></el-option>
              </el-select>
            </div>
            <div class="item-form form-select" v-show="hiveData2.params.is_timed_sync">
              <label class="item-form-title">增量更新字段</label>
              <el-select v-model="hiveData2.params.increment_field" class="item-select">
                <el-option v-for="(item, index) in chooseFields" :value="item.name" :key="index" :label="item.name"></el-option>
              </el-select>
              <label class="mark">(增量更新字段只支持索引字段)</label>
            </div>
            <div class="item-form form-select" v-show="hiveData2.params.is_timed_sync">
              <label class="item-form-title">增量类型</label>
              <RadioGroup v-model="hiveData2.params.increment_type" class="item-input">
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
        <el-button type="primary" @click="finishHive($event)" v-show="currentStep === 1">完成{{(hiveId) ? ('编辑') : ('创建')}}</el-button>
      </div>
    </div>
  </Modal>
</template>
<script>
export default {
  props: {
    value: Boolean,
    hiveId: String
  },
  data () {
    return {
      currentStep: 0,
      hiveList: {},
      sync_fields: [],
      hiveData: {
        type: 9,
        name: '',
        desc: '',
        params: {
          host: '',
          port: 10000,
          username: '',
          password: '',
          database: ''
        }
      },
      allWords: [],
      chooseFields: [],
      tableName: '',
      hiveSchema: {},
      wsModal: false,
      hiveTables: [],
      hiveData2: {
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
  beforeDestroy () {

  },
  methods: {
    close () {
      this.$emit('close')
    },
    closeWoSetting () {
      this.wsModal = false
    },
    changeStep (step) {
      if (this.hiveId) {
        this.currentStep = step
      } else {
        this.$message.error('新建不允许使用步骤条')
      }
    },
    chooseTable (item, currentIndex) {
      if (this.hiveId) return // 编辑
      this.hiveTables = this.hiveTables.map((item, index) => {
        return index === currentIndex ? { ...item, active: true } : { ...item, active: false }
      })
      this.getHiveTableSchema({
        tableName: item.name,
        type: 'add'
      })
    },
    search () {
      this.dmService.openDetail({
        id: this.hiveId
      }).then(res => {
        this.hiveList = res.data.data_source
        this.tableName = this.hiveList.table
        this.hiveData = {
          type: 9,
          name: this.hiveList.name,
          desc: this.hiveList.desc,
          params: {
            host: this.hiveList.host,
            port: this.hiveList.port,
            username: this.hiveList.username,
            password: this.hiveList.password,
            database: this.hiveList.database,
            table: this.hiveList.table
          }
        }
        if (this.hiveList.is_timed_sync) {
          this.hiveData2.params = {
            is_timed_sync: 1,
            period: this.hiveList.period,
            period_type: this.hiveList.period_type,
            increment_type: this.hiveList.increment_type,
            increment_field: this.hiveList.increment_field
          }
        }
        this.editData2 = {
          tb_id: res.data.table_id,
          type: 9,
          ds_id: this.hiveList.id
        }
      })
      this.getHiveTableSchema({
        id: this.hiveId,
        type: 'update'
      })
    },
    next () {
      if (this.currentStep === 0) {
        if (!this.hiveData.name) {
          this.$message.error('数据源名称不能为空')
          return null
        }

        if (!this.hiveData.params.host) {
          this.$message.error('数据库地址不能为空')
          return null
        }

        if (!this.hiveData.params.port) {
          this.$message.error('数据库端口不能为空')
          return null
        }

        if (!this.utils.portCheck(this.hiveData.params.port)) {
          this.$message.error('数据库端口不合法')
          return null
        }

        if (!this.hiveData.params.database) {
          this.$message.error('数据库名不能为空')
          return null
        }
        if (this.hiveId) {
          this.dmService.editApiData({
            ...this.hiveData,
            id: this.hiveList.id
          }).then(res => {
            if (res.status === 0) {
              this.currentStep = 1
            } else {
              this.$message.error(res.msg)
            }
          })
        } else {
          this.dmService.saveMsgTmpData(this.hiveData).then(res => {
            if (res.status === 0) {
              this.hiveData2.temp_id = res.data.temp_id
              this.getHiveTableList()
              this.currentStep = 1
            } else {
              this.$message.error(res.msg)
            }
          })
        }
      }
    },
    async getHiveTableList () {
      debugger
      let res = await this.dmService.getHiveTableList({
        redis_key: this.hiveData2.temp_id
      })
      if (res.status === 0) {
        this.hiveTables = res.data.map((item, index) => {
          return index === 0 ? { name: item, active: true } : { name: item, active: false }
        })
        debugger
        this.getHiveTableSchema({
          tableName: this.hiveTables[0].name,
          type: 'add'
        })
      } else {
        this.$message.error(res.msg)
      }
    },
    getHiveTableSchema (option) {
      let params
      if (option.type === 'add') {
        this.tableName = option.tableName
        params = {
          redis_key: this.hiveData2.temp_id,
          table_name: this.tableName
        }
      } else if (option.type === 'update') {
        params = { id: option.id }
      }
      this.dmService.getHiveTableSchema(params).then(res => {
        if (res.status === 0) {
          this.hiveSchema = res.data.schema
          this.chooseFields = this.hiveSchema.fields
          this.hiveSchema.fields.forEach(item => {
            this.allWords.push(item.name)
          })
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    prev () {
      this.currentStep--
    },
    finishHive () {
      const putData = {
        type: 9,
        temp_id: this.hiveData2.temp_id,
        params: {}
      }

      putData.params.table = this.tableName
      putData.params.sync_fields = (this.sync_fields.length > 0) ? (this.sync_fields) : (this.hiveSchema.fields)
      putData.params.sync_fields = putData.params.sync_fields.map(item => {
        return { name: item.name, type: item.sys_type }
      })

      if (this.hiveData2.params.is_timed_sync) {
        putData.params.is_timed_sync = true
        putData.params.period = this.hiveData2.params.period
        putData.params.period_type = this.hiveData2.params.period_type
        putData.params.increment_field = this.hiveData2.params.increment_field
        putData.params.increment_type = this.hiveData2.params.increment_type

        if (putData.params.period === null) {
          this.$message.error('请选择更新频率')
          return
        }
        if (!putData.params.increment_field) {
          this.$message.error('请选择更新字段')
          return
        }
      } else {
        putData.params.is_timed_sync = false
      }

      if (this.hiveId) {
        this.editData2.params = putData.params
        this.dmService.saveEditData(this.editData2).then(res => {
          if (res.status === 0) {
            // this.$router.push('/dm')
            this.$message.success('编辑数据源成功')
            this.$emit('refresh')
            setTimeout(() => {
              this.close()
            }, 300)
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
      // this.sync_fields = data.sync_fields
      this.sync_fields = data.fields
      this.chooseFields = data.fields

      let increment_field = this.hiveData2.params.increment_field
      if (increment_field) {
        let chooseNames = this.chooseFields.map(item => {
          return item.name
        })
        if (!chooseNames.includes(increment_field)) {
          this.hiveData2.params.increment_field = ''
        }
      }
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
        if (this.hiveId) {
          this.search()
        }
      }
    }
  }
}
</script>
