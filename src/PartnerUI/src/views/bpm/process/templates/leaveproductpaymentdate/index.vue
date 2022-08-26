<template>
  <el-col :span="formItemContent.cols">
    <el-form-item label="Ayrılma Türü">
      {{ formItemContent.alias }}
    </el-form-item>
    <el-form-item label="Ödeme Tarihi">
      {{ paymentDate }}
    </el-form-item>
  </el-col>
</template>
<script>
import moment from 'moment'

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
    },
    kickOffFormItems: {
      type: Array,
      default: () => {
      }
    }
  },
  emits: ['update:modelValue'],
  data() {
    return {
      paymentDate: null,
      productStage: null,
      stepStartDate: null,
      productCreateDate: new Date((this.kickOffFormItems.filter(p => p.content.includes('ProductCreateDate')).map(p => p.valueString))),
      isAfterDay: 14
    }
  },
  computed: {
    productCreateDateFormat() {
      return moment(this.productCreateDate).format('YYYY-MM-DD').toString()
    },
    value: {
      get() {
        return this.modelValue
      },
      set(value) {
        this.$emit('update:modelValue', value)
      }
    }
  },
  mounted() {
    this.productStage = this.formItemContent.alias
    this.calculatePaymentDate()
  },
  methods: {

    calculatePaymentDate() {
      if (this.productCreateDate.length === 0 || this.productCreateDate === '""') {
        this.isAfter = false
      }
      var isAfter = moment(this.productCreateDateFormat).isAfter('2021-05-05')
      console.log('isAfter', isAfter)

      var paymentDayBeforeDelivery = this.$store.getters.parameters.financeParameters.find(i => i.name === 'Ayrılma - Teslimat Öncesi Ödeme Gün Sayısı').value
      var paymentDayBeforeService = this.$store.getters.parameters.financeParameters.find(i => i.name === 'Ayrılma - Hizmet Öncesi Ödeme Gün Sayısı').value
      var paymentDayDeliveryStage = this.$store.getters.parameters.financeParameters.find(i => i.name === 'Ayrılma - Teslimat Dönemi Ödeme Gün Sayısı').value
      var paymentDayBeforeDeliveryAfter15February = this.$store.getters.parameters.financeParameters.find(i => i.name === 'Ayrılma - Teslimat Öncesi Ödeme Gün Sayısı - 15 Şubat Sonrası').value
      // normalde eklenen günler 21-30-80 ancak bulunduğumuz gün de sayılacağı için 1 eksilterek topladık
      paymentDayBeforeDelivery -= 1
      paymentDayBeforeService -= 1
      paymentDayDeliveryStage -= 1
      paymentDayBeforeDeliveryAfter15February -= 1

      var isToProject = this.model.details.includes('<strong>Alıcı Proje No: </strong>')

      if (!isToProject) {
        this.paymentDate = this.formatDateTime(new Date(this.model.startedDateTime))
      } else {
        if (this.productStage === 'Hizmet Öncesi') {
          this.findFriday(paymentDayBeforeService, isAfter, this.isAfterDay)
        } else if (this.productStage === 'Teslimat Öncesi') {
          this.findFriday(paymentDayBeforeDelivery, isAfter, this.isAfterDay)
        } else if (this.productStage === '15 Şubat 2021 Sonrası Açılan - Teslimat Öncesi') {
          this.findFriday(paymentDayBeforeDeliveryAfter15February, isAfter, this.isAfterDay)
        } else {
          this.findFriday(paymentDayDeliveryStage, isAfter, this.isAfterDay)
        }
      }
    },
    findTuesday(days) {
      var processStartDate = new Date(this.model.startedDateTime)
      var deliveryDate = new Date(processStartDate.setDate(processStartDate.getDate() + days))
      var firstDayOfDeliveryDate = new Date(deliveryDate.setDate(deliveryDate.getDate() - deliveryDate.getDay() + (deliveryDate.getDay() === 0 ? -6 : 1)))
      var tuesDayOfDeliveryDate = new Date(firstDayOfDeliveryDate.setDate(firstDayOfDeliveryDate.getDate() + 1))
      this.paymentDate = this.formatDateTime(tuesDayOfDeliveryDate)
    },
    findFriday(days, isAfter, isAfterDay) {
      if (isAfter && this.productStage === 'Hizmet Öncesi') {
        console.log('x3')
        var innerMoment = require('moment-business-days')
        var processStartDateAfter = new Date(this.model.startedDateTime)
        var deliveryDateAfter = new Date(processStartDateAfter.setDate(processStartDateAfter.getDate() + isAfterDay))
        console.log('deliveryDateAfter', deliveryDateAfter)

        var isBusinessDay = innerMoment(deliveryDateAfter, 'DD-MM-YYYY').isBusinessDay()
        console.log('isBusinessDay', isBusinessDay)

        this.paymentDate = this.formatDateTime(deliveryDateAfter)
        if (!isBusinessDay) {
          for (let index = 0; index < 6; index++) {
            deliveryDateAfter = new Date(processStartDateAfter.setDate(processStartDateAfter.getDate() + 1))
            if (innerMoment(deliveryDateAfter, 'DD-MM-YYYY').isBusinessDay()) {
              this.paymentDate = this.formatDateTime(deliveryDateAfter)
              break
            }
          }
        }
      } else {
        var processStartDate = new Date(this.model.startedDateTime)
        var deliveryDate = new Date(processStartDate.setDate(processStartDate.getDate() + days))
        var firstDayOfDeliveryDate = new Date(deliveryDate.setDate(deliveryDate.getDate() - deliveryDate.getDay() + (deliveryDate.getDay() === 0 ? -6 : 1)))
        var tuesDayOfDeliveryDate = new Date(firstDayOfDeliveryDate.setDate(firstDayOfDeliveryDate.getDate() + 4))
        this.paymentDate = this.formatDateTime(tuesDayOfDeliveryDate)
      }
    },
    formatDateTime(datetime) {
      var dd = datetime.getDate()
      var mm = datetime.getMonth() + 1
      var yyyy = datetime.getFullYear()
      if (dd < 10) { dd = '0' + dd }
      if (mm < 10) { mm = '0' + mm }
      return dd + '/' + mm + '/' + yyyy
    }
  }
}
</script>

