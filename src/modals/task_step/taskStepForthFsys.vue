<template>
  <div class="step-body" v-show="step === 3 && (taskStep === CONSTANT.taskStep.DATABASE || taskStep === CONSTANT.taskStep.N_DATABASE)">
    <div class="flow-mapping-main">
      <div class="mapping-header">
        <span>映射配置</span>
      </div>
      <div class="mapping-con">
        <div class="header">
          <div class="row">
            <Checkbox  v-model="AllCheck" @on-change="checkAll" class="item">
              <span class="title">输出字段</span>
            </Checkbox>
            <span class="item"></span>
            <span class="item title">数据表目标字段</span>
          </div>
        </div>
        <div class="body">
          <div class="row" v-for="item in outputFields" :key="item.id">
            <Checkbox class="item" v-model="item.isChoose">
              <span class="field-name">{{item.alias || item.name}}</span>
            </Checkbox>
            <span class="equal">=</span>
            <el-select
              class="item"
              v-model="item.mappingName"
              >
              <el-option
                v-for="item in dbFields"
                :key="item.name"
                :value="item.name"
                :label="item.name">
              </el-option>
            </el-select>
          </div>
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
    step: Number,
    taskStep: Number
  },
  data () {
    return {
      AllCheck: true,
      outputFields: [],
      dbFields: []
    }
  },
  methods: {
    init () {
      let fieldList = []
      let fieldMapping = {}

      if (this.$store.getters.taskData) {
        const taskData = this.$store.getters.taskData
        if (this.taskStep === this.CONSTANT.taskStep.N_DATABASE) {
          fieldList = this.$store.state.task.tableData.title_list
        } else {
          fieldList = taskData.output_fields
        }
        fieldMapping = taskData.database.field_mapping
      } else if (this.$store.getters.outputFields) {
        if (this.taskStep === this.CONSTANT.taskStep.N_DATABASE) {
          fieldList = this.$store.state.task.tableData.title_list
        } else {
          fieldList = this.$store.getters.outputFields
        }
      }
      this.outputFields = fieldList.map(item => {
        const extraData = {
          id: item.id || item.field_id,
          name: item.name || item.field_name
        }

        return {
          ...item,
          ...extraData,
          mappingName: fieldMapping[`${extraData.id}`] || '',
          isChoose: !!fieldMapping[extraData.id]
        }
      })
      if (this.$store.getters.schemaFields.length > 0) {
        this.dbFields = this.$store.getters.schemaFields
      } else {
        this.tcService.getTaskSchema({
          id: this.$store.state.task.taskId
        }).then(res => {
          if (res.status === 0) {
            this.dbFields = res.data.schema.fields
          } else {
            this.$message.error('获取任务Schema列表失败')
          }
        })
      }
    },
    prev () {
      this.$emit('prev')
    },
    next () {
      let fieldMapping = {}
      let mappingNameList = []
      let formatMappingNameList = []
      for (let item of this.outputFields) {
        if (item.isChoose) {
          if (!item.mappingName) {
            this.$message.error('请选择数据表目标字段')
            return
          }
          fieldMapping[item.id] = item.mappingName
          mappingNameList.push(item.mappingName)
        }
      }
      formatMappingNameList = Array.from(new Set(mappingNameList))
      if (formatMappingNameList.length < mappingNameList.length) {
        this.$message.error('目标表字段不允许重复')
        return
      }

      const pushData = {
        task_id: this.$store.state.task.taskId,
        field_mapping: fieldMapping
      }
      const service = this.$store.state.task.taskData ? this.tcService.editstep4ByDB(pushData) : this.tcService.saveTask4SettingByDB(pushData)

      service.then(res => {
        if (res.status === 0) {
          this.$message.success('保存成功')
          this.$emit('finish')
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    checkAll (status) {
      this.outputFields.forEach(item => {
        item.isChoose = status
      })
    }
  },
  watch: {
    step () {
      if (this.step === 3 &&
        (this.taskStep === this.CONSTANT.taskStep.DATABASE ||
        this.taskStep === this.CONSTANT.taskStep.N_DATABASE)) {
        this.init()
      } else if (this.step === -1) {
        Object.assign(this.$data, this.$options.data())
      }
    }
  }
}
</script>
