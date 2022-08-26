<template>
  <el-col :span="formItemContent.cols" >
    <el-form-item
      :rules="rules"
      :label="formItemContent.label"
      :required="formItemContent.isRequired"
      :prop="'formItems[' + index + '].value[0]'">
      <el-input
        :disabled="disabled"
        :name="'smalltextfield'+value.formItems[index].fieldAliasName"
        v-model="value.formItems[index].value[0]"
        :placeholder="formItemContent.placeholder"/>
    </el-form-item>
  </el-col>
</template>
<script>
export default {
  components: {
  },
  props: {
    modelValue: {
      type: Object,
      default: () => {}
    },
    formItemContent: {
      type: Object,
      default: () => {}
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
      console.log('test:' + rule)
      if (this.formItemContent.isRequired && !this.value.formItems[this.index].value[0]) {
        callback(new Error(this.$t('task.required', {title: this.formItemContent.label})))
      } else {
        callback()
      }
    };
    return {
      rules: [{ validator: validatePass, trigger: 'blur' }]
    }
  },
  mounted() {
  }
}
</script>
<style scoped>
.form-element {
  display: inline-block;
}
</style>

