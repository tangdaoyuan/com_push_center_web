<template>
  <div class="wt-main">
    <create-new-folder
      @refresh="init"
      @close="closeCnFile"
      :folder-list="folderList"
      v-model="modals.cnfModal" />
    <move-folder
      @refresh="init"
      @close="closeMoFile"
      :folder-list="folderList"
      :wt-data="rnwtData"
      v-model="modals.mfModal" />
    <detele-file
      @refresh="init"
      @close="closeDefile"
      :wt-id="wtId"
      v-model="modals.dfModal" />
    <upload-data
      @refresh="init"
      @close="closeUpData"
      :folder-list="folderList"
      :step="uploadStep"
      :choose-menu="chooseMenu"
      :field-id="chooseItem.id"
      v-model="modals.udModal" />
    <rename-wt
      :wt-data="rnwtData"
      @refresh="init"
      @close="closeRnwtData"
      v-model="modals.rnwtModal"/>
    <div class="wt-left">
      <div class="wt-left-header">
        <Menu mode="horizontal" theme="light" :active-name="chooseMenu">
          <MenuItem name="table" @click.native="changeMenu($event, 'table')">
            <span>工作表</span>
          </MenuItem>
          <MenuItem name="data" @click.native="changeMenu($event, 'data')">
            <span>数据源</span>
          </MenuItem>
        </Menu>
        <el-dropdown>
          <span class="el-dropdown-link">
            <Icon type="md-add" />
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item @click.native="modals.cnfModal = true">创建文件夹</el-dropdown-item>
            <el-dropdown-item @click.native="uploadModal">上传数据</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <div class="search-box">
        <input class="search-input" v-model="filterText" type="text" required>
        <Icon class="search-icon" type="md-search" />
      </div>
      <div class="tree-list">
        <el-tree
          ref="treeList"
          node-key="id"
          :indent="8"
          :data="treeList"
          check-on-click-node
          :default-expanded-keys="chooseTag"
          auto-expand-parent
          highlight-current
          :default-checked-keys="chooseTag"
          @node-click="choose"
          :filter-node-method="filterNode"
          :render-content="renderContent">
        </el-tree>
      </div>
    </div>
    <div class="wt-right" v-show="chooseTag.length !== 0">
      <div class="wt-right-header">{{chooseItem.name}}</div>
      <div class="wt-header-menu">
        <Menu mode="horizontal" theme="light" :active-name="tableType">
          <MenuItem name="prew" @click.native="changePrew($event, 'prew')">
            <span>数据预览</span>
          </MenuItem>
          <MenuItem name="setting" @click.native="changePrew($event, 'setting')">
            <span>工作表设置</span>
          </MenuItem>
        </Menu>
      </div>
      <div class="wt-right-search" v-show="tableType === 'prew'">
        <span>显示最新 {{page_param.showTotal}} 条数据，共 {{page_param.total}} 条数据</span>
        <span>最近更新时间：{{utils.momentDate(updateTime, 'data_h_time_h')}}</span>
        <i @click="refresh()"></i>
        <Button type="default" @click="addData">追加数据</Button>
      </div>
      <div class="wt-right-body" v-show="tableType === 'prew'">
        <div class="wt-right-wm" id="wt_con">
          <watermark dom-key="wt_con"></watermark>
        </div>
        <el-table
          class="wt-table"
          stripe
          height="100%"
          :data="dataList">
          <el-table-column
            v-for="(item, index) in titleList"
            :key="index"
            min-width="120"
            show-overflow-tooltip
            :label="item.alias || item.name">
            <template slot-scope="scope">
              <span v-if="item.origin_type === 2">{{utils.momentDate(scope.row[item.id], 'date_time')}}</span>
              <span v-else>{{scope.row[item.id]}}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="table-setting-body" v-show="tableType === 'setting'">
        <div class="header-btn">
          <div class="data-show" v-show="!editTable">
            <span v-show="tableSetData.receive_start_time || tableSetData.receive_end_time">
              {{(tableSetData.receive_start_time) ? (utils.momentDate(tableSetData.receive_start_time, 'data_h_time_h')) : ('暂无开始时间')}} ~ {{(tableSetData.receive_end_time) ? (utils.momentDate(tableSetData.receive_end_time, 'data_h_time_h')) : ('暂无结束时间')}}
            </span>
          </div>
          <div class="data-edit" v-show="editTable">
            <el-date-picker type="datetime" v-model="tableSetData.receive_start_time" placeholder="选择接入开始时间" style="width: 200px"></el-date-picker>
            <span>~</span>
            <el-date-picker type="datetime" v-model="tableSetData.receive_end_time" placeholder="选择接入结束时间" style="width: 200px" :options="endTimeOptions"></el-date-picker>
          </div>
          <Button class="edit-btn" v-show="!editTable" @click="editTable = !editTable" type="text">
            <Icon type="md-brush" />
            <span>编辑</span>
          </Button>
          <Button class="edit-btn" v-show="editTable" @click="finishTable($event)" type="text">
            <Icon type="md-checkmark" />
            <span>完成</span>
          </Button>
        </div>
        <div class="wt-setting-con">
          <el-table
            height="100%"
            :data="wtData.title_list">
            <el-table-column
              label="原字段名">
              <template slot-scope="scope">
                <span>{{scope.row.name}}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="新字段名">
              <template slot-scope="scope">
                <Input v-show="editTable" type="text" v-model="scope.row.alias" :maxlength="16" />
                <span v-show="!editTable">{{scope.row.alias}}</span>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
    <div class="wt-right" v-show="chooseTag.length === 0">
      <div class="empty-main">
        <span>~请选择左侧的菜单</span>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'wt',
  data () {
    return {
      wtId: '',
      updateTime: '',
      filterText: '',
      chooseItemId: '',
      chooseItem: '',
      editTable: false,
      uploadStep: '0',
      tableType: 'prew',
      chooseMenu: 'table',
      treeList: [],
      chooseTag: [],
      folderList: [],
      titleList: [],
      dataList: [],
      rnwtData: {},
      wtData: {},
      modals: {
        cnfModal: false,
        mfModal: false,
        dfModal: false,
        udModal: false,
        rnwtModal: false
      },
      page_param: {
        page_no: 1,
        page_size: 50,
        total: 0,
        showTotal: 0
      },
      tableSetData: {
        receive_start_time: '',
        receive_end_time: ''
      },
      endTimeOptions: {
        disabledDate: date => {
          return date && date.valueOf() < this.tableSetData.receive_start_time
        }
      }
    }
  },
  created () {
    this.init()
  },
  watch: {
    filterText (val) {
      this.$refs.treeList.filter(val)
    },
    '$route' (to, from) {
      this.init()
    }
  },
  methods: {
    init () {
      this.getFolder()
      if (this.$route.query) {
        if (this.$route.query.table_type) {
          this.tableType = this.$route.query.table_type
        }
        if (this.$route.query.add_id) {
          this.addId = ''
        }
        if (this.$route.query.fieldId) {
          this.chooseItemId = this.$route.query.fieldId
        } else {
          this.chooseItemId = ''
        }
        if (this.$route.query.folder) {
          this.chooseMenu = this.$route.query.folder
        } else {
          this.chooseMenu = 'table'
        }
        this.seacrhFolder(this.chooseMenu)
        if (this.$route.query.type) {
          this.uploadType = this.$route.query.type
          switch (this.uploadType) {
            case 'data_upload':
              this.uploadStep = this.$route.query.step
              this.modals.udModal = true
              return null
            default:
              break
          }
        }
      }
    },
    closeCnFile () {
      this.modals.cnfModal = false
    },
    closeDefile () {
      this.modals.dfModal = false
    },
    closeMoFile () {
      this.modals.mfModal = false
    },
    closeUpData () {
      this.modals.udModal = false
    },
    closeRnwtData () {
      this.modals.rnwtModal = false
    },
    reset () {
      this.chooseTag = []
      this.chooseItem = ''
    },
    addData () {
      if (this.$route.query.fieldId) {
        this.$router.replace(`wt?type=data_upload&step=0&add_id=${this.$route.query.fieldId}`)
        this.uploadStep = '0'
        this.modals.udModal = true
      } else {
        this.$message.error('请选择工作表')
      }
    },
    getFolder () {
      this.wtService.getFolderList({}).then(res => {
        if (res.status === 0) {
          this.folderList = res.data
        }
      })
    },
    seacrhFolder (type) {
      let queryService = {}
      switch (type) {
        case 'data':
          queryService = this.wtService.getDataSource()
          break
        case 'table':
          queryService = this.wtService.getFolder()
          break
        default:
          queryService = this.wtService.getFolder()
          break
      }

      queryService.then(res => {
        if (res.status === 0) {
          this.treeList = res.data
          if (this.chooseItemId) {
            this.wtService.getTableItem({
              id: this.chooseItemId
            }).then(res => {
              if (res.status === 0) {
                this.chooseItem = res.data
                this.chooseTag = [this.chooseItemId]
                this.searchData()
              }
            })
          } else {
            this.chooseTag = []
          }
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
          this.treeList = []
        }
      })
    },
    searchData () {
      switch (this.tableType) {
        case 'prew':
          this.titleList = []
          this.dataList = []
          this.wtService.getprewData({
            tb_id: this.chooseItem.id,
            page_no: this.page_param.page_no,
            page_size: this.page_param.page_size
          }).then(res => {
            if (res.status === 0) {
              this.titleList = res.data.title_list
              this.dataList = res.data.data_list
              this.updateTime = res.data.update_time
              this.page_param.total = res.data.total
              this.page_param.showTotal = (this.page_param.total <= 50) ? (this.page_param.total) : (50)
            }
          })
          break
        case 'setting':
          this.wtService.getFieldData({
            id: this.chooseItem.id
          }).then(res => {
            if (res.status === 0) {
              this.wtData = res.data
              this.tableSetData.receive_start_time = (this.wtData.receive_start_time) ? (new Date(this.wtData.receive_start_time)) : (null)
              this.tableSetData.receive_end_time = (this.wtData.receive_end_time) ? (new Date(this.wtData.receive_end_time)) : (null)
            }
          })
          break
      }
    },
    changeMenu (e, type) {
      e.stopPropagation()
      if (this.chooseMenu !== type) {
        this.$router.push(`/wt?folder=${type}`)
        this.reset()
      }
    },
    uploadModal () {
      this.$router.replace(`wt?type=data_upload&step=0`)
      this.uploadStep = '0'
      this.modals.udModal = true
    },
    filterNode (value, data) {
      if (!value) return true
      if (data.name) {
        return data.name.indexOf(value) !== -1
      }
    },
    choose (node) {
      if (this.utils.getType(node.id) === 'field') {
        this.chooseTag = [node.id]
        this.chooseItem = node
        this.$router.push(`/wt?folder=${this.chooseMenu}&table_type=prew&fieldId=${node.id}`)
      }
    },
    renderContent (h, { node, data, store }) {
      const spanRes1 = {
        'class': {
          'item-list': true,
          'selected': data.id === this.chooseTag[0]
        }
      }
      const drop = h('el-dropdown', {
        nativeOn: {
          click: (e) => {
            e.stopPropagation()
          }
        }
      },
      [
        h('a', {
          'class': {
            'more-btn': true
          }
        },
        [
          h('i', {
            'class': {
              'more': true
            }
          })
        ]),
        h('el-dropdown-menu', {
          slot: 'dropdown'
        },
        [
          (this.chooseMenu === 'table' && this.utils.getType(data.id) === 'folder') ? (h('el-dropdown-item', {
            domProps: {
              innerHTML: '置顶'
            },
            nativeOn: {
              click: (e) => {
                e.stopPropagation()
                this.wtService.saveFolder({
                  id: data.id,
                  is_top: 1
                }).then(res => {
                  if (res.status === 0) {
                    this.$message({
                      message: '置顶成功',
                      type: 'success'
                    })
                    this.init()
                  }
                })
              }
            }
          })) : (''),
          h('el-dropdown-item', {
            domProps: {
              innerHTML: '重命名'
            },
            nativeOn: {
              click: (e) => {
                e.stopPropagation()
                let itemService
                switch (this.utils.getType(data.id)) {
                  case 'folder':
                    itemService = this.wtService.getFolderItem({
                      id: data.id
                    })
                    break
                  case 'field':
                    itemService = this.wtService.getTableItem({
                      id: data.id
                    })
                    break
                }

                itemService.then(res => {
                  if (res.status === 0) {
                    this.rnwtData = res.data
                    this.modals.rnwtModal = true
                  }
                })
              }
            }
          }),
          (this.chooseMenu !== 'table') ? ('') : (h('el-dropdown-item', {
            domProps: {
              innerHTML: '移动至'
            },
            nativeOn: {
              click: (e) => {
                e.stopPropagation()
                this.moveFolder(data)
              }
            }
          })),
          h('el-dropdown-item', {
            domProps: {
              innerHTML: '删除'
            },
            nativeOn: {
              click: (e) => {
                e.stopPropagation()
                this.wtId = data.id
                this.modals.dfModal = true
              }
            }
          })
        ])
      ])

      const innerSpan = [
        h('div', {
          'class': {
            'item-con': true
          }
        }, [
          h('i', {
            'class': {
              'folder': this.utils.getType(data.id) === 'folder' || this.utils.getType(data.id) === 'ds',
              'file': this.utils.getType(data.id) === 'field',
              'file-ds': this.utils.getType(data.id) === 'field' && data.type === 1,
              'file-aggr': this.utils.getType(data.id) === 'field' && data.type === 2,
              'file-public': this.utils.getType(data.id) === 'field' && data.type === 3,
              'file-excel': this.utils.getType(data.id) === 'field' && data.type === 4,
              'file-mysql': this.utils.getType(data.id) === 'field' && data.type === 5,
              'file-oracle': this.utils.getType(data.id) === 'field' && data.type === 6

            }
          }),
          h('span', {
            attrs: {
              title: data.name
            },
            domProps: {
              innerHTML: data.name
            }
          })
        ]), (this.utils.getType(data.id) === 'folder' || this.utils.getType(data.id) === 'field') ? (drop) : ('')]

      return h('div', spanRes1, innerSpan)
    },
    moveFolder (data) {
      let itemService
      switch (this.utils.getType(data.id)) {
        case 'folder':
          itemService = this.wtService.getFolderItem
          break
        case 'field':
          itemService = this.wtService.getTableItem
          break
      }
      itemService({
        id: data.id
      }).then(res => {
        if (res.status === 0) {
          this.rnwtData = res.data
          this.modals.mfModal = true
        }
      })
    },
    changePrew (e, type) {
      e.stopPropagation()
      this.$router.push(`/wt?folder=${this.chooseMenu}&table_type=${type}&fieldId=${this.chooseItem.id}`)
    },
    finishTable (e) {
      e.stopPropagation()
      const pushData = {
        tb_id: this.chooseItem.id,
        table_name: this.chooseItem.name,
        list: []
      }

      pushData.receive_start_time = ((typeof this.tableSetData.receive_start_time === 'object' && this.tableSetData.receive_start_time !== null) ? (this.tableSetData.receive_start_time.getTime()) : (this.tableSetData.receive_start_time))

      if (this.tableSetData.receive_end_time) {
        pushData.receive_end_time = ((typeof this.tableSetData.receive_end_time === 'object') ? (this.tableSetData.receive_end_time.getTime()) : (this.tableSetData.receive_end_time))
      } else {
        pushData.receive_end_time = null
      }

      this.wtData.title_list.forEach(item => {
        pushData.list.push({
          id: item.id,
          alias: item.alias
        })
      })

      this.wtService.saveTable(pushData).then(res => {
        if (res.status === 0) {
          this.editTable = !this.editTable
          this.$message({
            message: '保存成功',
            type: 'success'
          })
          this.init()
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    refresh () {
      this.searchData()
    }
  }
}
</script>
