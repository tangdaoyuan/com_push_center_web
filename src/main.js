// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import iView from 'iview'
import Vuex from 'vuex'
import ElementUI from 'element-ui'
import VueLodash from 'vue-lodash'
import echarts from 'echarts'

import './libs/assets/bootstrap-suggest.css'
import 'iview/dist/styles/iview.css'
import 'element-ui/lib/theme-chalk/index.css'
import './assets/sass/main.scss'
import './pwa/registerServiceWorker'
import Img from './assets/getImg'

import './libs/js/jquery.min'
import './libs/js/highlight'
import './libs/js/bootstrap-suggest'

import store from './stores'
import CONSTANT from './beans/bean'
import Utils from './utils'
import router from './router'
import draggable from 'vuedraggable'

const VueCookie = require('vue-cookies')

const options = {
  name: 'lodash'
}

Vue.use(ElementUI)
Vue.use(iView)
Vue.use(Vuex)
Vue.use(VueLodash, options)
Vue.use(VueCookie)

Vue.prototype.$echarts = echarts
Vue.config.productionTip = false
Vue.config.devtools = true
Vue.prototype.CONSTANT = CONSTANT
Vue.prototype.utils = Utils
Vue.prototype.Img = Img
Vue.prototype.$query = window.$

Vue.component('draggable', draggable)

const components = require.context('./components/', true, /\.vue$/)
components.keys().forEach(item => {
  const tmpKey = item.split('/')[item.split('/').length - 1].replace(/.vue/g, '')
  Vue.component(tmpKey, components(item).default)
})

const modals = require.context('./modals/', true, /\.vue$/)
modals.keys().forEach(item => {
  const tmpKey = item.split('/')[item.split('/').length - 1].replace(/.vue/g, '')
  Vue.component(tmpKey, modals(item).default)
})

const services = require.context('./service/', true, /\.js$/)
services.keys().forEach(item => {
  if (item !== './index.js') {
    const tmpKey = item.split('/')[item.split('/').length - 1].replace(/_service.js/g, 'Service')
    Vue.prototype[tmpKey] = services(item).default
  }
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
}).$mount('#app')
