import axios from 'axios'
import {
  Message
} from 'element-ui'
import store from '../stores'
import iView from 'iview'
import VueCookies from 'vue-cookies'

let reqCount = 0
axios.defaults.timeout = 45000
axios.interceptors.request.use(config => {
  if (VueCookies.get('pc_token')) {
    config.headers.Authorization = 'Bearer ' + VueCookies.get('pc_token')
    config.headers.userId = VueCookies.get('pc_user_id')
  }
  // console.log('request', reqCount)
  // console.log('request', config.url)
  if (reqCount === 0) {
    // iView.Spin.show()
    store.commit('setLoading', true)
    // console.log('show Spin:', config.url)
  }
  reqCount++
  return config
}, error => {
  reqCount--
  if (reqCount === 0) {
    // setTimeout(() => {
    //   iView.Spin.hide()
    // }, 300)
    store.commit('setLoading', false)
  }
  iView.Message({
    message: '加载超时',
    type: 'error'
  })
  return Promise.reject(error)
})
axios.interceptors.response.use(
  response => {
    reqCount--
    // console.log('response', reqCount)
    // console.log('response', response.config.url)
    if (reqCount === 0) {
      // setTimeout(() => {
      //   // iView.Spin.hide()
      //   store.commit('setLoading', false)
      //   console.log('hide Spin', response.config.url)
      // }, 300)
      store.commit('setLoading', false)
      // console.log('hide Spin', response.config.url)
    }
    return response
  },
  error => {
    reqCount--
    if (reqCount === 0) {
      // setTimeout(() => {
      //   iView.Spin.hide()
      // }, 300)
      store.commit('setLoading', false)
    }
    if (error.response) {
      switch (error.response.status) {
        case 401 | 403:
          // 401 清除token信息并跳转到登录页面
          Message({
            message: '登录已经失效，请重新登录',
            type: 'error'
          })
          store.commit('loginOut')
          store.commit('backLogin')
      }
    }
    return Promise.reject(error)
  }
)
export default class Service {
  TEMPLATE_GET (str, data, resolve) {
    axios.get(str, {
      params: data || {}
    }).then(res => {
      if (res.status === 200 && res.data.status === 0) {
        resolve(res.data)
      } else {
        resolve(res.data || {
          status: 1,
          msg: '请求失败'
        })
      }
    })
  }

  TEMPLATE_DELETE (str, data, resolve) {
    axios.delete(str, {
      params: data || {}
    }).then(res => {
      if (res.status === 200 && res.data.status === 0) {
        resolve(res.data)
      } else {
        resolve(res.data || {
          status: 1,
          msg: '请求失败'
        })
      }
    })
  }

  TEMPLATE_POST (str, data, resolve) {
    axios.post(str, data).then(res => {
      if (res.status === 200 && res.data.status === 0) {
        resolve(res.data)
      } else {
        resolve(res.data || {
          status: 1,
          msg: '请求失败'
        })
      }
    })
  }

  TEMPLATE_PUT (str, data, resolve) {
    axios.put(str, data).then(res => {
      if (res.status === 200 && res.data.status === 0) {
        resolve(res.data)
      } else {
        resolve(res.data || {
          status: 1,
          msg: '请求失败'
        })
      }
    })
  }
}
