<template>
  <Modal class="ud-modal-main modal-full" v-model="value" fullscreen>
    <choose-folder
      @changeFolder="chooseFolderItem"
      @close="closeCfModal"
      :folder-id="chooseFileSetData.folder_id"
      :folder-list="folderList"
      v-model="cfModal"/>
    <div class="ud-header" slot="header">
      <div class="header-btn">
        <Icon type="md-arrow-round-back" @click="closeModal"/>
        <span></span>
        <span>{{`${(addId) ? ('追加') : ('上传')}数据`}}</span>
      </div>
    </div>
    <div class="ud-body">
      <div class="step-box">
        <Steps :current="currentStep">
          <Step title="上传文件" content=""></Step>
          <Step title="预览数据" content=""></Step>
          <Step title="工作表设置" v-if="!addId" content=""></Step>
        </Steps>
      </div>
      <div class="ud-con" v-show="currentStep === 0">
        <div class="upload-box">
          <Upload
            class="upload-con"
            :class="{'has-file': uploadStart || files.length > 0}"
            :action="`/api/work_table/upload${(addId) ? ('?tb_id=' + addId) : ('')}`"
            :headers="fileHead"
            :format="['csv', 'xls', 'xlsx']"
            :on-format-error="fileCheckErr"
            paste
            :default-file-list="files"
            name="upload"
            :on-success="uploadSuccess"
            :on-error="uploadError"
            :before-upload="filesCheck"
            :on-remove="removeFile"
            type="drag">
              <div class="tip">
                <span><em>点击上传文件</em>或者拖拽上传</span>
                <span>支持Excel和CSV文件（单个Excel最大100M，CSV最大200M）</span>
                <span>最多5个文件批量上传，默认识别第一个sheet文件</span>
              </div>
            </Upload>
        </div>
        <div class="example-con">
          <div class="con-header">
            <span>表格示例</span>
            <span>1.请上传有标准行列的一维数据表格。（有合并单元格的数据请处理过后再上传，否则可能出现表头识别有误）</span>
            <span>
              <em>2.日期字段需包含年月日（如2016/1/1），或年月日时分秒。（如2016/1/1 00:00:00）</em>
              <em v-show="addId">
                <a :href="`/api/work_table/download/template?tb_id=${addId}`" download="example.xls">下载模板</a>
              </em>
            </span>
          </div>
          <div class="exc-table">
            <ul>
              <li>
                <div class="header">
                  <span>第1列</span>
                </div>
                <div class="con">
                  <div class="item">序号</div>
                  <div class="item">1</div>
                  <div class="item">2</div>
                  <div class="item">3</div>
                </div>
              </li>
              <li>
                <div class="header">
                  <span>第2列</span>
                </div>
                <div class="con">
                  <div class="item">拜访人</div>
                  <div class="item">周一围</div>
                  <div class="item">周一围</div>
                  <div class="item">周一围</div>
                </div>
              </li>
              <li>
                <div class="header">
                  <span>第3列</span>
                </div>
                <div class="con">
                  <div class="item">员工编号</div>
                  <div class="item">6000001</div>
                  <div class="item">6000001</div>
                  <div class="item">6000001</div>
                </div>
              </li>
              <li>
                <div class="header">
                  <span>第4列</span>
                </div>
                <div class="con">
                  <div class="item">部门</div>
                  <div class="item">销售一部</div>
                  <div class="item">销售一部</div>
                  <div class="item">销售一部</div>
                </div>
              </li>
              <li>
                <div class="header">
                  <span>第5列</span>
                </div>
                <div class="con">
                  <div class="item">职位</div>
                  <div class="item">销售总监</div>
                  <div class="item">销售总监</div>
                  <div class="item">销售总监</div>
                </div>
              </li>
              <li>
                <div class="header">
                  <span>第6列</span>
                </div>
                <div class="con">
                  <div class="item">拜访日期</div>
                  <div class="item">2016/8/9</div>
                  <div class="item">2016/8/9</div>
                  <div class="item">2016/8/9</div>
                </div>
              </li>
              <li>
                <div class="header">
                  <span>第7列</span>
                </div>
                <div class="con">
                  <div class="item">拜访时间</div>
                  <div class="item">11:23</div>
                  <div class="item">11:23</div>
                  <div class="item">11:23</div>
                </div>
              </li>
              <li>
                <div class="header">
                  <span>第8列</span>
                </div>
                <div class="con">
                  <div class="item">客户类型</div>
                  <div class="item">互联网</div>
                  <div class="item">互联网</div>
                  <div class="item">互联网</div>
                </div>
              </li>
              <li>
                <div class="header">
                  <span>第9列</span>
                </div>
                <div class="con">
                  <div class="item">进展</div>
                  <div class="item">初次拜访</div>
                  <div class="item">初次拜访</div>
                  <div class="item">初次拜访</div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div class="ud-con" v-show="currentStep === 1">
        <div class="ud-step2-title">
          <span>当前选中的表头为第2行，如不符合预期，可点击将你需要的数据行指定为表头和设置表头类型。</span>
          <span>表头前的数据，将不会保留</span>
          <span>不设置表头类型，则默认为文本类型</span>
        </div>
        <div class="menu-box">
          <Menu mode="horizontal" theme="light" :active-name="chooseExcelId">
            <MenuItem v-for="(item, index) in excelIds" :title="excelMap[item]" :key="index" :name="item" @click.native="changeTableMenu($event, item)">
              {{excelMap[item]}}
            </MenuItem>
          </Menu>
        </div>
        <div class="ud-step2-table" :class="{'is-add': addId}">
          <ul class="ud-thead" v-show="chooseExcelData.showData.title_list && chooseExcelData.showData.title_list.length > 0">
            <li class="ud-thead-op">
              <div class="op"></div>
            </li>
            <li class="ud-thead-index">#</li>
            <li class="ud-thead-item" v-for="(item, index) in chooseExcelData.showData.title_list" :key="index">
              <el-select class="select-box"
                v-model="excelMapList[chooseExcelId].item_type[item.key]">
                <el-option :value="0" label='数值'>
                  <i></i>
                  <span>数值</span>
                </el-option>
                <el-option :value="1" label="文本">
                  <i></i>
                  <span>文本</span>
                </el-option>
                <el-option :value="2" label="日期">
                  <i></i>
                  <span>日期</span>
                </el-option>
              </el-select>
            </li>
          </ul>
          <div class="ud-tbody" v-show="chooseExcelData.showData.title_list && chooseExcelData.showData.title_list.length > 0">
            <div class="ud-tbody-tr" v-for="(item, index) in chooseExcelData.showData.data_list" :key="index" @click="chooseRow($event, item)">
              <div class="ud-tbody-op">
                <div class="op" :class="{'select': excelMapList[chooseExcelId].row && excelMapList[chooseExcelId].row.index === index}"></div>
              </div>
              <div class="ud-tbody-index">{{index}}</div>
              <div class="ud-tbody-item" v-for="(n, i) in chooseExcelData.showData.title_list" :key="i">
                <span>{{item[n.key]}}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="ud-step2-footer" v-if="false">
          <div class="footer-con">
            <span>刷新预览</span>
            <Icon type="ios-information-circle-outline" />
          </div>
        </div>
      </div>
      <div class="ud-con step3" v-show="currentStep === 2">
        <div class="ud-left">
          <ul>
            <li v-for="(item, index) in excelItem" @click="chooseFile($event, item)" :class="{'select': chooseFileSetData.id === item.id}" :key="index" class="ud-item-li">
              <i></i>
              <span>{{item.name}}</span>
            </li>
          </ul>
        </div>
        <div class="ud-right">
          <div class="step3-item">
            <label>工作表</label>
            <Input type="text" v-model="chooseFileSetData.name" :maxlength="16" />
          </div>
          <div class="step3-item">
            <label>文件夹</label>
            <span class="item-input">
              <span>{{chooseFileSetData.folderName}}</span>
              <em @click="chooseFolderBtn($event, chooseFileSetData.folderName)">修改</em>
            </span>
          </div>
          <div class="step3-item">
            <label>备注</label>
            <Input type="textarea" v-model="chooseFileSetData.desc" class="item-area" :maxlength="200" placeholder="请输入工作表备注信息(最多200字)" />
          </div>
        </div>
      </div>
    </div>
    <div class="ud-footer" slot="footer">
      <Button type="text" @click="prev" v-show="currentStep !== 0">上一步</Button>
      <Button type="primary" @click="next" v-show="currentStep !== 2">{{(addId && currentStep === 1) ? ('完成') : ('下一步')}}</Button>
      <Button type="primary" @click="finish" v-show="currentStep === 2">完成</Button>
    </div>
  </Modal>
