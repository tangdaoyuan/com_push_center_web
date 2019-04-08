<template>
  <Modal
    class="modal-md edit-role-modal"
    v-model="value"
    :mask-closable="false"
    :closable="false">
    <div class="modal-header" slot="header">
      <span>配置角色</span>
      <Icon type="md-close" @click="close" />
    </div>
    <div class="modal-body">
      <Transfer
        filterable
        :titles="['角色列表', '已选择']"
        :data="sourceList"
        :targetKeys="triggerList"
        :render-format="renderText"
        @on-change="changeList">
      </Transfer>
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
    value: Boolean
  },
  data () {
    return {
      sourceList: [],
      triggerList: []
    }
  },
  methods: {
    ok () {
      this.$emit('finish', this.triggerList)
    },
    close () {
      this.$emit('close')
    },
    renderText (item) {
      return item.name
    },
    changeList (newList) {
      this.triggerList = newList
    }
  },
  watch: {
    value () {
      if (this.value) {
        this.userService.getRoleList().then(res => {
          if (res.status === 0) {
            this.sourceList = res.data.map(item => {
              return {
                ...item,
                key: item.id,
                label: item.name
              }
            })
            if (this.$store.state.user.userRoleCache) {
              this.triggerList = [...this.$store.state.user.userRoleCache.map(item => item.id)]
            } else {
              this.triggerList = []
            }
          }
        })
      } else {
        Object.assign(this.$data, this.$options.data())
      }
    }
  }
}
</script>
