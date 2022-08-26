<template>
  <el-col :span="formItemContent.cols" >
    <el-form-item
      :rules="rules"
      :label="formItemContent.label"
      :prop="'formItems[' + index + '].value[0]'">
      <el-select
        v-loading="busyCustomer"
        :disabled="disabled"
        v-model="value.formItems[index].value[0]"
        :remote-method="remoteCustomerSearch"
        :placeholder="formItemContent.placeholder"
        filterable
        remote
        reserve-keyword>
        <el-option-group
          v-for="group in customerList"
          :key="group.portfolioPartyId"
          :label="group.portfolioName">
          <el-option
            v-for="item in group.customers"
            :key="item.customerPartyId"
            :label="item.customerId+' - '+item.customerName"
            :value="item.customerPartyId"/>
        </el-option-group>
      </el-select>
    </el-form-item>
  </el-col>
</template>
<script>
import lookupApi from '@/api/bpm/lookup'
export default {
  model: {
    prop: 'model',
    event: 'change'
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
      customerList: [],
      busyCustomer: false,
      rules: [{ validator: validatePass, trigger: 'blur' }]
    }
  },
  mounted() {
  },
  methods: {
    remoteCustomerSearch(query) {
      if (query !== '') {
        this.busyCustomer = true
        lookupApi.getCustomer(query, this.$store.state.user.sub)
          .then((v) => {
            this.customerList = v.data
            this.busyCustomer = false
          })
          .catch((err) => {
            this.$emit('on-error', err.message)
            this.$notify.error(this.$t('notify.error'))
            this.busyCustomer = false
          })
      } else {
        this.customerList = []
      }
    }
  }
}
</script>
<style scoped>
.form-element {
  display: inline-block;
}
</style>

