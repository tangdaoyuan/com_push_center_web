<template>
  <div class="step-body" v-show="step === 3 && taskStep === CONSTANT.taskStep.DATABASE">
  </div>
</template>
<script>
export default {
  props: {
    step: Number,
    taskStep: Number
  },
  data () {
    return {}
  },
  method: {
    init () {
      let fieldList = []
      if (this.$store.getters.taskData) {
        fieldList = this.$store.getters.taskData.outputFields
      } else if (this.$store.getters.outputFields) {
        fieldList = this.$store.getters.outputFields
      }
      console.log(fieldList)
    }
  },
  watch: {
    step () {
      if (this.step === 3 &&
        this.taskStep === this.CONSTANT.taskStep.DATABASE) {
        this.init()
      } else if (this.step === -1) {
        Object.assign(this.$data, this.$options.data())
      }
    }
  }
}
</script>
