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
      <div class="transfer-main">
        <div class="tm-left">
          <div class="tm-left-header">
            <span>字段</span>
          </div>
          <div class="filter-box">
            <input class="search-input" v-model="sourceText" @keyup="searchSource" type="text" required>
            <Icon class="search-icon" type="md-search" />
          </div>
          <div class="tm-left-body">
            <li v-for="(item, index) in dataList" :key="item.id">
                <Checkbox v-model="item.isChoose">
                  <span>{{item.name}}</span>
                </Checkbox>
                <Icon type="ios-close-circle" @click="removeItem(item, index)" />
            </li>
          </div>
        </div>
        <div class="tm-mid">
          <Button type="primary" @click="toRight($event)">
            <Icon type="ios-arrow-forward" />
          </Button>
          <Button type="default" @click="toLeft($event)">
            <Icon type="ios-arrow-back" />
          </Button>
        </div>
        <div class="tm-right">
          <div class="tm-right-header">
            <span>已添加</span>
          </div>
          <div class="filter-box">
            <input class="search-input" v-model="targetText" @keyup="searchTarget" type="text" required>
            <Icon class="search-icon" type="md-search" />
          </div>
          <div class="tm-right-body">
            <ul class="tm-right-ul">
              <li v-for="(item, index) in triggerList" :key="item.id">
                <Checkbox v-model="item.isChoose">
                  <span>{{item.name}}</span>
                </Checkbox>
                <Icon type="ios-close-circle" @click="removeItem(item, index)" />
              </li>
            </ul>
          </div>
        </div>
      </div>
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
    prKey: String,
    sourceText: String,
    targetText: String,
    sourceList: Array,
    targetList: Array,
    selectedList: Array
  },
  data () {
    return {
      triggerList: [],
      filterText: '',
      chooseTag: [],
      expandList: []
    }
  },
  methods: {
    choose (data, node, event) {
      node.checked = !node.checked
    },
    searchSource (e) {
      if (e.keyCode === 13) {

      }
    },
    searchTarget (e) {
      if (e.keyCode === 13) {

      }
    },
    toRight (e) {
      const tmpData = []
      const treeData = this.$refs.treeList
      treeData.getCheckedKeys().forEach(item => {
        if (treeData.getNode(item).data.type === 3) {
          tmpData.push(treeData.getNode(item).data)
        }
      })
      tmpData.forEach(item => {
        if (!this.utils.checkListInner(this.triggerList, item, 'id')) {
          this.triggerList.push(item)
        }
      })
    },
    removeItem (item, index) {
      this.triggerList.splice(index, 1)
    },
    toLeft (e) {
      const tmpData = []
      this.triggerList.forEach(item => {
        if (!item.isChoose) {
          tmpData.push(item)
        }
      })
      this.triggerList = tmpData
    },
    close () {
      this.$emit('close')
    },
    ok () {
      this.$emit('finish', this.triggerList)
    }
  },
  watch: {
    value () {
      if (this.value) {
        const sources = this.sourceList.map(item => {
          return {
            ...item,
            key: item.id,
            label: item.alias || item.name,
            isChoose: false
          }
        })

        const targets = this.targetList.map(item => {
          return {
            ...item,
            key: item.id,
            label: item.alias || item.name,
            isChoose: false
          }
        })
        this.dataList = sources.concat(targets)
        if (this.selectedList && this.selectedList.length) {
          this.triggerList = this.selectedList.map(item => {
            return {
              ...item,
              key: item.id,
              label: item.alias || item.name,
              isChoose: false
            }
          })
        }
      } else {
        Object.assign(this.$data, this.$options.data())
      }
    }
  }
}
</script>
