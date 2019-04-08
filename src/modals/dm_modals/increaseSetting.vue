<template>
  <Modal class="ct-modal-main" v-model="value">
    <div class="ct-header" slot="header">
      <span>增量设置</span>
      <Icon type="md-close" @click="close" />
    </div>
    <div class="is-body">
      <div class="item-form">
        <label class="item-form-title">选择字段</label>
        <el-select v-model="increase.field" placeholder="请选择" @change="increaseField">
          <el-option
            v-for="item in tableInfo.fields"
            :key="item.name"
            :value="item.name"
            :label="item.name">
          </el-option>
        </el-select>
        <span class="notes">可使用日期或数值字段，建议使用索引字段</span>
      </div>
      <div class="item-form">
        <label class="item-form-title">增量方式</label>
        <el-select v-model="increase.type" placeholder="请选择" :disabled="!increase.field">
          <el-option
            v-for="item in CONSTANT.increaseType"
            :disabled="item.disabled"
            :value="item.value"
            :key="item.value"
            :label="item.label">
          </el-option>
        </el-select>
      </div>
      <div class="item-detail" v-show="fieldType !== 'date' && increase.type === 'maximum'">
        <div class="detail-option">
          <input
            type="checkbox"
            :checked="(maximumStr.end.enable) ? 'checked' : ''"
            @click="(maximumStr.end.enable) ? (maximumStr.end.enable = false) : (maximumStr.end.enable = true)">
          <span>限制最大值不超过</span>
          <Input v-model="maximumStr.end.value" placeholder="请输入值" />
        </div>
        <div class="detail-option">
          <input
            type="checkbox"
            :checked="(maximumStr.start.enable) ? 'checked' : ''"
            @click="(maximumStr.start.enable) ? (maximumStr.start.enable = false) : (maximumStr.start.enable = true)">
          <span>下次同步从指定值开始</span>
          <el-select v-model="maximumStr.start.compare" placeholder="请选择">
            <el-option
              v-for="item in CONSTANT.compareType"
              :value="item.value"
              :key="item.value"
              :label="item.label">
            </el-option>
          </el-select>
          <Input v-model="maximumStr.start.value" placeholder="请输入值" />
        </div>
      </div>
      <div class="item-detail datemax" v-show="fieldType === 'date' && increase.type === 'maximum'">
        <div class="detail-option">
          <input
            type="checkbox"
            :checked="(maximumDate.end.enable) ? 'checked' : ''"
            @click="(maximumDate.end.enable) ? (maximumDate.end.enable = false) : (maximumDate.end.enable = true)">
          <span  class="tips">限制最大值不超过</span>
          <el-radio-group
            @change="(dataEndmode === 0) ? (maximumDate.end.mode = 'today') : (maximumDate.end.mode = 'relative')"
            v-model="dataEndmode">
            <el-radio :label=0>当前日期</el-radio>
            <el-radio :label=1>
              <el-select v-model="maximumDate.end.type" placeholder="请选择">
                <el-option
                  v-for="item in CONSTANT.dateType"
                  :value="item.value"
                  :key="item.value"
                  :disabled="maximumDate.end.mode !== 'relative'"
                  :label="item.label">
                </el-option>
              </el-select>
              <Input v-model="maximumDate.end.value" placeholder="请输入值" :disabled="maximumDate.end.mode !== 'relative'"></Input>天
            </el-radio>
          </el-radio-group>
        </div>
        <div class="detail-option">
          <input
            type="checkbox"
            :checked="(maximumDate.start.enable) ? 'checked' : ''"
            @click="(maximumDate.start.enable) ? (maximumDate.start.enable = false) : (maximumDate.start.enable = true)">
          <span class="tips">下次同步从指定值开始</span>
          <el-select v-model="maximumDate.start.compare" placeholder="请选择">
            <el-option
              v-for="item in CONSTANT.compareType"
              :value="item.value"
              :key="item.value"
              :label="item.label">
            </el-option>
          </el-select>
          <!-- <Input v-model="maximumStr.start.value" placeholder="请输入值"></Input> -->
          <el-date-picker
            v-model="maximumDate.start.value"
            type="datetime"
            @change="getTime"
            placeholder="选择日期时间">
          </el-date-picker>
        </div>
      </div>
      <div class="item-detail datemax" v-show="fieldType === 'date' && increase.type === 'relativetime'">
        <div class="detail-option">
          <span  class="tips">同步起始点</span>
          <el-radio-group
            @change="(relativeStartmode === 0) ? (relativetime.start.mode = 'today') : (relativetime.start.mode = 'relative')"
            v-model="relativeStartmode">
            <el-radio :label=0>当前日期</el-radio>
            <el-radio :label=1>
              <el-select v-model="relativetime.start.type" placeholder="请选择">
                <el-option
                  v-for="item in CONSTANT.dateType"
                  :value="item.value"
                  :key="item.value"
                  :disabled="relativetime.start.mode !== 'relative'"
                  :label="item.label">
                </el-option>
              </el-select>
              <Input v-model="relativetime.start.value" placeholder="请输入值" :disabled="relativetime.start.mode !== 'relative'"></Input>天
            </el-radio>
          </el-radio-group>
        </div>
        <div class="detail-option">
          <span class="tips">同步终止点</span>
          <el-radio-group
            @change="getEndmode"
            v-model="relativeEndmode">
            <el-radio :label=0>当前日期</el-radio>
            <el-radio :label=1>
              <el-select v-model="relativetime.end.type" placeholder="请选择">
                <el-option
                  v-for="item in CONSTANT.dateType"
                  :value="item.value"
                  :key="item.value"
                  :disabled="relativetime.end.mode !== 'relative'"
                  :label="item.label">
                </el-option>
              </el-select>
              <Input v-model="relativetime.end.value" placeholder="请输入值" :disabled="relativetime.end.mode !== 'relative'" />天
            </el-radio>
            <el-radio :label=2>不限制</el-radio>
          </el-radio-group>
        </div>
      </div>
    </div>
    <div slot="footer" class="ct-footer">
      <Button @click="save">确定</Button>
      <Button @click="close">取消</Button>
    </div>
  </Modal>
