<template>
  <div id="app" class="main">
    <router-view/>
    <div class="global-loading" v-show="$store.getters.loading">
      <Spin fix size="large"></Spin>
    </div>
  </div>
</template>
<script>
export default {
  name: 'App',
  data () {
    return {
      loading: false
    }
  },
  created () {
    this.loading = this.$store.getters.loading
    this.loginService.getBackUrl({
      type: 'push-center'
    }).then(res => {
      if (res.status === 0) {
        this.$store.commit('setLogin', res.data)
        if (!this.$cookies.get('pc_token')) {
          this.$message.error('请登录系统')
          if (this.$route.name !== 'login') {
            this.$store.commit('backLogin')
          }
        }
      }
    })
  }
}
</script>
