import Service from './index.js'

class NmService extends Service {
  getNotifymanageData (data) {
    return new Promise((resolve) => {
      this.TEMPLATE_GET('/api/channel/list', data, resolve)
    })
  }

  createData (data) {
    return new Promise((resolve) => {
      this.TEMPLATE_POST('/api/channel/create', data, resolve)
    })
  }

  editData (data) {
    return new Promise((resolve) => {
      this.TEMPLATE_PUT('/api/channel', data, resolve)
    })
  }

  changeStatus (data) {
    return new Promise((resolve) => {
      this.TEMPLATE_PUT('/api/channel/switch', data, resolve)
    })
  }

  getAKey (data) {
    return new Promise((resolve) => {
      this.TEMPLATE_GET('/api/data_source/secret_key', data, resolve)
    })
  }

  getSKey (data) {
    return new Promise((resolve) => {
      this.TEMPLATE_GET('/api/data_source/secret_key', data, resolve)
    })
  }

  detailData (data) {
    return new Promise((resolve) => {
      this.TEMPLATE_GET('/api/channel', data, resolve)
    })
  }
}

export default new NmService()
