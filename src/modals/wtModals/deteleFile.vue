<template>
  <Modal class="df-modal-main" v-model="trigger">
    <div class="modal-header" slot="header">
      <span>提示</span>
      <Icon type="md-close" @click="trigger = false" />
    </div>
    <div class="df-body">
        <span>您确定要删除吗？</span>
    </div>
    <div slot="footer" class="modal-footer">
      <Button type="text" @click="ok($event)">确定</Button>
      <Button type="text" @click="trigger = false">取消</Button>
    </div>
  </Modal>
</template>
<script>
export default {
  props: {
    value: Boolean,
    wtId: String
  },
  data () {
    return {
      trigger: false
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
  methods: {
    ok (e) {
      e.stopPropagation()
      let serv
      const putData = {
        id: this.wtId,
        is_deleted: 1
      }
      if (this.wtId) {
        switch (this.utils.getType(this.wtId)) {
          case 'field':
            serv = this.wtService.saveReName
            break
          case 'folder':
            serv = this.wtService.saveFolderItem
        }
      }

      serv(putData).then(res => {
        if (res.status === 0) {
          this.$message({
            message: '删除成功',
            type: 'success'
          })
          this.$emit('refresh')
          this.trigger = false
          this.$emit('input', this.trigger)
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
          this.trigger = false
          this.$emit('input', this.trigger)
        }
      })
    }
  }
}
</script>
