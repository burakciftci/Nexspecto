<template>
  <el-col :span="formItemContent.cols" >
    <el-form-item
      :rules="rules"
      :label="formItemContent.label"
      :prop="'formItems[' + index + '].value'">

      <organization-search
        ref="selectedPerson"
        v-model="value.formItems[index].value[0]"
        :disabled="disabled"
        :internal-organization-id="value.formItems[index].value[0]"
        :key ="'user'+value.formItems[index].value[0]"
        :search-place-holder="formItemContent.placeholder"
        :role-type="'Employee'"/>
    </el-form-item>
  </el-col>
</template>
<script>

import organizationSearch from '@/views/bpm/process/templates/organizationSearch'
export default {
  components: { organizationSearch
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
      if (this.formItemContent.isRequired && !this.value.formItems[this.index].value[0]) {
        callback(new Error(this.$t('task.required', { title: this.formItemContent.label })))
      } else {
        callback()
      }
    }
    return {
      rules: [{ validator: validatePass, trigger: 'blur' }]
    }
  },
  methods: {
  }
}
</script>
<style scoped>
.form-element {
  display: inline-block;
}
</style>

