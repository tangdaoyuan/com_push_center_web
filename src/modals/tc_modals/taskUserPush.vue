<template>
  <Modal class="add-task-user"
    title="配置推送用户规则"
    v-model="value">
    <div class="step-push-body">
      <div class="step-header">
        <span>当下列条件满足时发送消息</span>
        <span>当下列条件满足时发送消息</span>
      </div>
      <div class="step-con">
        <div class="left-body">
          <div class="left-header">
            <Menu mode="horizontal" theme="light" :active-name="chooseMenu">
              <MenuItem :name="1" @click.native="chooseMenu = 1">
                匹配推送
              </MenuItem>
              <MenuItem :name="2" @click.native="chooseMenu = 2">
                直接推送
              </MenuItem>
              <MenuItem :name="3" @click.native="chooseMenu = 3">
                常用推送
              </MenuItem>
            </Menu>
          </div>
          <div class="left-con" v-show="chooseMenu === 1">
            <div class="left-item">
              <el-cascader
                class="item-cas"
                separator="-"
                @change="changeValue"
                :options.sync="mapData"
                clearable
                filterable
                v-model="userFilter.filter2">
              </el-cascader>
              <span v-show="!showEqSel" class="seq">等于</span>
              <el-select v-show="showEqSel" class="item-select" v-model="op">
                <el-option v-for="(n, i) in CONSTANT.taskOpVal" :key="i" :value="n.value" :label="n.name"></el-option>
              </el-select>
              <el-select class="item-select" v-model="userFilter.filter1">
                <el-option v-for="(n, i) in tbList" :key="i" :value="n.id" :label="n.alias || n.name"></el-option>
              </el-select>
            </div>
          </div>
          <div class="left-con" v-show="chooseMenu === 2">
            <transfer
              v-model="pushUserList"
              @changeList="changeList"
              pr-key="id"
              show-text="name"
              @changeTarget="changeTarget"
              :fav-list="favList"
              t-key="push"
              :push-list="groupList" />
          </div>
          <div class="left-con" v-show="chooseMenu === 3">
            <ul class="fav-ul">
              <li class="fav-li" v-show="favList && favList.length > 0" v-for="(item, index) in favList" :key="item.id" >
                <el-checkbox v-model="item.checked">{{item.name}}</el-checkbox>
                <el-popover
                  placement="top"
                  width="160"
                  v-model="item.deleteStatus">
                  <p>您确定删该么</p>
                  <div class="pop-delete-con">
                    <el-button size="mini" type="text" @click="item.deleteStatus = false">取消</el-button>
                    <el-button type="primary" size="mini" @click="deleteFavItem($event, item, index)">确定</el-button>
                  </div>
                  <i class="el-icon-circle-close" @click.native="item.deleteStatus = true" slot="reference"></i>
                </el-popover>
              </li>
              <li class="empty" v-show="!favList || favList.length === 0">
                <div class="empty-data"></div>
                <span>暂无常用推送，请到直接推送设置</span>
              </li>
            </ul>
          </div>
        </div>
        <div class="right-body">
          <div class="right-header">用户标签选择</div>
          <div class="right-item-body">
            <div class="right-item" v-for="(item, index) in tagList" :key="index">
              <span class="item-title">{{item.name}}</span>
              <el-select multiple v-model="item.chooseList">
                <el-option v-for="(n, i) in item.children" :key="i" :value="n.id" :label="n.name"></el-option>
              </el-select>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="modal-footer" slot="footer">
      <el-button type="text" @click="ok">确定</el-button>
      <el-button type="text" @click="close">取消</el-button>
    </div>
  </Modal>
