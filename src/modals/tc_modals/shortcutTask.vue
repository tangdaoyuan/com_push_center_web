<template>
  <Modal class="manage-modal task-manage short-manage" v-model="value" fullscreen>
    <choose-table-task
      v-model="ctModal"
      @chooseTable="chooseTableFn"
      @close="closeCtModal"
      :table-data="ctData"></choose-table-task>
    <task-filter
      v-model="taskFilterModal"
      :choose-index="chooseIndex"
      :filter-data="chooseFilter"
      :table-data="schemaData"
      :table-map="tableMap"
      @ok="addFilter"
      @close="closeTaskFilter" />
    <task-fav-user short-type="short" v-model="taskFavUserModal" @saveFav="saveFav"/>
    <div class="manage-header" slot="header">
      <Icon type="md-arrow-round-back" @click="back($event)"/>
      <span>新建快捷任务</span>
    </div>
    <div class="manage-body short-body">
      <div class="short-con">
        <div class="short-left">
          <div class="left-title">
            <span>选择模型</span>
          </div>
          <div class="left-con">
            <el-tree
              ref="treeList"
              node-key="id"
              :indent="8"
              :data="treeList"
              check-on-click-node
              :default-expanded-keys="chooseTag"
              auto-expand-parent
              highlight-current
              :default-checked-keys="chooseTag"
              @node-click="choose"
              :filter-node-method="filterNode"
              :render-content="renderContent">
            </el-tree>
          </div>
        </div>
        <div class="short-right">
          <div class="short-title">
            <div class="title-con">推送配置</div>
            <div class="title-setting">
              <Icon class="noti-icon on" title="消息提醒" type="ios-notifications" v-if="sValue" @click="sValue = !sValue" />
              <Icon class="noti-icon" title="消息免打扰" type="ios-notifications-off" v-if="!sValue" @click="sValue = !sValue" />
              <div @click="goTaskSet" class="title-link">高级设置</div>
            </div>
          </div>
          <div class="short-item-box">
            <div class="short-item">
              <div class="item-title">
                <span>数据表</span>
              </div>
              <div class="item-con">
                <RadioGroup @on-change="changeField" v-model="chooseTableItem">
                  <Radio v-for="item in ctData" :key="item.id" :label="item.id">{{item.name}}</Radio>
                </RadioGroup>
              </div>
            </div>
            <div class="short-item">
              <div class="item-title">
                <span>基本信息</span>
              </div>
              <div class="item-con">
                <div class="item-input-box">
                  <div class="input-box">
                    <label>推送名称</label>
                    <Input type="text" v-model="putData.task_name" :maxlength="16" />
                  </div>
                  <div class="input-box">
                    <label>推送分类</label>
                    <el-select v-model="putData.task_type">
                      <el-option v-for="item in typeList" :key="item.id" :value="item.id" :label="item.content"></el-option>
                    </el-select>
                  </div>
                </div>
                <div class="item-input-box">
                  <Input type="textarea" class="item-textarea" v-model="putData.task_describe" placeholder="请输入说明"></Input>
                  <label>最多支持200字输入</label>
                </div>
              </div>
            </div>
            <div class="short-item">
              <div class="item-title">
                <span>数据筛选</span>
              </div>
              <div class="item-con">
                <div class="btn-box" @click="addTableFilter($event)">
                  <Icon type="ios-add-circle-outline" />
                  <label>添加</label>
                </div>
                <div class="item-box title">
                  <label>满足下列</label>
                  <el-select v-model="filter_logic">
                    <el-option v-for="item in CONSTANT.tsFilterTypeList" :key="item.value" :value="item.value" :label="item.name"></el-option>
                  </el-select>
                </div>
                <div class="filter-con-body">
                  <div class="filter-item" v-for="(item, index) in filterList" :key="index">
                    <div class="title-box">
                      <span>{{(tableMap[item.field_id]) ? (tableMap[item.field_id].alias || tableMap[item.field_id].name) : ''}}</span>
                      <span v-show="item.op !== 'range'">{{utils.getTaskOp(item.op)}}</span>
                      <span v-show="item.op !== 'range'">{{item.value || ''}}</span>
                      <span v-show="item.op === 'range'">
                        <span v-if="item.value && item.value[0] && item.value[1]">
                          在{{utils.momentDate(item.value[0], 'date_time')}}~{{utils.momentDate(item.value[1], 'date_time')}}之间
                        </span>
                        <span v-else-if="item.value && item.value[0]">
                          从{{utils.momentDate(item.value[0], 'date_time')}}开始
                        </span>
                        <span v-else-if="item.value && item.value[1]">
                          在{{utils.momentDate(item.value[1], 'date_time')}}之前
                        </span>
                      </span>
                    </div>
                    <div class="op-box">
                      <i class="el-icon-edit" @click="editFilter(item, index)"></i>
                      <el-popover
                        placement="top"
                        width="160"
                        v-model="item.deleteModal">
                        <p>确定删除该条匹配规则么？</p>
                        <div style="text-align: right; margin: 0">
                          <el-button size="mini" type="text" @click="item.deleteModal = false">取消</el-button>
                          <el-button type="primary" size="mini" @click="deleteFilter(item, index)">确定</el-button>
                        </div>
                        <i slot="reference" class="el-icon-delete" @click="item.deleteModal = true"></i>
                      </el-popover>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="short-item">
              <div class="item-title">
                <span>推送目标</span>
              </div>
              <div class="item-con">
                <Tabs v-model="taskUserType">
                  <TabPane label="匹配推送" name="1" @click.native="taskUserType = '1'">
                    <div class="ppts-box">
                      <div class="item-box title">
                        <label>满足下列</label>
                        <el-select v-model="taskUserLogic">
                          <el-option v-for="item in CONSTANT.tsFilterTypeList" :key="item.value" :value="item.value" :label="item.name"></el-option>
                        </el-select>
                      </div>
                      <div class="item-box">
                        <div class="user-task-filter-box" v-for="(item, index) in userFilter" :key="index">
                          <el-cascader class="item-cas" separator="-" :options.sync="mapData" clearable filterable v-model="item.filter2"></el-cascader>
                          <span class="seq">等于</span>
                          <el-select v-model="item.filter1">
                            <el-option
                              v-for="n in schemaData.title_list"
                              :key="n.name"
                              :value="n.name"
                              :label="n.name">
                            </el-option>
                          </el-select>
                          <Icon class="op-icon" @click="addUserFilter(index)" type="ios-add-circle-outline" />
                          <Icon class="op-icon" @click="deleteUserFilter(index)" v-if="userFilter.length > 1" type="ios-remove-circle-outline" />
                        </div>
                      </div>
                    </div>
                  </TabPane>
                  <TabPane label="直接推送" name="2" @click.native="taskUserType = '2'">
                    <Tag color="primary" v-for="(item, index) in favUserList" :key="index" :name="item.name" closable @on-close="deleteFavUser(index)">{{item.name}}</Tag>
                    <Button icon="ios-add" type="dashed" size="small" @click="favUser()">直接推送</Button>
                  </TabPane>
                  <Switch />
                </Tabs>
              </div>
            </div>
            <div class="short-item">
              <div class="item-title">
                <span>推送通道</span>
              </div>
              <div class="item-con">
                <Tabs>
                  <TabPane v-for="(item, index) in tstdList" :key="index" :label="item.name" :value="item.id">
                    <div class="label-box">
                      <Tag v-for="(n, i) in schemaData.title_list" @click.native="chooseField(item, n, index)" :name="item.name" :key="i" color="primary">{{n.name}}</Tag>
                    </div>
                    <div class="con-box">
                      <span class="title">
                        编辑消息内容
                      </span>
                      <textarea class="at-box" ref="at_box" @change="changeText(item, index)" v-model="item.msgText" cols="30" rows="10"></textarea>
                      <label>最多支持200字输入</label>
                      <div class="item-box">
                        <span>定时推送</span>
                        <div class="ts-radio-box">
                          <el-radio-group v-model="item.period_type">
                            <el-radio v-for="n in CONSTANT.pushTypeList" :key="n.type" :label="n.type">{{n.name}}</el-radio>
                          </el-radio-group>
                        </div>
                      </div>
                      <div class="item-box">
                        <span>推送时段</span>
                        <div class="ts-sjd-box">
                          <div v-if="item.period_type == 1">
                            <el-radio-group v-model="item.period_list[0].period_time">
                              <el-radio label="current_time">及时推送</el-radio>
                              <el-radio label="work_day">工作日推送08：00 ~18：00</el-radio>
                            </el-radio-group>
                          </div>
                          <div v-if="item.period_type == 4">
                            <el-time-picker
                              is-range
                              v-model="item.period_list[0].period_time"
                              range-separator="至"
                              start-placeholder="开始时间"
                              end-placeholder="结束时间"
                              placeholder="选择时间范围" />
                          </div>
                          <div v-if="item.period_type == 5 || item.period_type == 7">
                            <el-radio-group v-model="item.period_list[0].period_time">
                              <el-radio label="work_day">工作日</el-radio>
                              <el-radio label="all">全部</el-radio>
                            </el-radio-group>
                          </div>
                          <div v-if="item.period_type == 6">
                            <el-select v-model="item.period_list[0].period_time">
                              <el-option v-for="n in CONSTANT.weekDayList" :key="n.value" :value="n.value" :label="n.name"></el-option>
                            </el-select>
                          </div>
                        </div>
                        <span v-if="item.period_type != 1">推送时间</span>
                        <div v-if="item.period_type != 1">
                          <el-time-picker v-model="item.period_list[0].time" placeholder="请选择时间"></el-time-picker>
                        </div>
                      </div>
                    </div>
                  </TabPane>
                </Tabs>
              </div>
            </div>
            <div class="short-item">
              <div class="item-title">
                <span>关键字段</span>
              </div>
              <div class="item-con">
                <Tag v-for="(item, index) in keyFieldList" :key="index" closable @on-close="deleteKeyField(index)" color="primary">{{item.name}}</Tag>
              </div>
            </div>
            <div class="short-item">
              <div class="item-title">
                <span>任务起止时间</span>
              </div>
              <div class="item-con">
                <el-date-picker type="datetimerange" start-placeholder="开始日期"
                  end-placeholder="结束日期" v-model="time_d"></el-date-picker>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="manage-footer" slot="footer">
      <el-button @click="close">取消</el-button>
      <el-button type="primary" @click="ok">确认</el-button>
    </div>
  </Modal>
