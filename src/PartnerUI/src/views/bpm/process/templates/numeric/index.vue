<template>
  <el-col :span="formItemContent.cols" >
    <el-form-item
      :rules="rules"
      :label="formItemContent.label"
      :required="formItemContent.isRequired"
      :prop="'formItems[' + index + '].value[0]'">
      <el-input-number
        :disabled="disabled"
        v-model="value.formItems[index].value[0]"
        :placeholder="formItemContent.placeholder"
        :min="formItemContent.min"
        :max="formItemContent.max"
        controls-position="right"/>
    </el-form-item>
  </el-col>
</template>
<script>
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
    // var validatePass = (rule, value, callback) => {
    //   console.log('callback: ', callback)
    //   console.log('rule: ', rule)
    //   console.log('value: ', value)
    //   rule.type = 'number'
    //   console.log('ruleagain: ', rule)
    //   console.log('this.model.formItems[this.index].value[0] outside', this.model.formItems[this.index].value[0])
    //   if (this.formItemContent.isRequired && this.model.formItems[this.index].value[0] === undefined) {
    //     console.log('this.model.formItems[this.index].value[0] inside', this.model.formItems[this.index].value[0])
    //     callback(new Error(this.$t('task.required', { title: this.formItemContent.label })))
    //   } else {
    //     console.log('else')
    //     callback()
    //   }
    // }
    return {
      rules: [
        { required: this.formItemContent.isRequired, message: this.$t('task.required', { title: this.formItemContent.label }), type: 'number', trigger: 'change' },
        { min: +this.formItemContent.min, max: +this.formItemContent.max, type: 'number', trigger: 'change' }
      ]

    }
  },
  mounted() {
    // this.model.formItems[this.index].value[0] = this.formItemContent.alias
  }
}
</script>
<style scoped>
.form-element {
  display: inline-block;
}
</style>

