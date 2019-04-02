<template>
  <div class="rm-main">
    <div class="rm-title">
      <span>权限管理</span>
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
          label="用户名">
        </el-table-column>
        <el-table-column
          prop="phone"
          label="手机">
        </el-table-column>
        <el-table-column
          prop="username"
          label="登录名">
        </el-table-column>
        <el-table-column
          label="最后登录时间">
          <template slot-scope="scope">
            <div>
              {{utils.momentDate((scope.row.last_login_time ? Number(scope.row.last_login_time) : null), 'date_time')}}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="角色">
          <template slot-scope="scope">
            <div>
              <el-select :disabled="userData.id === scope.row.id" @change="changeSelect(scope.row)" v-model="scope.row.role">
                <el-option v-for="(item, index) in roleList" :key="index" :value="item.id" :label="item.name"></el-option>
              </el-select>
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
      }
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
    search () {
      this.tcService.getUserlist(this.params).then(res => {
        if (res.status === 0) {
          this.list = res.data.list
          this.count = res.data.total
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
    }
  }
}
</script>
