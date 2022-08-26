<template>
  <div class="documentPage">
    <el-dialog v-model="dialogVisible" :modal="false">
      <img :src="imagePath" class="imageShow" style="width:100%;height:50%;" alt="">
    </el-dialog>
    <el-dialog v-model="templateDialogVisible" :modal="false">
      <el-row>
        <el-select v-model="selectedTemplate" placeholder="Lütfen bir şablon seçiniz">
          <el-option
            v-for="item in templateList"
            :key="item.documentTemplateId"
            :label="item.templateName"
            :value="item.documentTemplateId"/>
        </el-select>
        <el-button style="float:right; margin-left:5px;" type="primary" @click="templateDialogVisible = false">İptal
        </el-button>
        <el-button style="float:right" type="success" @click="printTemplate(selectedTemplate)">Yazdır</el-button>
      </el-row>
    </el-dialog>
    <el-dialog v-model="uploadDialogVisible" append-to-body title="Dosya Ekle">
      <el-card>
        <el-upload
          v-loading="busy"
          ref="files"
          :file-list="fileList"
          :auto-upload="false"
          :on-change="onChange"
          :accept="acceptedExtensions"
          multiple
          action=""
          list-type="picture">
          <template #trigger>
            <el-button size="small" class="primary-button">Dosya Seç</el-button>
          </template>
          <el-button v-loading="busy" style="margin-left: 10px;" size="small" type="action" @click="submitFiles">Yükle
          </el-button>
        </el-upload>
      </el-card>
    </el-dialog>
    <el-collapse v-if="!collapseShown" class="documentPageCollapse" @change="handleChange">
      <el-collapse-item :title="documentTypeName" name="1">
        <template #title>
          <el-row style="width:100%;">
            <el-col :span="8" :push="2"><span class="font1">{{ documentTypeName }}</span></el-col>
            <el-col :span="5" :push="8"><span style="float:right;margin-top:15px;color:#b7b7b7;font-weight:normal;"
                                              class="normalFont"><strong style="color:#000;">{{ value.files.length }} Dosya</strong></span>
            </el-col>
          </el-row>
        </template>
        <el-table :data="value.files" :show-header="true" width="100%">
          <el-table-column label="İsim" property="name"/>
          <el-table-column v-if="!withOutIndices" label="Kullanıcı" property="user"/>
          <el-table-column label="Tarih" property="date"/>
          <el-table-column label="Aksiyonlar">
            <template v-slot:default="scope">
              <el-button-group>
                <el-button :disabled="disabled" class="icon-button" @click="viewDocumentType(scope.row)">
                  <svg-icon icon-class="view-icon"/>
                </el-button>
                <el-button v-if="scope.row.fileListStatusHistories !== 'deleted' && hasActionDelete"
                           :disabled="disabled || isCzmDocuments" class="icon-button"
                           @click="archive(scope.row.fileId)">
                  <svg-icon icon-class="archive-sent"/>
                </el-button>
                <el-button v-if="scope.row.fileListStatusHistories === 'deleted' && hasActionDelete"
                           :disabled="disabled || isCzmDocuments" class="icon-button"
                           @click="unarchive(scope.row.fileId)">
                  <svg-icon icon-class="archive-back"/>
                </el-button>
              </el-button-group>
            </template>
          </el-table-column>
          <el-table-column width="200px">
            <template v-slot:default="stuff">
              <el-button slot="reference" @click="imageShow(stuff.row)">Ön izleme</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div v-if="disabled === false"
             style="background: #e5e5e5;color: #b7b7b7;font-weight: normal;width:100%;height:50px;padding:10px;display:flex;align-items: center;justify-content: space-between;">
          <span>Yeni Bir Dosya Eklemek İçin Lütfen "+" Butonuna Tıklayınız.</span>
          <div style="min-width: 100px;">
            <el-tooltip
              class="box-item"
              effect="light"
              content="Dosya Ekle"
              placement="top"
            >
              <el-button v-if="hasActionAdd" :disabled="isCzmDocuments" style="width: 30px;height: 30px !important;" type="action" circle
                        @click="uploadDialog">
                <i class="fa-solid fa-plus"></i>
              </el-button>
            </el-tooltip>
            <el-tooltip
              class="box-item"
              effect="light"
              content="Yazdır"
              placement="top"
            >
              <el-button :disabled="isCzmDocuments" style="width: 30px;height: 30px !important;" type="action" circle @click="templateDialog">
                <i class="fa-solid fa-print"></i>
              </el-button>
            </el-tooltip>
          </div>
        </div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>
