import wtService from '../../service/wt_service'

const state = {
  folderList: null
}

const actions = {
  getFolder: ({ state, commit }, data) => {
    return new Promise(resolve => {
      if (state.folderList) {
        resolve(state.folderList)
      } else {
        wtService.getFolderList(data).then(res => {
          if (res.status === 0) {
            commit('setFolder', res.data)
            resolve(res.data)
          }
        })
      }
    })
  }
}

const mutations = {
  setFolder: (state, data) => {
    state.folderList = data
  },
  resetData: (state) => {
    [
      state.folderList
    ] = []
  }
}

const getters = {}

export default {
  state,
  actions,
  mutations,
  getters
}
