<template>
  <div class="lm-main title-main">
    <div class="lm-header">
      <el-button
        @click="addTitle"
        type="primary">
        添加
      </el-button>
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
          prop="title"
          label="标题">
        </el-table-column>
        <el-table-column
          label="环境名称">
          <template slot-scope="scope">
            <span>{{CONSTANT.TM_TYPE_MAP[scope]}}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="创建时间">
          <template slot-scope="scope">
            <span>{{utils.momentDate(scope.row.create_date,'date_time')}}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="150">
          <template slot-scope="scope">
            <el-button @click="setTitle(scope.row)" type="text" size="small">设为标题</el-button>
            <el-button @click="delTitle(scope.row)" type="text" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <add-title
      v-model="addTitleModal"
      @refresh="search"
      @close="closeAddTitle">
    </add-title>
  </div>
</template>
<script>
export default {
  data () {
    return {
      list: [],
      params: {
        current_title_id: '',
        page_size: 50,
        page_no: 1,
        serach_content: ''
      },
      addTitleModal: false
    }
  },
  created () {
    this.search()
  },
  methods: {
    addTitle () {
      this.addTitleModal = true
    },
    closeAddTitle () {
      this.addTitleModal = false
    },
    setTitle (row) {
      if (this.current_title_id === row.id) {
        this.$message.error('当前标题已重复')
        return
      }
      if (row.current) {
        this.$message.error('当前系统已设置为该标题')
      }

      this.$confirm(`确认设置标题为 ${row.title} 吗`).then(_ => {
        const params = {
          id: row.id,
          type: row.type,
          sys_type: row.sys_type,
          ...this.params
        }
        this.tmService.setLogoTitle(params).then(res => {
          if (res.status === 0) {
            this.current_title_id = row.id
            this.$message.success('标题设置完成')
          }
        })
      })
    },
    delTitle (row) {
      this.$confirm(`确认删除标题 ${row.title} 吗`).then(res => {
        if (res.status === 0) {
          this.$message.error('功能对接中ing...')
        }
      })
    },
    search () {
      this.tmService.getTitleList(this.params).then(res => {
        this.list = res.data.list
      })
    }
  }
}
</script>