</template>
<script>
export default {
  props: {
    value: Boolean,
    step: String,
    folderList: Array,
    chooseMenu: String,
    fieldId: String
  },
  created () {
    this.init()
  },
  data () {
    return {
      uploadStart: false,
      cfModal: false,
      currentStep: 0,
      csvSize: 200 * 1024 * 1024,
      xlsSize: 100 * 1024 * 1024,
      addId: '',
      uploadType: '',
      chooseExcelId: '',
      files: [],
      excelId: [],
      excelIds: [],
      excelItem: [],
      tmpIdList: [],
      csvStr: [/.csv/],
      xlsStr: [/.xls/, /.xlsx/],
      excelMap: {},
      currentRow: {},
      excelMapList: {},
      fileHead: {},
      chooseExcelData: {
        showData: {
          title_list: [],
          data_list: []
        },
        row: {},
        item_type: {}
      },
      chooseFileSetData: {
        id: '',
        name: '',
        folder_id: '',
        folderName: '',
        desc: ''
      }
    }
  },
  methods: {
    close () {
      this.$emit('close')
    },
    closeCfModal () {
      this.cfModal = false
    },
    prev () {
      switch (this.currentStep) {
        case 1:
          // this.files = []
          // this.uploadStart = false
          if (this.addId) {
            this.$router.push(`/wt?type=data_upload&add_id=${this.addId}&step=0`)
          } else {
            this.$router.push(`/wt?type=data_upload&step=0`)
          }
          break
        case 2:
          if (this.addId) {
            this.$router.push(`/wt?type=data_upload&step=1&add_id=${this.addId}&excel_ids=${this.excelIds.join(',')}`)
          } else {
            this.$router.push(`/wt?type=data_upload&step=1&excel_ids=${this.excelIds.join(',')}`)
          }
          break
      }
    },
    next () {
      switch (this.currentStep) {
        case 0:
          if (this.files.length > 0) {
            this.currentStep = this.currentStep + 1
            const excelIds = []
            const excelTmp = {}
            this.files.forEach(item => {
              excelIds.push(item.excelId)
              excelTmp[item.excelId] = item.name.replace(/.xlsx/g, '').replace(/.xls/g, '')
            })
            localStorage.setItem('excel_tmp', JSON.stringify(excelTmp))
            if (this.addId) {
              this.$router.push(`/wt?type=data_upload&add_id=${this.addId}&step=1&excel_ids=${encodeURIComponent(excelIds.join(','))}`)
            } else {
              this.$router.push(`/wt?type=data_upload&step=1&excel_ids=${encodeURIComponent(excelIds.join(','))}`)
            }
          } else {
            this.$message({
              message: '请上传excel',
              type: 'error'
            })
          }
          break
        case 1:
          const putData = []
          this.files = []
          this.uploadStart = false
          this.excelIds.forEach(item => {
            const tmp = {}
            tmp.excel_id = item
            tmp.title_row = (Object.keys(this.excelMapList[item].row).length > 0) ? (this.excelMapList[item].row.index) : (0)
            if (this.addId) {
              tmp.tb_id = this.addId
            }
            tmp.item_type = {}
            this.excelMapList[item].showData.title_list.forEach(n => {
              if (this.excelMapList[item] && (this.excelMapList[item].item_type[n.key] || this.excelMapList[item].item_type[n.key] === 0)) {
                tmp.item_type[n.key] = this.excelMapList[item].item_type[n.key]
              } else {
                tmp.item_type[n.key] = 1
              }
            })
            putData.push(tmp)
          })

          let finishService = this.wtService.saveExcelTmpData

          if (this.addId) {
            finishService = this.wtService.saveExcelData
          }

          finishService(putData).then(res => {
            if (res.status === 0) {
              if (this.addId) {
                this.$message.success('保存成功')
                this.close()
                this.uploadStart = false
                localStorage.removeItem('excel_tmp')
                this.$router.push('/wt')
              } else {
                const tmpIds = res.data
                if (tmpIds.length !== this.excelIds.length) {
                  const errorList = []
                  this.excelIds.forEach(n => {
                    if (!this.utils.checkListInner(tmpIds, n)) {
                      errorList.push(`${this.excelMap[n]}`)
                    }
                  })
                  this.$message.error(`${errorList.join(',')}保存失败`)
                }
                this.$router.push(`/wt?type=data_upload&step=2&excel_ids=${this.excelIds.join(',')}&tmp_ids=${tmpIds.join(',')}`)
              }
            } else {
              this.$message.error(res.msg)
            }
          })
          break
      }
    },
    finish () {
      const putData = []
      this.excelItem.forEach(item => {
        const tmp = {
          temp_id: `temp_${item.id}`,
          table_name: item.name,
          folder_id: item.folder_id || '',
          desc: item.desc
        }
        if (this.addId) {
          tmp.tb_id = this.addId
        }
        putData.push(tmp)
      })
      this.wtService.saveExcelData(putData).then(res => {
        if (res.status === 0) {
          this.$message.success('保存成功')
          this.close()
          this.files = []
          this.uploadStart = false
          localStorage.removeItem('excel_tmp')
          this.$router.push('/wt')
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    chooseRow (e, item) {
      this.excelMapList[this.chooseExcelId].row = item
    },
    init () {
      this.fileHead = {
        'Authorization': 'Bearer ' + this.$cookies.get('pc_token'),
        'userId': this.$cookies.get('pc_user_id')
      }
      if (this.$route.query.step) {
        this.currentStep = parseInt(this.step)
      } else {
        this.currentStep = -1
      }
      if (this.$route.query && this.$route.query.add_id) {
        this.addId = this.$route.query.add_id
      } else {
        this.addId = ''
      }
      switch (this.currentStep) {
        case 0:
          this.files = []
          this.uploadStart = false
          break
        case 1:
          if (this.$route.query.excel_ids) {
            this.excelIds = decodeURIComponent(this.$route.query.excel_ids).split(',')
            const excelTmp = JSON.parse(localStorage.getItem('excel_tmp'))
            if (excelTmp) {
              this.excelMap = excelTmp
            }

            this.wtService.getExcelData({
              excel_ids: this.excelIds
            }).then(res => {
              if (res.status === 0) {
                this.excelIds.forEach(item => {
                  res.data[item].data_list.forEach((n, index) => {
                    n.index = index
                  })
                  this.excelMapList[item] = {
                    showData: res.data[item],
                    row: {},
                    item_type: {}
                  }
                })
                this.chooseExcelId = this.excelIds[0]
                this.chooseExcelData = (this.excelMapList[this.chooseExcelId]) || {
                  showData: {
                    title_list: [],
                    data_list: []
                  },
                  row: {},
                  item_type: {}
                }
              } else {
                this.$message.error(res.msg)
              }
            })
          }
          break
        case 2:
          if (this.$route.query.excel_ids) {
            this.excelIds = decodeURIComponent(this.$route.query.excel_ids).split(',')
            const excelTmp = JSON.parse(localStorage.getItem('excel_tmp'))
            if (excelTmp) {
              this.excelMap = excelTmp
            }
            if (this.$route.query.tmp_ids) {
              this.tmpIdList = this.$route.query.tmp_ids.split(',')
            }
            this.wtService.getExcelData({
              excel_ids: this.excelIds
            }).then(res => {
              if (res.status === 0) {
                this.excelIds.forEach(item => {
                  res.data[item].data_list.forEach((n, index) => {
                    n.index = index
                  })
                  this.excelMapList[item] = {
                    showData: res.data[item],
                    row: {},
                    item_type: {}
                  }
                })

                this.chooseExcelId = this.excelIds[0]
                this.chooseExcelData = (this.excelMapList[this.chooseExcelId]) || {
                  showData: {
                    title_list: [],
                    data_list: []
                  },
                  row: {},
                  item_type: {}
                }

                const excelItem = []
                this.excelIds.forEach(item => {
                  if (this.excelMapList[item]) {
                    excelItem.push({
                      id: item,
                      name: this.excelMap[item],
                      folder_id: '',
                      folderName: '',
                      desc: '',
                      row: this.excelMapList[item].row,
                      item_type: this.excelMapList[item].item_type
                    })
                  }
                })
                this.excelItem = excelItem
                this.chooseFileSetData = this.excelItem[0]
              } else {
                this.$message.error(res.msg)
              }
            })
          }
          break
        default:
          break
      }
    },
    changeTableMenu (e, id) {
      e.stopPropagation()
      this.chooseExcelId = id
      this.chooseExcelData = (this.excelMapList[this.chooseExcelId]) || {
        showData: {
          title_list: [],
          data_list: []
        },
        row: {},
        item_type: {}
      }
    },
    closeModal () {
      this.back()
    },
    removeFile (e, oldFile, files) {
      this.files = oldFile
      if (this.files.length === 0) {
        this.uploadStart = false
      }
      this.$message({
        message: '删除成功',
        type: 'success'
      })
    },
    uploadError (e, oldFile, files) {
      this.files = files || []
      if (!files || files.length === 0) {
        this.uploadStart = false
      }
      this.$message({
        message: '上传失败',
        type: 'error'
      })
    },
    uploadSuccess (res, oldFile, files) {
      if (res.status === 0) {
        files.forEach((item, index) => {
          if (item.uid === oldFile.uid) {
            item.excelId = res.data
          }
        })
        this.$message({
          message: '上传成功',
          type: 'success'
        })
      } else {
        this.$message({
          message: res.msg,
          type: 'error'
        })
        files.forEach((item, index) => {
          if (item.uid === oldFile.uid) {
            files.splice(index, 1)
          }
        })
      }
      this.files = files || []
      if (!files || files.length === 0) {
        this.uploadStart = false
      }
    },
    fileCheckErr () {
      this.$message({
        message: '文件格式错误',
        type: 'error'
      })
    },
    filesCheck (file) {
      if (this.files && this.files.length >= 5) {
        this.$message({
          message: '文件数量不能大于5个',
          type: 'error'
        })
        return false
      } else if (this.utils.fileCheck(this.csvStr, file.name)) {
        if (file.size > this.csvSize) {
          this.$message({
            message: 'csv文件大小超过了200M',
            type: 'error'
          })
          return false
        } else {
          this.uploadStart = true
        }
      } else if (this.utils.fileCheck(this.xlsStr, file.name)) {
        if (file.size > this.xlsSize) {
          this.$message({
            message: 'excel文件大小超过了100M',
            type: 'error'
          })
          return false
        } else {
          this.uploadStart = true
        }
      } else {
        this.$message({
          message: '文件格式错误',
          type: 'error'
        })
        return false
      }
    },
    back () {
      this.currentStep = 0
      this.close()
      this.files = []
      this.uploadStart = false
      this.$router.push(`/wt`)
    },
    chooseFile (e, item) {
      this.chooseFileSetData = item
    },
    chooseFolderBtn (e, item) {
      this.cfModal = true
    },
    chooseFolderItem (item) {
      this.chooseFileSetData.folder_id = item.id
      this.wtService.getFolderItem({
        id: item.id
      }).then(res => {
        if (res.status === 0) {
          this.chooseFileSetData.folderName = res.data.name
        }
      })
    }
  },
  watch: {
    value () {
      if (!this.value) {
        Object.assign(this.$data, this.$options.data())
      }
    },
    '$route' (to, from) {
      this.init()
    }
  }
}
</script>
