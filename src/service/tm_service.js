import Service from './index'

class TmService extends Service {
  currentLogoTitle (data) {
    return new Promise((resolve) => {
      this.TEMPLATE_GET('/api/logo_title/getCurrentLog', data, resolve)
    })
  }
  getLogoList (data) {
    return new Promise((resolve) => {
      this.TEMPLATE_GET('/api/logo_title/list/logo', data, resolve)
    })
  }
  setLogoTitle (data) {
    return new Promise((resolve) => {
      this.TEMPLATE_GET('/api/logo_title/change', data, resolve)
    })
  }
  delLogo (data) {
    return new Promise((resolve) => {
      this.TEMPLATE_GET('', data, resolve)
    })
  }
  getTitleList (data) {
    return new Promise((resolve) => {
      this.TEMPLATE_GET('/api/logo_title/list/title', data, resolve)
    })
  }
  addTitle (data) {
    return new Promise((resolve) => {
      this.TEMPLATE_GET('/api/logo_title/title', data, resolve)
    })
  }
  delTitle (data) {
    return new Promise((resolve) => {
      this.TEMPLATE_GET('', data, resolve)
    })
  }
}

export default new TmService()
