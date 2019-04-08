<template>
  <Modal class="ws-modal-main" v-model="value">
    <div class="ws-header" slot="header">
      <span>字段设置</span>
      <Icon type="md-close" @click="close" />
    </div>
    <div class="ws-body">
      <span>备注预览与同步限制255字</span>
      <el-table
        stripe
        height="300"
        ref="schema_table"
        @selection-change="handleSelectionChange"
        :data.sync="dataSchema.fields">
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column
          prop="name"
          label="字段名">
        </el-table-column>
        <el-table-column
          width="100"
          label="是否索引">
          <template slot-scope="scope">
            <span>{{(scope.row.has_index) ? ('是') : ('否')}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="sql_type"
          label="数据库中字段类型">
        </el-table-column>
        <el-table-column
          label="系统中字段类型">
          <template slot-scope="scope">
            <span>{{utils.getFieldType(scope.row.sys_type)}}</span>
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
    datas: Array,
    dataSchema: Object
  },
  data () {
    return {
      single: '',
      multipleSelection: []
    }
  },
  watch: {
    value () {
      (this.value && setTimeout(() => {
        this.dataSchema.fields.forEach((item, index) => {
          if (this.utils.checkListInner(this.datas, item.name)) {
            this.$refs.schema_table.toggleRowSelection(this.dataSchema.fields[index], true)
          }
        })
      })) || Object.assign(this.$data, this.$options.data())
    }
  },
  methods: {
    close () {
      this.$emit('close')
    },
    save () {
      const putData = {
        sync_fields: []
      }
      if (this.$refs.schema_table.selection && this.$refs.schema_table.selection.length > 0) {
        this.$refs.schema_table.selection.forEach(item => {
          putData.sync_fields.push(item.name)
        })
        this.$message.success('配置成功')
        this.$emit('finish', putData)
        this.close()
      } else {
        this.$message.error('请选择同步字段')
      }
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    }
  }
}
</script>
