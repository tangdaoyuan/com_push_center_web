export default class Img {
  constructor (url) {
    if (url) {
      if (url.indexOf('.') > -1) {
        this.img = require(`@/assets/imgs/${url}`)
      } else {
        switch (url) {
          case 'api':
            this.img = require(`@/assets/imgs/dm-api.png`)
            break
          case 'BDP同步客户端':
            this.img = require(`@/assets/imgs/dm-client.png`)
            break
          case 'excel':
            this.img = require(`@/assets/imgs/dm-excel.png`)
            break
          case 'MySQL':
            this.img = require(`@/assets/imgs/dm-mysql.png`)
            break
          case 'Oracle':
            this.img = require(`@/assets/imgs/dm-oracle.png`)
            break
          case '消息队列':
            this.img = require(`@/assets/imgs/dm-message.png`)
            break
          case 'Kafka':
            this.img = require(`@/assets/imgs/dm-kafka.png`)
            break
          case 'Datahub流式数据源':
            this.img = require(`@/assets/imgs/dm-datahub.png`)
            break
          case 'Oracle流式数据源':
            this.img = require(`@/assets/imgs/dm-oracle.png`)
            break
          case 'hive':
            this.img = require(`@/assets/imgs/dm-hive.png`)
            break
          case '手机短信':
            this.img = require(`@/assets/imgs/nm_msg.png`)
            break
          case '警务微信':
            this.img = require(`@/assets/imgs/nm_vchat.png`)
            break
          case '钉钉':
            this.img = require(`@/assets/imgs/nm_dingding.png`)
            break
          case 'APP应用':
            this.img = require(`@/assets/imgs/nm_app.png`)
            break
          case '业务系统':
            this.img = require(`@/assets/imgs/nm_business.png`)
            break
          case '开放API':
            this.img = require(`@/assets/imgs/nm_api.png`)
            break
          case 'Web消息中心':
            this.img = require(`@/assets/imgs/nm_web.png`)
            break
          default:
            this.img = ''
        }
      }
    } else {
      this.img = ''
    }
  }
}
