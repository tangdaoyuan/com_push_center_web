<template>
  <div class="rm-main">
    <div class="rm-title">
      <span>用户管理</span>
      <filter-option :filter-items='filterItems' @filter-search="changeSearchData"></filter-option>
    </div>
    <div class="rm-body">
      <el-table
        :data="list"
        height="100%">
        <el-table-column
          type="index"
          width="50">
        </el-table-column>
        <el-table-column
          prop="name"
          label="用户名"
          width="150">
        </el-table-column>
        <el-table-column
          prop="phone"
          width="100"
          label="手机">
        </el-table-column>
        <el-table-column
          prop="username"
          width="100"
          label="登录名">
        </el-table-column>
        <el-table-column
          label="创建时间"
          width="180">
          <template slot-scope="scope">
            <div>
              {{utils.momentDate((scope.row.create_time ? Number(scope.row.create_time) : null), 'date_time')}}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="角色">
          <template slot-scope="scope">
            <div class="tag-box">
              <el-tag v-show="scope.row.role_name_list && index < 5" v-for="(item, index) in scope.row.role_name_list" :key="index">{{item}}</el-tag>
              <span v-show="scope.row.role_name_list && scope.row.role_name_list.length > 5">...</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="组织">
          <template slot-scope="scope">
            <div class="tag-box">
              <el-tag v-show="scope.row.organization_name_list && index < 5" v-for="(item, index) in scope.row.organization_name_list" :key="index">{{item}}</el-tag>
              <span v-show="scope.row.organization_name_list && scope.row.organization_name_list.length > 5">...</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          width="150"
          label="操作">
          <template slot-scope="scope">
            <div class="op-box">
              <el-button v-show="!scope.row.role_name_list" @click="setRole($event, scope.row)" type="text">设置角色</el-button>
              <el-button v-show="scope.row.role_name_list" @click="editRole($event, scope.row)" type="text">编辑角色</el-button>
              <el-button v-show="!scope.row.organization_name_list" @click="editGroup($event, scope.row)" type="text">设置单位</el-button>
              <el-button v-show="scope.row.organization_name_list" @click="editGroup($event, scope.row)" type="text">编辑单位</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="rm-footer">
      <el-pagination
        background
        :page-size="params.page_size"
        :pager-count="5"
        :current-page.sync="params.page_no"
        layout="prev, pager, next"
        @current-change="changePage"
        :total="count">
      </el-pagination>
    </div>
    <edit-role
      v-model="modals.editRole"
      @close="closeEditRole"
      @finish="finshEditRole">
    </edit-role>
    <group-allot
      v-model="modals.groupAllot"
      @close="closeGroupAllot"
      pr-key="code"
      show-text="name"
      @ok="changeTarget"
      :change-list="sourceList"></group-allot>
  </div>
</template>
<script>
export default {
  data () {
    return {
      list: [],
      roleList: [],
      count: 120,
      userData: this.$cookies.get('pc_data'),
      params: {
        search_content: '',
        page_no: 1,
        page_size: 20
      },
      modals: {
        editRole: false,
        groupAllot: false
      },
      sourceList: [],
      selectedUserId: '',
      filterItems: [
        {
          itemName: '',
          placeholder: '搜索',
          type: 'name',
          in_type: 'input',
          value: ''
        }
      ]
    }
  },
  created () {
    this.init()
  },
  methods: {
    init () {
      this.initRoleList()
      this.search()
    },
    initRoleList () {
      this.tcService.getRoleList().then(res => {
        if (res.status === 0) {
          this.roleList = res.data
        }
      })
    },
    changeSearchData (data) {
      if (data[0] && data[0].value) {
        this.search({ search_content: data[0].value })
      }
    },
    search (data) {
      this.tcService.getUserlist({ ...this.params, ...(data || {}) }).then(res => {
        if (res.status === 0) {
          this.list = res.data.list
          this.count = res.data.total
        }
      })
    },
    changeTarget (data) {
      this.sourceList = data
      const params = {
        user_id: this.$store.state.user.userEditData.id,
        organization_code_list: data.map(item => item.code)
      }
      this.userService.setGroup(params).then(res => {
        if (res.status === 0) {
          this.$message.success('设置成功')
          this.closeGroupAllot()
          this.search()
        }
      })
    },
    changePage (no) {
      this.params.page_no = no
      this.search()
    },
    changeSelect (item) {
      this.tcService.saveRole({
        role_id: item.role,
        user_id: item.id
      }).then(res => {
        if (res.status === 0) {
          this.search()
          this.$message.success('修改成功')
        } else {
          this.$message.error(res.msg || '修改失败')
        }
      })
    },
    editGroup (e, item) {
      e.stopPropagation()
      this.$store.commit('setUserEditData', item)
      this.modals.groupAllot = true
    },
    setRole (e, item) {
      e.stopPropagation()
      this.$store.commit('resetUserRoleCache')
      this.$store.commit('setUserCache', item)
      this.modals.editRole = true
    },
    editRole (e, item) {
      e.stopPropagation()
      this.$store.dispatch('getRoleByUser', {
        user_id: item.id
      }).then(res => {
        if (res) {
          this.$store.commit('setUserCache', item)
          this.modals.editRole = true
        }
      })
    },
    closeGroupAllot () {
      this.$store.commit('resetUserEditData')
      this.modals.groupAllot = false
    },
    closeEditRole () {
      this.$store.commit('resetUserDataCache')
      this.$store.commit('resetUserRoleCache')
      this.modals.editRole = false
    },
    finshEditRole (data) {
      const putData = {
        user_id: this.$store.state.user.userCache && this.$store.state.user.userCache.id,
        role_id_list: data,
        type: 1
      }

      this.userService.saveAllotUser(putData).then(res => {
        if (res.status === 0) {
          this.$message.success('保存成功')
          this.modals.editRole = false
          this.$store.commit('resetUserDataCache')
          this.$store.commit('resetUserRoleCache')
          this.search()
        }
      })
    }
  }
}
</script>
