<template>
  <Modal
    class="modal-sm set-dict-modal"
    v-model="value"
    :mask-closable="false"
    :closable="false">
    <div class="modal-header" slot="header">
      <span>设置字典</span>
      <Icon type="md-close" @click="close" />
    </div>
    <div class="modal-body">
      <div class="modal-item">
        <el-select v-model="selectDict">
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
      selectDict: ''
    }
  },
  methods: {
    close () {
      this.$emit('close')
    },
    ok () {
      this.$emit('finish', {
        display_dict_id: this.selectDict
      })
    }
  },
  watch: {
    value () {
      if (this.value) {
        const config = this.$store.state.task.dictConfig
        if (config) {
          this.selectDict = config.filter_dic_id
        }
      }
    }
  }
}
</script>
