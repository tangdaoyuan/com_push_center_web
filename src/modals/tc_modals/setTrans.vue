<template>
   <Modal
    class="modal-md set-translate-mdoal"
    v-model="value"
    :mask-closable="false"
    :closable="false">
    <div class="modal-header" slot="header">
      <span>新增字段</span>
      <Icon type="md-close" @click="close" />
    </div>
    <div class="modal-body">
      <div class="table-panel">
        <div class="select-box"
          v-for="(row, index) in rules"
          :key="index">
          <el-select class="select"
            v-model="rules[index].source_field_id">
            <el-option
              v-for="item in tableTitleList"
              :key="item.id"
              :value="item.id"
              :label="item.alias || item.name">
            </el-option>
          </el-select>
          <span class="equal">等于</span>
          <el-select class="select"
            v-model="rules[index].dictionary_field_id">
            <el-option
              v-for="item in dictTitleList"
              :key="item.id"
              :value="item.id"
              :label="item.alias || item.name">
            </el-option>
          </el-select>
          <el-select class="select"
            v-model="rules[index].display_field_id">
            <el-option
              v-for="item in dictTitleList"
              :key="item.id"
              :value="item.id"
              :label="item.alias || item.name"></el-option>
          </el-select>
          <div class="op-box">
            <span @click="addTransRow(index)" class="el-icon-plus"></span>
            <span v-show="rules.length > 1" @click="removeTransRow(index)" class="el-icon-minus"></span>
          </div>
        </div>
      </div>
    </div>
    <div class="modal-footer" slot="footer">
      <el-button type="text" class="sure-btn" @click="ok">确定</el-button>
      <el-button type="text" class="cancel-btn"  @click="close">取消</el-button>
    </div>
   </Modal>
</template>
<script>
export default {
  props: {
    value: Boolean,
    tableId: String,
    translateRules: Array,
    tableTitleList: Array,
    dictTitleList: Array
  },
  data () {
    return {
      rules: []
    }
  },
  methods: {
    addTransRow (index) {
      if (index >= 0) {
        const data = this.rules[index]
        if (data.source_field_id && data.dictionary_field_id && data.display_field_id) {
          this.rules.splice(
            index + 1,
            0,
            this.resetRules()[0]
          )
        } else {
          this.$message.error('请先完成当前字典规则')
        }
      }
    },
    removeTransRow (index) {
      if (this.rules.length > 1) {
        this.rules.splice(index, 1)
      } else {
        this.rules = this.resetRules()
      }
    },
    resetRules () {
      return [
        {
          source_field_id: '',
          dictionary_field_id: '',
          display_field_id: ''
        }
      ]
    },
    close () {
      this.$emit('close')
    },
    ok () {
      const dictionaries = []
      for (let rule of this.rules) {
        if (!rule.source_field_id || !rule.dictionary_field_id || !rule.display_field_id) continue

        this.dictTitleList.forEach((item) => {
          if (item.id && item.id === rule.display_field_id) {
            dictionaries.push({ ...item })
          }
        })
      }

      this.$emit('ok', this.rules, dictionaries, this.tableId)
      this.$emit('close')
    }
  },
  watch: {
    value () {
      if (this.value) {
        if (!this.translateRules || this.translateRules.length <= 0) {
          this.rules = this.resetRules()
          return
        }
        this.rules = this.translateRules
      } else {
        this.rules = this.resetRules()
      }
    }
  }
}
</script>
