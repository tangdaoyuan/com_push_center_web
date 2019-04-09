<template>
  <div class="login-main">
    <div class="login-main-m"></div>
    <div class="login-main-con">
      <div class="login-header">
        <div class="header-left">
          <div class="login-logo"></div>
          <div class="logo-text">
            <span>智能推送中心</span>
            <span>Intelligent Push Center</span>
          </div>
        </div>
      </div>
      <div class="login-body">
        <div class="login-con">
          <div class="con-title">登录智能推送中心</div>
          <Form class="login-form" ref="loginForm" :model="loginForm" :rules="loginRule">
            <!-- <FormItem prop="domain" >
              <Input ref="login-input" class="item-input" type="text" v-model="loginForm.domain" @keyup.enter.native="sigin('loginForm')" required></Input>
              <label>企业域</label>
            </FormItem> -->
            <FormItem prop="user">
              <Input ref="login-input" class="item-input my-input" type="text" v-model="loginForm.user" @keyup.enter.native="sigin('loginForm')" required/>
              <label>用户名</label>
            </FormItem>
            <FormItem prop="password">
              <Input ref="login-input" class="item-input" type="password" v-model="loginForm.password" @keyup.enter.native="sigin('loginForm')" required/>
              <label>密码</label>
            </FormItem>
            <FormItem>
              <Button type="primary" @click="sigin('loginForm')">登录</Button>
            </FormItem>
          </Form>
        </div>
        <div class="login-text-bottom">
          <span>Copyright © 2018 Haizhi Ltd. ICP</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import $ from 'jquery'
export default {
  name: 'login',
  created () {
    setTimeout(() => {
      $(document).on('focusin', '.item-input > input', (e) => {
        $(e.target).parent('.item-input').parent('.ivu-form-item-content').find('label').attr('class', 'show')
      })
      $(document).on('blur', '.item-input > input', (e) => {
        if (!$(e.target).val() || $(e.target).val() === '') {
          $(e.target).parent('.item-input').parent('.ivu-form-item-content').find('label').attr('class', '')
        }
      })
    })
  },
  data () {
    return {
      rememberPassword: false,
      loginForm: {
        domain: '',
        user: '',
        password: ''
      },
      loginRule: {
        user: [
          { required: true, message: '用户名不能为空', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '密码不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    sigin () {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          let putData = {}
          if (this.loginForm.domain) {
            putData = {
              username: this.loginForm.user,
              password: this.loginForm.password,
              domain: this.loginForm.domain
            }
          } else {
            putData = {
              username: this.loginForm.user,
              password: this.loginForm.password
            }
          }

          this.loginService.login(putData).then(res => {
            if (process.env.NODE_ENV === 'development') {
              if (res.status === 0) {
                this.$store.commit('loginIn', this.$cookies.get('pc_data'))
                this.$router.push('/home')
                this.$message({
                  message: '登录成功',
                  type: 'success',
                  duration: 1000
                })
              } else {
                this.$message({
                  message: res.msg,
                  type: 'error'
                })
              }
            } else {
              if (res) {
                this.$store.commit('loginIn', this.$cookies.get('pc_data'))
                // this.$router.push('/home')
                this.$message({
                  message: '登录成功',
                  type: 'success',
                  duration: 1000
                })
              } else {
                this.$message({
                  message: res.msg,
                  type: 'error'
                })
              }
            }
          })
        }
      })
    }
  }
}
</script>
