import Service from './index.js'

class UserService extends Service {
  getGroupList (data) {
    return new Promise((resolve) => {
      this.TEMPLATE_GET('/api/account/user/group_list', data, resolve)
    })
  }

  saveRoleData (data) {
    return new Promise((resolve) => {
      this.TEMPLATE_POST('/api/role_permission/role/save', data, resolve)
    })
  }

  getRoleInfo (data) {
    return new Promise((resolve) => {
      this.TEMPLATE_GET('/api/role_permission/role', data, resolve)
    })
  }

  deleteRole (data) {
    return new Promise((resolve) => {
      this.TEMPLATE_DELETE('/api/role_permission/role/del', data, resolve)
    })
  }

  saveAllotUser (data) {
    return new Promise((resolve) => {
      this.TEMPLATE_POST('/api/role_permission/user/role', data, resolve)
    })
  }

  getRoleByUser (data) {
    return new Promise((resolve) => {
      this.TEMPLATE_GET('/api/role_permission/user/role_list', data, resolve)
    })
  }

  getRoleList (data) {
    return new Promise((resolve) => {
      this.TEMPLATE_GET('/api/role_permission/role/list', data, resolve)
    })
  }
}

export default new UserService()
