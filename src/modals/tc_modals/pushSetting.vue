<template>
  <Modal class="ps-modal-main" v-model="value">
    <div class="modal-header" slot="header">
      <span>提示</span>
      <Icon type="md-close" @click="close" />
    </div>
    <div class="ps-body">
      <div class="menu-box">
        <Menu mode="horizontal" theme="light" :active-name="chooseMenu">
          <MenuItem :name="1" @click.native="chooseMenu = 1">默认模板</MenuItem>
          <MenuItem :name="2" @click.native="chooseMenu = 2">自定义模板</MenuItem>
        </Menu>
      </div>
      <div class="ps-b-con" v-show="chooseMenu === 1">
        <span class="ps-default-msg">您有一条预警信息，请注意查收！</span>
      </div>
      <div class="ps-b-con" v-show="chooseMenu === 2">
        <textarea class="at-box" ref="at_box" v-model="msgText" cols="30" rows="10"></textarea>
        <span class="at-tips" :class="{'error': isError}">
          最多支持200字输入
        </span>
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
    list: Array,
    type: String,
    putData: Object
  },
  data () {
    return {
      chooseMenu: 1,
      msgText: '',
      isError: false
    }
  },
  methods: {
    close () {
      this.$emit('close')
    },
    ok (e) {
      e.stopPropagation()
      let str = ''
      if (this.chooseMenu === 2) {
        str = window.$(this.$refs.at_box).val()
        if (!str) {
          this.$message.error('消息模板不能为空')
          return null
        }
        if (str.length > 200) {
          this.isError = true
          return null
        } else {
          this.isError = false
        }
      }

      const putData = {
        channel_id_list: [],
        tpl_type: this.chooseMenu,
        msg: (this.chooseMenu === 1) ? ('您有一条预警消息，请注意查收！') : (str || '')
      }

      this.list.forEach(item => {
        putData.channel_id_list.push(item.id)
      })

      this.$message.success('设置成功')

      this.close()
      this.$emit('changeSetting', putData)
    }
  },
  watch: {
    value () {
      if (this.value) {
        if (this.putData[this.type].msg) {
          this.msgText = this.putData[this.type].msg
          this.chooseMenu = this.putData[this.type].tpl_type
        } else {
          if (this.$store.state.task.taskData) {
            if (this.$store.state.task.taskData.task_channels[this.type]) {
              this.msgText = this.$store.state.task.taskData.task_channels[this.type].msg
              this.chooseMenu = this.$store.state.task.taskData.task_channels[this.type].tpl_type
            }
          }
        }
        window.$(this.$refs.at_box).suggest('@', {
          data: (this.$store.state.task.tableData ? this.$store.state.task.tableData.title_list : []).map(item => {
            return {
              ...item,
              text: item.name,
              value: item.name
            }
          })
        })
      } else {
        this.isError = false
        Object.assign(this.$data, this.$options.data())
      }
    }
  }
}
</script>
