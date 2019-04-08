<template>
  <Modal class="tf-modal"
    v-model="value">
    <div class="tf-header" slot="header">
      <span>配置匹配规则</span>
      <Icon type="md-close" @click="close" />
    </div>
    <div class="modal-body">
      <div class="item-select-box">
        <label>匹配字段</label>
        <el-select v-model="filter.field_id" @change="changeField">
          <el-option
            v-for="n in tableData.title_list"
            :key="n.id"
            :value="n.id"
            :label="n.alias || n.name">
          </el-option>
        </el-select>
      </div>
      <div class="item-select-filter" v-if="filter.field_id && tableMap[filter.field_id]">
        <div class="item-sq-box">
          <label>匹配条件</label>
          <el-select v-model="filter.op">
            <el-option
              v-for="n in CONSTANT.tsTypeListAll[tableMap[filter.field_id].origin_type]"
              :key="n.value"
              :value="n.value"
              :label="n.atrls || n.name">
            </el-option>
          </el-select>
        </div>
        <div class="item-select-box"
          v-show="filter.op && filter.op !== 'nn' && filter.op !== 'en'">
          <label>匹配值</label>
          <Input
            class="filter-input"
            type="text"
            v-model="filter.value"
            placeholder="请输入"
            v-show="tableMap[filter.field_id] && tableMap[filter.field_id].origin_type !== 2" />
          <div class="date-box">
            <el-date-picker
              v-model="filter.start"
              v-show="tableMap[filter.field_id] && tableMap[filter.field_id].origin_type === 2"
              type="datetime"
              placeholder="选择开始日期时间" />
            <el-date-picker
              v-model="filter.end"
              v-show="tableMap[filter.field_id] && tableMap[filter.field_id].origin_type === 2"
              type="datetime"
              placeholder="选择结束日期时间" />
          </div>
        </div>
      </div>
    </div>
    <div class="modal-footer" slot="footer">
      <el-button type="text" @click="ok">确定</el-button>
      <el-button type="text" @click="close">取消</el-button>
    </div>
  </Modal>
</template>
<script>
export default {
  props: {
    value: Boolean,
    tableData: Object,
    tableMap: Object,
    filterData: Object,
    chooseIndex: Number
  },
  data () {
    return {
      filter: {
        field_id: '',
        op: '',
        value: '',
        start: '',
        end: ''
      }
    }
  },
  methods: {
    close () {
      this.$emit('close')
    },
    changeField () {
      this.filter = {
        ...this.filter,
        op: '',
        value: '',
        start: '',
        end: ''
      }
    },
    ok () {
      if (this.filter.field_id) {
        if (this.filter.op) {
          if (this.filter.op === 'nn' || this.filter.op === 'en') {
            const {
              field_id,
              op
            } = this.filter
            this.$emit('close')
            this.$emit('ok', {
              field_id,
              op,
              value: '',
              chooseIndex: this.chooseIndex
            })
          } else if (this.filter.op === 'range') {
            if (!this.filter.start && !this.filter.end) {
              this.$message.error('请选择匹配值')
            } else {
              const {
                field_id,
                op,
                value
              } = {
                ...this.filter,
                value: [
                  (this.filter.start) ? (this.filter.start.getTime()) : (0),
                  (this.filter.end) ? (this.filter.end.getTime()) : (0)
                ]
              }
              this.$emit('ok', {
                field_id,
                op,
                value,
                chooseIndex: this.chooseIndex
              })
              this.$emit('close')
            }
          } else {
            if (!this.filter.value) {
              this.$message.error('匹配值不能为空')
            } else {
              const {
                field_id,
                op,
                value
              } = this.filter
              this.$emit('close')
              this.$emit('ok', {
                field_id,
                op,
                value,
                chooseIndex: this.chooseIndex
              })
            }
          }
        } else {
          this.$message.error('匹配条件不能为空')
        }
      } else {
        this.$message.error('请选择字段')
      }
    }
  },
  watch: {
    value () {
      if (!this.value) {
        if (this.chooseIndex > -1) {} else {
          Object.assign(this.$data, this.$options.data())
        }
        this.$emit('input')
      }
    },
    tableData () {
      this.filter = {
        field_id: '',
        op: '',
        value: '',
        start: '',
        end: ''
      }
    },
    filterData () {
      if (!this.filterData) {
        this.filter = {
          field_id: '',
          op: '',
          value: '',
          start: '',
          end: ''
        }
      } else {
        if (this.filterData.op === 'range') {
          this.filter = {
            ...this.filter,
            ...this.filterData,
            start: (this.filterData.value[0]) ? (new Date(this.filterData.value[0])) : (''),
            end: (this.filterData.value[1]) ? (new Date(this.filterData.value[1])) : (''),
            value: '',
            deleteModal: undefined
          }
        } else {
          this.filter = {
            ...this.filter,
            ...this.filterData,
            deleteModal: undefined
          }
        }
      }
    }
  }
}
</script>
