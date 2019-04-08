import Service from './index.js'

class LoginService extends Service {
  login (data) {
    return new Promise((resolve) => {
      this.TEMPLATE_POST('/api/account/user/login', data, resolve)
    })
  }

  getUser (data) {
    return new Promise((resolve) => {
      this.TEMPLATE_GET('/api/account/user/profile', data, resolve)
    })
  }

  logout (data) {
    return new Promise((resolve) => {
      this.TEMPLATE_PUT('/api/account/user/logout', data, resolve)
    })
  }

  getBackUrl (data) {
    return new Promise((resolve) => {
      this.TEMPLATE_GET('/api/account/user/login/url', data, resolve)
    })
  }

  getMenuList (data) {
    return new Promise((resolve) => {
      this.TEMPLATE_GET('/api/ucenter/product/list', data, resolve)
    })
  }

  getMenuUrl (data) {
    return new Promise((resolve) => {
      this.TEMPLATE_GET('/api/ucenter/generate_url', data, resolve)
    })
  }
}

export default new LoginService()
