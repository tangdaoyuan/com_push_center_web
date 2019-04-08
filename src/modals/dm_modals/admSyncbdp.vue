<template>
  <Modal class="manage-modal task-manage" v-model="value" fullscreen>
    <set-keys
      v-model="skModal"
      @finish="finishSetkey"
      @close="closeSetKeys"
      :table-info="showTableInfo" />
    <choose-table v-model="ctModal"
      :tables="tables"
      :connect-id="bdpData3.params.connect_id"
      @saveBdptableData="saveBdptableData"
      @close="closeCtable" />
    <increase-setting
      v-model="synMode"
      @showIncreaseSetting="showIncreaseSetting"
      @close="closeIncSetting"
      :table-info="showTableInfo"
      :increase-data="increaseData" />
    <div class="manage-header" slot="header">
      <Icon type="md-arrow-round-back" @click="close"/>
      <span>{{(bdpId) ? ('编辑') : ('新增')}}同步客户端</span>
    </div>
    <div class="manage-body">
      <div class="step-box">
        <Steps :current="currentStep">
          <Step title="选择数据源" content=""  @click.native="changeStep(0)"></Step>
          <Step title="数据表设置" content="" @click.native="changeStep(1)"></Step>
          <Step title="同步设置" content="" @click.native="changeStep(2)"></Step>
        </Steps>
      </div>
      <div class="adm-step1 step3" v-show="currentStep === 0">
        <div class="step-body">
          <div class="step-item">
            <div class="item-body">
              <div class="item-form">
                <label class="item-form-title"><span>*</span>Hive地址</label>
                <Input class="item-input" v-model="bdpData1.server" />
              </div>
              <div class="item-form">
                <label class="item-form-title"><span>*</span>OPENDS token</label>
                <Input class="item-input" v-model="bdpData1.token" />
              </div>
            </div>
          </div>
          <div class="step-item attention">
            <div class="item-body">
              <div class="tips">
                <span class="tips-title">连接注意事项</span>
                <span>1.确保填入的token能访问到该hive</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="adm-step2 step3" v-show="currentStep === 1">
        <div class="step-body">
          <div class="table-list">
            <div class="list-title">
              <span class="title-word">数据表  <i v-show="tableInfo">已选{{tableInfo.length}}</i></span>
              <!-- <span class="title-pic" @click="ctModal = true" v-show="!tableInfo.name"></span> -->
              <span class="title-pic edit" @click="chooseTable" v-show="tableInfo"></span>
            </div>
            <div class="choosed">
              <ul >
                <li
                  v-for="(item, index) in tableInfo"
                  @click="showTable(index)"
                  :class="{'choose': index === choosed}"
                  :key="index">
                  <span>{{item.name}}</span>
                  <i class="el-icon-delete" @click="deleteTable($event, index)"></i>
                </li>
              </ul>
            </div>
          </div>
          <div class="table-settting" v-if="showTableInfo">
            <div class="item-set">
              <div class="set-header">
                <span>{{`预览表格-${showTableInfo.name || '请选择工作表'}`}}</span>
                <span class="set-keys" @click="skModal = true">字段与主键设置</span>
              </div>
              <div class="set-con">
                <el-table :data="showTableInfo.data_sample"
                  border
                  stripe
                  width="100%">
                  <el-table-column
                    v-for="(item, index) in showTableInfo.fields"
                    :key="index"
                    show-overflow-tooltip
                    min-width="120"
                    :label="item.name">
                    <template slot-scope="scope">
                      <span>{{scope.row[index]}}</span>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </div>
            <div class="item-set">
              <div class="set-header">
                <span>同步设置</span>
              </div>
              <div class="set-con">
                <div class="item-form">
                  <label class="item-form-title">同步方式</label>
                  <RadioGroup
                    class="item-input"
                    v-model="chooseParams.tables.increaseStatus"
                    @on-change="openIs(chooseParams.tables.increaseStatus)">
                    <Radio :label=0>全量</Radio>
                    <Radio :label=1>条件增量</Radio>
                  </RadioGroup>
                  <span class="notes">条件增量可使用自增ID或日期字段</span>
                </div>
                <div class="increase-wrap" v-show="chooseParams.tables.increaseStatus === 1 && increaseSetting.field">
                    <div class="content">
                      <div class="filed">{{increaseSetting.field}}增量</div>
                      <div class="increase-type-max"
                      v-show="increaseSetting.increaseType === 'maximum' &&
                        (increaseSetting.maxLimit || increaseSetting.nextStart)">
                        <span v-show="increaseSetting.maxLimit && !increaseSetting.nextStart">最大值限制不超过 {{increaseSetting.maxLimit}}</span>
                        <span v-show="increaseSetting.nextStart">下次同步从大于 {{increaseSetting.nextStart}} 开始</span>
                      </div>
                      <div class="increase-type-relative" v-show="increaseSetting.increaseType === 'relativetime'">
                        <span>同步范围 {{this.increaseSetting.synDuration}}</span>
                      </div>
                    </div>
                    <Button @click="openIs(chooseParams.tables.increaseStatus)">修改</Button>
                </div>
              </div>
            </div>
            <div class="item-set filter">
              <div class="set-header">
                <span>数据筛选</span>
              </div>
              <div class="set-con">
                <div class="item-form">
                  <label class="item-form-title">筛选方式</label>
                  <RadioGroup class="item-input" v-model="chooseParams.tables.filterStatus" >
                    <Radio :label="0">无</Radio>
                    <Radio :label="1">条件筛选</Radio>
                  </RadioGroup>
                </div>
                <div class="filter-detail" v-show="chooseParams.tables.filterStatus === 1">
                  <div class="filter-con-head" v-show="chooseParams.tables.filter.list.length > 1">
                    <label class="filter-title">满足下列</label>
                    <el-select class="filter-head-select" v-model="chooseParams.tables.filter.type">
                      <el-option v-for="item in CONSTANT.filterType" :key="item.value" :value="item.value" :label="item.label"></el-option>
                    </el-select>
                  </div>
                  <div class="filter-item" v-for="(item, index) in chooseParams.tables.filter.list" :key="index">
                    <div class="item-select-box">
                      <el-select v-model="item.name">
                        <el-option v-for="n in showTableInfo.fields" :key="n.id" :value="n.name" :label="n.name"></el-option>
                      </el-select>
                    </div>
                    <div class="item-sq-box">
                      <el-select v-model="item.type">
                        <el-option v-for="n in CONSTANT.filterTypeList" :key="n.value" :value="n.value" :label="n.name"></el-option>
                      </el-select>
                    </div>
                    <div class="item-select-box">
                      <Input type="text" v-model="item.value" placeholder="请输入" />
                    </div>
                    <div class="item-btn">
                      <Button class="item-btn-a" type="default" shape="circle" @click="addFilterItem($event, index)" icon="md-add"></Button>
                      <Button class="item-btn-a" type="default" shape="circle" @click="removeFilterItem($event, index)" v-show="chooseParams.tables.filter.list.length > 1" icon="md-remove"></Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="item-set">
              <div class="set-header">
                <span>高级设置</span>
              </div>
              <div class="set-con">
                <div class="item-form">
                  <label class="item-form-title">单次条数</label>
                  <span class="count">{{chooseParams.tables.rows}}</span>
                  <span>1000</span>
                  <el-slider v-model="chooseParams.tables.rows" class="item-slider" :min="1000" :max="50000"></el-slider>
                  <span>50000</span>
                </div>
                <div class="item-form">
                  <label class="item-form-title">按行去重</label>
                  <RadioGroup class="item-input" v-model="chooseParams.tables.dereplication">
                    <Radio :label=1>开启</Radio>
                    <Radio :label=0>关闭</Radio>
                  </RadioGroup>
                  <span class="notes">无主键时可按行去重，含主键时无效</span>
                </div>
                <div class="item-form">
                  <label class="item-form-title">覆盖同步</label>
                  <RadioGroup class="item-input" v-model="chooseParams.tables.clean">
                    <Radio :label=1>开启</Radio>
                    <Radio :label=0>关闭</Radio>
                  </RadioGroup>
                  <span class="notes">非增量时开启后每次都会先清空BDP中历史数据，有增量时无效</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="adm-step1 adm-step3 step3" v-show="currentStep === 2">
        <div class="step-body">
          <div class="step-item">
            <div class="item-body">
              <div class="item-form">
                <label class="item-form-title">数据源名</label>
                <Input class="item-input" v-model="bdpData3.name" :disabled="bdpId !== ''"/>
              </div>
              <div class="item-form">
                <label class="item-form-title">表备注同步</label>
                <RadioGroup v-model="bdpData3.params.table_comments" class="item-input">
                  <Radio :label=1>开启</Radio>
                  <Radio :label=0>关闭</Radio>
                </RadioGroup>
              </div>
              <div class="item-form">
                <label class="item-form-title">字段备注同步</label>
                <RadioGroup v-model="bdpData3.params.comments" class="item-input">
                  <Radio :label=1>开启</Radio>
                  <Radio :label=0>关闭</Radio>
                </RadioGroup>
              </div>
              <div class="item-form">
                <label class="item-form-title">定时同步</label>
                <RadioGroup v-model="timerSync" class="item-input">
                  <Radio :label=1>开启</Radio>
                  <Radio :label=0>关闭</Radio>
                </RadioGroup>
              </div>
              <div class="item-form" v-show="timerSync === 1">
                <label class="item-form-title">定时类型</label>
                <el-select class="item-select" v-model="timerType" filterable>
                  <el-option
                    v-for="item in timerTypeList"
                    :value="item.value"
                    :label="item.label"
                    :key="item.value">
                  </el-option>
                </el-select>
              </div>
              <!-- 定时同步-自定义 -->
              <div class="item-form-custom"  v-show="timerSync === 1 && timerType === 'origin'">
                <div class="item-form">
                  <label class="item-form-title">同步时间</label>
                  <ul>
                    <li v-for="(item, index) in customTimeArr.origin" :key="index" v-show="item.enable">
                      <div class="content">
                        <el-select class="item-select" @focus="hourList" v-model="item.hour" filterable>
                          <el-option
                            v-for="(item, index) in timehourList"
                            :value="item.value"
                            :label="item.label"
                            :key="index">
                          </el-option>
                        </el-select>
                        <span>时</span>
                        <el-select class="item-select" @focus="minuteList" v-model="item.minute" filterable>
                          <el-option
                            v-for="(item, index) in timeminuteList"
                            :value="item.value"
                            :label="item.label"
                            :key="index">
                          </el-option>
                        </el-select>
                        <span>分</span>
                      </div>
                      <div class="list-opt">
                        <i class="el-icon-plus" @click="addSyncTimeItem()" title="添加" v-show="index === 0"></i>
                        <i class="el-icon-minus" @click="minusSyncTimeItem(index)" title="删除" v-show="index !== 0"></i>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
              <div class="item-form-minute"  v-show="timerSync === 1 && timerType === 'minute'">
                <div class="item-form">
                  <label class="item-form-title">同步频次</label>
                  <div class="per">
                    <span>每</span>
                    <el-select class="item-select" @focus="singleminuteList" v-model="timerMinute.minute" filterable>
                      <el-option
                        v-for="(item, index) in singletimeList"
                        :value="item.value"
                        :label="item.label"
                        :key="index">
                      </el-option>
                    </el-select>
                    <span>分</span>
                  </div>
                </div>
              </div>
              <div class="item-form-crontab" v-show="timerSync === 1 && timerType === 'crontab'">
                <div class="item-form">
                  <label class="item-form-title">定时配置</label>
                  <Input type="text" class="item-select" v-model="timerCrontab.crontab" placeholder="0 1 * * *" :maxlength="16"/>
                </div>
                <div class="item-form">
                  <label class="item-form-title">提示</label>
                  <span class="item-select">分 时 日 月 周</span>
                </div>
              </div>
              <div class="item-form-delta"  v-show="timerSync === 1 && timerType === 'delta'">
                <div class="item-form">
                  <label class="item-form-title">间隔</label>
                  <RadioGroup v-model="timerDelta.delta" class="item-input">
                    <Radio :label="1">每一小时</Radio>
                    <Radio :label="2">每两小时</Radio>
                  </RadioGroup>
                </div>
                <div class="item-form">
                  <label class="item-form-title">起始时间</label>
                  <el-select class="item-select" @focus="hourList" v-model="timerDelta.start.hour" filterable>
                    <el-option
                      v-for="(item, index) in timehourList"
                      :value="item.value"
                      :label="item.label"
                      :key="index">
                    </el-option>
                  </el-select>
                  <span>时</span>
                  <el-select class="item-select" @focus="minuteList" v-model="timerDelta.start.minute" filterable>
                    <el-option
                      v-for="(item, index) in timeminuteList"
                      :value="item.value"
                      :label="item.label"
                      :key="index">
                    </el-option>
                  </el-select>
                  <span>分</span>
                </div>
                <div class="item-form">
                  <label class="item-form-title">结束时间</label>
                  <el-select class="item-select" @focus="hourList" v-model="timerDelta.end.hour" filterable>
                    <el-option
                      v-for="(item, index) in timehourList"
                      :value="item.value"
                      :label="item.label"
                      :key="index">
                    </el-option>
                  </el-select>
                  <span>时</span>
                  <el-select class="item-select" @focus="minuteList" v-model="timerDelta.end.minute" filterable>
                    <el-option
                      v-for="(item, index) in timeminuteList"
                      :value="item.value"
                      :label="item.label"
                      :key="index">
                    </el-option>
                  </el-select>
                  <span>分</span>
                </div>
              </div>
            </div>
          </div>
          <div class="step-item attention">
            <div class="item-body">
              <div class="tips">
                <span class="tips-title">同步设置注意事项</span>
                <span>1. 数据源名：数据源名是区分的唯一标识。</span>
                <span>2. 字段备注同步：开启后，字段备注将会同步到BDP。</span>
                <span>3. 表备注同步：开启后，表备注将会同步到BDP。</span>
                <span>4. 定时同步：开启后，将可以设置多个时间点来进行同步</span>
                <span>5. 同步时间：最多支持设置12个，时间间隔要大于1小时</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="manage-footer" slot=footer>
      <div class="step-footer">
        <el-button type="primary" @click="prev()" v-show="currentStep !== 0 && bdpId === ''">上一步</el-button>
        <el-button type="primary" @click="next()" v-show="currentStep !== 2">下一步</el-button>
        <el-button type="primary" @click="finishSync($event)" v-show="currentStep === 2">完成{{(bdpId) ? ('编辑') : ('并同步')}}</el-button>
      </div>
    </div>
  </Modal>
