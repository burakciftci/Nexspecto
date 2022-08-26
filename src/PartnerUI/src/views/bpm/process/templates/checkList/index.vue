<template>
  <el-col :span="formItemContent.cols">
    <el-form-item
      :rules="rules"
      :label="formItemContent.label"
      :required="formItemContent.isRequired"
      :prop="'formItems[' + index + '].value'">
      <el-checkbox-group
        :disabled="disabled"
        v-model="value.formItems[index].value"
        :name="'checklist'+value.formItems[index].formInstanceItemId">
        <el-checkbox v-for="c in formItemContentOptions()" :label="c.value" :key="c.value">{{ c.text }}</el-checkbox>
      </el-checkbox-group>
    </el-form-item>
  </el-col>
</template>
<script>
export default {
  components: {
    document
  },
  props: {
    modelValue: {
      type: Object,
      default: () => {
      }
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
        callback(new Error(this.$t('task.required', {title: this.formItemContent.label})))
      } else {
        callback()
      }
    }
    return {
      rules: [{validator: validatePass, trigger: 'blur'}]
    }
  },
  mounted() {
    this.value.formItems[this.index].value = this.formItemContent.value !== undefined ? this.formItemContent.value : []
  },
  methods: {
    formItemContentOptions() {
      const content = this.formItemContent
      const newArr = content.options.map(element => {
        if (element.indexOf('[') > -1 && element.indexOf(']')) {
          return {
            value: element.substr(0, element.indexOf('[')),
            text: element.substr(element.indexOf('[') + 1, element.length - 1 - element.substr(0, element.indexOf('[')).length - 1)
          }
        }
        return {text: element, value: element}
      })
      return newArr
    }
  }
}
</script>
<style scoped>
.form-element {
  display: inline-block;
}
</style>

