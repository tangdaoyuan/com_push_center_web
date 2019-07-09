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
        <div class="source-con">
          <div class="source-header">
            <Checkbox v-model="sourceChecked" @on-change="checkSource">
              <span>字段</span>
            </Checkbox>
          </div>
          <div class="filter-box">
            <input class="search-input" v-model="sourceText" @keyup="searchSource" type="text" required>
            <Icon class="search-icon" type="md-search" />
          </div>
          <div class="source-body">
            <ul class="source-ul">
              <li v-for="item in dataList" :key="item.id">
                  <Checkbox v-model="item.isChoose">
                    <span>{{item.name}}</span>
                  </Checkbox>
              </li>
            </ul>
          </div>
          <div @click="clearSource" class="source-footer">
            <a class="clear">清空</a>
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
        <div class="source-con">
          <div class="source-header">
            <Checkbox v-model="targetChecked" @on-change="checkTarget">
              <span>已添加</span>
            </Checkbox>
          </div>
          <div class="filter-box">
            <input class="search-input" v-model="targetText" @keyup="searchTarget" type="text" required>
            <Icon class="search-icon" type="md-search" />
          </div>
          <div class="source-body">
            <ul class="source-ul">
              <li v-for="item in triggerList" :key="item.id">
                <Checkbox v-model="item.isChoose">
                  <span>{{item.name}}</span>
                </Checkbox>
              </li>
            </ul>
          </div>
          <div class="source-footer">
            <a @click="clearTarget" class="clear">清空</a>
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
    sourceList: Array,
    targetList: Array,
    selectedList: Array
  },
  data () {
    return {
      targetChecked: false,
      sourceChecked: false,
      sourceText: '',
      targetText: '',
      dataList: [],
      dataListRef: [],
      triggerList: [],
      triggerListRef: []
    }
  },
  methods: {
    clearTarget () {
      this.checkTarget(false)
      this.targetChecked = false
    },
    checkTarget (status) {
      this.triggerList.forEach(item => {
        item.isChoose = status
      })
    },
    clearSource () {
      this.checkSource(false)
      this.sourceChecked = false
    },
    checkSource (status) {
      this.dataList.forEach(item => {
        item.isChoose = status
      })
    },
    searchTarget (e) {
      if (e.keyCode === 13 && this.targetText) {
        const targets = []
        this.triggerListRef.forEach(item => {
          if (item.alias.indexOf(this.targetText) > -1 || item.name.indexOf(this.targetText) > -1) {
            targets.push(item)
          }
        })
        this.triggerList = targets
      } else if (e.keyCode === 13 && !this.targetText) {
        this.triggerList = this.triggerListRef
      }
    },
    searchSource (e) {
      if (e.keyCode === 13 && this.sourceText) {
        const sources = []
        this.dataListRef.forEach(item => {
          if (item.alias.indexOf(this.sourceText) > -1 || item.name.indexOf(this.sourceText) > -1) {
            sources.push(item)
          }
        })
        this.dataList = sources
      } else if (e.keyCode === 13 && !this.sourceText) {
        this.dataList = this.dataListRef
      }
    },
    toRight (e) {
      const restData = []
      const checkData = []
      this.dataListRef.forEach(item => {
        if (!item.isChoose) {
          restData.push(item)
        } else {
          checkData.push(item)
        }
      })
      this.dataListRef = restData
      this.triggerListRef = this.triggerListRef.concat(checkData)

      this.searchSource({ keyCode: 13 })
      this.searchTarget({ keyCode: 13 })
    },
    toLeft (e) {
      const restData = []
      const checkData = []
      this.triggerListRef.forEach(item => {
        if (!item.isChoose) {
          restData.push(item)
        } else {
          checkData.push(item)
        }
      })
      this.dataListRef = this.dataListRef.concat(checkData)
      this.triggerListRef = restData

      this.searchSource({ keyCode: 13 })
      this.searchTarget({ keyCode: 13 })
    },
    close () {
      this.$emit('close')
    },
    ok () {
      this.$emit('ok', this.triggerList.map(item => {
        return {
          'id': item.id,
          'table_id': item.table_id
        }
      }))
    },
    search () {

    }
  },
  watch: {
    dataList: {
      handler () {
        if (this.dataList.length > 0) {
          for (let item of this.dataList) {
            if (!item.isChoose) {
              this.sourceChecked = false
              return
            }
          }
          this.sourceChecked = true
        } else {
          this.sourceChecked = false
        }
      },
      deep: true
    },
    triggerList: {
      handler () {
        if (this.triggerList.length > 0) {
          for (let item of this.triggerList) {
            if (!item.isChoose) {
              this.targetChecked = false
              return
            }
          }
          this.targetChecked = true
        } else {
          this.targetChecked = false
        }
      },
      deep: true
    },
    value () {
      if (this.value) {
        const keys = new Set()
        if (this.selectedList && this.selectedList.length) {
          this.triggerListRef = this.triggerList = this.selectedList.map(item => {
            keys.add(item.id)
            return {
              ...item,
              key: item.id,
              label: item.name || item.alias,
              isChoose: false
            }
          })
        }

        const sources = []
        this.sourceList.forEach(item => {
          if (!keys.has(item.id)) {
            sources.push({
              ...item,
              key: item.id,
              label: item.alias || item.name,
              isChoose: false
            })
          }
        })

        const targets = []
        this.targetList.forEach(item => {
          if (!keys.has(item.id)) {
            targets.push({
              ...item,
              key: item.id,
              label: item.alias || item.name,
              isChoose: false
            })
          }
        })
        this.dataListRef = this.dataList = sources.concat(targets)
      } else {
        Object.assign(this.$data, this.$options.data())
      }
    }
  }
}
</script>
