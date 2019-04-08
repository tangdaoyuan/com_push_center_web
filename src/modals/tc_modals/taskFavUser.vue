<template>
  <Modal
    class="tfu-modal"
    title="配置关注用户"
    v-model="value">
    <div class="modal-body">
      <transfer v-model="traList" @changeList="changeViewList" pr-key="id" show-text="name" @changeTarget="changeTarget" :push-list="viewGroupList" />
    </div>
    <div class="modal-footer" slot="footer">
      <el-button type="text" @click="ok">确定</el-button>
      <el-button type="text" @click="close">取消</el-button>
    </div>
  </Modal>
</template>
<script>
export default {
  props: {
    value: Boolean,
    editId: String,
    shortType: String,
    favList: Array
  },
  data () {
    return {
      traList: [],
      viewGroupList: []
    }
  },
  methods: {
    close () {
      this.$emit('close')
    },
    changeViewList (list) {
      this.traList = list
    },
    changeTarget (list) {
      this.viewGroupList = list
    },
    ok () {
      const viewData = {
        task_id: this.$store.state.task.taskId,
        view_group_list: [],
        view_user_list: []
      }

      this.traList.forEach(item => {
        if (item.type === 3) {
          viewData.view_user_list.push(item.id)
        } else if (item.type === 2 || item.type === 1) {
          viewData.view_group_list.push(item.id)
        }
      })

      if (this.shortType) {
        this.close()
        this.$emit('saveFav', this.traList)
      } else {
        const service = (this.$store.state.task.taskData) ? (this.tcService.edit4FavUser) : (this.tcService.saveTask4Setting)
        service({
          ...viewData,
          id: (this.$store.state.task.taskData) ? (this.editId) : (undefined)
        }).then(res => {
          if (res.status === 0) {
            this.$emit('saveFav', this.traList)
            this.$message.success('保存成功')
            this.close()
          } else {
            this.$message.error(res.msg || '保存失败')
          }
        })
      }
    }
  },
  watch: {
    value () {
      if (!this.value) {
        Object.assign(this.$data, this.$options.data())
      }
      if (this.value) {
        if (this.favList) {
          this.traList = this.favList
        } else {
          if (this.$store.state.task.taskData) {
            const tmp = this.$store.state.task.taskData.task_users
            this.traList = [
              ...tmp.view_group_list.map((item, index) => {
                return {
                  name: tmp.view_group_name_list[index],
                  id: item,
                  type: 1
                }
              }),
              ...tmp.view_user_list.map((item, index) => {
                return {
                  name: tmp.view_user_name_list[index],
                  id: item,
                  type: 3
                }
              })
            ]
          }
        }
        if (!this.viewGroupList || this.viewGroupList.length === 0) {
          this.tcService.getGroupList().then(res => {
            if (res.status === 0) {
              this.viewGroupList = res.data
            }
          })
        }
      }
    }
  }
}
</script>
