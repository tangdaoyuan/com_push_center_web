<template>
  <div class="lm-main">
    <div class="lm-header">
      <el-button type="primary" @click="addLogo" >添加</el-button>
    </div>
    <div class="lm-body">
      <el-table
        stripe
        :data="list"
        height="100%">
        <el-table-column
          type="index"
          width="50">
        </el-table-column>
        <el-table-column
          label="图标"
          width="100">
          <template slot-scope="scope">
            <img :src="scope.row.image"/>
          </template>
        </el-table-column>
        <el-table-column
          label="环境名称"
          width="150">
          <template slot-scope="scope">
            <span>{{CONSTANT.TM_TYPE_MAP[scope.row.sys_type]}}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="创建时间">
          <template slot-scope="scope">
            <span>{{utils.momentDate(scope.row.create_time,'date_time')}}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="200">
          <template
            slot-scope="scope">
              <el-button
                v-show="scope.row.current!==1"
                class="tip-ref-btn"
                type="text"
                size="small"
                @click="setLogo(scope.row)">
                设为logo
              </el-button>
              <el-button
                type="text"
                size="small"
                @click="delLogo(scope.row)">
                删除
              </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <add-logo v-model="addLogoModal" @refresh="search" @close="closeAddLogo"></add-logo>
  </div>
</template>
<script>
export default {
  data () {
    return {
      list: [],
      addLogoModal: false,
      current_logo_id: '',
      params: {
        page_no: 1,
        page_size: 50,
        search_content: ''
      }
    }
  },
  created () {
    this.search()
  },
  methods: {
    setLogo (row) {
      this.$confirm(`确认设置为该LOGO?`).then(_ => {
        if (row.current) {
          this.$message.error('当前系统已设置为该标题LOGO')
        }
        const params = {
          id: row.id,
          type: row.type,
          sys_type: row.sys_type,
          ...this.params }
        this.tmService.setLogoTitle(params).then(res => {
          if (res.status === 0) {
            this.$message.success('LOGO设置完成')
            this.search()
          }
        })
      })
    },
    addLogo (row) {
      this.addLogoModal = true
    },
    closeAddLogo () {
      this.addLogoModal = false
    },
    delLogo (row) {
      this.$confirm(`确认删除该LOGO?`).then(_ => {
        // TODO
        // const params = {}
      })
    },
    search () {
      this.tmService.getLogoList(this.params).then(res => {
        if (res.status === 0) {
          this.list = res.data.list
        }
      })
    }
  }
}
</script>
