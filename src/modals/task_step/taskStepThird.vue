<template>
  <div class="step-body" v-show="step === 2 && (taskStep === CONSTANT.taskStep.NORMAL || taskStep === CONSTANT.taskStep.USER)">
    <div class="ts-field-step">
      <div class="ts-item item1">
        <div class="item-header">
          <span class="head-title">数据表字段</span>
        </div>
        <div class="item-body">
          <div class="item-b-header">
            <span>字段名称</span>
            <span>字段类型</span>
          </div>
          <draggable
            element="div"
            class="drag-main drag-mothoer"
            v-model="tbList"
            v-bind="dragOptions"
            @start="moveStart"
            @end="moveEnd">
            <transition-group name="no" tag="ul">
              <li v-for="(item, index) in tbList"
                :key="index"
                @mousemove="detailHover = index"
                @mouseout="detailHover = ''">
                <div class="drag-item">
                  <span class="drag-title">
                    {{item.alias || item.name}}
                  </span>
                  <span class="drag-type">
                    <i v-show="item.origin_type === 0" class="number-type"></i>
                    <i v-show="item.origin_type === 1" class="text-type"></i>
                    <i v-show="item.origin_type === 2" class="date-type"></i>
                    <span v-show="item.origin_type === 0">数值</span>
                    <span v-show="item.origin_type === 1">文本</span>
                    <span v-show="item.origin_type === 2">日期</span>
                  </span>
                </div>
              </li>
            </transition-group>
          </draggable>
        </div>
        <div class="item-footer">
          <Dropdown class="item-drop-footer" placement="top">
            <span class="ts-f-title">全部加入至</span>
            <Icon class="ts-f-icon" type="ios-arrow-forward" />
            <DropdownMenu slot="list" trigger="hover">
              <DropdownItem @click.native="pushAll($event, 1)">预警列表</DropdownItem>
              <DropdownItem @click.native="pushAll($event, 2)">筛选器</DropdownItem>
              <DropdownItem @click.native="pushAll($event, 3)">详情页面</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </div>
      <div class="ts-item item2">
        <div class="item-header">
          <span class="head-title">预警列表</span>
        </div>
        <div class="item-body">
          <draggable element="div"
            class="drag-main drag1"
            :class="{'empty-ul': tbList1 && !tbList1[0].id}"
            v-bind="putOptions"
            v-model="tbList1"
            @start="isDragging = true"
            @end="isDragging = false">
            <transition-group name="no" tag="ul">
              <li v-for="(item, index) in tbList1"
                :class="{'empty': !item.id}"
                :key="index"
                @mousemove="detailHover = index"
                @mouseout="detailHover = ''">
                <div class="drag-item push-order" v-show="item.id">
                  <span class="drag-title">
                    <i class="item-order"></i>
                    <span>{{item.alias || item.name}}</span>
                  </span>
                  <div class="drag-type">
                    <i :key="item.display_type"
                      v-if="iconShow"
                      :class="{
                        'item-icon': true,
                        'link-type': item.display_type === 2 && item.display_field_type === 1,
                        'link-type-text': item.display_type === 2 && item.display_field_type === 2,
                        'link-type-field': item.display_type === 2 && item.display_field_type === 3,
                        'img-type': item.display_type === 3 && item.display_field_type === 1,
                        'img-type-text': item.display_type === 3 && item.display_field_type === 2,
                        'img-type-field': item.display_type === 3 && item.display_field_type === 3
                      }"></i>
                    <i class="delet-btn" @click="deleteItem($event, index, 'tb1')"></i>
                    <el-dropdown trigger="hover">
                      <el-button>
                        <i class="drop-btn"></i>
                      </el-button>
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item @click.native="chooseTb1Type($event, item, 1, index, 1)">默认</el-dropdown-item>
                        <el-dropdown-item @click.native="chooseTb1Type($event, item, 2, index, 1)">作为链接</el-dropdown-item>
                        <el-dropdown-item @click.native="chooseTb1Type($event, item, 3, index, 1)">作为图片</el-dropdown-item>
                      </el-dropdown-menu>
                    </el-dropdown>
                  </div>
                </div>
                <div class="drag-empty" v-show="!item.id">
                  <span>请将字段拖拽到此</span>
                </div>
              </li>
            </transition-group>
          </draggable>
        </div>
        <div class="item-footer other-footer">
          <span class="ts-f-title" @click="removeAll($event , 1)">全部清空</span>
        </div>
      </div>
      <div class="ts-item item2">
        <div class="item-header">
          <span class="head-title">筛选器</span>
        </div>
        <div class="item-body">
          <draggable element="div"
            class="drag-main drag1"
            :class="{'empty-ul': tbList2 && !tbList2[0].id}"
            v-bind="putOptions"
            v-model="tbList2"
            @start="isDragging = true"
            @end="isDragging = false">
            <transition-group name="no" tag="ul">
              <li v-for="(item, index) in tbList2"
                :class="{'empty': !item.id}"
                :key="index"
                @mousemove="detailHover = index"
                @mouseout="detailHover = ''">
                <div class="drag-item push-order" v-show="item.id">
                  <span class="drag-title">
                    <i class="item-order"></i>
                    <span>{{item.alias || item.name}}</span>
                  </span>
                  <div class="drag-type">
                    <i :key="item.display_type"
                      v-if="iconShow"
                      :class="{
                      'item-icon': true,
                      'number-type': item.display_type === 5,
                      'text-type': item.display_type === 6,
                      'date-type': item.display_type === 7,
                      'dic-type': item.display_type === 8
                    }"></i>
                    <i class="delet-btn" @click="deleteItem($event, index, 'tb2')"></i>
                    <el-dropdown trigger="hover">
                      <el-button>
                        <i class="drop-btn"></i>
                      </el-button>
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item @click.native="chooseTb2Type($event, item, 5, index)">数字</el-dropdown-item>
                        <el-dropdown-item @click.native="chooseTb2Type($event, item, 6, index)">文本</el-dropdown-item>
                        <el-dropdown-item @click.native="chooseTb2Type($event, item, 7, index)">日期</el-dropdown-item>
                        <el-dropdown-item @click.native="chooseTb2Type($event, item, 8, index)">字典</el-dropdown-item>
                      </el-dropdown-menu>
                    </el-dropdown>
                  </div>
                </div>
                <div class="drag-empty" v-show="!item.id">
                  <span>请将字段拖拽到此</span>
                </div>
              </li>
            </transition-group>
          </draggable>
        </div>
        <div class="item-footer other-footer">
          <span class="ts-f-title" @click="removeAll($event , 2)">全部清空</span>
        </div>
      </div>
      <div class="ts-item item2">
        <div class="item-header">
          <span class="head-title">详情页面</span>
        </div>
        <div class="item-body">
          <draggable element="div"
            class="drag-main drag1"
            v-bind="putOptions"
            :class="{'empty-ul': tbList3 && !tbList3[0].id}"
            v-model="tbList3"
            @start="isDragging = true"
            @end="isDragging = false">
            <transition-group name="no" tag="ul">
              <li v-for="(item, index) in tbList3"
                :class="{'empty': !item.id}"
                :key="index"
                @mousemove="detailHover = index"
                @mouseout="detailHover = ''">
                <div class="drag-item push-order" v-show="item.id">
                  <span class="drag-title">
                    <i class="item-order"></i>
                    <span>{{item.alias || item.name}}</span>
                  </span>
                  <div class="drag-type">
                    <i :key="item.display_type"
                      v-if="iconShow"
                      :class="{
                        'item-icon': true,
                        'link-type': item.display_type === 2 && item.display_field_type === 1,
                        'link-type-text': item.display_type === 2 && item.display_field_type === 2,
                        'link-type-field': item.display_type === 2 && item.display_field_type === 3,
                        'img-type': item.display_type === 3 && item.display_field_type === 1,
                        'img-type-text': item.display_type === 3 && item.display_field_type === 2,
                        'img-type-field': item.display_type === 3 && item.display_field_type === 3,
                        'ent-type': item.display_type === 4
                      }"></i>
                    <i class="delet-btn" @click="deleteItem($event, index, 'tb3')"></i>
                    <el-dropdown trigger="hover">
                      <el-button>
                        <i class="drop-btn"></i>
                      </el-button>
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item @click.native="chooseTb1Type($event, item, 1, index, 3)">默认</el-dropdown-item>
                        <el-dropdown-item @click.native="chooseTb1Type($event, item, 2, index, 3)">作为链接</el-dropdown-item>
                        <el-dropdown-item @click.native="chooseTb1Type($event, item, 3, index, 3)">作为图片</el-dropdown-item>
                        <el-dropdown-item @click.native="chooseTb1Type($event, item, 4, index, 3)">作为实体</el-dropdown-item>
                      </el-dropdown-menu>
                    </el-dropdown>
                  </div>
                </div>
                <div class="drag-empty" v-show="!item.id">
                  <span>请将字段拖拽到此</span>
                </div>
              </li>
            </transition-group>
          </draggable>
        </div>
        <div class="item-footer other-footer">
          <span class="ts-f-title" @click="removeAll($event , 3)">全部清空</span>
        </div>
      </div>
    </div>
    <div class="step-footer">
      <el-button v-show="!$store.state.task.taskData" @click="prev()">上一步</el-button>
      <el-button type="primary" @click="next()">{{$store.state.task.taskData ? '完成修改' : '下一步'}}</el-button>
    </div>
    <set-field v-model="modals.setField" :table-list="tbList" @close="closeSetField" @finish="finishField"></set-field>
    <set-dict v-model="modals.setDict" :table-list="dtList" @close="closeSetDict" @finish="finishDict"></set-dict>
  </div>
