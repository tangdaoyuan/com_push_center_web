import axios from 'axios'
import {
  Message
} from 'element-ui'
import store from '../stores'
import iView from 'iview'
import VueCookies from 'vue-cookies'

class Axios {
  axios = null
  reqCount = 0

  static getAxios () {
    if (!this.axios) {
      this.axios = axios
      this.axios.defaults.timeout = 45000
      this.axios.interceptors.request.use(config => {
        if (VueCookies.get('pc_token')) {
          config.headers.Authorization = 'Bearer ' + VueCookies.get('pc_token')
          config.headers.userId = VueCookies.get('pc_user_id')
        }
        if (this.reqCount === 0) {
          store.commit('setLoading', true)
        }
        this.reqCount++
        return config
      }, error => {
        this.reqCount--
        if (this.reqCount === 0) {
          store.commit('setLoading', false)
        }
        iView.Message({
          message: '加载超时',
          type: 'error'
        })
        return Promise.reject(error)
      })
      this.axios.interceptors.response.use(
        response => {
          this.reqCount--
          if (this.reqCount === 0) {
            store.commit('setLoading', false)
          }
          return response
        },
        error => {
          this.reqCount--
          if (this.reqCount === 0) {
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
    }
    return this.axios
  }
}

export default class Service {
  axios = null

  constructor () {
    this.axios = Axios.getAxios()
  }

  TEMPLATE_GET (str, data, resolve) {
    this.axios.get(str, {
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
    this.axios.delete(str, {
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
    this.axios.post(str, data).then(res => {
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
    this.axios.put(str, data).then(res => {
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