<script>

import documentApi from '@/api/dms/document'
import documentTemplateApi from '@/api/dms/documentTemplate'
import {Printd} from 'printd'
import {hasActionPermission} from '@/permission.js'

export default {

  props: {
    indices: {
      type: Array,
      default: () => [{keyType: '', value: ''}],
      description: 'template id'
    },
    disabled: {
      type: Boolean,
      default: false,
      description: 'disable'
    },
    documentType: {
      type: String,
      default: ''
    },
    documentGroupType: {
      type: String,
      default: ''
    },
    errorMessage: {
      default: '',
      type: String,
      description: 'global error message'
    },
    withOutIndices: {
      type: Boolean,
      default: false
    },
    documentPath: {
      default: '',
      type: String
    },
    isCzmDocuments: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      busy: false,
      showImage: false,
      documentTypeName: '',
      singleDocument: false,
      imagePath: '',
      isPrinting: false,
      dialogVisible: false,
      uploadDialogVisible: false,
      selectedTemplate: '',
      loading: false,
      fileList: [],
      templateList: [],
      content: 'string is too large to edit',
      templateDialogVisible: false,
      imageSize: [],
      sizeLimit: 10,
      collapseShown: true,
      hasActionAdd: true,
      isActive: false,
      hasActionDelete: true,
      canSeeArchive: false,
      acceptedExtensions: [],
      withOutIndicesExtensions: 'image/*, application/pdf, .xlsx, .docx, .sql, .txt',
      extensions: ['pdf', 'docx', 'xlsx', 'sql', 'txt', 'doc', 'jfif', 'msg'],
      modelValue: {
        documentId: '',
        hashCode: '',
        files: [
          {
            fileId: '',
            name: '',
            extension: '',
            size: '',
            user: '',
            date: '',
            fileListStatusHistories: ''
          }
        ]
      }
    }
  },
  emits: ['update:modelValue'],
  computed: {
    value: {
      get() {
        return this.modelValue
      },
      set(value) {
        this.$emit('update:modelValue', value)
      }
    }
  },
  created() {
    // this.sizeLimit = this.$store.getters.parameters.financeParameters.find(i => i.parameterType === 'documentuploadlimit').value === undefined ? this.sizeLimit : this.$store.getters.parameters.financeParameters.find(i => i.parameterType === 'documentuploadlimit').value
  },
  mounted() {
    this.hasAccessDeleteButton = hasActionPermission(this.$store.getters.permission_routers, 'documentDeleteButton')
    this.hasAccessAddButton = hasActionPermission(this.$store.getters.permission_routers, 'documentAddButton')
    this.canSeeArchive = hasActionPermission(this.$store.getters.permission_routers, 'documentCanSeeArchive')
    if (this.hasAccessAddButton && this.withOutIndices) {
      this.hasActionAdd = true
    } else if (this.withOutIndices) {
      this.hasActionAdd = false
    }
    if (this.hasAccessDeleteButton && this.withOutIndices) {
      this.hasActionDelete = true
      this.isActive = false
    } else if (this.withOutIndices) {
      this.hasActionDelete = false
      this.isActive = true
    }
    if (this.withOutIndices) {
      this.acceptedExtensions = this.withOutIndicesExtensions
    } else {
      this.acceptedExtensions = 'image/*, application/pdf, .sql, .txt'
    }
    // this.documentType = this.documentType
    this.getTemplateList()
    this.$nextTick(() => this.getDocument())
  },
  methods: {
    getDocument() {
      this.busy = true
      var save = (this.withOutIndices)
        ? documentApi.getDocument(this.documentType, this.createIndices = [{
          keyType: this.documentType.toUpperCase(),
          value: this.documentGroupType + this.documentType.toUpperCase()
        }], this.isActive, this.withOutIndices, this.canSeeArchive, this.isCzmDocuments)
        : documentApi.getDocument(this.documentType, this.indices, this.isActive, this.withOutIndices, this.canSeeArchive, this.isCzmDocuments)
      save.then((v) => {
        // console.log('v', v)
        if (!v.data.success) {
          this.collapseShown = true
        } else {
          this.collapseShown = false
          this.documentTypeName = v.data.result.description
          this.value.documentId = v.data.result.documentId
          this.singleDocument = v.data.result.isSingleDocument
          console.log('document', v.data.result)
          this.value.files.splice(0, this.value.files.length)
          v.data.result.files.forEach(i => {
            this.value.files.push(i)
            console.log('i', i)
          })
          this.busy = false
          this.$emit('change', this.value.documentId)
          this.$emit('count', this.value.files.length)
          this.$emit('activeCount', this.value.files.filter(i => i.fileListStatusHistories !== 'deleted').length)
        }
      })
        .catch((err) => {
          if (!err.success) {
            console.log(err)
            err.data.errors.DomainValidations.forEach((v) => {
              // eslint-disable-next-line
              this.$notify.error(this.$t(('error.') + v + '  '))
            })
          }
          /*    else {
                if (err.data.status !== 404) {
                  this.$notify.error(this.$t('notify.error'))
                }
              }*/
          this.busy = false
        })
    },
    getTemplateList() {
      documentTemplateApi
        .getTemplateList(this.documentType)
        .then((v) => {
          if (v.data.success) {
            this.templateList = v.data.result
            console.log('template', v.data.result)
            console.log('documentType', this.documentType)
          }
        })
        .catch((err) => {
          console.log(err)
        })
    },
    printTemplate(selectedTemplate) {
      const d = new Printd()
      // opens the "print dialog" of your browser to print the element
      this.isPrinting = true
      this.content = this.templateList.find(i => i.documentTemplateId === selectedTemplate).content
      var div = document.createElement('div')
      div.innerHTML = this.content
      this.$nextTick(() => {
        d.print(div)
        this.isPrinting = false
      })
    },
    viewDocumentType(document) {
      var path = process.env.VUE_APP_BASE_API + 'api/d/v1/partner/viewer?year=' + document.year + '&month=' + document.month + '&day=' + document.day + '&documentId=' + this.value.documentId + '&fileId=' + document.fileId + '&download=' + true + '&isCozum=' + this.isCzmDocuments
     console.log(path)
      window.open(path)
    },
    printDocument(documentId) {
      // Wait until PDF is ready to print
      this.path.print()
    },
    imageShow(document) {
      this.imagePath = process.env.VUE_APP_BASE_API + 'api/d/v1/partner/viewer?year=' + document.year + '&month=' + document.month + '&day=' + document.day + '&documentId=' + this.value.documentId + '&fileId=' + document.fileId + '&download=' + false + '&isCozum=' + this.isCzmDocuments
      if (this.extensions.includes(document.extension)) {
        window.open(this.imagePath)
      } else {
        this.dialogVisible = true
        this.showImage = true
      }
    },
    uploadDialog() {
      this.uploadDialogVisible = true
    },
    templateDialog() {
      this.templateDialogVisible = true
    },
    onChange(v) {
    },
    archive(fileId) {
      this.$confirm(this.$t('template.archiveQuestion'), this.$t('notifyArchive.archiveNotify'), {
        confirmButtonText: this.$t('notifyArchive.archiveRemove'),
        cancelButtonText: this.$t('notifyArchive.archiveCancel'),
        type: 'warning'
      }).then(() => {
        this.busy = true
        documentApi.archive(fileId)
          .then(() => {
            this.$notify.success(this.$t('notifyArchive.archiveSuccess'))
            this.busy = false
            this.getDocument()
          })
      }).catch(() => {
        this.busy = false
        this.$message({
          type: 'info',
          message: this.$t('notifyArchive.archiveCanceled')
        })
      })
    },
    avatarChangePath() {
      this.$emit('avatarChangePath', this.path)
    },
    unarchive(id) {
      if (this.singleDocument && this.value.files.filter(i => i.fileListStatusHistories === 'created').length > 0) {
        this.$notify.error('birden fazla dosya yüklenemez')
        return
      }
      this.$confirm(this.$t('template.unarchiveQuestion'), this.$t('notifyArchive.unarchiveNotify'), {
        confirmButtonText: this.$t('notifyArchive.unarchiveRemove'),
        cancelButtonText: this.$t('notifyArchive.unarchiveCancel'),
        type: 'warning'
      }).then(() => {
        this.busy = true
        documentApi.unarchive(id)
          .then(() => {
            this.$notify.success(this.$t('notifyArchive.unarchiveSuccess'))
            this.busy = false
            this.getDocument()
          })
      }).catch(() => {
        this.busy = false
        this.$message({
          type: 'info',
          message: this.$t('notifyArchive.unarchiveCanceled')
        })
      })
    },
    handleChange(val) {
    },
    submitFiles() {
      this.imageSize = []
      this.$refs.files.uploadFiles.forEach(i => {
        this.imageSize.push(((i.size) / 1024) / 1024).toFixed(2)
      })
      var documentCount = this.$refs.files.uploadFiles.length + this.value.files.filter(i => i.fileListStatusHistories === 'created').length
      if (this.singleDocument && documentCount > 1) {
        this.$notify.error('birden fazla dosya yüklenemez')
        return
      }
      if (!this.imageSize.some) {
        this.$notify.error(this.$t('dms.error.sizeExceed'))
        return
      }
      if (this.imageSize.some(i => i > this.sizeLimit) && !this.withOutIndices) {
        this.$notify.error(this.$t('dms.error.sizeExceed'))
        return
      }
      if (!this.busy) {
        this.loading = true
        this.busy = true
        var indices = this.withOutIndices ? [{
          keyType: this.documentType.toUpperCase(),
          value: this.documentGroupType + this.documentType.toUpperCase()
        }] : this.indices
        documentApi.createDocument({
          documentType: this.documentType,
          documentId: this.value.documentId,
          documentName: this.documentName,
          documentPath: this.documentPath,
          withoutIndex: this.withOutIndices,
          isCzmDocuments: this.isCzmDocuments,
          indices: indices,
          files: this.$refs.files.uploadFiles
          // files: this.$refs.files.files
        })
          .then(() => {
            this.$notify.success(this.$t('notify.success'))
            this.busy = false
            this.uploadDialogVisible = false
            this.fileList = []
            this.getDocument()
          })
          .catch((err) => {
            if (!err.success) {
              err.data.errors.DomainValidations.forEach((v) => {
                // eslint-disable-next-line
                this.$notify.error(this.$t('dms.error.' + v))
              })
            }
            /*else {
              this.$notify.error(this.$t('notify.error'))
            }*/
            this.busy = false
          })
        this.loading = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
:deep(.documentPage) {
  .documentPageCollapse .el-collapse-item__header {
    height: 40px !important;
    object-fit: contain;
    border-radius: 4px;
    box-shadow: 0 10px 20px 0 rgba(0, 0, 0, 0.1);
    border: solid 1px #e5e5e5;
    background-color: #fff !important;
    background-image: none !important;
  }

  .el-checkbox__inner {
    width: 20px !important;
    height: 20px !important;
    border-radius: 20px;
  }

  .el-checkbox__input.is-checked .el-checkbox__inner {
    border: 8px solid #fff;
    background: #b7b7b7;
  }

  .el-checkbox__inner::after {
    display: none;
  }

  .el-checkbox__input {
    border-radius: 50%;
  }

  .documentPageCollapse .font1 {
    font-size: 14px !important;
    font-weight: normal;
    font-style: normal;
    font-stretch: normal;
    line-height: normal;
    letter-spacing: normal;
    color: #000000;
    white-space: nowrap;
  }

  .orangeFont {
    font-size: 14px;
    font-weight: normal;
    font-style: normal;
    font-stretch: normal;
    line-height: normal;
    letter-spacing: normal;
    text-align: right;
    color: #f59f3e;
  }

  .normalFont {
    font-size: 14px;
    font-weight: 100;
    font-style: normal;
    font-stretch: normal;
    line-height: normal;
    letter-spacing: normal;
    text-align: center;
    color: #000000;
  }
}

@media only screen and (max-width: 1366px) {
  .font1 {
    font-size: 14px !important;
  }
  :deep(.documentPage) {
    .el-checkbox__inner {
      //widows: 20px;
      height: 20px;
    }
  }
}
</style>
