<template>
  <Modal
    class="modal-sm set-field-modal"
    v-model="value"
    :mask-closable="false"
    :closable="false">
    <div class="modal-header" slot="header">
      <span>设置字段</span>
      <Icon type="md-close" @click="close" />
    </div>
    <div class="modal-body">
      <div class="modal-item">
        <el-radio v-model="chooseType" :label="1">默认</el-radio>
      </div>
      <div class="modal-item">
        <el-radio v-model="chooseType" :label="2">自定义名称</el-radio>
        <el-input v-model="fieldText"></el-input>
      </div>
      <div class="modal-item">
        <el-radio v-model="chooseType" :label="3">选择字段</el-radio>
        <el-select v-model="selectField">
          <el-option v-for="(item, index) in tableList" :key="index" :label="item.name" :value="item.id"></el-option>
        </el-select>
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
    tableList: Array
  },
  data () {
    return {
      chooseType: 1,
      selectField: '',
      fieldText: ''
    }
  },
  methods: {
    close () {
      this.$emit('close')
    },
    ok () {
      this.$emit('finish', {
        display_field_type: this.chooseType,
        display_field_text: this.fieldText,
        display_field_id: this.selectField
      })
    }
  },
  watch: {
    value () {
      if (this.value) {
        const editData = this.$store.state.task.fieldData
        const config = this.$store.state.task.fieldConfig
        if (editData && config.type === editData.display_type) {
          [
            this.chooseType,
            this.selectField,
            this.fieldText
          ] = [
            editData.display_field_type || 1,
            editData.display_field_id || '',
            editData.display_field_text || ''
          ]
        }
      } else {
        Object.assign(this.$data, this.$options.data())
      }
    }
  }
}
</script>
