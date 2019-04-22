import dicService from '../../service/dic_service'
import tcService from '../../service/tc_service'
import util from '../../utils'

const state = {
  taskData: null,
  taskId: null,
  tableData: null,
  tableId: null,
  dicData: null,
  userDicData: [],
  userDicMap: null,
  fieldData: null,
  fieldConfig: null,
  dictConfig: null
}

const actions = {
  getDicData: ({ state, commit }, data) => {
    return new Promise((resolve) => {
      if (!state.dicData) {
        dicService.getDicConData(data).then(res => {
          if (res.status === 0) {
            commit('setDicData', res.data.list)
            resolve(res.data.list)
          } else {
            resolve(null)
          }
        })
      } else {
        resolve(state.dicData)
      }
    })
  },
  refreshTaskData: ({ commit }, data) => {
    return new Promise(resolve => {
      tcService.getTaskEditDetail(data).then(res => {
        if (res.status === 0) {
          commit('setTaskEditData', res.data.task)

          resolve()
        }
      })
    })
  },
  getEditDetail: ({ commit, state }, data) => {
    return new Promise(resolve => {
      if (!state.taskData) {
        tcService.getTaskEditDetail(data).then(res => {
          if (res.status === 0) {
            commit('setTaskEditData', res.data.task)
            resolve(res.data.task)
          } else {
            resolve()
          }
        })
      } else {
        resolve(state.taskData)
      }
    })
  },
  initUserDicData: ({ commit, state }, data) => {
    return new Promise(resolve => {
      tcService.getAllUserData(data).then(res => {
        if (res.status === 0) {
          commit('setUserDicData', res.data)
          commit('setUserMapDic', util.listMap(res.data, 'id'))
          resolve(res.data)
        }
      })
    })
  }
}

const getters = {}

const mutations = {
  setTaskId: (state, id) => {
    state.taskId = id
  },
  setTaskEditData: (state, data) => {
    state.taskData = data
  },
  setTaskTableData: (state, data) => {
    state.tableData = data
  },
  setTableId: (state, id) => {
    state.tableId = id
  },
  setFieldConfig: (state, data) => {
    state.fieldConfig = data
  },
  setFiledData: (state, data) => {
    state.fieldData = data
  },
  setDictConfig: (state, data) => {
    state.dictConfig = data
  },
  setDicData: (state, data) => {
    state.dicData = data
  },
  setUserDicData: (state, data) => {
    state.userDicData = data
  },
  setUserMapDic: (state, data) => {
    state.userDicMap = data
  },
  resetFieldData: (state) => {
    [
      state.fieldConfig,
      state.fieldData
    ] = []
  },
  resetDictConfig: () => {
    [
      state.dictConfig
    ] = []
  },
  resetTaskEdit: (state) => {
    [
      state.taskData,
      state.taskId,
      state.tableData,
      state.tableId
    ] = []
  }
}

export default {
  state,
  actions,
  mutations,
  getters
}
