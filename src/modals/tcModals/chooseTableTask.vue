<template>
  <Modal class="ct-modal-main" v-model="trigger">
    <div class="modal-header" slot="header">
      <span>选择模型数据表</span>
      <Icon type="md-close" @click="trigger = false" />
    </div>
    <div class="ct-con">
      <RadioGroup v-model="chooseTable">
        <Radio v-for="item in tableData" :key="item.id" :label="item.id">{{item.name}}</Radio>
      </RadioGroup>
    </div>
    <div slot="footer" class="modal-footer">
      <Button type="text" :disabled="tableData.length === 0" @click="ok($event)">确定</Button>
      <Button type="text" @click="trigger = false">取消</Button>
    </div>
  </Modal>
</template>
<script>
export default {
  props: {
    value: Boolean,
    tableData: Array
  },
  data () {
    return {
      trigger: false,
      chooseTable: ''
    }
  },
  watch: {
    value () {
      this.trigger = this.value
    },
    trigger () {
      if (!this.trigger) {
        Object.assign(this.$data, this.$options.data())
      }
      this.$emit('input', this.trigger)
    }
  },
  created () {
    this.trigger = this.value
  },
  methods: {
    ok (e) {
      e.stopPropagation()
      if (!this.chooseTable) {
        this.$message.error('请选择数据表')
        return
      }
      let res = {}
      this.tableData.forEach(item => {
        if (item.id === this.chooseTable) {
          res = item
        }
      })
      this.$emit('chooseTable', res)
      this.trigger = false
    }
  }
}
</script>
