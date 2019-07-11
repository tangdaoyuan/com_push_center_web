<template>
  <div class="step-body" v-show="step === 1 && taskStep <= CONSTANT.taskStep.API">
    <task-filter
      v-model="modals.taskFilterModal"
      :choose-index="chooseIndex"
      :filter-data="chooseFilter"
      :table-data="tableData"
      :table-map="tableMap"
      @ok="addFilter"
      @close="closeTaskFilter" />
    <div class="step-filter-body">
      <div class="ts-left ts-left-flow">
        <div class="ts-step-header">
          <span>选择流式数据表</span>
        </div>
        <div class="search-box">
          <input class="search-input" v-model="filterText" type="text" required>
          <Icon class="search-icon" type="md-search" />
        </div>
        <div class="left-body">
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
      <div class="ts-content-flow">
        <div class="step-filter" :class="{'hide-body': filterToogle}">
          <div class="filter-header">
            <span>{{sourceTbName || "请选择流式表"}}</span>
          </div>
          <div class="filter-body" :class="{'hide-body': filterToogle}">
            <Tabs size="small" v-model="tabName1">
              <TabPane label="条件筛选" name="conditionRule">
                <div class="filter-con-head">
                  <div class="filter-toa">
                    <label class="filter-title">满足下列</label>
                    <el-select class="filter-head-select" v-model="chooseFilterType">
                      <el-option v-for="item in CONSTANT.tsFilterTypeList" :key="item.value" :value="item.value" :label="item.name"></el-option>
                    </el-select>
                  </div>
                  <el-button class="filter-btn" icon="el-icon-plus" circle type="primary" @click="addTaskFilter()" />
                </div>
                <div class="filter-con-body">
                  <div class="filter-item" v-for="(item, index) in filterList" :key="index">
                    <div class="title-box">
                      <span>{{(tableMap[item.field_id]) ? (tableMap[item.field_id].alias || tableMap[item.field_id].name) : ''}}</span>
                      &nbsp;
                      <span v-show="item.op !== 'range'">{{utils.getTaskOp(item.op)}}</span>
                      &nbsp;
                      <span v-show="item.op !== 'range'">{{item.value || ''}}</span>
                      &nbsp;
                      <span v-show="item.op === 'range'">
                        <span v-if="item.value && item.value[0] && item.value[1]">
                          在{{utils.momentDate(new Date(item.value[0]).getTime(), 'date_time')}}~{{utils.momentDate(new Date(item.value[1]).getTime(), 'date_time')}}之间
                        </span>
                        <span v-else-if="item.value && item.value[0]">
                          从{{utils.momentDate(new Date(item.value[0]).getTime(), 'date_time')}}开始
                        </span>
                        <span v-else-if="item.value && item.value[1]">
                          在{{utils.momentDate(new Date(item.value[1]).getTime(), 'date_time')}}之前
                        </span>
                      </span>
                    </div>
                    <div class="op-box">
                      <span class="icon icon-edit" @click="editFilter(item, index)"></span>
                      <el-popover
                        placement="top"
                        width="160"
                        v-model="item.deleteModal">
                        <p>确定删除该条匹配规则么？</p>
                        <div style="text-align: right; margin: 0">
                          <el-button size="mini" type="text" @click="item.deleteModal = false">取消</el-button>
                          <el-button type="primary" size="mini" @click="deleteFilter(item, index)">确定</el-button>
                        </div>
                        <div slot="reference" class="icon icon-del" @click.native="item.deleteModal = true"></div>
                      </el-popover>
                    </div>
                  </div>
                </div>
              </TabPane>
              <TabPane label="字典翻译" name="dictionaryRule">
                <div class="dict-table-header">
                  <span @click="showFlowDictTable" class="table-selection">选择字典表</span>
                  <div v-for="(val, key, ind) in dictTableData" :key="ind"
                    v-show="key">
                    <el-popover
                        placement="bottom"
                        width="200"
                        v-model="val.visible">
                        <div class="btn-group">
                          <el-button type="primary" size="mini" @click="showSetTrans(key);val.visible = false">编辑</el-button>
                          <el-button type="primary" size="mini" @click="showFlowDataTable(CONSTANT.tableCategory.DICT, val);val.visible = false">预览</el-button>
                          <el-button type="danger" size="mini" @click="removeDictTable(key);val.visible = false">删除</el-button>
                        </div>
                        <div slot="reference" class="table-item">
                          <span @click.native="val.visible = true" class="item-title">{{ val.name }}</span>
                        </div>
                      </el-popover>
                  </div>
                </div>
                <div class="dict-table-body"></div>
              </TabPane>
            </Tabs>
          </div>
          <div class="seperator"></div>
        </div>
        <div class="step-table">
          <div class="table-header">
            <span @click="showFlowSelectTable" class="table-selection">选择纬度表</span>
            <div v-show="targetTableData.id" class="table-item">
              <span class="item-title">{{ targetTableData.name }}</span>
              <span @click="resetTargetTable" class="el-icon-close item-del"></span>
            </div>
            <span
              v-show="targetTableData.id"
              @click="showFlowDataTable(CONSTANT.tableCategory.DIM)"
              class="table-preview">
              数据预览
            </span>
          </div>
          <div v-show="true || sourceTbName" class="table-body">
            <Tabs size="small" v-model="tabName2">
              <TabPane label="条件碰撞" name="relevanceTab">
                <div class="table-panel">
                  <span class="source-table">{{sourceTbName || "请选择流式表"}}</span>
                  <span>&nbsp;</span>
                  <span class="target-table">{{targetTableData.name || "请选择纬度表"}}</span>
                  <span>&nbsp;</span>
                  <div v-for="(row, index) in relevanceRules"
                    :key="index"
                    class="select-box">
                    <el-select
                      class="select"
                      v-model="relevanceRules[index].origin_field_id">
                      <el-option
                        v-for="item in tableData.title_list"
                        :key="item.id"
                        :value="item.id"
                        :label="item.alias || item.name">
                      </el-option>
                    </el-select>
                    <span class="equal">等于</span>
                    <el-select
                      class="select"
                      v-model="relevanceRules[index].target_field_id">
                      <el-option
                        v-for="item in targetTableData.title_list"
                        :key="item.id"
                        :value="item.id"
                        :label="item.alias || item.name">
                      </el-option>
                    </el-select>
                    <div class="op-box">
                      <span @click="addRelRow(index)" class="el-icon-plus"></span>
                      <span v-show="relevanceRules.length > 1" @click="removeRelRow(index)" class="el-icon-minus"></span>
                    </div>
                  </div>
                </div>
              </TabPane>
              <TabPane label="数据筛选" name="filterTab">
                <div class="table-panel">
                  <div
                    v-for="(row, index) in targetTableData.filterList"
                    :key="index"
                    class="select-box">
                    <el-select
                      class="select"
                      v-model="targetTableData.filterList[index].field_id"
                      @change="changeField"
                      >
                      <el-option
                        v-for="item in targetTableData.title_list"
                        :key="item.id"
                        :value="item.id"
                        :label="item.alias || item.name">
                      </el-option>
                    </el-select>
                    <el-select
                      class="select"
                      placeholder="匹配条件"
                      v-show="targetTableData.filterList[index].field_id"
                      v-model="targetTableData.filterList[index].op">
                      <el-option
                        v-for="n in tsTypeListAll"
                        :key="n.value"
                        :value="n.value"
                        :label="n.name">
                      </el-option>
                    </el-select>
                    <el-input
                      v-show="targetTableData.filterList[index].op"
                      class="select"
                      v-model="targetTableData.filterList[index].value"
                      placeholder="请输入内容">
                    </el-input>
                    <div class="op-box">
                      <span @click="addFilRow(index)" class="el-icon-plus"></span>
                      <span v-show="targetTableData.filterList.length > 1" @click="removeFilRow(index)" class="el-icon-minus"></span>
                    </div>
                  </div>
                </div>
              </TabPane>
            </Tabs>
          </div>
        </div>
      </div>
      <div class="ts-right-flow">
        <div class="step-filter">
          <div class="filter-header">
            <span>输出字段</span>
            <span @click="addOutputField" class="el-icon-plus"></span>
          </div>
          <div class="filter-body">
            <div
              v-for="(item, index) in getOutputFields"
              :key="item.id"
              class="output-field">
              <span class="dot" :class="outputFieldDot(item.table_id)"></span>
              <span class="output-con">{{item.name || item.alias}}</span>
              <span @click="removeOutputField(index, item.table_id)" class="el-icon-close hide"></span>
            </div>
            <div
              v-for="(item) in getFlatDict"
              :key="item.id"
              class="output-field">
              <span class="dot" :class="outputFieldDot(item.table_id)"></span>
              <span class="output-con">{{ item.name || item.alias }}</span>
              <span @click="removeTransOutputField(item.id, item.table_id)" class="el-icon-close hide"></span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="step-footer">
      <el-button v-show="!$store.state.task.taskData" @click="prev()">上一步</el-button>
      <el-button type="primary" @click="next()">{{$store.state.task.taskData ? '完成修改' : '下一步'}}</el-button>
    </div>
    <set-trans
      v-model="modals.setTrans"
      @close="closeSetTrans"
      @ok="saveTransRules"
      :tableId="selectedDictTable.id"
      :table-title-list="tableData.title_list"
      :dict-title-list="selectedDictTable.title_list"
      :translate-rules="translateRules[selectedDictTable.id]"></set-trans>
    <flow-data-table
      v-model="modals.flowDataTable"
      @close="closeFlowDataTable"
      :table-id="dataTableTag.id"
      :table-name="dataTableTag.name"/>
    <flow-select-table
      v-model="modals.flowSelectTable"
      :category="CONSTANT.tableCategory.DIM"
      @ok="chooseTargetTable"
      @close="closeFlowSelectTable"/>
    <flow-select-table
      v-model="modals.flowDictTable"
      :category="CONSTANT.tableCategory.DICT"
      @ok="chooseDictTable"
      @close="closeFlowDictTable"/>
    <add-output-field
      v-model="modals.addFieldOutput"
      :source-list="tableData.title_list"
      :target-list="targetTableData.title_list"
      :selected-list="getSelectOutputFields()"
      @close="closeOutputField"
      @ok="chooseOutputField"/>
  </div>
