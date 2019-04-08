class CONSTANT {
  dmTypeList = [
    {
      label: 'BDP同步客户端',
      value: 1
    },
    {
      label: '消息队列',
      value: 2
    },
    {
      label: 'api',
      value: 3
    },
    {
      label: 'excel',
      value: 4
    },
    {
      label: 'Oracle',
      value: 5
    },
    {
      label: 'MySql',
      value: 6
    }
  ]

  DIC_TYPE_PARAMS = {
    type_id: 'dic_t_task_type'
  }

  taskOpVal = [
    {
      name: '等于',
      value: 'eq'
    },
    {
      name: '等于并向下检索',
      value: 'like'
    }
  ]

  pushTypeList = [
    {
      name: '实时',
      type: 1
    },
    // {
    //   name: '工作日',
    //   type: 2
    // },
    // {
    //   name: '自定义',
    //   type: 3
    // },
    {
      name: '小时',
      type: 4
    },
    {
      name: '日',
      type: 5
    },
    {
      name: '周',
      type: 6
    },
    {
      name: '月',
      type: 7
    }
  ]

  weekDayList = [
    {
      name: '星期一',
      value: 'monday'
    },
    {
      name: '星期二',
      value: 'tuesday'
    },
    {
      name: '星期三',
      value: 'wednesday'
    },
    {
      name: '星期四',
      value: 'thursday'
    },
    {
      name: '星期五',
      value: 'friday'
    },
    {
      name: '星期六',
      value: 'saturday'
    },
    {
      name: '星期日',
      value: 'sunday'
    }
  ]

  // 数据源排序方式
  dmOrderBy = [
    {
      label: '按同步次数升序',
      value: 'count_asc'
    },
    {
      label: '按同步次数降序',
      value: 'count_desc'
    },
    {
      label: '按创建时间升序',
      value: 'create_asc'
    },
    {
      label: '按创建时间降序',
      value: 'create_desc'
    },
    {
      label: '按最近同步时间升序',
      value: 'update_asc'
    },
    {
      label: '按最近同步时间降序',
      value: 'update_desc'
    }
  ]
  // 任务管理排序方式
  tcOrderBy = [
    {
      label: '按今日推送次数升序',
      value: 'today_asc'
    },
    {
      label: '按今日推送次数降序',
      value: 'today_desc'
    },
    {
      label: '按历史推送次数升序',
      value: 'total_asc'
    },
    {
      label: '按历史推送次数降序',
      value: 'total_desc'
    },
    {
      label: '按最近推送时间升序',
      value: 'push_asc'
    },
    {
      label: '按最近推送时间降序',
      value: 'push_desc'
    }
  ]
  // 任务监控排序方式
  nwOrderBy = [
    {
      label: '按最近推送时间升序',
      value: 'push_asc'
    },
    {
      label: '按最近推送时间降序',
      value: 'push_desc'
    },
    {
      label: '按匹配成功数量升序',
      value: 'matched_asc'
    },
    {
      label: '按匹配成功数量降序',
      value: 'matched_desc'
    },
    {
      label: '按匹配失败数量升序',
      value: 'unmatched_asc'
    },
    {
      label: '按匹配失败数量降序',
      value: 'unmatched_desc'
    },
    {
      label: '按推送成功数量升序',
      value: 'succeed_asc'
    },
    {
      label: '按推送成功数量降序',
      value: 'succeed_desc'
    },
    {
      label: '按推送失败数量升序',
      value: 'failed_asc'
    },
    {
      label: '按推送失败数量降序',
      value: 'failed_desc'
    }
  ]
  // 通道管理排序方式
  nmOrderBy = [
    {
      label: '按最近同步时间升序',
      value: 'time_asc'
    },
    {
      label: '按最近同步时间降序',
      value: 'time_desc'
    },
    {
      label: '按累计推送次数升序',
      value: 'total_asc'
    },
    {
      label: '按累计推送次数降序',
      value: 'total_desc'
    }
  ]
  // 数据源统计数据
  dmStatistics = {
    'total': '全部',
    'open': '正常',
    'failed': '异常',
    'closed': '禁用'
  }

  // 推送任务统计
  tcStatistics = {
    'total': '全部',
    'normal': '正常',
    'error': '异常',
    'failed': '失效',
    'closed': '停用'
  }

  // 任务监控统计数据
  nwStatistics = {
    'total': '全部',
    'closed': '停用',
    'error': '异常',
    'failed': '失效',
    'normal': '正常'
  }

  nmStatistics = {
    'total': '全部',
    'normal': '正常',
    'error': '异常',
    'closed': '停用'
  }

  connectList = [
    {
      label: 'BASIC',
      value: 0
    },
    {
      label: 'TNS',
      value: 1
    }
  ]

  timeList = [
    {
      label: '秒',
      value: 0
    },
    {
      label: '分',
      value: 1
    },
    {
      label: '小时',
      value: 2
    },
    {
      label: '日',
      value: 3
    },
    {
      label: '周',
      value: 4
    },
    {
      label: '月',
      value: 5
    }
  ]

  incrementList = [
    {
      label: '序列',
      value: 0
    },
    {
      label: '时间',
      value: 1
    }
  ]

  dmFiledTypeList = [
    {
      label: '数值',
      value: 0
    },
    {
      label: '文本',
      value: 1
    },
    {
      label: '日期',
      value: 2
    }
  ]

  nmTypeList = [
    {
      label: '手机短信',
      value: '1'
    },
    {
      label: '警务微信',
      value: '2'
    },
    {
      label: '钉钉',
      value: '3'
    },
    {
      label: 'APP应用',
      value: '4'
    },
    {
      label: '业务系统',
      value: '5'
    },
    {
      label: '开放API',
      value: '6'
    },
    {
      label: 'Web消息中心',
      value: '0'
    }
  ]

  nmRadioList = [
    {
      name: '手机短信',
      value: 1
    },
    {
      name: '警务微信',
      value: 2
    },
    {
      name: '钉钉',
      value: 3
    },
    {
      name: 'APP应用',
      value: 4
    },
    {
      name: '业务系统',
      value: 5
    },
    {
      name: '开放API',
      value: 6
    },
    {
      name: 'Web消息中心',
      value: 0
    }
  ]

  taskTypeList = [
    {
      label: '涉恐预警',
      value: 1
    },
    {
      label: '涉稳预警',
      value: 2
    },
    {
      label: '涉黄预警',
      value: 3
    },
    {
      label: '涉毒预警',
      value: 4
    }
  ]

  statusList = [
    {
      label: '正常',
      id: '1',
      value: 1
    },
    {
      label: '关闭',
      id: '2',
      value: 2
    },
    {
      label: '失效',
      id: '3',
      value: 3
    },
    {
      label: '异常',
      id: '4',
      value: 4
    }
  ]

  tsTypeList = [
    {
      name: '等于',
      value: 'eq'
    },
    {
      name: '大于',
      value: 'gt'
    },
    {
      name: '小于',
      value: 'lt'
    },
    {
      name: '大于等于',
      value: 'gte'
    },
    {
      name: '小于等于',
      value: 'lte'
    },
    {
      name: '不等于',
      value: 'neq'
    }
  ]

  tsTypeListAll = [
    [
      {
        name: '等于',
        value: 'eq'
      },
      {
        name: '大于',
        value: 'gt'
      },
      {
        name: '小于',
        value: 'lt'
      },
      {
        name: '大于等于',
        value: 'gte'
      },
      {
        name: '小于等于',
        value: 'lte'
      },
      {
        name: '不等于',
        value: 'neq'
      },
      {
        name: '为空',
        value: 'en'
      },
      {
        name: '不为空',
        value: 'nn'
      }
    ],
    [
      {
        name: '等于',
        value: 'eq'
      },
      {
        name: '不等于',
        value: 'neq'
      },
      {
        name: '包含',
        value: 'contains'
      },
      {
        name: '不包含',
        value: 'nocontains'
      },
      {
        name: '为空',
        value: 'en'
      },
      {
        name: '不为空',
        value: 'nn'
      }
    ],
    [
      {
        name: '为空',
        value: 'en'
      },
      {
        name: '不为空',
        value: 'nn'
      },
      {
        name: '时间范围',
        value: 'range'
      }
    ]
  ]

  tsFilterTypeList = [
    {
      name: '全部条件',
      value: 1
    },
    {
      name: '任意条件',
      value: 0
    }
  ]

  tsTdMap = {
    'api': '开放API',
    'app': 'APP应用',
    'bs': '业务系统',
    'ding_talk': '钉钉',
    'sms': '短信通道',
    'wechat': '警务微信',
    'web': '推送中心'
  }

  filterTypeList = [
    {
      value: '=',
      name: '等于'
    },
    {
      value: '!=',
      name: '不等于'
    },
    {
      value: '>',
      name: '大于'
    },
    {
      value: '<',
      name: '小于'
    },
    {
      value: '>=',
      name: '大于等于'
    },
    {
      value: '<=',
      name: '小于等于'
    },
    {
      value: 'like',
      name: '包含'
    },
    {
      value: 'not like',
      name: '不包含'
    }
  ]

  filterType = [
    {
      label: '全部条件',
      value: 'and'
    },
    {
      label: '任意条件',
      value: 'or'
    }
  ]

  compareType = [
    {
      value: '>',
      label: '>'
    },
    {
      value: '>=',
      label: '>='
    }
  ]

  dateType = [
    {
      value: 'before',
      label: '前'
    },
    {
      value: 'after',
      label: '后'
    }
  ]

  increaseType = [
    {
      value: 'maximum',
      label: '上次同步最大值'
    },
    {
      value: 'relativetime',
      label: '相对时间',
      disabled: true
    }
  ]

  dataDic = {
    'api': '开放API',
    'bdp': '同步客户端',
    'excel': 'excel导入',
    'mysql': 'MySql',
    'oracle': 'Oracle',
    'queue': '消息队列'
  }

  taskDic = {
    'terrorist': '涉恐预警',
    'stable': '涉稳预警',
    'porn': '涉黄预警',
    'drug': '涉毒预警'
  }

  channelDic = {
    'sms': '短信通道',
    'web': 'web消息中心',
    'wechat': '警务微信',
    'ding_talk': '钉钉',
    'app': '移动APP',
    'bs': '业务系统',
    'api': '开放API'
  }

  dictionary = [
    {
      value: 'zidian1',
      label: '字典1'
    },
    {
      value: 'zidian2',
      label: '字典2'
    },
    {
      value: 'zidian3',
      label: '字典3'
    }
  ]
}

export default new CONSTANT()
