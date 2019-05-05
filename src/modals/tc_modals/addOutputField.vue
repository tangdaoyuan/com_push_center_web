<template>
  <Modal
    class="modal-md output-field-modal"
    v-model="value"
    :mask-closable="false"
    :closable="false">
    <div class="modal-header" slot="header">
      <span>新增字段</span>
      <Icon type="md-close" @click="close" />
    </div>
    <div class="modal-body">
      <Transfer
        filterable
        :titles="['字段', '已添加']"
        :data="dataList"
        :targetKeys="triggerList"
        :render-format="renderText"
        :selected-keys="selectedKeys"
        :filter-method="filterMethod"
        @on-selected-change="checkedList"
        @on-change="changeList">
        <div class="content-footer">
          <a @click="clear" class="clear">清空</a>
        </div>
      </Transfer>
    </div>
    <div class="modal-footer" slot="footer">
      <el-button type="text" class="sure-btn" @click="ok">确定</el-button>
      <el-button type="text" class="cancel-btn"  @click="close">取消</el-button>
    </div>
  </Modal>
</template>
<script>
export default {
  props: {
    value: Boolean,
    sourceList: Array,
    targetList: Array,
    selectedList: Array
  },
  mounted () {
    this.$query('.output-field-modal .clear').eq(0).attr('clearbtn', 'left')
    this.$query('.output-field-modal .clear').eq(1).attr('clearbtn', 'right')
  },
  data () {
    return {
      dataList: [],
      triggerList: [],
      selectedKeys: [],
      sourceSelectedKeys: [],
      targetSelectedKeys: []
    }
  },
  methods: {
    clear (e) {
      const target = e.target || e.srcElement
      const direction = target.getAttribute('clearbtn')
      console.log([...this.targetSelectedKeys])
      console.log([...this.sourceSelectedKeys])
      if (direction === 'left') {
        this.selectedKeys = [...this.targetSelectedKeys]
        console.log(this.selectedKeys)
      } else if (direction === 'right') {
        this.selectedKeys = [...this.sourceSelectedKeys]
        console.log(this.selectedKeys)
      }
    },
    filterMethod (data, query) {
      return data.label.indexOf(query) > -1 ||
        data.name.indexOf(query) > -1 ||
        data.alias.indexOf(query) > -1
    },
    ok () {
      this.$emit('ok', this.triggerList)
    },
    close () {
      this.$emit('close')
    },
    renderText (item) {
      return item.name
    },
    checkedList (sourceSelectedKeys, targetSelectedKeys) {
      this.sourceSelectedKeys = sourceSelectedKeys
      this.targetSelectedKeys = targetSelectedKeys
    },
    changeList (newList) {
      this.triggerList = newList
    }
  },
  watch: {
    value () {
      if (this.value) {
        const sources = this.sourceList.map(item => {
          return {
            ...item,
            key: item.id,
            label: item.alias || item.name
          }
        })

        const targets = this.targetList.map(item => {
          return {
            ...item,
            key: item.id,
            label: item.alias || item.name
          }
        })
        this.dataList = sources.concat(targets)
        if (this.selectedList && this.selectedList.length) {
          this.triggerList = this.selectedList.map(item => {
            return item.id
          })
        }
      } else {
        Object.assign(this.$data, this.$options.data())
      }
    }
  }
}
</script>