</template>
<script>
export default {
  props: {
    value: Boolean,
    bdpId: String
  },
  created () {
  },
  data () {
    return {
      ctModal: false,
      skModal: false,
      synMode: false,
      currentStep: 0,
      choosed: -1,
      ref: '',
      firstEdit: true,
      showTableInfo: {},
      bdpData1: {
        server: '172.16.190.197',
        token: '382ce68b54728eee956b159564d793cf',
        type: 'BDP'
      },
      paramsList2: {},
      bdpData3: {
        name: '',
        desc: '',
        type: 1,
        temp_id: '',
        params: {
          connect_id: '',
          collision: 0,
          comments: 0,
          table_comments: 0,
          timer: {}
        }
      },
      dataSource: {},
      tables: [],
      tableInfo: [],
      // increase字段做回显处理
      increaseData: {},
      increaseSetting: {
        field: '',
        increaseType: '',
        maxLimit: '',
        nextStart: '',
        synDuration: ''
      },
      timerSync: 0,
      timerType: '',
      timerCrontab: {
        type: 'crontab',
        crontab: '',
        enable: true
      },
      timerDelta: {
        type: 'delta',
        enable: true,
        delta: '2',
        start: {
          hour: '00',
          minute: '00'
        },
        end: {
          hour: '00',
          minute: '00'
        }
      },
      // 定时同步自定义时间
      customTimeArr: {
        type: 'origin',
        origin: [{
          enable: true,
          hour: '00',
          minute: '00'
        }],
        'enable': false
      },
      timerMinute: {
        type: 'minute',
        minute: '5',
        enable: true
      },
      timerTypeList: [
        {
          value: 'delta',
          label: '每小时'
        },
        {
          value: 'crontab',
          label: 'crontab'
        },
        {
          value: 'minute',
          label: 'minute'
        },
        {
          value: 'origin',
          label: '自定义'
        }
      ],
      chooseParams: {
        tables: {
          name: '',
          ref: '',
          type: 'normal',
          rows: 10000,
          filterStatus: 0,
          sql: '',
          filter: {
            type: 'and',
            list: [{
              type: '',
              value: '',
              name: ''
            }]
          },
          increaseStatus: 0,
          increase: {},
          dereplication: 1,
          clean: 0,
          keys: [],
          fields: [],
          formatter: {},
          auto_fields: 0,
          collision_config: {
            master_id: null,
            extra: {
              case_sensitive: 0
            },
            mapper: {},
            output: {}
          }
        },
        field_type: {}
      },
      paramsList: {
        tables: {
          name: '',
          ref: '',
          type: 'normal',
          rows: 10000,
          filterStatus: 0,
          sql: '',
          filter: {
            type: 'and',
            list: [{
              type: '',
              value: '',
              name: ''
            }]
          },
          increaseStatus: 0,
          increase: {},
          dereplication: 1,
          clean: 0,
          keys: [],
          fields: [],
          formatter: {},
          auto_fields: 0,
          collision_config: {
            master_id: null,
            extra: {
              case_sensitive: 0
            },
            mapper: {},
            output: {}
          }
        },
        field_type: {}
      },
      timehourList: [],
      singletimeList: [],
      timeminuteList: []
    }
  },
  methods: {
    close () {
      this.$emit('close')
    },
    closeSetKeys () {
      this.skModal = false
    },
    closeIncSetting () {
      this.synMode = false
    },
    closeCtable () {
      this.ctModal = false
    },
    changeStep (step) {
      if (this.bdpId) {
        if (step === 0) {
          this.$message.info('不允许修改数据源')
        } else {
          this.currentStep = step
        }
      } else {
        this.$message.info('新建不允许使用步骤条')
      }
    },
    search () {
      this.dmService.getMysqlSchema({
        id: this.bdpId
      }).then(res => {
        if (res.status === 0) {
          this.tableInfo = res.data.schema

          this.dmService.openDetail({
            id: this.bdpId
          }).then(res => {
            if (res.status === 0) {
              // 处理data3
              this.dataSource = res.data.data_source
              this.bdpData3.name = this.dataSource.name
              this.bdpData3.params.table_comments = this.dataSource.table_comments
              this.bdpData3.params.comments = this.dataSource.comments
              if (this.dataSource.timer && this.dataSource.timer.type) {
                this.timerSync = 1
                if (this.dataSource.timer.type === 'origin') {
                  this.timerType = 'origin'
                  this.customTimeArr.origin = this.dataSource.timer.origin
                } else if (this.dataSource.timer.type === 'minute') {
                  this.timerType = 'minute'
                  this.timerMinute.minute = this.dataSource.timer.minute
                } else if (this.dataSource.timer.type === 'crontab') {
                  this.timerType = 'crontab'
                  this.timerCrontab.crontab = this.dataSource.timer.crontab
                } else if (this.dataSource.timer.type === 'delta') {
                  this.timerType = 'delta'
                  this.timerDelta.delta = Number(this.dataSource.timer.delta)
                  this.timerDelta.start = this.dataSource.timer.start
                  this.timerDelta.end = this.dataSource.timer.end
                }
              } else {
                this.timerSync = 0
              }

              this.paramsList2 = {}
              this.tableInfo.forEach(item => {
                this.dataSource.tables.forEach(n => {
                  if (item.ref === n.ref) {
                    this.paramsList2[item.ref] = {
                      table_id: n.table_id,
                      tables: n,
                      field_type: {}
                    }
                  }
                })
              })
              Object.keys(this.paramsList2).forEach(k => {
                if (this.paramsList2[k].tables.filter) {
                  this.paramsList2[k].tables.filterStatus = 1
                } else {
                  this.paramsList2[k].tables.filter = {
                    type: 'and',
                    list: [{
                      type: '',
                      value: '',
                      name: ''
                    }]
                  }
                  this.paramsList2[k].tables.filterStatus = 0
                }
                if (this.paramsList2[k].tables.increase) {
                  this.paramsList2[k].tables.increaseStatus = 1
                } else {
                  this.paramsList2[k].tables.increase = {}
                  this.paramsList2[k].tables.increaseStatus = 0
                }
              })
              this.showTable(0)
              this.showIncrease()
            }
          })
        }
      })
    },
    showTable (index, type) {
      // if (type) {
      //   this.paramsList2[this.ref] = {
      //     ...this.chooseParams
      //   }
      // }
      this.choosed = index
      this.showTableInfo = this.tableInfo[index]
      this.ref = this.showTableInfo.ref
      this.chooseParams = this.paramsList2[this.ref]
      this.paramsList2[this.ref] = this.chooseParams
      this.showIncrease()
    },
    deleteTable (e, index) {
      e.stopPropagation()
      if (this.tableInfo.length === 1) {
        this.$message.info('至少要选择一张数据表')
      } else {
        this.ref = this.tableInfo[index].ref
        this.tableInfo.splice(index, 1)
        this.tables.splice(index, 1)
        delete this.paramsList2[this.ref]
        this.showTable(0)
      }
    },
    next () {
      if (this.currentStep === 0) {
        this.connectBdp()
      }
      if (this.currentStep === 1) {
        let params2 = {
          table_list: [],
          type: 1
        }
        console.log(this.paramsList2, this.tableInfo)
        Object.keys(this.paramsList2).forEach(k => {
          // 最后根据fields单独处理field_type
          let fieldList
          this.tableInfo.forEach(item => {
            if (k === item.ref) {
              fieldList = item
            }
          })
          if (!this.paramsList2[k].tables.fields || this.paramsList2[k].tables.fields.length === 0) {
            fieldList.fields.forEach(item => {
              this.paramsList2[k].tables.fields.push(item.name)
            })
          }
          this.paramsList2[k].tables.fields.forEach(item => {
            fieldList.fields.forEach(n => {
              if (n.name === item) {
                this.paramsList2[k].field_type[n.name] = n.data_type
              }
            })
          })
          params2.table_list.push(this.paramsList2[k])
        })
        this.chooseParams = {
          ...this.paramsList
        }
        params2.table_list.forEach(n => {
          let item = n.tables
          if (this.dataSource.tables && this.dataSource.tables.length > 0) {
            this.dataSource.tables.forEach(a => {
              if (a.ref === n.tables.ref) {
                n.table_id = a.table_id
              }
            })
          }
          if (item.filterStatus === 0) {
            item.filter = undefined
            item.sql = undefined
          } else {
            if (!item.filter.list[0].type && !item.filter.list[0].value && !item.filter.list[0].name) {
              item.filter = undefined
              item.sql = undefined
            }
          }
          if (item.increaseStatus === 0) {
            item.increase = undefined
          }
          delete item.filterStatus
          delete item.increaseStatus
        })

        if (this.bdpId) {
          this.dmService.editBdpTable({
            ...params2,
            ds_id: this.dataSource.id
          }).then(res => {
            if (res.status === 0) {
              this.currentStep = 2
            } else {
              this.$message.error(res.msg)
            }
          })
        } else {
          this.dmService.saveMsgTmpData(params2).then(res => {
            if (res.status === 0) {
              this.bdpData3.temp_id = res.data.temp_id
              this.currentStep = 2
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
    connectBdp () {
      this.dmService.connectBdp(this.bdpData1).then(res => {
        if (res.status === 0) {
          this.bdpData3.params.connect_id = res.data
          this.ctModal = true
        } else {
          this.$message.error('连接BDP失败')
        }
      })
    },
    finishSetkey (data) {
      Object.keys(data).forEach(key => {
        this.paramsList2[this.ref].tables[key] = data[key]
      })
    },
    openIs (status) {
      if (status === 1 || status === '1') {
        this.synMode = true
      }
    },
    chooseTable () {
      if (this.bdpId !== '') {
        if (!this.dataSource.connect_id) {
          this.connectBdp()
        } else {
          this.bdpData3.params.connect_id = this.dataSource.connect_id
        }
        // 此处自己处理所传弹窗的tables项
        if (this.firstEdit) {
          this.tableInfo.forEach(item => {
            this.tables.push({
              name: item.name,
              ref: item.ref,
              folder: [],
              table: []
            })
          })
        }
        this.firstEdit = false
        this.ctModal = true
      } else {
        this.ctModal = true
      }
    },
    // 显示条件增量设置的项
    showIncreaseSetting (increase) {
      this.paramsList2[this.ref].tables.increase = increase
      this.showIncrease()
    },
    addFilterItem (e, index) {
      e.stopPropagation()
      let flag = true
      this.chooseParams.tables.filter.list.forEach(item => {
        if (!(item.name && item.type && item.value)) {
          flag = false
        }
      })
      if (flag) {
        this.chooseParams.tables.filter.list.splice(index + 1, 0, {
          name: '',
          type: '',
          value: ''
        })
      } else {
        this.$message.error('筛选条件不能为空')
      }
    },
    removeFilterItem (e, index) {
      e.stopPropagation()
      this.chooseParams.tables.filter.list.splice(index, 1)
    },
    finishSync (e) {
      if (this.timerSync === 1 && this.timerType === 'minute') {
        this.bdpData3.params.timer = this.timerMinute
      } else if (this.timerSync === 1 && this.timerType === 'crontab') {
        this.bdpData3.params.timer = this.timerCrontab
      } else if (this.timerSync === 1 && this.timerType === 'delta') {
        this.timerDelta.delta = String(this.timerDelta.delta)
        this.bdpData3.params.timer = this.timerDelta
      } else if (this.timerSync === 1 && this.timerType === 'origin') {
        this.customTimeArr.enable = true
        this.customTimeArr.origin = this.customTimeArr.origin.filter((current) => {
          current.hour = parseInt(current.hour)
          current.minute = parseInt(current.minute)
          return current.enable === true
        })
        this.bdpData3.params.timer = this.customTimeArr
      }
      if (this.bdpId) {
        this.dmService.editBdpData({
          id: this.dataSource.id,
          name: this.bdpData3.name,
          comments: this.bdpData3.params.comments,
          table_comments: this.bdpData3.params.table_comments,
          timer: this.bdpData3.params.timer
        }).then(res => {
          if (res.status === 0) {
            this.$message.success('编辑数据源成功')
            this.$emit('refresh')
            this.close()
          } else {
            this.$message.error(res.msg)
          }
        })
      } else {
        this.dmService.saveApiData(this.bdpData3).then(res => {
          if (res.status === 0) {
            this.$router.push('/dm')
            this.$message.success('bdp同步客户端成功')
          } else {
            this.$message.error(res.msg)
          }
        })
      }
    },
    saveBdptableData (bdptableData, tables) {
      this.tables = tables
      this.tableInfo = bdptableData
      this.tableInfo.forEach(item => {
        // 此处对做paramsList2处理
        let flag = true
        Object.keys(this.paramsList2).forEach(k => {
          if (item.ref === k) {
            flag = false
          }
        })
        if (flag) {
          this.paramsList2[item.ref] = {
            ...this.paramsList,
            tables: {
              ...this.paramsList.tables,
              name: item.name,
              ref: item.ref,
              filter: {
                type: 'and',
                list: [{
                  type: '',
                  value: '',
                  name: ''
                }]
              }
            }
          }
        }
      })
      console.log(this.paramsList2)
      this.showTable(0)
      this.currentStep = 1
    },
    hourList () {
      if (this.timehourList.length < 2) {
        for (let i = 0; i < 24; i++) {
          if (i < 10) {
            i = '0' + i
          }
          this.timehourList.push({
            value: i,
            label: i
          })
        }
      }
    },
    minuteList () {
      if (this.timeminuteList.length < 2) {
        for (let i = 0; i < 60; i++) {
          if (i < 10) {
            i = '0' + i
          }
          this.timeminuteList.push({
            value: i,
            label: i
          })
        }
      }
    },
    singleminuteList () {
      if (this.singletimeList.length < 2) {
        for (let i = 0; i < 60; i++) {
          this.singletimeList.push({
            value: String(i),
            label: String(i)
          })
        }
      }
    },
    // 添加自定义时间
    addSyncTimeItem () {
      this.customTimeArr.origin.push({
        enable: true,
        hour: '00',
        minute: '00'
      })
    },
    // 删除自定义时间
    minusSyncTimeItem (index) {
      this.customTimeArr.origin[index].enable = false
    },
    showIncrease () {
      this.increaseData = this.paramsList2[this.ref].tables.increase
      if (Object.keys(this.increaseData).length !== 0) {
        this.increaseSetting.field = this.increaseData.field
        this.increaseSetting.increaseType = this.increaseData.type
        if (this.increaseData !== {}) {
          if (this.increaseData.type === 'maximum') {
            if (this.increaseData.maximum.end.mode) {
              let maximum1 = this.increaseData.maximum
              if (maximum1.end.mode === 'today') {
                if (maximum1.end.enable) {
                  this.increaseSetting.maxLimit = '当前日期'
                } else {
                  this.increaseSetting.maxLimit = ''
                }
              } else if ((maximum1.end.mode === 'relative')) {
                if (maximum1.end.type === 'after' && maximum1.end.value) {
                  this.increaseSetting.maxLimit = '后' + maximum1.end.value + '天'
                }
                if (maximum1.end.type === 'before' && maximum1.end.value) {
                  this.increaseSetting.maxLimit = '前' + maximum1.end.value + '天'
                }
              }
              if (maximum1.start.enable) {
                this.increaseSetting.nextStart = maximum1.start.value
              } else {
                this.increaseSetting.nextStart = ''
              }
            } else {
              let maximum2 = this.increaseData.maximum
              if (maximum2.end.enable) {
                this.increaseSetting.maxLimit = maximum2.end.value
              } else {
                this.increaseSetting.maxLimit = ''
              }
              if (maximum2.start.enable) {
                this.increaseSetting.nextStart = maximum2.start.value
              } else {
                this.increaseSetting.nextStart = ''
              }
            }
          } else if (this.increaseData.type === 'relativetime') {
            let relatime = this.increaseData.relativetime
            let synStart = ''
            let synEnd = ''
            if (relatime.end.mode === 'today') {
              synEnd = '当前日期'
            } else if (relatime.end.mode === 'unlimited') {
              synEnd = '不限制'
            } else if (relatime.end.mode === 'relative') {
              if (relatime.end.type === 'after') {
                synEnd = '后' + (relatime.end.value || 0) + '天'
              }
              if (relatime.end.type === 'before') {
                synEnd = '前' + (relatime.end.value || 0) + '天'
              }
            }
            if (relatime.start.mode === 'today') {
              synStart = '当前日期'
            } else if (relatime.start.mode === 'relative') {
              if (relatime.start.type === 'after') {
                synStart = '后' + (relatime.start.value || 0) + '天'
              }
              if (relatime.start.type === 'before') {
                synStart = '前' + relatime.start.value + '天'
              }
            }
            this.increaseSetting.synDuration = synStart + '-' + synEnd
          }
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
        if (this.bdpId) {
          this.search()
          this.currentStep = 1
        }
      }
    }
  }
}
</script>
