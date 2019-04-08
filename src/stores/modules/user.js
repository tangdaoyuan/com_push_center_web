import userService from '../../service/user_service'
import router from '../../router'

const state = {
  isLogin: false,
  login_user_data: {},
  loginUrl: '',
  groupList: null,
  roleEditData: null,
  chooseRoleId: null,
  userRoleCache: null,
  userCache: null
}

const actions = {
  getUserGroupList ({ state, commit }, data) {
    return new Promise(resolve => {
      if (!state.groupList) {
        userService.getGroupList(data).then(res => {
          if (res.status === 0) {
            commit('setGroupList', res.data)
            resolve(res.data)
          } else {
            resolve(null)
          }
        })
      } else {
        resolve(state.groupList)
      }
    })
  },
  getRoleEditData ({ state, commit }, data) {
    return new Promise(resolve => {
      if (!state.roleEditData) {
        userService.getRoleInfo(data).then(res => {
          if (res.status === 0) {
            commit('setRoleEditData', res.data)
            resolve(res.data)
          } else {
            resolve(null)
          }
        })
      } else {
        resolve(state.roleEditData)
      }
    })
  },

  getRoleByUser ({ state, commit }, data) {
    return new Promise(resolve => {
      if (!state.userRoleCache) {
        userService.getRoleByUser(data).then(res => {
          if (res.status === 0) {
            commit('setUserRoleCache', res.data)
            resolve(res.data)
          } else {
            resolve(null)
          }
        })
      } else {
        resolve(state.userRoleCache)
      }
    })
  }

}

const getters = {
  isLogin: state => state.isLogin
}

const mutations = {
  getLoginStatus (state) {
    state.isLogin = localStorage.getItem('isLogin')
  },
  loginIn (state, data) {
    state.isLogin = true
    localStorage.setItem('isLogin', true)
    localStorage.setItem('login_user_data', JSON.stringify(data))
  },
  logOut (state) {
    state.isLogin = false
    localStorage.clear()
    localStorage.setItem('isLogin', false)
  },
  setLogin (state, url) {
    state.loginUrl = url
  },
  backLogin (state) {
    if (process.env.NODE_ENV === 'development') {
      router.replace({
        path: '/login?status=1'
      })
    } else {
      window.location.href = state.loginUrl
    }
  },
  setRoleId (state, data) {
    state.chooseRoleId = data
  },
  setGroupList (state, data) {
    state.groupList = data
  },
  setRoleEditData (state, data) {
    state.roleEditData = data
  },
  setUserRoleCache (state, data) {
    state.userRoleCache = data
  },
  setUserCache (state, data) {
    state.userCache = data
  },
  resetUserDataCache (state) {
    [state.userCache] = []
  },
  resetUserRoleCache (state) {
    [state.userRoleCache] = []
  },
  resetRoleId (state) {
    [state.chooseRoleId] = []
  },
  resetRoleEditData (state) {
    [state.roleEditData] = []
  },
  resetUserCache (state) {
    [state.groupList] = []
  }
}

export default {
  state,
  actions,
  mutations,
  getters
}
