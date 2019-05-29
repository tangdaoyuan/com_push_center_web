
const state = {
  loading: false
}

const mutations = {
  setLoading: (state, data) => {
    state.loading = data
  }
}

const getters = {
  loading: state => state.loading
}

export default {
  state,
  mutations,
  getters
}