</template>
<script>
export default {
  props: {
    step: Number,
    taskStep: Number
  },
  data () {
    return {
      tbId: undefined,
      tabName1: 'conditionRule',
      tabName2: 'relevanceTab',
      filterText: '',
      dataTableTag: {
        id: undefined,
        name: ''
      },
      modals: {
        flowDataTable: false,
        flowSelectTable: false,
        flowDictTable: false,
        taskFilterModal: false,
        addFieldOutput: false,
        setTrans: false
      },
      treeList: [],
      chooseTag: [],
      filterToogle: false,
      chooseFilterType: 1,
      chooseIndex: -1,
      sourceTbName: '',
      tableMap: {},
      tableData: {
        title_list: [],
        data_list: []
      },
      targetTableData: {
        id: undefined,
        name: '',
        filterLogic: 0,
        title_list: [],
        data_list: [],
        filterList: [
          {
            op: '',
            field_id: '',
            value: ''
          }
        ]
      },
      selectedDictTable: {
        id: undefined,
        name: '',
        title_list: []
      },
      dictTableData: {},
      chooseFilter: {},
      filterList: [],
      relevanceRules: [
        {
          origin_field_id: '',
          target_field_id: ''
        }
      ],
      translateRules: {},
      outputFields: {
        sources: [],
        targets: [],
        dictionaries: {}
      },
      tsTypeListAll: []
    }
  },
  methods: {
    init () {
      if (!this.treeList || this.treeList.length === 0) {
        this.wtService.getFolder().then(res => {
          if (res.status === 0) {
            this.treeList = res.data
          }
        })
      }
      if (this.$store.state.task.taskData) {
        const taskData = this.$store.state.task.taskData
        this.chooseTag = [taskData.table_id]
        this.sourceTbName = taskData.table_name
        this.chooseFilterType = taskData.filter_logic
        this.filterList = taskData.filter_list
        this.tbId = taskData.table_id
        this.tableData = {
          title_list: [],
          data_list: []
        }
        this.wtService.getprewData({
          page_no: 1,
          page_size: 100,
          tb_id: this.tbId
        }).then(res => {
          if (res.status === 0) {
            this.tableData = res.data
            this.$store.commit('setTaskTableData', res.data)
          }
        })

        if (taskData.stream_rules && taskData.stream_rules.length > 0) {
          const streamRule = taskData.stream_rules[0]
          this.targetTableData.id = streamRule.table_id
          this.targetTableData.name = streamRule.table_name

          if (streamRule.relevance_rules && streamRule.relevance_rules.length > 0) {
            this.relevanceRules = streamRule.relevance_rules
          }

          this.wtService.getprewData({
            page_no: 1,
            page_size: 100,
            tb_id: this.targetTableData.id
          }).then(res => {
            if (res.status === 0) {
              [
                this.targetTableData.title_list,
                this.targetTableData.data_list
              ] = [
                res.data.title_list,
                res.data.data_list
              ]
            }
          })
        }

        if (taskData.translate_rules && taskData.translate_rules.length > 0) {
          const translateRules = {}
          const dictTableData = {}
          taskData.translate_rules.forEach(rule => {
            if (!dictTableData[rule.table_id]) {
              [
                dictTableData[rule.table_id],
                dictTableData[rule.table_id]['id'],
                dictTableData[rule.table_id]['name']
              ] = [
                {},
                rule.table_id,
                rule.table_name
              ]
            }
            if (!translateRules[rule.table_id]) {
              translateRules[rule.table_id] = []
            }
            translateRules[rule.table_id].push({ ...rule })
          })

          this.translateRules = translateRules

          for (let key in dictTableData) {
            this.wtService.getprewData({
              page_no: 1,
              page_size: 100,
              tb_id: key
            }).then(res => {
              if (res.status === 0) {
                [
                  dictTableData[key].title_list,
                  dictTableData[key].data_list
                ] = [
                  res.data.title_list,
                  res.data.data_list
                ]
              }
            })
          }
          this.dictTableData = dictTableData
        }

        if (taskData.output_fields) {
          const sources = []
          const targets = []
          const dictionaries = []

          taskData.output_fields.forEach(item => {
            if (item.table_id === this.tbId) {
              sources.push({
                id: item.field_id,
                name: item.field_name,
                table_id: item.table_id
              })
            }
            if (item.table_id === this.targetTableData.id) {
              targets.push({
                id: item.field_id,
                name: item.field_name,
                table_id: item.table_id
              })
            }
          })

          for (let key in this.translateRules) {
            if (!dictionaries[key]) dictionaries[key] = []

            this.translateRules[key].map(item => {
              dictionaries[key].push({
                id: item.display_field_id,
                name: item.display_field_name,
                table_id: item.table_id
              })
            })
          }

          this.outputFields.sources = sources
          this.outputFields.targets = targets

          this.outputFields.dictionaries = dictionaries
        }
      }
    },
    changeField (fieldId) {
      let chooseField = this.targetTableData.title_list.find((item) => {
        return fieldId === item.id
      })
      this.tsTypeListAll = this.CONSTANT.tsTypeListAll[chooseField.origin_type]
    },
    showSetTrans (key) {
      this.selectedDictTable = this.dictTableData[key]
      this.showSetTransModal()
    },
    saveTransRules (rules, dicts, tableId) {
      this.translateRules[tableId] = rules
      this.$set(this.outputFields.dictionaries, tableId, dicts)
    },
    addRelRow (index) {
      this.relevanceRules.splice(index + 1, 0, this.$options.data().relevanceRules[0])
    },
    removeRelRow (index) {
      this.relevanceRules.splice(index, 1)
    },
    addFilRow (index) {
      this.targetTableData.filterList.splice(index + 1, 0, this.$options.data().targetTableData.filterList[0])
    },
    removeFilRow (index) {
      this.targetTableData.filterList.splice(index, 1)
    },
    chooseTargetTable (targetTableData) {
      if (targetTableData.id === this.tbId) {
        this.$message.error('维度表与工作表重复')
        return
      }
      this.resetTargetTable()
      this.resetRelevanceRules()
      this.targetTableData = {
        ...this.$options.data().targetTableData,
        ...targetTableData
      }
      this.outputFields.targets = [...targetTableData.title_list]
      this.closeFlowSelectTable()
    },
    chooseDictTable (dictTableData) {
      if (dictTableData.id === this.tbId) {
        this.$message.error('字典表与工作表重复')
        return
      }

      if (this.dictTableData[dictTableData.id]) {
        this.$message.error('字典表已经存在')
        return
      }

      this.dictTableData[dictTableData.id] = dictTableData
      this.closeFlowDictTable()
    },
    resetTargetTable () {
      Object.assign(this.targetTableData, this.$options.data().targetTableData)
      this.outputFields.targets = []
    },
    removeDictTable (table_id) {
      this.$delete(this.translateRules, table_id)
      this.$delete(this.dictTableData, table_id)
      this.$delete(this.outputFields.dictionaries, table_id)
    },
    addOutputField () {
      if (this.tableData.title_list.length ||
        this.targetTableData.title_list.length) {
        this.modals.addFieldOutput = true
      } else {
        this.$message.error('请选择流式表或维度表')
      }
    },
    chooseOutputField (selectedList) {
      let sources = []
      selectedList.forEach(item => {
        for (let obj of this.tableData.title_list) {
          if (obj.id && obj.id === item.id) sources.push({ ...obj })
        }
      })
      const targets = []
      selectedList.forEach(item => {
        for (let obj of this.targetTableData.title_list) {
          if (obj.id && obj.id === item.id) targets.push({ ...obj })
        }
      })
      const dictionaries = {}
      selectedList.forEach(item => {
        if (this.dictTableData[item.table_id]) {
          if (!dictionaries[item.table_id]) dictionaries[item.table_id] = []
          for (let obj of this.dictTableData[item.table_id].title_list) {
            if (obj.id && obj.id === item.id) dictionaries[item.table_id].push({ ...obj })
          }
        }
      })
      this.outputFields.sources = sources
      this.outputFields.targets = targets
      this.outputFields.dictionaries = dictionaries
      // sync translate rules
      this.closeOutputField()
    },
    removeOutputField (index, table_id) {
      const s_len = this.outputFields.sources.length
      const t_len = this.outputFields.targets.length
      if (index <= s_len - 1) {
        this.outputFields.sources.splice(index, 1)
      } else if (index <= s_len + t_len - 1) {
        this.outputFields.targets.splice(index - s_len, 1)
      }
    },
    removeTransOutputField (id, table_id) {
      this.$set(this.outputFields.dictionaries,
        table_id,
        this.outputFields.dictionaries[table_id].filter((item) => item.id !== id)
      )
      this.$set(this.translateRules,
        table_id,
        this.translateRules[table_id].filter((item) => item.display_field_id !== id)
      )
    },
    choose (node) {
      if (this.$store.state.task.taskData) {
        this.$message.warning('编辑过程中不允许更换数据表')
      } else {
        if (this.utils.getType(node.id) === 'field') {
          if (this.targetTableData.id === node.id) {
            this.$message.error('维度表与工作表重复')
            return
          }
          // todo  清空筛选数据
          this.resetRelevanceRules()
          this.sourceTbName = node.name
          this.chooseTag = [node.id]
          this.chooseItem = node
          this.tbId = node.id
          this.tableData = {
            title_list: [],
            data_list: []
          }
          this.wtService.getprewData({
            page_no: 1,
            page_size: 100,
            tb_id: node.id
          }).then(res => {
            if (res.status === 0) {
              this.tableData = res.data
              this.filterList = []
              this.outputFields.sources = [...res.data.title_list]
              this.$store.commit('setTableId', node.id)
              this.$store.commit('setTaskTableData', res.data)
            }
          })
        }
      }
    },
    resetRelevanceRules () {
      this.relevanceRules = [
        {
          origin_field_id: '',
          target_field_id: ''
        }
      ]
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
              'folder': this.utils.getType(data.id) === 'folder' || this.utils.getType(data.id) === 'ds',
              'file': this.utils.getType(data.id) === 'field',
              'file-ds': this.utils.getType(data.id) === 'field' && data.type === 1,
              'file-aggr': this.utils.getType(data.id) === 'field' && data.type === 2,
              'file-public': this.utils.getType(data.id) === 'field' && data.type === 3,
              'file-excel': this.utils.getType(data.id) === 'field' && data.type === 4,
              'file-oracle': this.utils.getType(data.id) === 'field' && (data.type === 5 || data.type === 8),
              'file-mysql': this.utils.getType(data.id) === 'field' && data.type === 6,
              'file-kafka': this.utils.getType(data.id) === 'field' && data.type === 7,
              'file-hive': this.utils.getType(data.id) === 'field' && data.type === 9,
              'file-datahub': this.utils.getType(data.id) === 'field' && data.type === 10,
              'file-set': this.utils.getType(data.id) === 'field' && data.type === 0
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
    },
    editFilter (item, index) {
      this.chooseFilter = item
      this.chooseIndex = index
      this.modals.taskFilterModal = true
    },
    addTaskFilter () {
      this.chooseIndex = -1
      this.modals.taskFilterModal = true
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
      this.closeTaskFilter()
    },
    deleteFilter (item, index) {
      item.deleteModal = false
      this.filterList.splice(index, 1)
    },
    prev () {
      this.$emit('prev')
    },
    next () {
      if (!this.tbId) {
        this.$message.error('请选择工作表!')
        return
      }
      if (!this.chooseFilterType && this.chooseFilterType !== 0) {
        this.$message.error('请配置全局条件')
        return
      }
      if (this.targetTableData.id) {
        if (!this.relevanceRules[0].origin_field_id || !this.relevanceRules[0].target_field_id) {
          this.$message.error('请选择条件碰撞规则!')
          return
        }
        this.saveOrEditSubmit()
      } else {
        this.$confirm('未选择纬度表，可能引起爆炸式推送或系统崩溃，确认继续？')
          .then(_ => {
            this.saveOrEditSubmit()
          })
      }
    },
    saveOrEditSubmit () {
      if (this.filterList && this.filterList.length > 0) {
        this.filterList = this.filterList.map(item => {
          return {
            ...item,
            deleteModal: undefined
          }
        })
      }

      const streamRules = []
      if (this.targetTableData.id) {
        streamRules.push({
          table_id: this.targetTableData.id,
          filter_logic: this.targetTableData.filterLogic,
          filter_list: this.utils.filterEmptyField(this.targetTableData.filterList),
          relevance_rules: this.utils.filterEmptyField(this.relevanceRules)
        })
      }

      const translateRules = []
      if (Object.keys(this.dictTableData).length) {
        Object.keys(this.translateRules)
          .forEach(key => {
            translateRules.push(
              ...this.utils.filterEmptyField(this.translateRules[key])
                .map(item => {
                  return {
                    ...item,
                    table_id: key
                  }
                })
            )
          })
      }

      const outputFields = []
      const storeOutputFields = []
      if (this.outputFields) {
        outputFields.push(...this.outputFields.sources.map(item => {
          storeOutputFields.push({ ...item })

          return {
            field_id: item.id,
            table_id: this.tbId,
            origin_type: 1
          }
        }))

        if (this.targetTableData.id) {
          outputFields.push(...this.outputFields.targets.map(item => {
            storeOutputFields.push({ ...item })

            return {
              field_id: item.id,
              table_id: this.targetTableData.id,
              origin_type: 1
            }
          }))
        }

        if (Object.keys(this.dictTableData).length) {
          Object.keys(this.outputFields.dictionaries)
            .forEach(key => {
              outputFields.push(
                ...this.outputFields.dictionaries[key].map(item => {
                  storeOutputFields.push({ ...item })

                  return {
                    field_id: item.id,
                    table_id: key,
                    origin_type: 1
                  }
                })
              )
            })
        }
      }

      const putData = {
        id: this.$store.state.task.taskId,
        table_id: this.tbId,
        filter_list: this.filterList,
        filter_logic: this.chooseFilterType,
        translate_rules: translateRules,
        stream_rules: streamRules,
        output_fields: outputFields
      }

      const service = this.$store.state.task.taskData ? this.tcService.editStep2(putData) : this.tcService.saveTask1Seting(putData)
      service.then(res => {
        if (res.status === 0) {
          this.$message.success('保存成功')
          this.$store.commit('setOutputFields', storeOutputFields)
          if (!this.$store.state.task.taskData) {
            this.$emit('next', 1)
          } else {
            this.$emit('refresh')
          }
        } else {
          this.$message.error(res.msg || '保存失败')
        }
      })
    },
    outputFieldDot (id) {
      if (this.dictTableData[id]) {
        return 'g-dot'
      }
      switch (id) {
        case this.targetTableData.id:
          return 'b-dot'
        case this.tbId:
          return 'y-dot'
      }
    },
    showFlowDataTable (tableCategory, obj) {
      if (tableCategory === this.CONSTANT.tableCategory.DIM) {
        [
          this.dataTableTag.id,
          this.dataTableTag.name
        ] = [
          this.targetTableData.id,
          this.targetTableData.name
        ]
      } else if (tableCategory === this.CONSTANT.tableCategory.DICT) {
        [
          this.dataTableTag.id,
          this.dataTableTag.name
        ] = [
          obj.id,
          obj.name
        ]
      }
      this.modals.flowDataTable = true
    },
    closeFlowDataTable () {
      this.modals.flowDataTable = false
    },
    showFlowSelectTable () {
      this.modals.flowSelectTable = true
    },
    showFlowDictTable () {
      this.modals.flowDictTable = true
    },
    showSetTransModal () {
      this.modals.setTrans = true
    },
    closeFlowSelectTable () {
      this.modals.flowSelectTable = false
    },
    closeFlowDictTable () {
      this.modals.flowDictTable = false
    },
    closeTaskFilter () {
      this.modals.taskFilterModal = false
    },
    closeOutputField () {
      this.modals.addFieldOutput = false
    },
    closeSetTrans () {
      this.modals.setTrans = false
    },
    getSelectOutputFields () {
      let list = []
      list = this.outputFields.sources
        .concat(this.outputFields.targets)

      for (let key in this.outputFields.dictionaries) {
        list = list.concat(this.outputFields.dictionaries[key])
      }

      return list
    }
  },
  computed: {
    getOutputFields () {
      return this.outputFields.sources
        .concat(this.outputFields.targets)
    },
    getFlatDict () {
      let list = []
      Object.keys(this.outputFields.dictionaries)
        .forEach(key => {
          list = list.concat(this.outputFields.dictionaries[key])
        })
      return list
    }
  },
  watch: {
    tableData () {
      if (this.tableData && this.tableData.title_list) {
        const tmp = {}
        this.tableData.title_list.forEach(item => {
          tmp[item.id] = item
        })
        this.tableMap = tmp
      }
    },
    filterText (val) {
      this.$refs.treeList.filter(val)
    },
    step () {
      if (this.step === 1) {
        this.init()
      } else if (this.step === -1) {
        Object.assign(this.$data, this.$options.data())
      }
    }
  }
}
</script>
