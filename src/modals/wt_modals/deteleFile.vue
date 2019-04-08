<template>
  <Modal class="df-modal-main" v-model="value">
    <div class="modal-header" slot="header">
      <span>提示</span>
      <Icon type="md-close" @click="close" />
    </div>
    <div class="df-body">
        <span>您确定要删除吗？</span>
    </div>
    <div slot="footer" class="modal-footer">
      <Button type="text" @click="ok($event)">确定</Button>
      <Button type="text" @click="close">取消</Button>
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
    }
  },
  watch: {
    value () {
      if (!this.value) {
        Object.assign(this.$data, this.$options.data())
      }
    }
  },
  methods: {
    close () {
      this.$emit('close')
    },
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
          this.close()
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
          this.close()
        }
      })
    }
  }
}
</script>