</template>
<script>
export default {
  props: {
    value: Boolean,
    typeList: Array
  },
  data () {
    return {
      sValue: true,
      taskFilterModal: false,
      treeList: [],
      filter_logic: '',
      taskUserType: '1',
      chooseIndex: -1,
      chooseTag: [],
      mapData: [],
      putData: {
        task_type: '',
        task_name: '',
        task_describe: ''
      },
      chooseItem: null,
      ctModal: false,
      ctData: [],
      chooseTable: '',
      filter: '',
      filter1: '',
      tableMap: {},
      chooseTableItem: '',
      chooseFilter: {},
      schemaData: {
        title_list: []
      },
      filterList: [],
      userFilter: [
        {
          filter1: '',
          filter2: []
        }
      ],
      taskUserLogic: '',
      taskFavUserModal: false,
      favUserList: [],
      tstdList: [],
      keyFieldList: [],
      time_d: [],
      chooseTableName: ''
    }
  },
  created () {
    this.tcService.getTempList().then(res => {
      if (res.status === 0) {
        this.treeList = res.data
      }
    })
    this.tcService.getChannelsData().then(res => {
      if (res.status === 0) {
        this.tstdList = []
        Object.keys(res.data).forEach(key => {
          const tmp = res.data[key].map(item => {
            return {
              ...item,
              period_list: [
                {}
              ]
            }
          })
          this.tstdList = [...this.tstdList, ...tmp]
        })
      }
    })
  },
  watch: {
    value () {
      if (this.value) {
        if (!this.mapData || this.mapData.length === 0) {
          this.tcService.getTaskDict().then(res => {
            if (res.status === 0) {
              this.mapData = res.data
            }
          })
        }
      }
      if (!this.value) {
        Object.assign(this.$data, this.$options.data())
      }
    },
    schemaData () {
      if (this.schemaData && this.schemaData.fields) {
        const tmp = {}
        this.schemaData.fields.forEach(item => {
          tmp[item.name] = {
            ...item,
            id: item.name
          }
        })
        this.tableMap = tmp
      }
    }
  },
  methods: {
    close () {
      this.$emit('close')
    },
    closeCtModal () {
      this.ctModal = false
    },
    goTaskSet () {
      this.close()
      this.$emit('input')
      this.$emit('goTaskSet')
    },
    closeTaskFilter () {
      this.taskFilterModal = false
    },
    changeField (id) {
      this.ctData.forEach(item => {
        if (item.id === id) {
          this.chooseTableFn(item)
        }
      })
    },
    initAt (id) {
    },
    changeText (n, index) {
      n.msgText = window.$(this.$refs.at_box[index]).val()
    },
    chooseField (item, n, index) {
      const tmp = window.$(this.$refs.at_box[index]).val()
      if (this.keyFieldList.filter(a => a.name === n.name).length === 0) {
        this.keyFieldList.push(this.schemaData.title_map[n.name])
      }
      setTimeout(() => {
        window.$(this.$refs.at_box[index]).val(tmp + ` @${n.name} `)
        item.msgText = window.$(this.$refs.at_box[index]).val()
      }, 300)
    },
    deleteKeyField (index) {
      this.keyFieldList.splice(index, 1)
    },
    deleteFavUser (index) {
      this.favUserList.splice(index, 1)
    },
    saveFav (data) {
      this.favUserList = data
    },
    favUser () {
      this.taskFavUserModal = true
    },
    addUserFilter (index) {
      this.userFilter.splice(index + 1, 0, {
        filter1: '',
        filter2: []
      })
    },
    deleteUserFilter (index) {
      this.userFilter.splice(index, 1)
    },
    addTableFilter (e) {
      e.stopPropagation()
      this.chooseIndex = -1
      this.taskFilterModal = true
    },
    deleteFilter (item, index) {
      item.deleteModal = false
      this.filterList.splice(index, 1)
    },
    editFilter (item, index) {
      this.chooseFilter = item
      this.chooseIndex = index
      this.taskFilterModal = true
    },
    back (e) {
      e.stopPropagation()
      this.close()
    },
    addFilter (res) {
      if (res.chooseIndex > -1) {
        this.filterList.splice(res.chooseIndex, 1, {
          ...res,
          chooseIndex: undefined
        })
      } else {
        this.filterList = [...this.filterList, {
          ...res,
          chooseIndex: undefined
        }]
      }
    },
    chooseTableFn (item) {
      this.tcService.getTableSchema({
        table_id: item.id,
        table_name: item.name
      }).then(res => {
        if (res.status === 0) {
          this.schemaData = {
            ...res.data,
            title_list: res.data.fields.map(n => {
              return {
                ...n,
                id: n.name
              }
            }),
            title_map: (() => {
              const tmp = {}
              res.data.fields.forEach(item => {
                tmp[item.name] = item
              })
              return tmp
            })()
          }
          this.chooseTableItem = item.id
          this.chooseTableName = item.name
          this.$refs.at_box.forEach((n, index) => {
            window.$(n).suggest({
              '@': {
                data: this.schemaData.title_list,
                map: (item) => {
                  return {
                    text: item.name,
                    value: item.name
                  }
                },
                onselect: (e, item, callback) => {
                  const tmp = window.$(n).val()
                  if (this.schemaData.title_map[`${item.text}`]) {
                    if (this.keyFieldList.filter(n => n.name === item.text).length === 0) {
                      this.keyFieldList.push(this.schemaData.title_map[item.text])
                    }
                  }
                  setTimeout(() => {
                    window.$(n).val(tmp)
                  }, 300)
                }
              }
            })
          })
          this.reset(true)
        }
      })
    },
    choose (node) {
      if (!node.children) {
        if (this.chooseItem && node.model_id === this.chooseItem.model_id) {
        } else {
          this.tcService.getModelData({
            model_id: node.model_id
          }).then(res => {
            if (res.status === 0) {
              if (res.data && res.data.length > 0) {
                this.chooseTag = [node.id]
                this.ctData = res.data
                this.ctModal = true
              } else {
                this.$message.error('该模型没有数据表，请重新选择模型')
              }
            }
          })
        }
        this.chooseItem = node
      }
    },
    reset (check) {
      if (!check) {
        this.chooseTag = []
        this.chooseTableName = ''
        this.chooseTableItem = ''
        this.chooseItem = {
          model_name: '',
          model_id: ''
        }
      }
      this.putData = {
        task_type: '',
        task_name: '',
        task_describe: ''
      }
      this.filterList = []
      this.taskUserLogic = ''
      this.taskUserType = '1'
      this.userFilter = [
        {
          filter1: '',
          filter2: []
        }
      ]
      this.favUserList = []
      this.time_d = []
    },
    ok () {
      if (!this.chooseItem.model_id) {
        this.$message.error('请选择一个数据模型')
        return
      }
      if (!this.chooseTableItem) {
        this.$message.error('请选择一个数据表')
        return
      }
      if (!this.putData.task_name) {
        this.$message.error('任务名称不能为空')
        return
      }
      if (!this.putData.task_type) {
        this.$message.error('任务类型不能为空')
        return
      }
      const putData = {
        msg_notify: (this.sValue) ? 1 : 0,
        table_name: this.chooseTableName,
        table_id: this.chooseTableItem,
        model_name: this.chooseItem.model_name,
        model_id: this.chooseItem.model_id,
        redis_key: this.schemaData.redis_key,
        ...this.putData,
        filter_logic: this.filter_logic,
        filter_list: this.filterList.map(n => {
          return {
            ...n,
            field_name: n.field_id
          }
        }),
        task_users: {
          rule_logic: Number(this.taskUserLogic),
          push_rule_list: [
            {
              push_type: Number(this.taskUserType),
              push_target: (() => {
                let pushData = []
                console.log(this.userFilter)
                if (this.taskUserType === '1') {
                  pushData = this.userFilter.map(n => {
                    let tmp = {}
                    tmp[n.filter2[0]] = n.filter2[1]
                    return {
                      field_name: n.filter1,
                      target: tmp
                    }
                  })
                } else if (this.taskUserType === '2') {
                  const user_id_list = []
                  const group_id_list = []
                  this.favUserList.forEach(n => {
                    if (n.type === 3) {
                      user_id_list.push(n.id)
                    } else if (n.type === 1 || n.type === 2) {
                      group_id_list.push(n.id)
                    }
                  })
                  pushData = [
                    {
                      target: {
                        user_id_list: user_id_list,
                        group_id_list: group_id_list
                      }
                    }
                  ]
                }
                return pushData
              })()
            }
          ]
        },
        fast_push_channels: {
          push_start_time: this.time_d[0] ? this.time_d[0].getTime() : undefined,
          push_end_time: this.time_d[1] ? this.time_d[1].getTime() : undefined,
          channel_list: (() => {
            return this.tstdList.map(item => {
              return {
                channel_id_list: [item.id],
                period_type: item.period_type,
                tpl_type: item.tpl_type,
                type: item.type,
                msg: item.msgText,
                period_list: [
                  {
                    time: (typeof item.period_list[0].time === 'object') ? (this.utils.momentDate(item.period_list[0].time, 'time')) : (item.period_list[0].time),
                    period_time: (typeof item.period_list[0].period_time === 'object') ? (item.period_list[0].period_time.map(n => {
                      return this.utils.momentDate(n, 'time')
                    }).join(',')) : (item.period_list[0].period_time)
                  }
                ]
              }
            })
          })()
        },
        key_word: (() => {
          let tmp = ''
          this.keyFieldList.forEach(a => {
            tmp = `${tmp} ${a.name}`
          })
          return tmp
        })()
      }
      this.tcService.saveShortTask(putData).then(res => {
        if (res.status === 0) {
          this.$emit('refresh')
          this.reset()
          this.$message('添加成功')
          this.close()
        } else {
          this.$message.error(res.msg || '保存失败')
        }
      })
    },
    filterNode (value, data) {
      if (!value) return true
      if (data.name) {
        return data.name.indexOf(value) !== -1
      }
    },
    renderContent (h, { node, data, store }) {
      const spanRes1 = {
        'class': {
          'item-list': true,
          'selected': data.id === this.chooseTag[0]
        }
      }
      const innerSpan = [
        h('div', {
          'class': {
            'item-con': true
          }
        }, [
          h('i', {
            'class': {
              'folder': data.children,
              'file': !data.children
            }
          }),
          h('span', {
            attrs: {
              title: data.name
            },
            domProps: {
              innerHTML: data.name
            }
          })
        ])]

      return h('div', spanRes1, innerSpan)
    }
  }
}
</script>
