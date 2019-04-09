<template>
  <div class="step-body" v-show="step === 2">
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
            class="drag-main"
            v-model="tbList"
            v-bind="dragOptions"
            :move="onMove"
            @start="moveStart"
            @end="moveEnd">
            <transition-group name="no" tag="ul">
              <li v-for="(item, index) in tbList"
                :key="item.id"
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
            <DropdownMenu slot="list" trigger="click">
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
            :move="onMove"
            @start="isDragging = true"
            @end="isDragging = false">
            <transition-group name="no" tag="ul">
              <li v-for="(item, index) in tbList1"
                :class="{'empty': !item.id}"
                :key="item.id"
                @mousemove="detailHover = index"
                @mouseout="detailHover = ''">
                <div class="drag-item push-order" v-show="item.id">
                  <span class="drag-title">
                    <i class="item-order"></i>
                    <span>{{item.alias || item.name}}</span>
                  </span>
                  <div class="drag-type">
                    <i class="link-type" :ref="`tb1_link${index}`" v-show="item.display_type === 2"></i>
                    <i class="img-type" :ref="`tb1_img${index}`" v-show="item.display_type === 3"></i>

                    <i class="delet-btn" @click="deleteItem($event, index, 'tb1')"></i>
                    <el-dropdown trigger="click">
                      <el-button>
                        <i class="drop-btn"></i>
                      </el-button>
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item @click.native="chooseType($event, item, 1, index, 'tb1')">默认</el-dropdown-item>
                        <el-dropdown-item @click.native="chooseType($event, item, 2, index, 'tb1', `link`)">作为链接</el-dropdown-item>
                        <el-dropdown-item @click.native="chooseType($event, item, 3, index, 'tb1', `img`)">作为图片</el-dropdown-item>
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
            :move="onMove"
            @start="isDragging = true"
            @end="isDragging = false">
            <transition-group name="no" tag="ul">
              <li v-for="(item, index) in tbList2"
                :class="{'empty': !item.id}"
                :key="item.id"
                @mousemove="detailHover = index"
                @mouseout="detailHover = ''">
                <div class="drag-item push-order" v-show="item.id">
                  <span class="drag-title">
                    <i class="item-order"></i>
                    <span>{{item.alias || item.name}}</span>
                  </span>
                  <div class="drag-type">
                    <i class="link-type" :ref="`tb2_link${index}`" v-show="item.display_type === 2"></i>
                    <i class="img-type" :ref="`tb2_img${index}`" v-show="item.display_type === 3"></i>

                    <i class="delet-btn" @click="deleteItem($event, index, 'tb2')"></i>
                    <el-dropdown trigger="click">
                      <el-button>
                        <i class="drop-btn"></i>
                      </el-button>
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item @click.native="chooseType($event, item, 1, index, 'tb2')">默认</el-dropdown-item>
                        <el-dropdown-item @click.native="chooseType($event, item, 2, index, 'tb2', `link`)">作为链接</el-dropdown-item>
                        <el-dropdown-item @click.native="chooseType($event, item, 3, index, 'tb2', `img`)">作为图片</el-dropdown-item>
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
            :move="onMove"
            @start="isDragging = true"
            @end="isDragging = false">
            <transition-group name="no" tag="ul">
              <li v-for="(item, index) in tbList3"
                :class="{'empty': !item.id}"
                :key="item.id"
                @mousemove="detailHover = index"
                @mouseout="detailHover = ''">
                <div class="drag-item push-order" v-show="item.id">
                  <span class="drag-title">
                    <i class="item-order"></i>
                    <span>{{item.alias || item.name}}</span>
                  </span>
                  <div class="drag-type">
                    <i class="link-type" :ref="`tb3_link${index}`" v-show="item.display_type === 2"></i>
                    <i class="img-type" :ref="`tb3_img${index}`" v-show="item.display_type === 3"></i>

                    <i class="delet-btn" @click="deleteItem($event, index, 'tb3')"></i>
                    <el-dropdown trigger="click">
                      <el-button>
                        <i class="drop-btn"></i>
                      </el-button>
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item @click.native="chooseType($event, item, 1, index, 'tb3')">默认</el-dropdown-item>
                        <el-dropdown-item @click.native="chooseType($event, item, 2, index, 'tb3', `link`)">作为链接</el-dropdown-item>
                        <el-dropdown-item @click.native="chooseType($event, item, 3, index, 'tb3', `img`)">作为图片</el-dropdown-item>
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
  </div>
