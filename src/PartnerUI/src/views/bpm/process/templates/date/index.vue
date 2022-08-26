<template>
  <el-col :span="formItemContent.cols" >
    <el-form-item
      :rules="rules"
      :label="formItemContent.label"
      :required="formItemContent.isRequired"
      :prop="'formItems[' + index + '].value[0]'">
      <el-date-picker
        :disabled="disabled"
        v-model="value.formItems[index].value[0]"
        :picker-options="pickerOptions"
        :name ="'date'+value.formItems[index].formInstanceItemId"
        :placeholder="formItemContent.placeholder"
        format="dd/MM/yyyy"
        value-format="YYYY-MM-DD"
        type="date" />
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
    var validatePass = (rule, value, callback) => {
      console.log('valueee' + value);
      console.log('rulesss' + rule);
      console.log(this.value.formItems[this.index].value[0]);
      if (this.formItemContent.isRequired && !this.value.formItems[this.index].value[0]) {
        callback(new Error(this.$t('task.required', { title: this.formItemContent.label })))
      } else {
        callback()
      }
    }
    return {
      pickerOptions: {
        disabledDate(time) {
          var now = new Date(new Date().setDate(new Date().getDate() - 1))
          var oneYearLater = new Date(new Date().setFullYear(new Date().getFullYear() + 1))
          return (
            time.getTime() < now ||
            time.getTime() > oneYearLater
          )
        },
        firstDayOfWeek: 1
      },
      rules: [{ validator: validatePass, trigger: 'blur' }]
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

