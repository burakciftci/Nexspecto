<template>
  <el-col :span="formItemContent.cols">
    <el-form-item :label="formItemContent.label" :rules="rules" :required="formItemContent.isRequired" :prop="'formItems[' + index + '].value[0]'">
      <el-date-picker
        v-model="value.formItems[index].value[0]"
        :picker-options="pickerOptions"
        type="date"
        value-format="yyyy-MM-dd"
        placeholder="Gün Seçiniz."
        @change="getLockedDays"
        @focus="reValidate"/>
    </el-form-item>

    <!-- {{ (kickOffFormItems.filter(p => p.content.includes('DeliveryAmount')).map(p => p.valueString))[0] }} -->
  </el-col>
</template>
<script>

import moment from 'moment'
import productDeliveryApi from '@/api/finance/productdeliveryreport'

export default {
  components: {},
  props: {
    kickOffFormItems: {
      type: Array,
      default: () => {
      }
    },
    modelValue: {
      type: Object,
      default: () => {
      }
    },
    formItemContent: {
      type: Object,
      default: () => {
      }
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
    var amount = (this.kickOffFormItems.filter(p => p.content.includes('DeliveryAmount')).map(p => p.valueString))
    return {
      list: {},
      deliveryAmount: amount.length ? amount[0] : null,
      lockedDays: [],
      rules: [{ validator: validatePass, trigger: 'blur' }],
      isWrongPortfolio: false,
      pickerOptions: {
        disabledDate: (time, locked = this.lockedDays) => {
          return moment(time).isSameOrAfter(moment().startOf('month').add(7, 'M')) || this.lockedDays.findIndex(i => new Date(Date.parse(i.lockedDay)).toUTCString() === new Date(time).toUTCString()) > -1
        }
      }
    }
  },
  async mounted() {
    // this.party = this.formItemContent.alias
    await this.reValidate()
  },
  methods: {
    async getLockedDays() {
      this.busy = true
      const { data } = await productDeliveryApi.getLimitFullDays()
      this.lockedDays = data

      // if (this.lockedDays.findIndex(i => new Date(Date.parse(i.lockedDay)).toUTCString() === new Date(this.model.formItems[this.index].value[0]).toUTCString()) > -1) {
      //   this.$notify.error('Seçilen gün teslimatlar için doludur !')
      //   this.model.formItems[this.index].value[0] = null
      // }

      this.busy = false
    },
    async getLockedDaysByDeliveryAmount() {
      this.busy = true
      const { data } = await productDeliveryApi.getLimitFullDaysByDeliveryAmount(this.deliveryAmount)
      this.lockedDays = data
    },
    async reValidate() {
      // console.log('revalidate')
      if (this.deliveryAmount && this.deliveryAmount !== '') {
        await this.getLockedDaysByDeliveryAmount()
      } else {
        await this.getLockedDays()
      }

      if (this.lockedDays.findIndex(i => new Date(Date.parse(i.lockedDay)).toUTCString() === new Date(this.value.formItems[this.index].value[0]).toUTCString()) > -1) {
        this.$notify.error('Seçilen gün teslimatlar için doludur !')
        this.value.formItems[this.index].value[0] = null
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