</template>
<script>
export default {
  props: {
    value: Boolean,
    tableInfo: Object,
    increaseData: Object
  },
  created () {
    this.getEndmode()
  },
  data () {
    return {
      dataEndmode: 0,
      relativeStartmode: 0,
      relativeEndmode: 0,
      fieldType: '',
      increase: {
        field: '',
        type: ''
      },
      maximumStr: {
        start: {
          compare: '',
          enable: false,
          value: ''
        },
        end: {
          enable: false,
          value: ''
        }
      },
      maximumDate: {
        start: {
          enable: false,
          compare: '>',
          value: '2018-11-22 00:00:00'
        },
        end: {
          enable: false,
          value: '1',
          type: 'before',
          mode: 'today'
        }
      },
      relativetime: {
        start: {
          mode: 'today',
          type: 'before',
          value: 1
        },
        end: {
          mode: 'today',
          type: 'before',
          value: 1
        }
      }
    }
  },
  watch: {
    value () {
      if (!this.value) {
        Object.assign(this.$data, this.$options.data())
      } else {
        if (this.increaseData !== {}) {
          if (this.increaseData.type === 'maximum') {
            if (this.increaseData.maximum.end.mode) {
              this.maximumDate = this.increaseData.maximum
            } else {
              this.maximumStr = this.increaseData.maximum
            }
          } else if (this.increaseData.type === 'relativetime') {
            this.relativetime = this.increaseData.relativetime
          }
          this.increase.field = this.increaseData.field
          this.increase.type = this.increaseData.type
        } else {
          this.increase = {
            field: '',
            type: ''
          }
        }
      }
    },
    tableInfo () {
      Object.assign(this.$data, this.$options.data())
    }
  },
  methods: {
    close () {
      this.$emit('close')
    },
    save () {
      if (this.increase.field !== '') {
        if (this.fieldType !== 'date' && this.increase.type === 'maximum') {
          this.increase.maximum = this.maximumStr
        } else if (this.fieldType === 'date' && this.increase.type === 'maximum') {
          if (this.maximumDate.end.mode === 'today') {
            this.maximumDate.end.value = '0'
            this.maximumDate.end.type = 'before'
          } else if ((this.maximumDate.end.mode === 'relative')) {
          }
          this.increase.maximum = this.maximumDate
        } else if (this.fieldType === 'date' && this.increase.type === 'relativetime') {
          if (this.relativetime.end.mode === 'today') {
            this.relativetime.end.value = '0'
            this.relativetime.end.type = 'before'
          } else if (this.relativetime.end.mode === 'unlimited') {
            this.relativetime.end.value = ''
            this.relativetime.end.type = 'before'
          } else if (this.relativetime.end.mode === 'relative') {
            this.relativetime.end.value = Number(this.relativetime.end.value)
          }
          if (this.relativetime.start.mode === 'today') {
            this.relativetime.start.value = '0'
            this.relativetime.start.type = 'before'
          } else if (this.relativetime.start.mode === 'relative') {
            this.relativetime.start.value = Number(this.relativetime.start.value)
          }
          this.increase.relativetime = this.relativetime
        }
        this.$emit('showIncreaseSetting', this.increase)
      }
      this.close()
    },
    getEndmode () {
      if (this.relativeEndmode === 0) {
        this.relativetime.end.mode = 'today'
      } else if (this.relativeEndmode === 1) {
        this.relativetime.end.mode = 'relative'
      } else if (this.relativeEndmode === 2) {
        this.relativetime.end.mode = 'unlimited'
      }
    },
    // 增量方式中的相对时间是否可点击
    increaseField () {
      this.tableInfo.fields.forEach(item => {
        if (item.name === this.increase.field) {
          this.fieldType = item.data_type
        }
      })
      if (this.fieldType === 'date') {
        this.CONSTANT.increaseType[1].disabled = false
        this.increase.type = 'maximum'
      }
      if (this.fieldType !== 'date') {
        this.CONSTANT.increaseType[1].disabled = true
      }
    },
    getTime () {
      this.maximumDate.start.value = this.utils.momentDate(this.maximumDate.start.value, 'date_time')
    }
  }
}
</script>
