import Service from './index.js'

class HomeService extends Service {
  dataSourceStatus (data) {
    return new Promise((resolve) => {
      this.TEMPLATE_GET('/api/data_source/status_count', data, resolve)
    })
  }

  dataList (data) {
    return new Promise((resolve) => {
      this.TEMPLATE_GET('/api/data_source/list', data, resolve)
    })
  }

  taskCount (data) {
    return new Promise((resolve) => {
      this.TEMPLATE_GET('/api/task/statistics', data, resolve)
    })
  }

  taskList (data) {
    return new Promise((resolve) => {
      this.TEMPLATE_GET('/api/task/list', data, resolve)
    })
  }

  passCount (data) {
    return new Promise((resolve) => {
      this.TEMPLATE_GET('/api/channel/statistics', data, resolve)
    })
  }

  passList (data) {
    return new Promise((resolve) => {
      this.TEMPLATE_GET('/api/channel/list', data, resolve)
    })
  }

  getDmBarData (data) {
    return new Promise((resolve) => {
      this.TEMPLATE_GET('/api/data_source/type_count', data, resolve)
    })
  }

  getTaskData (data) {
    return new Promise((resolve) => {
      this.TEMPLATE_GET('/api/task/statistics/type', data, resolve)
    })
  }

  getChanneldata (data) {
    return new Promise((resolve) => {
      this.TEMPLATE_GET('/api/channel/statistics/type', data, resolve)
    })
  }

  getDataPie (data) {
    return new Promise((resolve) => {
      this.TEMPLATE_GET('/api/data_source/status_count', data, resolve)
    })
  }

  getTaskPie (data) {
    return new Promise((resolve) => {
      this.TEMPLATE_GET('/api/task/statistics', data, resolve)
    })
  }

  getChannelPie (data) {
    return new Promise((resolve) => {
      this.TEMPLATE_GET('/api/channel/statistics', data, resolve)
    })
  }
}

export default new HomeService()
