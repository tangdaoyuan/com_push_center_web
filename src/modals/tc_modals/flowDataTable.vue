<template>
  <Modal
    class="flow-table-main"
    scrollable
    v-model="value"
    :mask-closable="false"
    :closable="false">
    <div
      class="modal-header"
      slot="header">
      <span>{{tableName}}</span>
      <Icon type="md-close" @click="close" />
    </div>
    <div class="flow-data-body">
      <div class="body-header">
        <span >显示最新 1000 条数据，共 {{datas.total}} 条数据</span>
        <span>最近更新时间：{{utils.momentDate(datas.update_time, 'date_time')}}</span>
        <span  @click="refresh" class="refresh"></span>
      </div>
      <div class="body-main">
        <el-table
        :data="datas.data_list"
        stripe>
        <el-table-column
          v-for="k in datas.title_list"
          :key="k.id"
          :prop="k.id"
          :label="k.name">
        </el-table-column>
      </el-table>
      </div>
    </div>
    <div slot="footer" class="modal-footer" v-show="false">
      <Button type="text" @click="ok($event)">确定</Button>
      <Button type="text" @click="close">取消</Button>
    </div>
  </Modal>
</template>
<script>
export default {
  props: {
    value: Boolean,
    name: String,
    tableId: String,
    tableName: String
  },
  data () {
    return {
      datas: [
        {
          alert_level: '橙色',
          date: '2018/03/26 07:39:46',
          name: '张警官',
          number: '101383299476384731',
          type: '重点上访人员,精神病人',
          place: '杨家铺派出所'
        }
      ]
    }
  },
  methods: {
    refresh () {
      this.wtService.getprewData({
        page_no: 1,
        page_size: 100,
        tb_id: this.tableId
      }).then(res => {
        if (res.status === 0) {
          this.datas = res.data
        }
      })
    },
    ok () {
      console.log('ok')
    },
    close () {
      this.$emit('close')
    }
  },
  watch: {
    value () {
      if (this.value) {
        this.refresh()
      }
    }
  }
}
</script>
