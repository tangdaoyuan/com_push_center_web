<template>
  <Scroll :on-reach-bottom="handleReachBottom"
    height="100%"
    class="pc-card-main">
    <Row class="pc-card-row"
      :gutter="gutter"
      v-for="(child, index) in tableData"
      :key="index">
      <i-col class="pc-card-col"
        :span="24 / span"
        v-show="child && child.length > 0"
        v-for="(item, tIndex) in child"
        :key="tIndex"
        @click.native="toDetail(item)">
        <div class="pc-card">
          <div class="pc-card-h" v-show="type === 'horizontal' ">
            <div class="h-left">
              <slot :data="item" name="img"></slot>
            </div>
            <div class="h-right">
              <slot name="r-header" :data="item"></slot>
              <slot name="r-body" :data="item"></slot>
              <slot name="r-footer" :data="item"></slot>
            </div>
          </div>
          <div class="pc-card-v" v-show="type === 'vertical'">
            <div class="v-header">
              <slot name="v-header" :data="item"></slot>
            </div>
            <div class="v-body">
              <slot name="v-body" :data="item"></slot>
            </div>
            <div class="v-footer">
              <slot name="v-footer" :data="item"></slot>
            </div>
          </div>
        </div>
      </i-col>
    </Row>
  </Scroll>

</template>
<script>
export default {
  props: {
    cardData: Array,
    span: Number,
    type: String,
    gutter: Number
  },
  data () {
    return {
      tableData: []
    }
  },
  methods: {
    handleReachBottom () {
      this.$emit('addRefresh')
    },
    toDetail (item) {
      this.$emit('openDetail', item)
    }
  },
  watch: {
    cardData () {
      if (this.cardData && this.cardData.length > 0) {
        let tmp = []
        let aTmp = []
        this.cardData.forEach((item, index) => {
          const tIndex = index + 1
          if (tIndex % this.span === 0) {
            aTmp = [...aTmp, item]
            tmp = [...tmp, aTmp]
            aTmp = []
          } else {
            aTmp = [...aTmp, item]
            if (tIndex === this.cardData.length) {
              tmp = [...tmp, aTmp]
            }
          }
        })
        this.tableData = tmp
      } else {
        this.tableData = []
      }
    }
  }
}
</script>
