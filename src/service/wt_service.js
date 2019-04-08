import Service from './index.js'

class WtService extends Service {
  getFolder (data) {
    return new Promise((resolve) => {
      this.TEMPLATE_GET('/api/folder/tree_list', data, resolve)
    })
  }

  getDataSource (data) {
    return new Promise((resolve) => {
      this.TEMPLATE_GET('/api/data_source/tree_list', data, resolve)
    })
  }

  getprewData (data) {
    return new Promise((resolve) => {
      this.TEMPLATE_POST('/api/work_table/preview', data, resolve)
    })
  }

  getTableItem (data) {
    return new Promise((resolve) => {
      this.TEMPLATE_GET('/api/work_table/item', data, resolve)
    })
  }

  getFolderItem (data) {
    return new Promise((resolve) => {
      this.TEMPLATE_GET('/api/folder/item', data, resolve)
    })
  }

  saveTable (data) {
    return new Promise((resolve) => {
      this.TEMPLATE_POST('/api/work_table/edit', data, resolve)
    })
  }

  getFieldData (data) {
    return new Promise((resolve) => {
      this.TEMPLATE_GET('/api/work_table/title/list', data, resolve)
    })
  }

  saveReName (data) {
    return new Promise((resolve) => {
      this.TEMPLATE_POST('/api/work_table/save/item', data, resolve)
    })
  }

  saveFolderItem (data) {
    return new Promise((resolve) => {
      this.TEMPLATE_POST('/api/folder/save', data, resolve)
    })
  }

  saveFolder (data) {
    return new Promise((resolve) => {
      this.TEMPLATE_POST('/api/folder/save', data, resolve)
    })
  }

  getFolderList (data) {
    return new Promise((resolve) => {
      this.TEMPLATE_GET('/api/folder/list', data, resolve)
    })
  }

  getExcelData (data) {
    return new Promise((resolve) => {
      this.TEMPLATE_POST('/api/work_table/preview', data, resolve)
    })
  }

  saveExcelData (data) {
    return new Promise((resolve) => {
      this.TEMPLATE_POST('/api/work_table/save/excel', data, resolve)
    })
  }

  saveExcelTmpData (data) {
    return new Promise((resolve) => {
      this.TEMPLATE_POST('/api/work_table/temp/save', data, resolve)
    })
  }
}

export default new WtService()
