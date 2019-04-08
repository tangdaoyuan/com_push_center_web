<template>
  <Modal class="td-main-home" v-model="value">
    <div class="modal-header" slot="header">
      <span>任务详情</span>
      <Icon type="md-close" @click="back($event)" />
    </div>
    <div class="td-body">
      <div class="td-body-header">
        <span>任务名称</span>
        <span>{{detail.name}}</span>
        <span>任务类型</span>
        <span>{{detail.type_name}}</span>
        <span>对应工作表</span>
        <span>{{detail.table_name}}</span>
      </div>
      <div class="td-body-main">
        <div class="td-body-item">
          <div class="item-header">
            <i></i>
            <span>数据筛选规则</span>
          </div>
          <div class="item-main">
            <div class="item-box">
              <div class="item-title">满足下列</div>
              <div class="item-con" v-show="detail.filter_logic === 1">全部条件</div>
              <div class="item-con" v-show="!detail.filter_logic || detail.filter_logic === 0">任意条件</div>
            </div>
            <div class="item-box" v-for="(item, index) in detail.filter_list" :key="index">
              <div class="item-title"></div>
              <div class="item-con">
                <span>{{item.field_name}}</span>
                <span>{{utils.getTaskOp(item.op)}}</span>
                <span v-if="item.op === 'range' && item.value && item.value[0] && item.value[1]">
                  在{{utils.momentDate(new Date(item.value[0]).getTime(), 'date_time')}}~{{utils.momentDate(new Date(item.value[1]).getTime(), 'date_time')}}之间
                </span>
                <span v-else-if="item.op === 'range' && item.value && item.value[0]">
                  从{{utils.momentDate(new Date(item.value[0]).getTime(), 'date_time')}}开始
                </span>
                <span v-else-if="item.op === 'range' && item.value && item.value[1]">
                  在{{utils.momentDate(new Date(item.value[1]).getTime(), 'date_time')}}之前
                </span>
                <span v-if="item.op !== 'range'">{{item.value}}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="td-body-item">
          <div class="item-header">
            <i></i>
            <span>任务字段</span>
          </div>
          <div class="item-main">
            <div class="item-box">
              <div class="item-title">预警列表</div>
              <div class="item-con">
                <span v-for="(item, index) in detail.task_fields.alarm_fields" :key="index">{{item.field_name}}</span>
              </div>
            </div>
            <div class="item-box">
              <div class="item-title">筛选器</div>
              <div class="item-con">
                <span v-for="(item, index) in detail.task_fields.filter_fields" :key="index">{{item.field_name}}</span>
              </div>
            </div>
            <div class="item-box">
              <div class="item-title">详情页面</div>
              <div class="item-con">
                <span v-for="(item, index) in detail.task_fields.detail_fields" :key="index">{{item.field_name}}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="td-body-item">
          <div class="item-header">
            <i></i>
            <span>推送规则</span>
          </div>
          <div class="item-main" v-for="(n, i) in ((detail.task_users && detail.task_users.push_rule_list) || [])" :key="i">
            <div class="item-box" v-if="n.push_type === 1">
              <div class="item-title">推送用户</div>
              <div class="item-con">
                <div v-for="(item, index) in n.push_target" :key="index">
                  <span>{{item.field_name}}</span>
                  <span v-show="!item.op || item.op !== 'task_type_choosed'">等于</span>
                  <span v-show="item.op && item.op === 'task_type_choosed'">等于并向下检索</span>
                  <span>{{item.target.match_desc}}</span>
                </div>
              </div>
            </div>
            <div class="item-box" v-if="n.push_type === 2">
              <div class="item-title">推送用户</div>
              <div class="item-con">
                <span
                  v-for="(item, index) in (n.push_target[0].target.user_name_list || [])"
                  :key="index">
                  {{item}}
                </span>
              </div>
            </div>
            <div class="item-box" v-if="n.push_type === 2">
              <div class="item-title">推送群组</div>
              <div class="item-con">
                <span
                  v-for="(item, index) in (n.push_target[0].target.group_name_list || [])"
                  :key="index">
                  {{item}}
                </span>
              </div>
            </div>
            <div class="item-box">
              <div class="item-title">用户标签</div>
              <div class="item-con">
                <span v-for="(v, k) in n.portraits_name_map" :key="k">
                  <span>{{k}}:</span>
                  <span v-for="(m, index) in v" :key="index">{{m}}</span>
                </span>
              </div>
            </div>
          </div>
        </div>
        <div class="td-body-item">
          <div class="item-header">
            <i></i>
            <span>关注用户</span>
          </div>
          <div class="item-main">
            <div class="item-box">
              <div class="item-title">用户</div>
              <div class="item-con">
                <span v-for="(item, index) in detail.task_users.view_user_name_list" :key="index">{{item}}</span>
              </div>
            </div>
          </div>
          <div class="item-main">
            <div class="item-box">
              <div class="item-title">群组</div>
              <div class="item-con">
                <span v-for="(item, index) in detail.task_users.view_group_name_list" :key="index">{{item}}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="td-body-item">
          <div class="item-header">
            <i></i>
            <span>推送通道</span>
          </div>
          <div class="item-main">
            <div v-for="(v, k) in detail.task_channels" :key="k" v-show="k !== 'push_end_time' && k !== 'push_start_time'">
              <div class="item-box" >
                <div class="item-title">{{CONSTANT.tsTdMap[k]}}</div>
                <div class="item-con">
                  <span v-for="(item, index) in v.channel_name_list" :key="index">{{item}}</span>
                </div>
              </div>
              <div class="item-box">
                <div class="item-title">消息内容</div>
                <div class="item-con">
                  <span>{{v.msg}}</span>
                </div>
              </div>
              <div class="item-box line">
                <div class="item-title">推送周期</div>
                <div class="item-con">
                  <span v-show="v.period_type === 1">及时推送</span>
                  <span v-show="v.period_type === 2">工作日推送</span>
                  <span v-show="v.period_type === 3"
                    class="time"
                    v-for="(item, index) in v.period_list"
                    :key="index">
                    {{utils.momentDate(item.start_time, 'data_h_time_h')}}-{{utils.momentDate(item.end_time, 'data_h_time_h')}}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="td-body-item">
          <div class="item-header">
            <i></i>
            <span>推送时间</span>
          </div>
          <div class="item-main">
            <div class="item-box">
              <div class="item-title">推送时间</div>
              <div class="item-con">
                <span class="time">{{utils.momentDate(detail.push_start_time, 'data_h_time_h')}}-{{utils.momentDate(detail.push_end_time, 'data_h_time_h')}}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="td-body-item">
          <div class="item-header">
            <i></i>
            <span>反馈字典</span>
          </div>
          <div class="item-main">
            <div class="item-box">
              <div class="item-title">反馈字典</div>
              <div class="item-con">
                <span class="time">{{detail.dic_type_name}}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="modal-footer" slot="footer">
    </div>
  </Modal>
