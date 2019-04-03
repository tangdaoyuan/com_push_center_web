<template>
  <div class="rm-main">
    <div class="rm-title">
      <span>角色管理</span>
      <el-button type="primary" icon="el-icon-circle-plus-outline" @click="addRole">添加</el-button>
    </div>
    <div class="rm-body role">
      <el-table
        :data="list"
        stripe
        height="100%">
        <el-table-column
          type="index"
          width="50">
        </el-table-column>
        <el-table-column
          prop="name"
          show-overflow-tooltip
          label="角色名"
          width="160">
        </el-table-column>
        <el-table-column
          label="任务类型">
          <template slot-scope="scope">
            <div class="tag-box">
              <el-tag v-show="scope.row.task_type_choosed !== 'all'" v-for="(item, index) in scope.row.task_type_name_list" :key="index">{{item}}</el-tag>
              <el-tag v-show="scope.row.task_type_choosed === 'all'">全部类型</el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="创建时间"
          show-overflow-tooltip
          width="180">
          <template slot-scope="scope">
            <div>
              {{utils.momentDate(scope.row.create_time, 'date_time')}}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="最后修改时间"
          show-overflow-tooltip
          width="180">
          <template slot-scope="scope">
            <div>
              {{utils.momentDate(scope.row.update_time, 'date_time')}}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="180">
          <template slot-scope="scope">
            <div class="op-box">
              <el-button type="text" @click="allotRole($event, scope.row)">分配用户</el-button>
              <el-button type="text" @click="editRole($event, scope.row)">编辑</el-button>
              <el-button type="text" @click="deleteRole($event, scope.row)">删除</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <add-role
      v-model="modals.addRole"
      @finishSave="finishSave"
      @close="closeAddRole">
    </add-role>
    <user-allot
      v-model="modals.userAllot"
      pr-key="id"
      show-text="name"
      @finish="changeAllot"
      @close="closeUserAllot">
    </user-allot>
  </div>
</template>
<script>
export default {
  data () {
    return {
      list: [],
      modals: {
        addRole: false,
        userAllot: false
      }
    }
  },
  created () {
    this.init()
  },
  methods: {
    init () {
      this.tcService.getRoleData({}).then(res => {
        if (res.status === 0) {
          this.list = res.data
        }
      })
    },
    addRole () {
      this.$store.commit('resetRoleEditData')
      this.modals.addRole = true
    },
    allotRole (e, item) {
      this.$store.dispatch('getRoleEditData', {
        role_id: item.id
      }).then(res => {
        if (res) {
          this.modals.userAllot = true
        }
      })
    },
    editRole (e, item) {
      this.$store.dispatch('getRoleEditData', {
        role_id: item.id
      }).then(res => {
        if (res) {
          this.modals.addRole = true
        }
      })
    },
    changeAllot (data) {
      const putData = {
        user_id_list: data.map(item => item.id),
        type: 1,
        role_id: this.$store.state.user.roleEditData.id
      }

      this.userService.saveAllotUser(putData).then(res => {
        if (res.status === 0) {
          this.$message.success('保存成功')
          this.modals.userAllot = false
          this.$store.commit('resetRoleEditData')
        } else {
          this.$message.error(res.msg || '保存失败')
        }
      })
    },
    deleteRole (e, item) {
      this.$Modal.confirm({
        title: '提示',
        content: `是否删除角色  ${item.name}`,
        onOk: () => {
          this.userService.deleteRole({
            id: item.id
          }).then(res => {
            if (res.status === 0) {
              this.$message.success('删除成功')
              this.init()
            } else {
              this.$message.error(res.msg || '删除失败')
            }
          })
        }
      })
    },
    closeAddRole () {
      this.modals.addRole = false
      this.$store.commit('resetRoleEditData')
    },
    finishSave () {
      this.modals.addRole = false
      this.$store.commit('resetRoleEditData')
      this.init()
    },
    closeUserAllot () {
      this.modals.userAllot = false
      this.$store.commit('resetRoleEditData')
    }
  }
}
</script>
