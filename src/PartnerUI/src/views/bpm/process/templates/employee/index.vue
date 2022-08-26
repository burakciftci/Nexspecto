<template>
  <el-col :span="formItemContent.cols" >
    <el-form-item
      :rules="rules"
      :label="formItemContent.label"
      :prop="'formItems[' + index + '].value'">
      <el-cascader
        v-loading="busy"
        :disabled="disabled"
        :placeholder="formItemContent.placeholder"
        :show-all-levels="false"
        :options="employeeList"
        v-model="value.formItems[index].value"
        :value="getEmployeeList()"
        expand-trigger="hover"/>
    </el-form-item>
  </el-col>
</template>
<script>
import lookupApi from '@/api/bpm/lookup'
export default {
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
    const validatePass = (rule, value, callback) => {
      if (this.formItemContent.isRequired && !this.value.formItems[this.index].value[0]) {
        callback(new Error(this.$t('task.required', {title: this.formItemContent.label})))
      } else {
        callback()
      }
    };
    return {
      busy: false,
      employeeList: [],
      rules: [{ validator: validatePass, trigger: 'blur' }]
    }
  },
  methods: {
    getEmployeeList() {
      if (this.employeeList.length === 0) {
        this.busy = true
        lookupApi.getPositionEmployeeTree()
          .then((v) => {
            const extendArray = a => {
              const t = { value: a.value, label: a.text }
              if (a.children && a.children.length > 0) {
                t.children = a.children.map(e => extendArray(e))
              }
              return t
            }
            this.employeeList = [extendArray(v.data)]
            this.busy = false
          })
          .catch((err) => {
            this.$emit('on-error', err.message)
            this.$notify.error(this.$t('notify.error'))
            this.busy = false
          })
      }
      return this.employeeList
    }
  }
}
</script>
<style scoped>
.form-element {
  display: inline-block;
}
</style>

