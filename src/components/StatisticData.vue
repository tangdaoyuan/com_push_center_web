<template lang='html'>
  <div class="statistic-wrap">
    <div class="statistic-item"
      v-for="(value, index) in dataStatistics"
      :key="index"
      @click="filterStatus(value, index)"
      :class="{
        'blue': index === choosed,
        'abnormal': value.label === '异常',
        'total': value.label === '全部',
        'normal': value.label === '正常',
        'failed': value.label === '失效',
        'closed': value.label === '停用' || value.label === '禁用'
      }">
      <label
        :class="{'abnormal': value.label === '异常' && abnormal}"
        @click="showAbnormalList($event, value.label)">
        {{value.label}}
      </label>
      <span>{{value.data}}</span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    dataStatistics: Object,
    abnormal: Boolean
  },
  data () {
    return {
      choosed: -1
    }
  },
  methods: {
    filterStatus (item, index) {
      this.choosed = index
      if (item.data !== 0) {
        this.$emit('filetrStatus', item.label)
      } else {
        this.$message.info('无数据展示')
      }
    },
    showAbnormalList (e, status) {
      e.stopPropagation()
      if (status === '异常' && this.abnormal) {
        this.$emit('showAbnormalList')
      }
    }
  }
}
</script>
