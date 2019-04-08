<template>
  <Modal class="adt-modal-main" v-model="value">
    <div class="modal-header" slot="header">
      <span>新增字典类型</span>
      <Icon type="md-close" @click="close" />
    </div>
    <div class="adt-con">
      <div class="adt-item">
        <span class="item-title">字典名称</span>
        <Input class="item-con" type="text" v-model="name" :maxlength="16" placeholder="请输入字典名称" />
      </div>
      <div class="adt-item area">
        <Input type="textarea" :rows="4" v-model="description" placeholder="请输入字典描述" :maxlength="500" />
      </div>
      <div class="adt-item tip">
        最多支持200字输入
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
    wtData: Object,
    folderList: Array,
    editData: Object
  },
  data () {
    return {
      chooseTag: [],
      name: '',
      description: ''
    }
  },
  watch: {
    value () {
      this.value && this.editData && (() => {
        this.name = this.editData.name
        this.description = this.editData.description
      })()
      this.value && (() => {
        Object.assign(this.$data, this.$options.data())
      })()
    }
  },
  methods: {
    close () {
      this.$emit('close')
    },
    ok (e) {
      e.stopPropagation()
      if (!this.name) {
        return this.$message.error('名称不能为空！')
      }

      this.dicService.saveDicData({
        name: this.name,
        description: this.description,
        id: (this.editData) ? this.editData.id : undefined
      }).then(res => {
        if (res.status === 0) {
          this.$message.success('保存成功')
          this.$emit('close')
          this.$emit('init')
        }
      })
    }
  }
}
</script>
