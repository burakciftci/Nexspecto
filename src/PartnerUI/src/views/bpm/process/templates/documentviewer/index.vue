<template>
  <el-col :span="formItemContent.cols" >
    <el-form-item
      :rules="rules"
      :label="formItemContent.label"
      :prop="'formItems[' + index + '].documentType'">
      <document
        :disabled="disabled"
        :indices="getIndicies()"
        :document-type="formItemContent.documentType.toLowerCase()" />
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
      default: () => []
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
      if (this.formItemContent.isRequired && this.value.formItems[this.index].documentType === '') {
        callback(new Error(this.$t('task.required', { title: this.formItemContent.label })))
      } else {
        callback()
      }
    }
    return {
      rules: [{ validator: validatePass, trigger: 'blur' }]

    }
  },
  mounted() {
    this.value.formItems[this.index].documentType = this.formItemContent.documentType
  },
  methods: {
    getIndicies() {
      var processIdIndex = this.formItemContent.documentIndices.find(i => i.keyType === 'PROCESSID')
      if (processIdIndex && processIdIndex.value === '') {
        processIdIndex.value = this.processId
      }
      return this.formItemContent.documentIndices
    }
  }
}
</script>
<style scoped>
.form-element {
  display: inline-block;
}
</style>

