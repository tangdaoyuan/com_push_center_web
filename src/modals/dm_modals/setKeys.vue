<template>
  <Modal class="ws-modal-main" v-model="value">
    <div class="ws-header" slot="header">
      <span>字段与主键设置</span>
      <Icon type="md-close" @click="close" />
    </div>
    <div class="ws-body">
      <span>备注预览与同步限制255字</span>
      <el-table
        stripe
        fit
        height="300"
        ref="schema_table"
        @selection-change="handleSelectionChange"
        :data.sync="schema.fields">
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column
          prop="name"
          label="字段名">
        </el-table-column>
        <el-table-column
          min-width="110"
          label="主键">
          <template slot-scope="scope">
            <el-checkbox v-model="scope.row.choose_key">
              <span>{{(!scope.row.choose_key) ? ('否') : ('自定义主键')}}</span>
            </el-checkbox>
          </template>
        </el-table-column>
        <el-table-column
          prop="data_type"
          label="字段类型">
        </el-table-column>
        <el-table-column
          min-width="170"
          label="日期字段格式">
          <template slot-scope="scope">
            <Input type="text" v-model="scope.row.format" placeholder="yyyy-MM-dd HH:mm:ss"/>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div slot="footer" class="ws-footer">
      <Button @click="save">保存</Button>
      <Button @click="close">取消</Button>
    </div>
  </Modal>
</template>
<script>
export default {
  props: {
    value: Boolean,
    tableInfo: Object
  },
  data () {
    return {
      multipleSelection: [],
      schema: {},
      input: '',
      setkeyData: {
        keys: [],
        fields: [],
        formatter: {}
        // field_type: {}
      }
    }
  },
  watch: {
    value () {
      if (this.value) {
        this.setkeyData = {
          keys: [],
          fields: [],
          formatter: {}
          // field_type: {}
        }
        this.schema = this.tableInfo
        setTimeout(() => {
          this.schema.fields.forEach((item, index) => {
            this.$refs.schema_table.toggleRowSelection(this.schema.fields[index], true)
          })
        })
      } else {
        Object.assign(this.$data, this.$options.data())
      }
    }
  },
  methods: {
    save () {
      this.schema.fields.forEach(item => {
        if (item.choose_key) {
          this.setkeyData.keys.push(item.name)
        }
      })
      if (this.$refs.schema_table.selection && this.$refs.schema_table.selection.length > 0) {
        this.$refs.schema_table.selection.forEach(item => {
          this.setkeyData.fields.push(item.name)
          // this.setkeyData.field_type[item.name] = item.data_type
          if (item.format) {
            this.setkeyData.formatter[item.name] = {
              type: item.data_type,
              fmt: item.format
            }
          }
        })
        this.$message.success('配置成功')
        this.$emit('finish', this.setkeyData)
        this.$emit('close')
      } else {
        this.$message.error('请设置字段与主键')
      }
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    close () {
      this.$emit('close')
      // this.save()
      this.$emit('finish', this.setkeyData)
    }
  }
}
</script>