</template>
<script>
export default {
  props: {
    step: Number
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
      ]
    }
  },
  methods: {
    init () {
      if (this.$store.state.task.tableData) {
        this.tbList = this.$store.state.task.tableData.title_list
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
        tb1 = [...tb1, ...this.tbList.filter(item => n.field_id === item.id)]
      })
      this.$store.state.task.taskData.task_fields.filter_fields.forEach(n => {
        tb2 = [...tb2, ...this.tbList.filter(item => n.field_id === item.id)]
      })
      this.$store.state.task.taskData.task_fields.detail_fields.forEach(n => {
        tb3 = [...tb3, ...this.tbList.filter(item => n.field_id === item.id)]
      })
      this.tbList1 = [...tb1, ...(tb1.length === 0) ? ([{
        name: '',
        id: ''
      }]) : ([])]
      this.tbList2 = [...tb2, ...(tb2.length === 0) ? ([{
        name: '',
        id: ''
      }]) : ([])]
      this.tbList3 = [...tb3, ...(tb3.length === 0) ? ([{
        name: '',
        id: ''
      }]) : ([])]
    },
    moveStart (evt) {
      this.isDragging = true
    },
    moveEnd (evt, data) {
      this.isDragging = false
      if (this.tbList1.length > 1) {
        this.tbList1.forEach((item, index) => {
          if (!item.id) {
            this.tbList1.splice(index, 1)
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
        })
      }
      this.tbList1 = this.lodash.uniqBy(this.tbList1, 'id')
      this.tbList2 = this.lodash.uniqBy(this.tbList2, 'id')
      this.tbList3 = this.lodash.uniqBy(this.tbList3, 'id')
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
    chooseType (e, item, type, index, listType, refType) {
      switch (listType) {
        case 'tb1':
          this.tbList1[index].display_type = type
          break
        case 'tb2':
          this.tbList2[index].display_type = type
          break
        case 'tb3':
          this.tbList3[index].display_type = type
          break
      }
      this.$refs[`${listType}_link${index}`][0].style.display = 'none'
      this.$refs[`${listType}_img${index}`][0].style.display = 'none'
      if (refType) {
        this.$refs[`${listType}_${refType}${index}`][0].style.display = 'block'
      }
    },
    onMove (a, b) {
    },
    pushAll (e, type) {
      this.$Spin.show()
      switch (type) {
        case 1:
          this.tbList1 = this.utils.coppyArray(this.tbList)
          break
        case 2:
          this.tbList2 = this.utils.coppyArray(this.tbList)
          break
        case 3:
          this.tbList3 = this.utils.coppyArray(this.tbList)
          break
      }
      setTimeout(() => {
        this.$Spin.hide()
      }, 1000)
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
            display_type: item.display_type || 1
          })
        }
      })
      this.tbList2.forEach(item => {
        if (item.id) {
          pushData.filter_fields.push({
            field_id: item.id,
            display_type: item.display_type || 1
          })
        }
      })
      this.tbList3.forEach(item => {
        if (item.id) {
          pushData.detail_fields.push({
            field_id: item.id,
            display_type: item.display_type || 1
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
    }
  },
  watch: {
    step () {
      if (this.step === 2) {
        this.init()
      } else if (this.step === -1) {
        Object.assign(this.$data, this.$options.data())
      }
    }
  }
}
</script>