</template>
<script>
export default {
  props: {
    value: Boolean,
    tbList: Array,
    tagList: Array,
    groupList: Array,
    pushUserList: Array,
    index: Number,
    filterList: Array
  },
  data () {
    return {
      deleteStatus: false,
      chooseMenu: 1,
      mapData: [],
      showEqSel: false,
      op: 'eq',
      userFilter: {
        filter1: '',
        filter2: []
      },
      traList: [],
      favList: []
    }
  },
  created () {
  },
  methods: {
    close () {
      this.$emit('close')
    },
    deleteFavItem (e, item, index) {
      const tmp = [...this.favList]
      tmp.splice(index, 1)
      this.tcService.saveFavList({ collect_user_list: tmp.map(n => {
        return {
          origin_id: n.id,
          type: n.type,
          name: n.name
        }
      }) }).then(res => {
        if (res.status === 0) {
          this.$message.success('删除成功')
          this.favList.splice(index, 1)
        } else {
          this.$message.error(res.msg || '删除失败')
        }
      })
    },
    changeValue () {
      if (this.lodash.isArray(this.userFilter.filter2) && this.userFilter.filter2.length > 0) {
        if (this.lodash.difference(this.userFilter.filter2, ['org_prop', 'code']).length === 0) {
          this.showEqSel = true
        } else if (this.lodash.difference(this.userFilter.filter2, ['org_prop', 'name']).length === 0) {
          this.showEqSel = true
        } else {
          this.showEqSel = false
        }
      } else {
        this.showEqSel = false
      }
    },
    changeList (list) {
      this.traList = list
    },
    changeTarget (list) {
      this.$emit('changeTarget', list)
    },
    ok () {
      let tmpList = []
      if (this.chooseMenu === 1) {
        if (!this.userFilter.filter1) {
          this.$message.error('匹配字段不能为空')
          return
        }
        if (!this.userFilter.filter2.length === 0) {
          this.$message.error('匹配属性不能为空')
          return
        }
      }

      if (this.chooseMenu === 2) {
        if (this.traList.length === 0) {
          this.$message.error('推送不能为空')
          return
        }
      }

      if (this.chooseMenu === 3) {
        this.favList.forEach(item => {
          if (item.checked) {
            tmpList.push(item)
          }
        })
        if (tmpList.length === 0) {
          this.$message.error('推送不能为空')
          return
        }
      }

      this.close()
      this.$message.success('保存成功')
      this.$emit('ok', {
        userFilter: this.userFilter,
        chooseMenu: this.chooseMenu !== 1 ? 2 : 1,
        traList: this.chooseMenu === 3 ? tmpList : this.traList,
        mapData: this.mapData,
        op: (this.op && this.op === 'like') ? ('like') : (undefined)
      }, this.index)
    }
  },
  watch: {
    value () {
      if (this.value) {
        this.tcService.getFavList().then(res => {
          if (res.status === 0) {
            this.favList = res.data.map(item => {
              return {
                ...item,
                id: item.origin_id,
                user_id: undefined,
                checked: true
              }
            })
          }
        })
        if (!this.mapData || this.mapData.length === 0) {
          this.tcService.getTaskDict().then(res => {
            if (res.status === 0) {
              this.mapData = res.data
            }
          })
        }
        if (this.index > -1) {
          this.chooseMenu = this.filterList[this.index].push_type
          this.tagList.forEach(item => {
            item.chooseList = this.filterList[this.index].portraits[item.id] || []
          })
          if (this.chooseMenu === 2) {
            this.$emit('changePushUserList', [
              ...this.filterList[this.index].push_target[0].target.user_id_list.map((item, index) => {
                let res = {}
                this.filterList[this.index].push_target[0].target.user_list.forEach(n => {
                  if (n.id === item) {
                    res = n
                  }
                })
                return res
              }),
              ...this.filterList[this.index].push_target[0].target.group_id_list.map((item, index) => {
                let res = {}
                this.filterList[this.index].push_target[0].target.group_list.forEach(n => {
                  if (n.id === item) {
                    res = n
                  }
                })
                return res
              })
            ])
          } else if (this.chooseMenu === 1) {
            this.userFilter.filter1 = this.filterList[this.index].push_target[0].field_id
            const tmp = []
            Object.keys(this.filterList[this.index].push_target[0].target).forEach(item => {
              if (item !== 'match_desc' && item !== 'type') {
                tmp.push(item)
                tmp.push(this.filterList[this.index].push_target[0].target[item])
              }
            })
            this.userFilter.filter2 = tmp
            if (this.lodash.difference(this.userFilter.filter2, ['org_prop', 'code']).length === 0) {
              this.showEqSel = true
              this.op = this.filterList[this.index].push_target[0].op || 'eq'
            } else if (this.lodash.difference(this.userFilter.filter2, ['org_prop', 'name']).length === 0) {
              this.showEqSel = true
              this.op = this.filterList[this.index].push_target[0].op || 'eq'
            } else {
              this.showEqSel = false
            }
          }
        }
      }
      if (!this.value) {
        Object.assign(this.$data, this.$options.data())
        this.$emit('input')
      }
    }
  }
}
</script>
