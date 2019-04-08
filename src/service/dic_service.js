import Service from './index.js'

class DicService extends Service {
  getDicData (data) {
    return new Promise((resolve) => {
      this.TEMPLATE_GET('/api/dic/type/list', data, resolve)
    })
  }

  getDicContent (data) {
    return new Promise((resolve) => {
      this.TEMPLATE_GET('/api/dic/content/list', data, resolve)
    })
  }

  saveDicData (data) {
    return new Promise((resolve) => {
      this.TEMPLATE_POST('/api/dic/type/save', data, resolve)
    })
  }

  deleteTypeData (data) {
    return new Promise((resolve) => {
      this.TEMPLATE_DELETE('/api/dic/type', data, resolve)
    })
  }

  deleteConData (data) {
    return new Promise((resolve) => {
      this.TEMPLATE_DELETE('/api/dic/content/item', data, resolve)
    })
  }

  getDicConData (data) {
    return new Promise((resolve) => {
      this.TEMPLATE_GET('/api/dic/content/list', data, resolve)
    })
  }

  saveDicCon (data) {
    return new Promise((resolve) => {
      this.TEMPLATE_POST('/api/dic/content/save', data, resolve)
    })
  }

  saveConItem (data) {
    return new Promise((resolve) => {
      this.TEMPLATE_PUT('/api/dic/content/item', data, resolve)
    })
  }
}

export default new DicService()
