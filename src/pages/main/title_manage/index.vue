<template>
  <div class="tm-main">
    <div class="tm-left">
      <el-menu class="tm-menu"
        :default-active="settingsStatus">
        <el-menu-item @click.native="changeMenu($event, 'logo')" index="logo">图标设置</el-menu-item>
        <el-menu-item @click.native="changeMenu($event, 'title')" index="title">标题设置</el-menu-item>
      </el-menu>
    </div>
    <div class="tm-right">
      <router-view/>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      settingsStatus: 'logo'
    }
  },
  created () {
    switch (this.$route.name) {
      case 'tm':
        this.$router.push('/tm/lm')
        break
      case 'lm':
        this.settingsStatus = 'logo'
        break
      case 'titlem':
        this.settingsStatus = 'title'
    }
  },
  methods: {
    changeMenu (e, type) {
      switch (type) {
        case 'logo':
          if (this.$route.name !== 'lm') {
            this.$router.push('/tm/lm')
          }
          break
        case 'title':
          if (this.$route.name !== 'titlem') {
            this.$router.push('/tm/titlem')
          }
          break
        default:
          this.$router.push('/tm/lm')
          break
      }
    }
  }
}
</script>
