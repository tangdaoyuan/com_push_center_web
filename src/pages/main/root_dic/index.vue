<template>
  <div class="rm-main">
    <div class="rm-title">
      <span>权限字典</span>
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
          label="权限名称">
        </el-table-column>
        <el-table-column
          prop="code"
          label="权限代码">
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
          label="最近更新时间">
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
      this.tcService.getRootDicData({}).then(res => {
        if (res.status === 0) {
          this.list = res.data
        }
      })
    }
  }
}
</script>
