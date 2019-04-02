
const state = {
  isLogin: false,
  login_user_data: {},
  loginUrl: ''
}

const actions = {}

const getters = {
  isLogin: state => state.isLogin
}

const mutations = {
  getLoginStatus (state) {
    state.isLogin = localStorage.getItem('isLogin')
  },
  loginIn (state, data) {
    state.isLogin = true
    localStorage.setItem('isLogin', true)
    localStorage.setItem('login_user_data', JSON.stringify(data))
  },
  logOut (state) {
    state.isLogin = false
    localStorage.clear()
    localStorage.setItem('isLogin', false)
  },
  setLogin (state, url) {
    state.loginUrl = url
  },
  backLogin (state) {
    window.location.href = state.loginUrl
  }
}

export default {
  state,
  actions,
  mutations,
  getters
}
