import Service from './index.js'

class TcService extends Service {
  getTaskList (data) {
    return new Promise((resolve) => {
      this.TEMPLATE_GET('/api/task/list', data, resolve)
    })
  }

  getStatusCount (data) {
    return new Promise((resolve) => {
      this.TEMPLATE_GET('/api/task/statistics', data, resolve)
    })
  }

  saveTaskEdit (data) {
    return new Promise((resolve) => {
      this.TEMPLATE_PUT('/api/task', data, resolve)
    })
  }

  addTask (data) {
    return new Promise((resolve) => {
      this.TEMPLATE_POST('/api/task/basic', data, resolve)
    })
  }

  getTaskDetail (data) {
    return new Promise((resolve) => {
      this.TEMPLATE_GET('/api/task', data, resolve)
    })
  }

  saveTask1Seting (data) {
    return new Promise((resolve) => {
      this.TEMPLATE_POST('/api/task/table', data, resolve)
    })
  }

  saveTask2Seting (data) {
    return new Promise((resolve) => {
      this.TEMPLATE_POST('/api/task/task_fields', data, resolve)
    })
  }

  saveTask3Seting (data) {
    return new Promise((resolve) => {
      this.TEMPLATE_POST('/api/task/push_users', data, resolve)
    })
  }

  saveTask4Setting (data) {
    return new Promise((resolve) => {
      this.TEMPLATE_POST('/api/task/view_users', data, resolve)
    })
  }

  saveTask5Setting (data) {
    return new Promise((resolve) => {
      this.TEMPLATE_POST('/api/task/task_remains', data, resolve)
    })
  }

  getTaskDict (data) {
    return new Promise((resolve) => {
      this.TEMPLATE_GET('/api/task/match_dic', data, resolve)
    })
  }

  getUserTagList (data) {
    return new Promise((resolve) => {
      this.TEMPLATE_GET('/api/account/user/portraits_list', data, resolve)
    })
  }

  getGroupList (data) {
    return new Promise((resolve) => {
      this.TEMPLATE_GET('/api/account/user/group_list', data, resolve)
    })
  }

  getGroupItem (data) {
    return new Promise((resolve) => {
      this.TEMPLATE_GET('/api/account/user/expand_group', data, resolve)
    })
  }

  getSearchUser (data) {
    return new Promise((resolve) => {
      this.TEMPLATE_GET('/api/account/user/group_users', data, resolve)
    })
  }

  getChannelsData (data) {
    return new Promise((resolve) => {
      this.TEMPLATE_GET('/api/task/channels', data, resolve)
    })
  }

  getTaskEditDetail (data) {
    return new Promise((resolve) => {
      this.TEMPLATE_GET('/api/task/item', data, resolve)
    })
  }

  changeStatus (data) {
    return new Promise((resolve) => {
      this.TEMPLATE_PUT('/api/task/switch', data, resolve)
    })
  }

  editStep2 (data) {
    return new Promise((resolve) => {
      this.TEMPLATE_PUT('/api/task/filter_list', data, resolve)
    })
  }

  editStep2Filter (data) {
    return new Promise((resolve) => {
      this.TEMPLATE_PUT('/api/task/task_fields', data, resolve)
    })
  }

  editstep3 (data) {
    return new Promise((resolve) => {
      this.TEMPLATE_PUT('/api/task/task_users', data, resolve)
    })
  }

  editstep4 (data) {
    return new Promise((resolve) => {
      this.TEMPLATE_PUT('/api/task/task_channels', data, resolve)
    })
  }

  edit4FavUser (data) {
    return new Promise((resolve) => {
      this.TEMPLATE_PUT('/api/task/view_users', data, resolve)
    })
  }

  getTempList (data) {
    return new Promise((resolve) => {
      this.TEMPLATE_GET('/api/fast_push/model/list', data, resolve)
    })
  }

  getModelData (data) {
    return new Promise((resolve) => {
      this.TEMPLATE_GET('/api/fast_push/model/table_list', data, resolve)
    })
  }

  getTableSchema (data) {
    return new Promise((resolve) => {
      this.TEMPLATE_GET('/api/fast_push/model/table_schema', data, resolve)
    })
  }

  saveShortTask (data) {
    return new Promise((resolve) => {
      this.TEMPLATE_POST('/api/fast_push/task/save', data, resolve)
    })
  }

  getUserlist (data) {
    return new Promise((resolve) => {
      this.TEMPLATE_GET('/api/role_permission/user/list', data, resolve)
    })
  }

  getRoleList (data) {
    return new Promise((resolve) => {
      this.TEMPLATE_GET('/api/role_permission/role/list', data, resolve)
    })
  }

  saveRole (data) {
    return new Promise((resolve) => {
      this.TEMPLATE_POST('/api/role_permission/user/role', data, resolve)
    })
  }

  getRootDicData (data) {
    return new Promise((resolve) => {
      this.TEMPLATE_GET('/api/role_permission/permission/list', data, resolve)
    })
  }

  getRoleData (data) {
    return new Promise((resolve) => {
      this.TEMPLATE_GET('/api/role_permission/role/list', data, resolve)
    })
  }

  getAllUserData (data) {
    return new Promise((resolve) => {
      this.TEMPLATE_GET('/api/account/user/group_users', data, resolve)
    })
  }

  deleteTaskItem (data) {
    return new Promise((resolve) => {
      this.TEMPLATE_DELETE('/api/task/del', data, resolve)
    })
  }

  getFavList (data) {
    return new Promise((resolve) => {
      this.TEMPLATE_GET('/api/account/user/collect_list', data, resolve)
    })
  }

  saveFavList (data) {
    return new Promise((resolve) => {
      this.TEMPLATE_POST('/api/account/user/collect/save', data, resolve)
    })
  }
}

export default new TcService()
