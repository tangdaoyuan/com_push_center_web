import http from 'axios'
import moment from 'moment'
import $ from 'jquery'
import Vue from 'vue'

class Utils {
  fileCheck (checkList, str) {
    let res = false
    checkList.forEach(item => {
      if (item.test(str)) {
        res = true
      }
    })
    return res
  }

  getSecret () {
    return new Promise((resolve, reject) => {
      http.get('/api/data_source/secret_key').then(res => {
        if (res.status === 200 && res.data.status === 0) {
          resolve(res.data.data)
        } else {
          resolve('')
        }
      })
    })
  }

  momentDate (num, type) {
    if (num) {
      if (Object.prototype.toString.call(num) === '[object Date]') {
        num = num.getTime()
      }
      switch (type) {
        case 'date':
          return moment(parseInt(num)).format('YYYY-MM-DD')
        case 'date_h':
          return moment(parseInt(num)).format('YYYY/MM/DD')
        case 'date_time':
          return moment(parseInt(num)).format('YYYY-MM-DD HH:mm:ss')
        case 'data_h_time':
          return moment(parseInt(num)).format('YYYY/MM/DD HH:mm:ss')
        case 'data_h_time_h':
          return moment(parseInt(num)).format('YYYY/MM/DD HH:mm')
        case 'time':
          return moment(parseInt(num)).format('HH:mm:ss')
        case 'time_h':
          return moment(parseInt(num)).format('HH:mm')
      }
    } else {
      return ''
    }
  }

  getTaskStep (tableType, targetType) {
    const CONSTANT = Vue.prototype.CONSTANT

    if (tableType === CONSTANT.tableType.NORMAL) {
      return CONSTANT.taskStep.NORMAL
    } else if (tableType === CONSTANT.tableType.FLOW) {
      switch (targetType) {
        case CONSTANT.pushType.USER:
          return CONSTANT.taskStep.USER
        case CONSTANT.pushType.DATABASE:
          return CONSTANT.taskStep.DATABASE
        case CONSTANT.pushType.API:
          return CONSTANT.taskStep.API
      }
    }
  }

  getType (str) {
    const fieldReg = RegExp(/tb/)
    const folderReg = RegExp(/folder/)
    const dsReg = RegExp(/ds/)

    if (str.match(fieldReg)) {
      return 'field'
    } else if (str.match(folderReg)) {
      return 'folder'
    } else if (str.match(dsReg)) {
      return 'ds'
    } else {
      return ''
    }
  }

  checkListInner (list, item, checkStr) {
    let res = false
    list.forEach(n => {
      if (checkStr && n[checkStr] === item[checkStr]) {
        res = true
      } else if (!checkStr && n === item) {
        res = true
      }
    })
    return res
  }

  filterEmptyField (obj) {
    if (obj) {
      return obj.filter(item => {
        for (const k in item) {
          if (item[k] === undefined || item[k] == null || item[k] === '') return false
        }
        return true
      })
    }
  }

  viewGo (url) {
    const a = $(`<a href="${url}" target="_blank"></a>`)
    const dom = a.get(0)
    const e = document.createEvent('MouseEvents')

    e.initEvent('click', true, true)
    dom.dispatchEvent(e)
    a.remove()
  }

  getTDType (str) {
    switch (str) {
      case 1 | '1':
        return '手机短信'
      case 2 | '2':
        return '警务微信'
      case 3 | '3':
        return '钉钉'
      case 4 | '4':
        return 'APP应用'
      case 5 | '5':
        return '业务系统'
      case 6 | '6':
        return '开放API'
      case 0 | '0':
        return 'Web消息中心'
    }
  }

  getTDStatus (str) {
    switch (str) {
      case 1 | '1':
        return '正常'
      case 0 | '0':
        return '停用'
      case 2 | '2':
        return '异常'
    }
  }

  convertTDStatus (str) {
    switch (str) {
      case '正常':
        return 1
      case '停用':
        return 0
      case '异常':
        return 2
    }
  }

  getTaskType (str) {
    switch (str) {
      case '1' | 1:
        return '涉恐'
      case '2' | 2:
        return '涉稳'
      case '3' | 3:
        return '涉黄'
      case '4' | 4:
        return '涉毒'
    }
  }

