<template>
  <div class="step-body" v-show="step === 3">
    <task-user-push
      v-model="taskUserModal"
      @changePushUserList="changePushUserList"
      @changeTarget="changeTarget"
      :tb-list="tbList"
      :tag-list="tagList"
      :group-list="groupList"
      :push-user-list="pushUserList"
      :index="chooseIndex"
      :filter-list="filterList"
      @ok="ok"
      @close="closeTaskUser"/>
    <task-fav-user
      :edit-id="editId"
      :filter-list="filterList"
      :fav-list="favList"
      @saveFav="saveFav"
      @close="closeTaskFavUser"
      v-model="taskFavUserModal"/>
    <div class="step-push-body">
      <div class="step-push-header">
        <span class="title-text">配置推送条件</span>
        <div class="op-box" @click="favUser($event)">
          <div class="op-star">
            <el-button icon="el-icon-star-on" circle type="primary"></el-button>
            <span>关注用户</span>
          </div>
          <div class="op-add" @click="addFilter($event)">
            <el-button icon="el-icon-plus" circle type="primary"></el-button>
            <span>添加规则</span>
          </div>
        </div>
      </div>
      <div class="step-push-con">
        <div class="con-header">
          <label class="filter-title">满足下列</label>
          <el-select class="filter-head-select" v-model="chooseFilterType">
            <el-option v-for="item in CONSTANT.tsFilterTypeList" :key="item.value" :value="item.value" :label="item.name"></el-option>
          </el-select>
        </div>
        <ul class="con-ul">
          <li class="con-li" v-for="(item, index) in filterList" :key="index">
            <div class="show-box">
              <span>{{(item.push_type === 1) ? ('匹配推送') : ('直接推送')}}</span>
              <span v-html="item.showStr"></span>
              <span v-html="item.showTagStr"></span>
            </div>
            <div class="op-btn">
              <i slot="reference" class="op-icon el-icon-edit-outline" @click="editFilter($event, index)" ></i>
              <el-popover
                placement="top"
                width="160"
                v-model="item.showDeleteModal">
                <p>是否删掉该条匹配规则？</p>
                <div style="text-align: right; margin: 0">
                  <el-button size="mini" type="text" @click="item.showDeleteModal = false">取消</el-button>
                  <el-button type="primary" size="mini" @click="deleteFilter(item, index)">确定</el-button>
                </div>
                <i slot="reference" class="op-icon el-icon-delete"></i>
              </el-popover>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <div class="step-footer">
      <el-button v-show="!$store.state.task.taskData" @click="prev()">上一步</el-button>
      <el-button type="primary" @click="next()">{{$store.state.task.taskData ? '完成修改' : '下一步'}}</el-button>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    step: Number
  },
  data () {
    return {
      taskUserModal: false,
      taskFavUserModal: false,
      chooseFilterType: 1,
      favList: null,
      tbList: [],
      mapData: [],
      tagList: [],
      groupList: [],
      viewGroupList: [],
      filterList: [],
      tbMap: {},
      mapDataMap: {},
      pushUserList: [],
      chooseIndex: -1,
      editId: ''
    }
  },
  methods: {
    init () {
      const pro = []

      if (this.$store.state.task.tableData) {
        this.tbList = this.$store.state.task.tableData.title_list
      } else {
        pro.push(
          new Promise((resolve, reject) => {
            this.wtService.getprewData({
              page_no: 1,
              page_size: 100,
              tb_id: this.$store.state.task.tableId || (this.$store.state.task.taskData && this.$store.state.task.taskData.table_id)
            }).then(res => {
              if (res.status === 0) {
                this.tbList = res.data.title_list
                this.$store.commit('setTaskTableData', res.data)
                resolve()
              }
            })
          })
        )
      }

      Promise.all([
        ...pro,
        new Promise((resolve, reject) => {
          this.tcService.getUserTagList().then(res => {
            if (res.status === 0) {
              res.data.forEach(item => {
                item.chooseList = []
              })
              this.tagList = res.data
              resolve()
            }
          })
        }),
        new Promise((resolve, reject) => {
          this.tcService.getGroupList().then(res => {
            if (res.status === 0) {
              this.groupList = res.data
              resolve()
            }
          })
        }),
        new Promise((resolve, reject) => {
          this.tcService.getTaskDict().then(res => {
            if (res.status === 0) {
              this.mapData = res.data
              resolve()
            }
          })
        })
      ]).then(() => {
        if (this.$store.state.task.taskData) {
          const taskData = this.$store.state.task.taskData
          this.filterList = [...taskData.task_users.push_rule_list]
          this.editId = taskData.task_users.id
          this.filterList.forEach(item => {
            item.showTagStr = ''
            item.showStr = ''
            if (Object.keys(item.portraits || {}) && Object.keys(item.portraits || {}).length > 0) {
              Object.keys(item.portraits || {}).forEach(k => {
                const tmp = this.tagList.filter(n => {
                  return n.id === k
                })
                if (tmp && tmp.length > 0) {
                  item.showTagStr = `<span class="tag-list">${item.showTagStr}${tmp[0].name}:`
                  let str = ''
                  item.portraits[k].forEach(m => {
                    tmp[0].children.forEach(j => {
                      if (m === j.id) {
                        str = `${str}<em>${j.name}</em>`
                      }
                    })
                  })
                  item.showTagStr = `${item.showTagStr}${str}</span>`
                }
              })
            }
            if (item.push_type === 1) {
              if (item.push_target && item.push_target.length > 0) {
                const tmp = Object.keys(item.push_target[0].target).filter(n => {
                  return n !== 'type'
                })
                if (tmp && tmp.length > 0) {
                  this.mapData.forEach(n => {
                    if (n.value === tmp[0]) {
                      item.showStr = `${item.showStr}${n.label}-`
                      if (n.children && n.children.length > 0) {
                        n.children.forEach(m => {
                          if (m.value === item.push_target[0].target[tmp[0]]) {
                            item.showStr = `${item.showStr}${m.label}<em>${item.push_target[0].op ? '等于并向下检索' : '等于'}</em>`
                          }
                        })
                      }
                    }
                  })
                }
                const tmp1 = this.tbList.filter(n => {
                  return n.id === item.push_target[0].field_id
                })
                if (tmp1 && tmp1.length > 0) {
                  item.showStr = `${item.showStr}${tmp1[0].alias || tmp1[0].name}`
                }
              }
            } else if (item.push_type === 2) {
              if (item.push_target && item.push_target.length > 0) {
                item.showStr = ''
                const user_list = item.push_target[0].target.user_name_list
                const group_list = item.push_target[0].target.group_name_list
                let user_item_list = []
                let group_item_list = []
                if (item.push_target[0].target.user_name_list && item.push_target[0].target.user_name_list.length > 0) {
                  user_item_list = item.push_target[0].target.user_name_list.map((n, index) => {
                    return {
                      name: n,
                      id: item.push_target[0].target.user_id_list[index],
                      type: 3
                    }
                  })
                }
                if (item.push_target[0].target.group_name_list && item.push_target[0].target.group_name_list.length > 0) {
                  group_item_list = item.push_target[0].target.group_name_list.map((n, index) => {
                    return {
                      name: n,
                      id: item.push_target[0].target.group_id_list[index],
                      type: 1
                    }
                  })
                }
                item.push_target[0].target.user_list = user_item_list
                item.push_target[0].target.group_list = group_item_list
                item.showStr = `${(user_list && user_list.length > 0) ? ('<em class="use-box" titlt="' + user_list.join(',') + '">用户：' + user_list.join(',') + '</em>') : ('')}${(group_list && group_list.length > 0) ? ('<em class="user-box" title="' + group_list.join(',') + '">群组/机构：' + group_list.join(',') + '</em>') : ('')}`
              }
            }
          })
          this.chooseFilterType = taskData.task_users.rule_logic
        } else {
          this.editId = ''
        }
      })
    },
    closeTaskFavUser () {
      this.taskFavUserModal = false
    },
    closeTaskUser () {
      this.taskUserModal = false
    },
    saveFav (data) {
      this.favList = data
    },
    changeTarget (list) {
      this.groupList = list
    },
    addFilter (e) {
      e.stopPropagation()
      this.chooseIndex = -1
      this.taskUserModal = true
    },
    editFilter (e, index) {
      e.stopPropagation()
      this.chooseIndex = index
      this.taskUserModal = true
    },
    deleteFilter (item, index) {
      item.showDeleteModal = false
      this.filterList.splice(index, 1)
    },
    changePushUserList (data) {
      this.pushUserList = data
    },
    favUser (e) {
      e.stopPropagation()
      this.taskFavUserModal = true
    },
    ok (data, index) {
      let tmp = {}
      if (data.chooseMenu === 1) {
        tmp = {
          portraits: {},
          push_type: 1,
          showStr: '',
          showTagStr: '',
          push_target: [
            {
              target: {}
            }
          ]
        }
        tmp.push_target[0].op = data.op || undefined
        tmp.push_target[0].field_id = data.userFilter.filter1
        tmp.push_target[0].target[data.userFilter.filter2[0]] = data.userFilter.filter2[1]
        if (data.mapData && data.mapData.length > 0) {
          data.mapData.forEach(item => {
            if (item.value === data.userFilter.filter2[0]) {
              tmp.showStr = `${tmp.showStr}${item.label}-`
              if (item.children && item.children.length > 0) {
                item.children.forEach(n => {
                  if (n.value === data.userFilter.filter2[1]) {
                    tmp.showStr = `${tmp.showStr}${n.label}<em>${data.op ? '等于并向下检索' : '等于'}</em>`
                  }
                })
              }
            }
          })
        }
        this.tbList.forEach(item => {
          if (item.id === data.userFilter.filter1) {
            tmp.showStr = `${tmp.showStr}${item.alias || item.name}`
          }
        })
      } else if (data.chooseMenu === 2) {
        tmp = {
          portraits: {},
          push_type: 2,
          showStr: '',
          showTagStr: '',
          push_target: [
            {
              target: {
                user_id_list: [],
                group_id_list: [],
                user_list: [],
                group_list: []
              }
            }
          ]
        }
        const user_list = []
        const group_list = []
        if (data.traList) {
          tmp.traList = data.traList
          data.traList.forEach(item => {
            if (item && item.type === 3) {
              user_list.push(item.name)
              tmp.push_target[0].target.user_list.push(item)
              tmp.push_target[0].target.user_id_list.push(item.id)
            } else if (item.type === 2 || item.type === 1) {
              tmp.push_target[0].target.group_list.push(item)
              tmp.push_target[0].target.group_id_list.push(item.id)
              group_list.push(item.name)
            }
          })
          tmp.showStr = `${(user_list && user_list.length > 0) ? ('<em class="use-box" titlt="' + user_list.join(',') + '">用户：' + user_list.join(',') + '</em>') : ('')}${(group_list && group_list.length > 0) ? ('<em class="user-box" title="' + group_list.join(',') + '">群组/机构：' + group_list.join(',') + '</em>') : ('')}`
        }
      }
      this.tagList.forEach(item => {
        if (item.chooseList && item.chooseList.length > 0) {
          tmp.portraits[item.id] = item.chooseList
          tmp.showTagStr = `<span class="tag-list">${tmp.showTagStr}${item.name}:`
          let str = ''
          item.chooseList.forEach(n => {
            item.children.forEach(m => {
              if (n === m.id) {
                str = `${str}<em>${m.name}</em>`
              }
            })
          })
          tmp.showTagStr = `${tmp.showTagStr}${str}</span>`
        } else {
          tmp.portraits[item.id] = []
        }
      })
      if (index === -1) {
        this.filterList = [...this.filterList, tmp]
      } else {
        this.filterList.splice(index, 1, tmp)
      }
    },
    prev () {
      this.$emit('prev')
    },
    next () {
      const push_rule_list = []
      if (!this.filterList || this.filterList.length === 0) {
        this.$message.error('请配置推送用户')
        return
      }
      if (!this.chooseFilterType && this.chooseFilterType !== 0) {
        this.$message.error('请配置推送用户匹配条件')
      } else {
        this.filterList.forEach(item => {
          push_rule_list.push({
            ...item,
            showStr: undefined,
            showTagStr: undefined
          })
        })
      }

      const putData = {
        task_id: this.$store.state.task.taskId,
        rule_logic: this.chooseFilterType,
        id: (this.$store.state.task.taskData) ? (this.$store.state.task.taskData.task_users.id) : (undefined),
        push_rule_list
      }

      const service = this.$store.state.task.taskData ? this.tcService.editstep3(putData) : this.tcService.saveTask3Seting(putData)
      service.then(res => {
        if (res.status === 0) {
          this.$message.success('保存成功')
          if (this.$store.state.task.taskData) {
            this.$emit('refresh')
          } else {
            this.$emit('next', 3)
          }
        } else {
          this.$message.error(res.msg || '保存失败')
        }
      })
    }
  },
  watch: {
    step () {
      if (this.step === 3) {
        this.init()
      } else if (this.step === -1) {
        Object.assign(this.$data, this.$options.data())
      }
    }
  }
}
</script>
