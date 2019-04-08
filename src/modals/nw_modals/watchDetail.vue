<template>
  <Modal class="nwd-main" v-model="value">
    <div class="modal-header" slot="header">
      <span>{{`${chooseItem.name} -- ${utils.getNwMatch(showMenu)}`}}</span>
      <Icon type="md-close" @click="back($event)" />
    </div>
    <div class="nwd-con">
      <div class="nwd-table">
        <el-table
          stripe
          height="100%"
          :data="tableData.dataList">
          <el-table-column
            v-for="(item, index) in tableData.headList"
            :key="index"
            min-width="120"
            :label="item.name || item.alias"
            show-overflow-tooltip>
            <template slot-scope="scope">
              <span v-if="item.origin_type === 2">{{utils.momentDate(scope.row[item.id], 'date_time')}}</span>
              <span v-else>{{scope.row[item.id]}}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div class="modal-footer" slot="footer">
    </div>
  </Modal>
</template>
<script>
export default {
  props: {
    value: Boolean,
    showMenu: String,
    chooseItem: Object,
    tableData: Object
  },
  data () {
    return {
    }
  },
  watch: {
    value () {
      if (!this.value) {
        Object.assign(this.$data, this.$options.data())
      }
    }
  },
  methods: {
    close () {
      this.$emit('close')
    },
    renderHeader (h, data) {
      const header = this.tableData.headList[data.$index]
      const headerText = header.alias || header.name
      let vnode
      switch (header.origin_type) {
        case 0:
          vnode = <div class={`tb-header`}>
            <i class="number-type"></i>
            <span title={headerText} domPropsInnerHTML={headerText}></span>
          </div>
          break
        case 1:
          vnode = <div class={`tb-header`}>
            <i class="text-type"></i>
            <span title={headerText} domPropsInnerHTML={headerText}></span>
          </div>
          break
        case 2:
          vnode = <div class={`tb-header`}>
            <i class="date-type"></i>
            <span title={headerText} domPropsInnerHTML={headerText}></span>
          </div>
          break
        default:
          vnode = <div class={`tb-header`}>
            <span title={headerText} domPropsInnerHTML={headerText}></span>
          </div>
          break
      }
      return (
        vnode
      )
    },
    back (e) {
      e.stopPropagation()
      this.close()
    }
  }
}
</script>
