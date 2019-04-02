<template>
  <div class="wm-body hide">
  </div>
</template>
<script>
export default {
  props: {
    domKey: String
  },
  data () {
    return {
      data: this.$cookies.get('pc_data') || {}
    }
  },
  created () {
    setTimeout(() => {
      this.initWatermark()
    })
  },
  methods: {
    initWatermark () {
      const canvas = document.createElement('canvas')
      const context = canvas.getContext('2d')
      canvas.width = 360
      canvas.height = 180
      context.fillStyle = 'rgba(100, 100, 100, 0.2)'
      context.font = '12px Arial'
      context.rotate(-30 * Math.PI / 180)
      context.translate(90, 90)
      context.textAlign = 'center'
      context.fillText(`${this.data.name} (${this.data.identity})`, 0, 20)
      context.fillText(`${this.utils.momentDate(this.data.last_login_time, 'date_time')}`, 0, 40)
      context.fillText(`本操作将被记录`, 0, 60)
      context.fillText(`泄露相关信息将被依法追究法律责任`, 0, 80)

      const _setBackgroundImage = (image) => {
        const element = this.$query(`#${this.domKey} + .el-table`)
        if (element.css('background-image') !== 'none') {
          element.css('background-repeat', `repeat, ${element.css('background-repeat')}`)
          element.css('background-size', `360px 180px, ${element.css('background-size')}`)
          element.css('background-image', `url(${image}), ${element.css('background-image')}`)
        } else {
          element.css('background-image', `url(${image})`)
        }
      }

      _setBackgroundImage(canvas.toDataURL('image/png'))
    }
  }
}
</script>