</template>
<script>
export default {
  props: {
    value: Boolean,
    detailId: String
  },
  data () {
    return {
      dic_name: '',
      detail: {
        task_fields: {
          alarm_fields: [],
          filter_fields: [],
          detail_fields: []
        },
        task_users: {
          portraits_name_list: []
        },
        task_channels: {
          api: {
            channel_name_list: [],
            period_list: [],
            period_type: ''
          },
          app: {
            channel_name_list: [],
            period_list: []
          },
          bs: {
            channel_name_list: [],
            period_list: [],
            period_type: ''
          },
          ding_talk: {
            channel_name_list: [],
            period_list: []
          },
          sms: {
            channel_name_list: [],
            period_list: [],
            period_type: ''
          },
          weChat: {
            channel_name_list: [],
            period_list: []
          },
          web: {
            channel_name_list: [],
            period_list: [],
            period_type: ''
          }
        }
      }
    }
  },
  methods: {
    close () {
      this.$emit('close')
    },
    searchDetail () {
      this.tcService.getTaskDetail({
        id: this.detailId
      }).then(res => {
        if (res.status === 0) {
          this.detail = res.data
        }
      })
    },
    back (e) {
      e.stopPropagation()
      this.close()
    }
  },
  watch: {
    value () {
      if (this.value) {
        this.searchDetail()
      }
    }
  }
}
</script>
