<template>
  <div class="rm-main">
    <div class="rm-title">
      <span>角色管理</span>
    </div>
    <div class="rm-body role">
      <el-table
        :data="list"
        height="100%">
        <el-table-column
          type="index"
          width="50">
        </el-table-column>
        <el-table-column
          prop="name"
          label="角色名"
          width="150">
        </el-table-column>
        <el-table-column
          label="权限列表">
          <template slot-scope="scope">
            <div class="tag-box">
              <el-tag v-for="(item, index) in scope.row.permission_list" :key="index">{{item.name}}</el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="创建时间">
          <template slot-scope="scope">
            <div>
              {{utils.momentDate(scope.row.create_time, 'date_time')}}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="最后修改时间">
          <template slot-scope="scope">
            <div>
              {{utils.momentDate(scope.row.update_time, 'date_time')}}
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      list: []
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
    }
  }
}
</script>
