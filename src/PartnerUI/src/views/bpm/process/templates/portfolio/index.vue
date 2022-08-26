<template>
  <el-col v-loading="busy" :span="formItemContent.cols">
    <el-row>
      <el-form-item :rules="rules" label="Portföyü Aktarılcak BMT" prop="partyId" label-width="140px">
        <el-select v-loading="busy" v-model="value.formItems[index].value[0]" class="itemlabel" clearable @change="getLookups">
          <el-option
            v-for="item in bmtList"
            :key="item.value"
            :label="item.label"
            :value="item.value"/>
        </el-select>
      </el-form-item>
    </el-row>
    <el-row>
      <el-form-item label="Portföy Tasarruf Sahipleri" label-width="140px">
        <el-select class="itemlabel" value="Aktarım Yapılacak Müsteriler" clearable>
          <el-option
            v-for="item in nameList"
            :key="item.value"
            :label="item.text"
            :value="item.value"/>
        </el-select>
      </el-form-item>
    </el-row>
    <el-row>
      <el-form-item :rules="rules" label="Portföyü Devri" prop="newBmt" label-width="140px">
        <el-select v-model="value.formItems[index].value[1]" class="itemlabel" clearable>
          <el-option
            v-for="item in newBmtList"
            :key="item.value"
            :label="item.label"
            :value="item.value"/>
        </el-select>
      </el-form-item>
    </el-row>
  </el-col>
</template>

<script>

import portfolioApi from '@/api/crm/portfolio'

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
      if (!(this.value.formItems[this.index].value[0] > 0)) {
        callback(new Error(this.$t('task.required', { title: 'Portföyü Aktarılcak BMT' })))
      } else if (!(this.model.formItems[this.index].value[1] > 0)) {
        callback(new Error(this.$t('task.required', { title: 'Yeni BMT' })))
      } else {
        callback()
      }
    }
    return {
      busy: false,
      partyId: null,
      party: null,
      nameList: [],
      newBmtList: [],
      bmtList: [],
      rules: [
        { validator: validatePass, trigger: 'blur' }]
    }
  },
  mounted() {
    this.party = this.formItemContent.aliasPortfolio
    this.customerList = this.formItemContent.aliasCustomerList
    if (this.party != null) {
      if (this.party > 0) {
        this.partyId = this.party
        this.value.formItems[this.index].value[0] = this.partyId.toString()
        this.getBmtList()
        this.getLookups()
        this.getBmtCustomers()
      } else {
        portfolioApi.getPortfolioParty(this.party)
          .then((v) => {
            if (v.data === '') {
              this.bmtList.push({
                label: 'Portföyü Yoktur',
                value: 0
              })
              this.value.formItems[this.index].value[0] = 0
            } else {
              this.value.formItems[this.index].value[0] = v.data.partyId.toString()
              this.partyId = v.data.partyId
              this.busy = false
              if (this.value.formItems[this.index].value[0] > 0) {
                this.getBmtList()
                this.getLookups()
              }
            }
          })
          .catch((err) => {
            if (err.data.status === 400) {
              err.data.errors.DomainValidations.forEach((v) => {
                // eslint-disable-next-line
                this.$notify.error(this.$t(('crm.error.')+ v + '  '))
              })
            } else {
              this.$notify.error(this.$t('notify.error'))
            }
            this.busy = false
          })
      }
    }
  },
  created() {
  },
  methods: {
    getLookups() {
      this.getBmtCustomers()
      this.getNewBmtList()
    },
    getBmtCustomers() {
      if (this.customerList !== null && this.customerList !== undefined) {
        portfolioApi.getBmtCustomersByCustomerList(this.customerList)
          .then((v) => {
            this.nameList = v.data
            this.busy = false
          })
          .catch((err) => {
            if (err.data.status === 400) {
              err.data.errors.DomainValidations.forEach((v) => {
                // eslint-disable-next-line
                this.$notify.error(this.$t(('crm.error.')+ v + '  '))
              })
            } else {
              this.$notify.error(this.$t('notify.error'))
            }
          })
      } else if (this.value.formItems[this.index].value[0] > 0) {
        portfolioApi.getBmtCustomersByPortfoloPartyId(this.value.formItems[this.index].value[0])
          .then((v) => {
            this.nameList = v.data
            this.busy = false
          })
          .catch((err) => {
            if (err.data.status === 400) {
              err.data.errors.DomainValidations.forEach((v) => {
                // eslint-disable-next-line
                this.$notify.error(this.$t(('crm.error.')+ v + '  '))
              })
            } else {
              this.$notify.error(this.$t('notify.error'))
            }
          })
      }
    },
    getNewBmtList() {
      if (this.value.formItems[this.index].value[0] > 0) {
        portfolioApi.getNewBmtList(this.model.formItems[this.index].value[0])
          .then((v) => {
            this.newBmtList = v.data
            this.newBmtList.push({
              label: 'Rastgele',
              value: 1
            })
            this.busy = false
          })
          .catch((err) => {
            if (err.data.status === 400) {
              err.data.errors.DomainValidations.forEach((v) => {
                // eslint-disable-next-line
                this.$notify.error(this.$t(('crm.error.')+ v + '  '))
              })
            } else {
              this.$notify.error(this.$t('notify.error'))
            }
          })
      }
    },
    getBmtList() {
      if (this.partyId > 0) {
        portfolioApi.getBmtList(this.partyId)
          .then((v) => {
            this.bmtList = v.data
            this.value.formItems[this.index].value[0] = this.bmtList[0].value
            this.busy = false
          })
          .catch((err) => {
            if (err.data.status === 400) {
              err.data.errors.DomainValidations.forEach((v) => {
                // eslint-disable-next-line
                this.$notify.error(this.$t(('crm.error.')+ v + '  '))
              })
            } else {
              this.$notify.error(this.$t('notify.error'))
            }
          })
      }
    }
  }
}
</script>

<style scoped>
.itemlabel {
  width:100%;
  height: 36px;
  line-height: 36px;
}
</style>

