<template>
  <Modal class="adc-modal-main" v-model="value">
    <div class="modal-header" slot="header">
      <span>新增字典</span>
      <Icon type="md-close" @click="close" />
    </div>
    <div class="adc-con">
      <div class="adc-item">
        <span class="item-title">字典类型</span>
        <el-select class="item-con"
          v-model="dicType"
          :disabled="!!editData"
          placeholder="请选择字典类型">
          <el-option
            v-for="item in typeList"
            :value="item.id"
            :label="item.name"
            :key="item.value">
          </el-option>
        </el-select>
      </div>
      <div class="adc-item" v-show="!editData" v-for="(item, index) in conList" :key="index">
        <span class="item-title" v-show="index === 0">字典内容</span>
        <span class="item-title" v-show="index !== 0"></span>
        <Input class="item-con"
          type="text"
          v-model="item.content"
          :maxlength="16"
          placeholder="请输入字典内容" />
        <Icon type="md-add" size="18" @click="addCon(index)"/>
        <Icon type="md-remove" size="18" @click="deleteCon(index)"/>
      </div>
      <div class="adc-item" v-show="editData">
        <span class="item-title" >字典内容</span>
        <Input class="item-con"
          type="text"
          v-model="content"
          :maxlength="16"
          placeholder="请输入字典内容" />
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
    editData: Object,
    typeList: Array
  },
  data () {
    return {
      dicType: '',
      content: '',
      conList: [
        {
          content: ''
        }
      ]
    }
  },
  methods: {
    close () {
      this.$emit('close')
    },
    ok (e) {
      e.stopPropagation()
      const contentList = this.conList.filter(res => res.content)
      let service
      if (this.editData) {
        if (!this.content) {
          this.$message.error('内容不能为空')
          return
        }
        service = this.dicService.saveConItem({
          id: this.editData.id,
          content: this.content
        })
      } else {
        if (contentList.length === 0) {
          this.$message.error('内容不能为空')
          return
        }
        service = this.dicService.saveDicCon({
          type_id: this.dicType,
          content_list: contentList
        })
      }
      service.then(res => {
        if (res.status === 0) {
          this.$message.success('保存成功')
          this.$emit('init')
          this.$emit('close')
        }
      })
    },
    addCon (index) {
      this.conList.splice(index + 1, 0, { content: '' })
    },
    deleteCon (index) {
      this.conList.splice(index, 1)
    }
  },
  watch: {
    value () {
      this.value && this.editData && (() => {
        this.dicType = this.editData.type_id
        this.content = this.editData.content
      })()

      !this.value && (() => {
        Object.assign(this.$data, this.$options.data())
      })()
    }
  }
}
</script>
