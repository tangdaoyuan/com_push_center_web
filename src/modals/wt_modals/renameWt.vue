<template>
  <Modal class="rnwt-modal-main" v-model="value">
    <div class="modal-header" slot="header">
      <span>编辑工作表</span>
      <Icon type="md-close" @click="close"/>
    </div>
    <div class="rnwt-body">
      <div class="rnwt-item">
        <span class="title">工作表名称</span>
        <Input class="item-input" v-model="wtData.name" type="text" :maxlength="16" />
      </div>
      <div class="rnwt-item">
        <Input type="textarea" v-model="wtData.desc" placeholder="备注（最多500字）" :maxlength="500"/>
      </div>
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
    wtData: Object
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
    refresh () {
      this.$emit('refresh')
      this.close()
    },
    ok (e) {
      e.stopPropagation()
      if (!this.wtData.name) {
        this.$message({
          message: '名称不能为空',
          type: 'error'
        })
        return
      }

      let putData = {}
      switch (this.utils.getType(this.wtData.id)) {
        case 'folder':
          putData = {
            id: this.wtData.id,
            name: this.wtData.name,
            parent_id: this.wtData.parent_id,
            is_deleted: this.wtData.is_deleted,
            is_top: this.wtData.is_top,
            desc: this.wtData.desc
          }

          this.wtService.saveFolder(putData).then(res => {
            if (res.status === 0) {
              this.$message({
                message: '修改成功',
                type: 'success'
              })
              this.refresh()
            } else {
              this.$message({
                message: res.msg,
                type: 'eror'
              })
            }
          })
          break
        case 'field':
          putData = {
            id: this.wtData.id,
            name: this.wtData.name,
            desc: this.wtData.desc,
            folder_id: this.wtData.folder_id,
            is_deleted: this.wtData.is_deleted
          }

          this.wtService.saveReName(putData).then(res => {
            if (res.status === 0) {
              this.$message({
                message: '修改成功',
                type: 'success'
              })
              this.refresh()
            } else {
              this.$message({
                message: res.msg,
                type: 'eror'
              })
            }
          })
          break
      }
    }
  }
}
</script>