  getTaskStatus (str) {
    switch (str) {
      case '1' | 1:
        return '正常'
      case '2' | 2:
        return '停用'
      case '3' | 3:
        return '失效'
      case '4' | 4:
        return '异常'
    }
  }

  getTaskOp (str) {
    switch (str) {
      case 'lt':
        return '小于'
      case 'gt':
        return '大于'
      case 'lte':
        return '小于等于'
      case 'gte':
        return '大于等于'
      case 'eq':
        return '等于'
      case 'neq':
        return '不等于'
      case 'contains':
        return '包含'
      case 'nocontains':
        return '不包含'
      case 'en':
        return '为空'
      case 'nn':
        return '不为空'
    }
  }

  getdmStatus (str) {
    switch (str) {
      case '0' | 0:
        return '异常'
      case '1' | 1:
        return '成功'
      case '2' | 2:
        return '正常'
      case '3' | 3:
        return '禁用'
      default:
        return ''
    }
  }

  convertDmStatus (str) {
    switch (str) {
      case '异常':
        return '0'
      case '成功':
        return 1
      case '正常':
        return 2
      case '禁用':
        return 3
      default:
        return ''
    }
  }

  taskStatus (str) {
    switch (str) {
      case 1:
      case '1':
        return '正常'
      case 2:
      case '2':
        return '停用'
      case 3:
      case '3':
        return '失效'
      case 4:
      case '4':
        return '异常'
    }
  }

  convertNwStatus (str) {
    switch (str) {
      case '正常':
        return 1
      case '停用':
        return 2
      case '失效':
        return 3
      case '异常':
        return 4
    }
  }

  getFieldType (str) {
    switch (str) {
      case 0 | '0':
        return '数值'
      case 1 | '1':
        return '文本'
      case 2 | '2':
        return '日期'
    }
  }

  coppyArray (arr) {
    return arr.map((e) => {
      if (typeof e === 'object') {
        return Object.assign({}, e)
      } else {
        return e
      }
    })
  }

  getPeriodType (str) {
    switch (str) {
      case 0 | '0':
        return '秒'
      case 1 | '1':
        return '分钟'
      case 2 | '2':
        return '小时'
      case 3 | '3':
        return '日'
      case 4 | '4':
        return '周'
      case 5 | '5':
        return '月'
    }
  }

  ipCheck (str) {
    let res = true
    const ipReg = /((25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))\.){3}(25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))/g

    if (!str) {
      res = false
    } else {
      if (str === 'localhost') {
        res = true
      } else if (!ipReg.test(str)) {
        res = false
      }
    }

    return res
  }

  portCheck (str) {
    let res = true
    const reg = /^([0-9]|[1-9]\d{1,3}|[1-5]\d{4}|6[0-4]\d{4}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$/

    if (!str) {
      res = false
    } else {
      if (!reg.test(str)) {
        res = false
      }
    }

    return res
  }

  topicCheck (str) {
    let res = true
    const reg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{5,16}$/g

    if (!str) {
      res = false
    } else {
      if (!reg.test(str)) {
        res = false
      }
    }

    return res
  }

  searchList (list, str) {
    if (str) {
      return list.filter(function (current) {
        return current.name.toLowerCase().indexOf(str.toLowerCase()) > -1
      })
    }
    return list
  }

  getNwMatch (type) {
    switch (type) {
      case 'matched':
        return '匹配成功'
      case 'unmatched':
        return '匹配失败'
      case 'push_succeed':
        return '推送成功'
      case 'push_failed':
        return '推送失败'
    }
  }

  convertTcStatus (str) {
    switch (str) {
      case '正常':
        return 1
      case '停用':
        return 2
      case '失效':
        return 3
      case '异常':
        return 4
    }
  }

  listMap (list, key) {
    const res = {}
    const each = (data) => {
      data.forEach(item => {
        res[item[key]] = {
          ...item,
          children: undefined
        }
        if (item.children && item.children.length > 0) {
          each(item.children)
        }
      })
    }
    each(list)
    return res
  }
}

export default new Utils()
