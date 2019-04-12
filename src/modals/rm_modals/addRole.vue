<template>
  <Modal
    class="modal-sm add-role-modal"
    v-model="value"
    :mask-closable="false"
    :closable="false">
    <div class="modal-header" slot="header">
      <span>{{$store.state.user.roleEditData ? '编辑' : '新增'}}角色</span>
      <Icon type="md-close" @click="close" />
    </div>
    <div class="modal-body">
      <div class="item-main">
        <label class="item-title">
          角色
        </label>
        <div class="item-con">
          <el-input v-model="roleData.name" placeholder="请输入角色名" clearable></el-input>
        </div>
      </div>
      <div class="item-main">
        <label class="item-title">
          任务类型
        </label>
        <div class="item-con">
          <el-radio class="item-radio" @change="changeType" v-model="roleData.type" label="all">全部</el-radio>
          <el-radio class="item-radio" @change="changeType" v-model="roleData.type" label="tmp">
            <div class="item-select-box">
              <el-select multiple :disabled="roleData.type === 'all'" placeholder="请选择类型" v-model="roleData.typeList">
                <el-option
                  v-for="(item, index) in options.typeList"
                  :key="index"
                  :label="item.content"
                  :value="item.id">
                </el-option>
              </el-select>
            </div>
          </el-radio>
        </div>
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
    value: Boolean
  },
  data () {
    return {
      options: {
        typeList: []
      },
      roleData: {
        name: '',
        type: 'all',
        typeList: []
      },
      modals: {
        groupAllot: false
      },
      sourceList: []
    }
  },
  methods: {
    ok () {
      if (!this.roleData.name) {
        this.$message.error('角色名称不能为空')
        return
      }
      if (this.roleData.type !== 'all') {
        if (this.roleData.typeList.length === 0) {
          this.$message.error('任务类型不能为空')
          return
        }
      }

      const putData = {
        id: (this.$store.state.user.roleEditData && this.$store.state.user.roleEditData.id) || undefined,
        name: this.roleData.name,
        type: 1,
        task_type_list: (this.roleData.type === 'all') ? ([]) : (this.roleData.typeList),
        task_type_choosed: this.roleData.type
      }

      this.userService.saveRoleData(putData).then(res => {
        if (res.status === 0) {
          this.$message.success('保存成功')
          this.$emit('finishSave')
        }
      })
    },
    close () {
      this.$emit('close')
    },
    changeType () {
      if (this.roleData.type === 'all') {
        this.roleData.typeList = []
      }
    }
  },
  watch: {
    value () {
      if (this.value) {
        this.$store.dispatch('getDicData', this.CONSTANT.DIC_TYPE_PARAMS).then(res => {
          this.options.typeList = res
        })
        if (this.$store.state.user.roleEditData) {
          const editData = this.$store.state.user.roleEditData

          this.roleData = {
            name: editData.name,
            type: (editData.task_type_choosed && editData.task_type_choosed === 'all') ? ('all') : ('tmp'),
            typeList: editData.task_type_list
          }
        }
      } else {
        Object.assign(this.$data, this.$options.data())
      }
    }
  }
}
</script>