</template>
<script>
export default {
  props: {
    step: Number,
    taskStep: Number
  },
  computed: {
    dragOptions () {
      return {
        animation: 0,
        group: { name: 'description', pull: 'clone', put: false },
        disabled: !this.editable,
        ghostClass: 'ghost'
      }
    },
    putOptions () {
      return {
        animation: 0,
        group: { name: 'description', pull: false, put: true },
        disabled: !this.editable,
        ghostClass: 'ghost'
      }
    }
  },
  data () {
    return {
      editable: true,
      detailHover: false,
      iconShow: true,
      modals: {
        setField: false,
        setDict: false
      },
      dtList: [],
      tbList: [],
      tbList1: [
        {
          name: '',
          id: ''
        }
      ],
      tbList2: [
        {
          name: '',
          id: ''
        }
      ],
      tbList3: [
        {
          name: '',
          id: ''
        }
      ],
      tbTemp1: [],
      tbTemp2: [],
      tbTemp3: []
    }
  },
  methods: {
    init () {
      this.dicService.getDicData({}).then(res => {
        if (res.status === 0) {
          this.dtList = res.data.list
        }
      })
      if (this.$store.state.task.tableData) {
        if (this.taskStep === this.CONSTANT.taskStep.USER) {
          let fieldList = []
          if (this.$store.getters.taskData) {
            fieldList = this.$store.getters.taskData.outputFields
          } else if (this.$store.getters.outputFields) {
            fieldList = this.$store.getters.outputFields
          }
          console.log(fieldList)
          this.tbList = fieldList.map(item => {
            return {
              ...item,
              id: item.id || item.field_id,
              name: item.name || item.field_name
            }
          })
          console.log(this.tbList)
        } else {
          this.tbList = this.$store.state.task.tableData.title_list
        }
        if (this.$store.state.task.taskData) {
          this.initEdit()
        }
      } else {
        if (this.$store.state.task.taskData) {
          this.wtService.getprewData({
            page_no: 1,
            page_size: 100,
            tb_id: this.$store.state.task.taskData.table_id
          }).then(res => {
            if (res.status === 0) {
              this.tableData = res.data
              this.$store.commit('setTaskTableData', res.data)
              this.tbList = this.tableData.title_list
              if (this.$store.state.task.taskData) {
                this.initEdit()
              }
            }
          })
        } else {
          this.$message.error('获取列表失败')
        }
      }
    },
    initEdit () {
      let tb1 = []
      let tb2 = []
      let tb3 = []
      this.$store.state.task.taskData.task_fields.alarm_fields.forEach(n => {
        tb1 = [...tb1, ...this.tbList.filter(item => n.field_id === item.id).map(item => {
          return {
            ...item,
            display_type: n.display_type,
            display_field_type: n.display_field_type,
            display_field_id: n.display_field_id,
            display_field_text: n.display_field_text
          }
        })]
      })
      this.$store.state.task.taskData.task_fields.filter_fields.forEach(n => {
        tb2 = [...tb2, ...this.tbList.filter(item => n.field_id === item.id)].map(item => {
          if (!n.display_type) {
            this.setTb2Type(item)
          } else {
            item.display_type = n.display_type
          }
          return {
            ...item,
            filter_dic_id: n.filter_dic_id
          }
        })
      })

      this.$store.state.task.taskData.task_fields.detail_fields.forEach(n => {
        tb3 = [...tb3, ...this.tbList.filter(item => n.field_id === item.id).map(item => {
          return {
            ...item,
            display_type: n.display_type,
            display_field_type: n.display_field_type,
            display_field_id: n.display_field_id,
            display_field_text: n.display_field_text
          }
        })]
      })
      this.tbList1 = (tb1.length > 0) ? tb1 : [{
        name: '',
        id: ''
      }]
      this.tbList2 = (tb2.length > 0) ? tb2 : [{
        name: '',
        id: ''
      }]
      this.tbList3 = (tb3.length > 0) ? tb3 : [{
        name: '',
        id: ''
      }]

      this.tbTemp1 = JSON.parse(JSON.stringify(this.tbList1))
      this.tbTemp2 = JSON.parse(JSON.stringify(this.tbList2))
      this.tbTemp3 = JSON.parse(JSON.stringify(this.tbList3))
    },
    moveStart (evt, data) {
      this.isDragging = true
      this.tbList.forEach(item => {
        item.display_type = undefined
      })
    },
    moveEnd (evt) {
      this.isDragging = false
      if (this.tbList1.length > 1) {
        this.tbList1.forEach((item, index) => {
          if (!item.id) {
            this.tbList1.splice(index, 1)
          }
          if (!item.display_type) {
            this.tbList1[index].display_type = 1
          }
        })
      }
      if (this.tbList2.length > 1) {
        this.tbList2.forEach((item, index) => {
          if (!item.id) {
            this.tbList2.splice(index, 1)
          }
        })
      }
      if (this.tbList3.length > 1) {
        this.tbList3.forEach((item, index) => {
          if (!item.id) {
            this.tbList3.splice(index, 1)
          }
          if (!item.display_type) {
            this.tbList3[index].display_type = 1
          }
        })
      }

      this.tbList1 = this.lodash.uniqBy(this.tbList1, 'id')
      this.tbList2 = this.lodash.uniqBy(this.tbList2, 'id')
      this.tbList3 = this.lodash.uniqBy(this.tbList3, 'id')

      this.tbList2 = [...this.tbList2.filter(item => {
        let has = false
        this.tbTemp2.forEach(n => {
          if (n.id === item.id) {
            has = true
            item.display_type = n.display_type
          }
        })
        if (!has) {
          this.setTb2Type(item)
        }
        return true
      })]

      this.tbTemp2 = JSON.parse(JSON.stringify(this.tbList2))
    },
    deleteItem (e, index, type) {
      switch (type) {
        case 'tb1':
          this.tbList1.splice(index, 1)
          if (this.tbList1.length === 0) {
            this.tbList1 = [
              {
                name: '',
                id: ''
              }
            ]
          }
          break
        case 'tb2':
          this.tbList2.splice(index, 1)
          if (this.tbList2.length === 0) {
            this.tbList2 = [
              {
                name: '',
                id: ''
              }
            ]
          }
          break
        case 'tb3':
          this.tbList3.splice(index, 1)
          if (this.tbList3.length === 0) {
            this.tbList3 = [
              {
                name: '',
                id: ''
              }
            ]
          }
          break
      }
    },
    removeAll (e, type) {
      e.stopPropagation()
      switch (type) {
        case 1:
          this.tbList1 = [
            {
              name: '',
              id: ''
            }
          ]
          break
        case 2:
          this.tbList2 = [
            {
              name: '',
              id: ''
            }
          ]
          break
        case 3:
          this.tbList3 = [
            {
              name: '',
              id: ''
            }
          ]
          break
      }
    },
    chooseTb2Type (e, item, type, index) {
      if (type === 8) {
        this.modals.setDict = true
        this.$store.commit('setDictConfig', {
          type: type,
          index: index,
          filter_dic_id: this.tbList2[index].filter_dic_id || ''
        })
      } else {
        this.iconShow = false
        setTimeout(() => {
          this.tbList2[index].display_type = type
          // this.tbList2[index].filter_dic_id = ''
          this.$nextTick(function () {
            this.iconShow = true
          })
        })
        this.tbTemp2 = JSON.parse(JSON.stringify(this.tbList2))
      }
    },
    chooseTb1Type (e, item, type, index, tb_type) {
      this.iconShow = false
      switch (type) {
        case 1:
          setTimeout(() => {
            this[`tbList${tb_type}`][index].display_type = type
            this.$nextTick(function () {
              this.iconShow = true
            })
          }, 300)
          this[`tbTemp${tb_type}`] = JSON.parse(JSON.stringify(this[`tbList${tb_type}`]))
          break
        case 2:
          this.$store.commit('setFieldConfig', {
            index: index,
            type: type,
            tb_type: tb_type
          })
          this.$store.commit('setFiledData', item)
          this.modals.setField = true
          this.$nextTick(function () {
            this.iconShow = true
          })
          break
        case 3:
          this.$store.commit('setFieldConfig', {
            index: index,
            type: type,
            tb_type: tb_type
          })
          this.$store.commit('setFiledData', item)
          this.modals.setField = true
          this.$nextTick(function () {
            this.iconShow = true
          })
          break
        case 4:
          setTimeout(() => {
            this[`tbList${tb_type}`][index].display_type = type
            this.$nextTick(function () {
              this.iconShow = true
            })
          }, 300)
          this[`tbTemp${tb_type}`] = JSON.parse(JSON.stringify(this[`tbList${tb_type}`]))
          break
        default:
          setTimeout(() => {
            this[`tbList${tb_type}`][index].display_type = 1
            this.$nextTick(function () {
              this.iconShow = true
            })
          }, 300)
          this[`tbTemp${tb_type}`] = JSON.parse(JSON.stringify(this[`tbList${tb_type}`]))
          break
      }
    },
    closeSetDict () {
      this.$store.commit('resetDictConfig')
      this.modals.setDict = false
    },
    closeSetField () {
      this.$store.commit('resetFieldData')
      this.modals.setField = false
    },
    finishDict (data) {
      const config = this.$store.state.task.dictConfig
      this.iconShow = false
      setTimeout(() => {
        this.tbList2[config.index].display_type = config.type
        this.tbList2[config.index].filter_dic_id = data.display_dict_id
        this.$nextTick(function () {
          this.iconShow = true
        })
      })
      this.tbTemp2 = JSON.parse(JSON.stringify(this.tbList2))
      this.$store.commit('resetDictConfig')
      this.modals.setDict = false
    },
    finishField (data) {
      const config = this.$store.state.task.fieldConfig
      this[`tbList${config.tb_type}`][config.index] = {
        ...this[`tbList${config.tb_type}`][config.index],
        ...data,
        display_type: config.type
      }
      this[`tbTemp${config.tb_type}`] = JSON.parse(JSON.stringify(this[`tbList${config.tb_type}`]))
      this.$store.commit('resetFieldData')
      this.modals.setField = false
    },
    pushAll (e, type) {
      this.$Spin.show()
      let tmp = []
      switch (type) {
        case 1:
          tmp = this.tbList.map(item => {
            let has = false
            let tmpItem = {}
            this.tbList1.forEach(n => {
              if (n.id === item.id) {
                tmpItem = n
                has = true
              }
            })
            if (has) {
              return {
                ...tmpItem
              }
            } else {
              return {
                ...item
              }
            }
          })
          this.tbList1 = JSON.parse(JSON.stringify(tmp))
          break
        case 2:
          tmp = this.tbList.map(item => {
            let has = false
            let tmpItem = {}
            this.tbList2.forEach(n => {
              if (n.id === item.id) {
                tmpItem = n
                has = true
              }
            })
            if (has) {
              return {
                ...tmpItem
              }
            } else {
              return {
                ...item,
                display_type: 0
              }
            }
          })
          this.tbList2 = JSON.parse(JSON.stringify(tmp))
          setTimeout(() => {
            this.tbList2.forEach(n => {
              if (n.display_type === 0) {
                this.setTb2Type(n)
              }
            })
          })
          break
        case 3:
          tmp = this.tbList.map(item => {
            let has = false
            let tmpItem = {}
            this.tbList3.forEach(n => {
              if (n.id === item.id) {
                tmpItem = n
                has = true
              }
            })
            if (has) {
              return {
                ...tmpItem
              }
            } else {
              return {
                ...item,
                display_type: 0
              }
            }
          })
          this.tbList3 = JSON.parse(JSON.stringify(tmp))
          break
      }
      setTimeout(() => {
        this.$Spin.hide()
      }, 300)
    },
    prev () {
      this.$emit('prev')
    },
    next () {
      const pushData = {
        task_id: this.$store.state.task.taskId,
        table_id: this.$store.state.task.table_id || (this.$store.state.task.taskData && this.$store.state.task.taskData.table_id),
        id: this.$store.state.task.taskData ? (this.$store.state.task.taskData.task_fields && this.$store.state.task.taskData.task_fields.id) : undefined,
        alarm_fields: [],
        filter_fields: [],
        detail_fields: []
      }

      this.tbList1.forEach(item => {
        if (item.id) {
          pushData.alarm_fields.push({
            field_id: item.id,
            display_type: item.display_type || 1,
            display_field_type: item.display_field_type || 1,
            display_field_text: item.display_field_text || undefined,
            display_field_id: item.display_field_id || undefined
          })
        }
      })
      this.tbList2.forEach((item, ind) => {
        const filter_dict_id = item.display_type === 8 ? item.filter_dic_id : ''

        if (item.id) {
          pushData.filter_fields.push({
            field_id: item.id,
            display_type: item.display_type || 1,
            filter_dic_id: filter_dict_id
          })
          this.tbList2[ind].filter_dic_id = filter_dict_id
        }
      })
      this.tbList3.forEach(item => {
        if (item.id) {
          pushData.detail_fields.push({
            field_id: item.id,
            display_type: item.display_type || 1,
            display_field_type: item.display_field_type || 1,
            display_field_text: item.display_field_text || undefined,
            display_field_id: item.display_field_id || undefined
          })
        }
      })
      const service = (this.$store.state.task.taskData) ? (this.tcService.editStep2Filter(pushData)) : (this.tcService.saveTask2Seting(pushData))
      service.then(res => {
        if (res.status === 0) {
          if (!this.$store.state.task.taskData) {
            this.$emit('next', 2)
          } else {
            this.$emit('refresh')
          }
        } else {
          this.$message.error(res.msg || '保存失败')
        }
      })
    },
    setTb2Type (item) {
      switch (item.origin_type) {
        case 1:
          item.display_type = 6
          break
        case 0:
          item.display_type = 5
          break
        case 2:
          item.display_type = 7
          break
        default:
          item.display_type = 6
          break
      }
    }
  },
  watch: {
    step () {
      if (this.step === 2 &&
        (this.taskStep === this.CONSTANT.taskStep.NORMAL ||
          this.taskStep === this.CONSTANT.taskStep.USER)) {
        this.init()
      } else if (this.step === -1) {
        Object.assign(this.$data, this.$options.data())
      }
    }
  }
}
</script>
