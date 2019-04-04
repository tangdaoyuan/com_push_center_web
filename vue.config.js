const devProxy = require('./proxy.conf.js')

const proEnv = require('./config/pro.env') // 生产环境
const uatEnv = require('./config/uat.env') // 测试环境
const devEnv = require('./config/dev.env') // 本地环境
const env = process.env.NODE_ENV
let target = ''

switch (env) {
  case 'production':
    target = proEnv.hosturl
    break
  case 'test':
    target = uatEnv.hosturl
    break
  case 'development':
    target = devEnv.hosturl
    break
}

// 生成代理配置对象
let proxyObj = {}
for (let key in devProxy) {
  proxyObj[key] = {
    target: devProxy[key].target,
    changeOrigin: devProxy[key].changeOrigin,
    pathRewrite: {
      [`^${key}`]: key
    }
  }
}

module.exports = {
  devServer: {
    // open: process.platform === 'darwin',
    host: '0.0.0.0',
    port: 8080,
    https: false,
    hotOnly: false,
    // See https://github.com/vuejs/vue-cli/blob/dev/docs/cli-service.md#configuring-proxy
    proxy: proxyObj, // string | Object
    before: app => {}
  }
}
