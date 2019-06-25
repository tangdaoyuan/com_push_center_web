import Service from './index'

class AMService extends Service {
  getAuthList (data) {
    return new Promise((resolve) => {
      this.TEMPLATE_GET('/api/third_auth/list', data, resolve)
    })
  }
  saveAuth (data) {
    return new Promise((resolve) => {
      this.TEMPLATE_POST('/api/third_auth/save', data, resolve)
    })
  }
  deleteAuth (data) {
    return new Promise((resolve) => {
      this.TEMPLATE_DELETE('/api/third_auth/delete', data, resolve)
    })
  }
  getSecretKey (data) {
    return new Promise((resolve) => {
      this.TEMPLATE_GET('/api/third_auth/secret_key', data, resolve)
    })
  }
}

export default new AMService()
