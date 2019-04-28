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
      <span>武汉铁路流式表</span>
      <Icon type="md-close" @click="close" />
    </div>
    <div class="flow-data-body">
      <div class="body-header">
        <span >显示最新 1000 条数据，共 5000 条数据</span>
        <span>最近更新时间：2017-11-20 00:04:44</span>
        <span class="refresh"></span>
      </div>
      <div class="body-main">
        <el-table
        :data="datas"
        stripe>
        <el-table-column
          prop="alert_level"
          label="预警级别"
          width="180">
        </el-table-column>
        <el-table-column
          prop="date"
          label="预警时间"
          width="180">
        </el-table-column>
        <el-table-column
          prop="name"
          label="姓名">
        </el-table-column>
        <el-table-column
          prop="number"
          label="证件号码">
        </el-table-column>
        <el-table-column
          prop="type"
          label="人员类别">
        </el-table-column>
        <el-table-column
          prop="place"
          label="发生地派出所">
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
    name: String
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
        },
        {
          alert_level: '橙色',
          date: '2018/03/26 07:39:46',
          name: '张警官',
          number: '101383299476384731',
          type: '重点上访人员,精神病人',
          place: '杨家铺派出所'
        },
        {
          alert_level: '橙色',
          date: '2018/03/26 07:39:46',
          name: '张警官',
          number: '101383299476384731',
          type: '重点上访人员,精神病人',
          place: '杨家铺派出所'
        },
        {
          alert_level: '橙色',
          date: '2018/03/26 07:39:46',
          name: '张警官',
          number: '101383299476384731',
          type: '重点上访人员,精神病人',
          place: '杨家铺派出所'
        },
        {
          alert_level: '橙色',
          date: '2018/03/26 07:39:46',
          name: '张警官',
          number: '101383299476384731',
          type: '重点上访人员,精神病人',
          place: '杨家铺派出所'
        },
        {
          alert_level: '橙色',
          date: '2018/03/26 07:39:46',
          name: '张警官',
          number: '101383299476384731',
          type: '重点上访人员,精神病人',
          place: '杨家铺派出所'
        },
        {
          alert_level: '橙色',
          date: '2018/03/26 07:39:46',
          name: '张警官',
          number: '101383299476384731',
          type: '重点上访人员,精神病人',
          place: '杨家铺派出所'
        },
        {
          alert_level: '橙色',
          date: '2018/03/26 07:39:46',
          name: '张警官',
          number: '101383299476384731',
          type: '重点上访人员,精神病人',
          place: '杨家铺派出所'
        },
        {
          alert_level: '橙色',
          date: '2018/03/26 07:39:46',
          name: '张警官',
          number: '101383299476384731',
          type: '重点上访人员,精神病人',
          place: '杨家铺派出所'
        },
        {
          alert_level: '橙色',
          date: '2018/03/26 07:39:46',
          name: '张警官',
          number: '101383299476384731',
          type: '重点上访人员,精神病人',
          place: '杨家铺派出所'
        },
        {
          alert_level: '橙色',
          date: '2018/03/26 07:39:46',
          name: '张警官',
          number: '101383299476384731',
          type: '重点上访人员,精神病人',
          place: '杨家铺派出所'
        },
        {
          alert_level: '橙色',
          date: '2018/03/26 07:39:46',
          name: '张警官',
          number: '101383299476384731',
          type: '重点上访人员,精神病人',
          place: '杨家铺派出所'
        },
        {
          alert_level: '橙色',
          date: '2018/03/26 07:39:46',
          name: '张警官',
          number: '101383299476384731',
          type: '重点上访人员,精神病人',
          place: '杨家铺派出所'
        }, {
          alert_level: '橙色',
          date: '2018/03/26 07:39:46',
          name: '张警官',
          number: '101383299476384731',
          type: '重点上访人员,精神病人',
          place: '杨家铺派出所'
        },
        {
          alert_level: '橙色',
          date: '2018/03/26 07:39:46',
          name: '张警官',
          number: '101383299476384731',
          type: '重点上访人员,精神病人',
          place: '杨家铺派出所'
        },
        {
          alert_level: '橙色',
          date: '2018/03/26 07:39:46',
          name: '张警官',
          number: '101383299476384731',
          type: '重点上访人员,精神病人',
          place: '杨家铺派出所'
        },
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
    ok () {
      console.log('ok')
    },
    close () {
      this.$emit('close')
    }
  }
}
</script>
