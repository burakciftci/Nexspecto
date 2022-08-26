<template>
  <div class="documentGroup">
    <el-collapse v-model="activeNames" class="documentGroupCollapse" @change="handleChange">
      <el-collapse-item v-if="documentGroup.documentGroupTypeDescription !== undefined" :title="getTitle" name="1">
        <template>
          <el-row style="width:100%;" justify="center">
            <el-col :span="10" :push="2"><span class="font1">{{ getTitle }}</span></el-col>
          </el-row>
        </template>
        <document v-for="(i,j) in documentGroup.documentTypes" :key="j" :indices="indices" :is-czm-documents="isCzmDocuments" :with-out-indices="withOutIndices" :document-group-type="documentGroupType" :document-type="i.documentTypeName.toLowerCase()" />
      </el-collapse-item>
    </el-collapse>
  </div>
</template>
<script>

import documentGroups from '@/api/dms/documentGroupType'
import document from '@/views/dms/document'

export default {
  components: {
    document
  },
  props: {
    indices: {
      type: Array,
      default: () => [{ keyType: '', value: '' }],
      description: 'template id'
    },
    disabled: {
      type: Boolean,
      default: false,
      description: 'disable'
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
    title: {
      type: String,
      default: ''
    },
    withOutIndices: {
      type: Boolean,
      default: false
    },
    isCzmDocuments: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      activeNames: [1],
      documentGroup: {
        documentGroupTypeDescription: ''
      },
      documentGroupTypes: [],
      documentTypes: [],
      busy: false,
      resultTitle: '',
      indiceList: []
    }
  },
  computed: {
    getTitle() {
      return this.title !== '' ? this.documentGroup.documentGroupTypeDescription + ' - ' + this.title : this.documentGroup.documentGroupTypeDescription
    }
  },
  created() {
    this.getGroupList()
    this.indiceList = this.indices
  },
  methods: {
    getGroupList() {
      this.busy = true
      documentGroups
        .getDocumentGroupTypesWithDocumentTypes(this.documentGroupType, this.indices)
        .then((v) => {
          this.documentGroup = v.data
        })
        .catch(() => {
        })
        .finally(() => {
          this.busy = false
        })
    },
    handleChange(val) {
    }
  }
}
</script>
<style lang="scss" scoped>
.documentGroup >>> {
  .el-collapse-item__content{
    padding-bottom: 0px;
  }
.documentGroupCollapse .el-collapse-item__header{
  height: 60px;
  object-fit: contain;
  border-radius: 4px;
  box-shadow: 0 10px 20px 0 rgba(0, 0, 0, 0.1);
  border: solid 1px #e5e5e5;
	background-image: linear-gradient(96deg, #f5f5f5, #ffffff);
}
.el-checkbox__inner{
    width: 30px;
    height: 30px;
    border-radius: 20px;
  }
  .el-checkbox__input.is-checked .el-checkbox__inner{
    border: 8px solid #fff;
    background: #b7b7b7;
  }
  .el-checkbox__inner::after{
    display: none;
  }
  .el-checkbox__input{
    border-radius: 50%;
  }
  .el-collapse-item__arrow{
    margin-bottom: 0px;
  }
  .el-collapse-item__arrow::before{
    color: #b7b7b7;
    width: 20px;
    height: 20px;
    font-weight: bold;
    font-size: 20px;
  }
  .documentGroupCollapse .font1{
    font-size: 16px;
    font-weight: normal;
    font-style: normal;
    font-stretch: normal;
    line-height: normal;
    letter-spacing: normal;
    color: #000000;
    vertical-align: middle;
  }
}
@media only screen and (max-width: 1366px) {
  .font1{
    font-size: 12px !important;
  }
  .normalFont {
    font-size: 12px !important;
  }
  .documentGroup >>> {
    .el-checkbox__inner {
      width: 20px;
      height: 20px;
    }
  }
}
</style>

