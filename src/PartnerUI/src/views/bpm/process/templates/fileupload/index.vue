<template>
  <el-col :span="formItemContent.cols">
    <el-form-item
      :rules="rules"
      :label="formItemContent.label"
      :prop="'formItems[' + index + '].documentType'"
      class="file-upload-item">
      <document
        v-if="formItemContent.documentType"
        ref="document"
        :disabled="disabled"
        v-model="value.formItems[index].value[0]"
        :indices="getIndicies()"
        :document-type="formItemContent.documentType.toLowerCase()"
        @activeCount="getFileCount"/>
    </el-form-item>
  </el-col>
</template>
<script>
import document from '@/views/dms/document'
export default {
  components: {
    document
  },
  props: {
    modelValue: {
      type: Object,
      default: () => {}
    },
    formItemContent: {
      type: Object,
      default: () => [],
      documentIndices: {
        type: Object,
        default: () => []
      }
    },
    index: {
      type: Number,
      default: 0
    },
    disabled: {
      type: Boolean,
      default: false
    },
    processId: {
      type: Number,
      default: 0
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
  data() {
    var validatePass = (rule, value, callback) => {
      this.value.formItems[this.index].value[0] = this.$refs['document'].documentId
      if (this.formItemContent.isRequired && this.fileCount === 0) {
        callback(new Error(this.$t('task.required', { title: this.formItemContent.label })))
      } else {
        callback()
      }
    }
    return {
      rules: [{ validator: validatePass, trigger: 'blur' }],
      fileCount: 0
    }
  },
  mounted() {
  },
  methods: {
    getIndicies() {
      if(this.formItemContent && this.formItemContent.documentIndices)
      {
        var processIdIndex = this.formItemContent.documentIndices.find(i => i.keyType === 'PROCESSID')
        if (processIdIndex && processIdIndex.value === '') {
          processIdIndex.value = this.processId
        }
      }

      return this.formItemContent.documentIndices
    },
    getFileCount(value) {
      this.fileCount = value
    }
  }
}
</script>
<style lang="scss" scoped>
.form-element {
  display: inline-block;
}
:deep(.file-upload-item) {
  .el-collapse.documentPageCollapse {
    margin-bottom: 0 !important;
    border: none;
  }
  .el-form-item__error {
    width: fit-content;
    height: 20px;
    object-fit: contain;
    border-radius: 4px;
    border: solid 1px #c94343;
    background-color: #feeaea;
    font-weight: bold;
    position: unset;
    padding-left: 5px;
    display: flex;
    align-items: center;
    justify-content: start;
  }
}
</style>

