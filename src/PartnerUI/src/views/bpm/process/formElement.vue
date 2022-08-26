<template>
  <el-form-item :disabled="disabled && !notDisabledComponentTypes.includes(model.formItems[index].formItemType.toString())" class="form-item-parent">
    <component
      v-if="model.formItems[index].formItemType"
      :is="model.formItems[index].formItemType"
      v-model="model"
      class="width-full"
      :form-item-content="formItemContent(model.formItems[index].content)"
      :index="index"
      :process-id="processId"
      :kick-off-form-items="kickOffFormItems"
      :disabled="disabled"/>
  </el-form-item>
</template>
<script>
import checklist from './templates/checkList'
import customer from './templates/customer'
import date from './templates/date'
import dropdownlistfield from './templates/dropdownlistfield'
import employee from './templates/employeeSearch'
import fileupload from './templates/fileupload'
import largetextaria from './templates/largeText'
import numeric from './templates/numeric'
import radiobuttons from './templates/radiobuttons'
import smalltextfield from './templates/smallText'
import partyidentityinformation from './templates/partyidentityinformation'
import customerproductinformation from './templates/customerproductinformation'
import documentviewer from './templates/documentviewer'
import portfolio from './templates/portfolio'
import portfoliocustomer from './templates/portfoliocustomer'
import portfoliocounter from './templates/portfoliocounter'
import customervalidation from './templates/customervalidation'
import corporatecustomervalidation from './templates/corporatecustomervalidation'
import customerfindex from './templates/customerFindex'
import transaction from './templates/transaction'
import instantdelivery from './templates/instantdelivery'
import partynote from './templates/partynote'
import contextvariableassignment from './templates/contextvariableassignment'
import leaveproductpaymentdate from './templates/leaveproductpaymentdate'
import partydatachange from './templates/partydatachange'
export default {
  components: {
    checklist,
    customer,
    partynote,
    date,
    dropdownlistfield,
    employee,
    fileupload,
    numeric,
    largetextaria,
    radiobuttons,
    smalltextfield,
    partyidentityinformation,
    customerproductinformation,
    documentviewer,
    instantdelivery,
    portfolio,
    portfoliocustomer,
    portfoliocounter,
    customervalidation,
    corporatecustomervalidation,
    customerfindex,
    transaction,
    contextvariableassignment,
    leaveproductpaymentdate,
    partydatachange
  },
  model: {
    prop: 'model',
    event: 'change'
  },
  props: {
    model: {
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
    processId: {
      type: Number,
      default: 0
    },
    kickOffFormItems: {
      type: Array,
      default: null
    }
  },
  data() {
    return {
      notDisabledComponentTypes: ['documentviewer', 'fileupload']
    }
  },
  methods: {
    formItemContent(contentString) {
      return JSON.parse(contentString)
    }
  }
}
</script>
<style lang="scss" scoped>
:deep(.form-element) {
  display: inline-block;
}
.form-item-parent{
  width: 100%;
  :deep(.documentPage) {
    width: 100%;
  }
}
</style>

