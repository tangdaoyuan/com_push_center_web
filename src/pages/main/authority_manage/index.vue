<template>
  <div class="rm-main">
    <div class="rm-title">
      <span>第三方系统授权管理</span>
      <el-button type="primary" icon="el-icon-circle-plus-outline" @click="addSystem">添加</el-button>
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
          width="180"
          label="系统名称"
         >
        </el-table-column>
        <el-table-column
          prop="secret_key"
          label="Secret Key"
          show-overflow-tooltip
          >
        </el-table-column>
        <el-table-column
          label="创建时间"
          show-overflow-tooltip
          width="160">
          <template slot-scope="scope">
            <div>
              {{utils.momentDate(scope.row.create_time, 'date_time')}}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="状态"
          show-overflow-tooltip
          width="80">
          <template slot-scope="scope">
            <div>
              {{scope.row.status===1?'已启用':'已禁用'}}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="180">
          <template slot-scope="scope">
            <div class="op-box">
              <el-button type="text" @click="deleteSystem($event, scope.row)">删除</el-button>
              <el-button type="text" @click="changeState($event, scope.row)">{{scope.row.status===0?'开启':'禁用'}}</el-button>
              <el-button type="text" @click="copySecretId($event, scope.row)">复制Key</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <add-system
      v-model="modals.addSystem"
      @finishSave="finishSave"
      @close="closeAddSystem">
    </add-system>
  </div>
</template>
<script>
export default {
  data () {
    return {
      list: [],
      modals: {
        addSystem: false
      }
    }
  },
  created () {
    this.init()
  },
  methods: {
    init () {
      this.amService.getAuthList({}).then(res => {
        if (res.status === 0) {
          this.list = res.data.list
        }
      })
    },
    addSystem () {
      this.modals.addSystem = true
    },
    copySecretId (e, item) {
      const input = document.createElement('input')
      document.body.appendChild(input)
      input.setAttribute('value', item.secret_key)
      input.select()
      if (document.execCommand('copy')) {
        document.execCommand('copy')
        this.$message({
          type: 'success',
          message: '复制成功!'
        })
      } else {
        this.$message({
          type: 'error',
          message: '该浏览器不支持，请手动复制!'
        })
      }
      // 删除'虚拟'DOM
      document.body.removeChild(input)
    },
    deleteSystem (e, item) {
      this.$Modal.confirm({
        title: '提示',
        content: `是否删除系统 ${item.name}`,
        onOk: () => {
          this.amService.deleteAuth({
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
    changeState (e, item) {
      let { id, status } = item
      status = status === 0 ? 1 : 0
      this.amService.saveAuth({
        id, status
      }).then(res => {
        if (res.status === 0) {
          this.$message.success('保存成功')
          this.init()
        }
      })
    },
    closeAddSystem () {
      this.modals.addSystem = false
    },
    finishSave () {
      this.modals.addSystem = false
      this.init()
    }
  }
}
</script>
