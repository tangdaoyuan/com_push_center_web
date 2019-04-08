import Service from './index.js'

class DmService extends Service {
  getWorktableData (data) {
    return new Promise((resolve) => {
      this.TEMPLATE_GET('/api/data_source/list', data, resolve)
    })
  }

  searchCount (data) {
    return new Promise((resolve) => {
      this.TEMPLATE_GET('/api/data_source/status_count', data, resolve)
    })
  }

  getMsgTmpData (data) {
    return new Promise((resolve) => {
      this.TEMPLATE_GET('/api/data_source/temp/get', data, resolve)
    })
  }

  saveApiData (data) {
    return new Promise((resolve) => {
      this.TEMPLATE_POST('/api/data_source/save', data, resolve)
    })
  }

  editApiData (data) {
    return new Promise((resolve) => {
      this.TEMPLATE_PUT('/api/data_source', data, resolve)
    })
  }

  editBdpData (data) {
    return new Promise((resolve) => {
      this.TEMPLATE_PUT('/api/data_source/bdp', data, resolve)
    })
  }

  saveEditData (data) {
    return new Promise((resolve) => {
      this.TEMPLATE_PUT('/api/data_source/field', data, resolve)
    })
  }

  getMysqlSchema (data) {
    return new Promise((resolve) => {
      this.TEMPLATE_GET('/api/data_source/schema', data, resolve)
    })
  }

  saveMsgTmpData (data) {
    return new Promise((resolve) => {
      this.TEMPLATE_POST('/api/data_source/temp/save', data, resolve)
    })
  }

  saveMsgData (data) {
    return new Promise((resolve) => {
      this.TEMPLATE_POST('/api/data_source/queue/save', data, resolve)
    })
  }

  changeStatus (data) {
    return new Promise((resolve) => {
      this.TEMPLATE_POST('/api/data_source/update', data, resolve)
    })
  }

  checkTopic (data) {
    return new Promise((resolve) => {
      this.TEMPLATE_GET('/api/data_source/topic/check', data, resolve)
    })
  }

  editBdpTable (data) {
    return new Promise((resolve) => {
      this.TEMPLATE_PUT('/api/data_source/bdp/table', data, resolve)
    })
  }

  openDetail (data) {
    return new Promise((resolve) => {
      this.TEMPLATE_GET('/api/data_source/detail', data, resolve)
    })
  }

  getSyncClientUrl (data) {
    return new Promise((resolve) => {
      this.TEMPLATE_GET('/api/data_source/bdp_url', data, resolve)
    })
  }

  connectBdp (data) {
    return new Promise((resolve) => {
      this.TEMPLATE_POST('/api/data_source/bdp/connector', data, resolve)
    })
  }

  getBdpTree (data) {
    return new Promise((resolve) => {
      this.TEMPLATE_GET('/api/data_source/bdp/connector/tree', data, resolve)
    })
  }

  getTableInfo (data) {
    return new Promise((resolve) => {
      this.TEMPLATE_POST('/api/data_source/bdp/connector/table', data, resolve)
    })
  }

  searchAbnormalList (data) {
    return new Promise((resolve) => {
      this.TEMPLATE_GET('/api/exception_record/list', data, resolve)
    })
  }

  getDmTable (data) {
    return new Promise((resolve) => {
      this.TEMPLATE_GET('/api/data_source/table_list', data, resolve)
    })
  }
}

export default new DmService()
