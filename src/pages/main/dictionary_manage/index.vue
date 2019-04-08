<template>
  <div class="dic-main">
    <add-dic-type
      :edit-data="editTypeData"
      @init="searchData"
      @close="closeDicType"
      v-model="adtModal" />
    <add-dic-con
      :edit-data="editConData"
      @init="searchConData"
      @close="closeDicCon"
      :type-list="typeList"
      v-model="adcModal" />
    <div class="dic-left">
      <div class="left-title">系统管理</div>
      <ul>
        <li
          v-for="(item, index) in leftList"
          :key="index"
          :class="{'choose': index === choosed}"
          @click="chooseDic($event, item.value, index)">
          <i class="dic-type"></i>
          <span>{{item.label}}</span>
        </li>
      </ul>
    </div>
    <div class="dic-right" v-show="rightShow === 'type'">
      <div class="dic-right-header">字典类型管理</div>
      <div class="dic-right-count">
        <span>共{{total||dicData.length}}条数据</span>
        <Button type="primary" @click="addType">新增字典类型</Button>
      </div>
      <div class="dic-right-body">
        <pc-card
          :card-data="dicData"
          type="vertical"
          @addRefresh="addRefresh"
          :gutter="20"
          :span="3">
          <template slot="v-header" slot-scope="item">
            <div class="v-header-title">
              <div class="header-box">{{item.data.name}}</div>
              <div class="header-op">
                <el-dropdown>
                  <i class="op-menu-icon"></i>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item @click.native="editData($event, item.data)">编辑</el-dropdown-item>
                    <el-dropdown-item @click.native="deleteTypeItem($event, item.data)">删除</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </div>
            </div>
          </template>
          <template slot="v-body" slot-scope="item">
            <div class="body-con">
              <div class="con-item">
                <span>ID：</span>
                <span>{{item.data.id}}</span>
              </div>
              <div class="con-item">
                <span>描述：</span>
                <span>{{item.data.description}}</span>
              </div>
            </div>
          </template>
        </pc-card>
      </div>
    </div>
    <div class="dic-right" v-show="rightShow === 'con'">
      <div class="dic-right-header">字典内容管理</div>
      <div class="dic-right-count">
        <span>共{{total||dicData.length}}条数据</span>
        <Button type="primary" @click="addCon">新增字典内容</Button>
      </div>
      <div class="dic-right-body">
        <pc-card
          :card-data="dicData"
          type="vertical"
          @addRefresh="addRefresh"
          :gutter="20"
          :span="3">
          <template slot="v-header" slot-scope="item">
            <div class="v-header-title">
              <div class="header-box">{{item.data.type_name}}</div>
              <div class="header-op">
                <el-dropdown>
                  <i class="op-menu-icon"></i>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item @click.native="editCon($event, item.data)">编辑</el-dropdown-item>
                    <el-dropdown-item @click.native="deleteConItem($event, item.data)">删除</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </div>
            </div>
          </template>
          <template slot="v-body" slot-scope="item">
            <div class="body-con">
              <div class="con-item">
                <span>ID：</span>
                <span>{{item.data.id}}</span>
              </div>
              <div class="con-item">
                <span>内容：</span>
                <span>{{item.data.content}}</span>
              </div>
            </div>
          </template>
        </pc-card>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      params: {},
      editTypeData: null,
      rightShow: 'type',
      adtModal: false,
      adcModal: false,
      total: '',
      dicData: [],
      choosed: 0,
      typeList: [],
      editConData: null,
      leftList: [
        {
          label: '字典类型管理',
          value: 'type'
        },
        {
          label: '字典内容管理',
          value: 'con'
        }
      ]
    }
  },
  created () {
    this.init()
  },
  methods: {
    init () {
      this.searchData()
    },
    closeDicCon () {
      this.adcModal = false
    },
    closeDicType () {
      this.adtModal = false
    },
    searchData () {
      this.dicService.getDicData(this.params).then(res => {
        if (res.status === 0) {
          this.total = res.data.total
          this.dicData = res.data.list
          this.typeList = res.data.list
        }
      })
    },
    searchConData () {
      this.dicService.getDicConData(this.params).then(res => {
        if (res.status === 0) {
          this.dicData = res.data.list
        }
      })
    },
    editData (e, item) {
      e.stopPropagation()
      this.editTypeData = item
      this.adtModal = true
    },
    editCon (e, item) {
      e.stopPropagation()
      this.editConData = item
      this.adcModal = true
    },
    deleteTypeItem (e, item) {
      this.$confirm(`是否删除${item.name}`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.dicService.deleteTypeData({
          id: item.id
        }).then(res => {
          if (res.status === 0) {
            this.searchData()
            this.$message.success('删除成功')
          }
        })
      }).catch(() => {
      })
    },
    deleteConItem (e, item) {
      this.$confirm(`是否删除${item.content}`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.dicService.deleteConData({
          id: item.id
        }).then(res => {
          if (res.status === 0) {
            this.searchConData()
            this.$message.success('删除成功')
          }
        })
      }).catch(() => {
      })
    },
    chooseDic (e, str, index) {
      this.rightShow = str
      this.choosed = index
      switch (str) {
        case 'type':
          this.searchData()
          break
        case 'con':
          this.searchConData()
          break
      }
    },
    addType () {
      this.editTypeData = null
      this.adtModal = true
    },
    addCon () {
      this.editConData = null
      this.adcModal = true
    },
    addRefresh () {
      this.$message.info('已经到底了！')
    }
  }
}
</script>
