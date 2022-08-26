<template>
  <el-col :span="formItemContent.cols">
    <el-form-item
      :rules="rules"
      :prop="'formItems[' + index + '].value[0]'">
      <el-row>
        <el-col :span="12">
          <div v-if="list && list.fatherName && list.fatherName.length>0">
            {{ 'Baba Adı: ' + list.fatherName }}
            <i class="el-icon-check" style="color:green"/>
          </div>
          <div v-else>
            {{ 'Baba Adı:.......................' }}
            <i class="el-icon-close" style="color:red"/>
          </div>
        </el-col>
        <el-col :span="12">
          <div v-if="list && list.birthDay">
            {{ 'Doğum Tarihi: ' + list.birthDay.toLocaleString() }}
            <i class="el-icon-check" style="color:green"/>
          </div>
          <div v-else>
            {{ 'Doğum Tarihi:.......................' }}
            <i class="el-icon-close" style="color:red"/>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <div v-if="list && list.identificationNumber && list.identificationNumber.length === 11">
            {{ 'TCKN : ' + list.identificationNumber }}
            <i class="el-icon-check" style="color:green"/>
          </div>
          <div v-else>
            {{ 'TCKN :.......................' }}
            <i class="el-icon-close" style="color:red"/>
          </div>
        </el-col>
        <el-col :span="12">
          <div
            v-if="list && list.contactMechList && list.contactMechList.find(x=>x.contactMechType == 'telecomnumber')">
            {{ 'Telefon: ' + list.contactMechList.find(x=>x.contactMechType == 'telecomnumber').infoString }}
            <i class="el-icon-check" style="color:green"/>
          </div>
          <div v-else>
            {{ 'Telefon:.......................' }}
            <i class="el-icon-close" style="color:red"/>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <div v-if="list && list.contactMechList && list.contactMechList.find(x=>x.contactMechType == 'emailaddress')">
            {{ 'Eposta: ' + list.contactMechList.find(x=>x.contactMechType == 'emailaddress').infoString }}
            <i class="el-icon-check" style="color:green"/>
          </div>
          <div v-else>
            {{ 'Eposta:.......................' }}
            <i class="el-icon-close" style="color:red"/>
          </div>
        </el-col>
        <el-col :span="12">
          <div v-if="list && list.portfolioType && list.portfolioType.portfolioType === 3">
            {{ 'Portföy: Bireysel Portföy' }}
            <i class="el-icon-check" style="color:green"/>
          </div>
          <div v-else>
            {{ 'Portföy:.......................' }}
            <i class="el-icon-close" style="color:red"/>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <div
            v-if="list && list.contactMechList && list.contactMechList.filter(x => x.contactMechType == 'telecomnumber').length > 1">
            {{ '2. Telefon: ' + list.contactMechList.filter(x => x.contactMechType == 'telecomnumber')[1].infoString }}
            <i class="el-icon-check" style="color:green"/>
          </div>
          <div v-else>
            {{ '2. Telefon:.......................' }}
            <i class="el-icon-close" style="color:red"/>
          </div>
        </el-col>
        <el-col :span="12">
          <div v-if="anyFirstPaymentPromiseNotes">
            {{ 'Ön Ödeme Takvimi Girişi: Var' }}
            <i class="el-icon-check" style="color:green"/>
          </div>
          <div v-else>
            {{ 'Ön Ödeme Takvimi Girişi: Yok' }}
            <i class="el-icon-close" style="color:red"/>
          </div>
        </el-col>
      </el-row>
      <el-row><el-col :span="24">
        <div v-if="firstPaymentAmountPromiseSum == firstPaymentAmount ">
          {{ 'İlk Ödeme Sözü Miktarı ile Proje İlk Ödeme Tutarı Eşit mi ?: ' }}
          <i class="el-icon-check" style="color:green"/>
        </div>
        <div v-else>
          {{ 'İlk Ödeme Sözü Miktarı ile Proje İlk Ödeme Tutarı Eşit mi ?: ' }}
          <i class="el-icon-close" style="color:red"/>
        </div>
      </el-col>

      </el-row>
      <el-row>
        <el-col :span="12">
          <div v-if="addressDetail && (addressDetail.countryId !== null && addressDetail.countryId !== '')">
            {{ 'Ülke ' + countryIdString }}
            <i class="el-icon-check" style="color:green"/>
          </div>
          <div v-else>
            {{ 'Ülke:.......................' }}
            <i class="el-icon-close" style="color:red"/>
          </div>
        </el-col>
        <el-col :span="12">
          <div v-if="addressDetail && (addressDetail.provinceId !== null && addressDetail.provinceId !== '')">
            {{ 'İl ' + provinceIdString }}
            <i class="el-icon-check" style="color:green"/>
          </div>
          <div v-else>
            {{ 'İl:.......................' }}
            <i class="el-icon-close" style="color:red"/>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <div v-if="addressDetail && (addressDetail.districtId !== null && addressDetail.districtId !== '')">
            {{ 'İlçe ' + districtIdString }}
            <i class="el-icon-check" style="color:green"/>
          </div>
          <div v-else>
            {{ 'İlçe:.......................' }}
            <i class="el-icon-close" style="color:red"/>
          </div>
        </el-col>
        <el-col :span="12">
          <div v-if="addressDetail && (addressDetail.neighborhoodId !== null && addressDetail.neighborhoodId !== '')">
            {{ 'Mahalle/Köy ' + addressDetail.neighborhoodId }}
            <i class="el-icon-check" style="color:green"/>
          </div>
          <div v-else>
            {{ 'Mahalle/Köy:.......................' }}
            <i class="el-icon-close" style="color:red"/>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <div v-if="addressDetail && (addressDetail.road !== null && addressDetail.road !== '') && (addressDetail.street !== null && addressDetail.street !== '')">
            {{ 'Cadde ' + addressDetail.road + ' / Sokak ' + addressDetail.street }}
            <i class="el-icon-check" style="color:green"/>
          </div>
          <div v-else-if="addressDetail && (addressDetail.road !== null && addressDetail.road !== '') && (addressDetail.street === null || addressDetail.street === '')">
            {{ 'Cadde ' + addressDetail.road }}
            <i class="el-icon-check" style="color:green"/>
          </div>
          <div v-else-if="addressDetail && (addressDetail.road === null || addressDetail.road === '') && (addressDetail.street !== null && addressDetail.street !== '')">
            {{ 'Sokak ' + addressDetail.street }}
            <i class="el-icon-check" style="color:green"/>
          </div>
          <div v-else>
            {{ 'Cadde/Sokak:.......................' }}
            <i class="el-icon-close" style="color:red"/>
          </div>
        </el-col>
        <el-col :span="12"/>
      </el-row>
      <el-row>
        <el-col :span="12">
          <div v-if="addressDetail && (addressDetail.buildingNumber !== null && addressDetail.buildingNumber !== '')">
            {{ 'Bina No ' + addressDetail.buildingNumber }}
            <i class="el-icon-check" style="color:green"/>
          </div>
          <div v-else>
            {{ 'Bina No:.......................' }}
            <i class="el-icon-close" style="color:red"/>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <div
            v-if="list && list.contactMechList && list.contactMechList.find(x=>x.contactMechType == 'postaladdress')">
            {{ 'Adres: ' + list.contactMechList.find(x=>x.contactMechType == 'postaladdress').infoString }}
          </div>
          <div v-else>
            {{ 'Adrres:.......................' }}
            <i class="el-icon-close" style="color:red"/>
          </div>
        </el-col>
      </el-row>
    </el-form-item>
  </el-col>
</template>
<script>

import personApi from '@/api/crm/person'
import productApi from '@/api/finance/product'
import geoApi from '@/api/crm/geo'

export default {
  components: {},
  props: {
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
    },
    kickOffFormItems: {
      type: Array,
      default: null
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
    return {
      firstPaymentAmountPromiseSum: 0,
      firstPaymentAmount: 0,
      isEqual: 0,
      list: {},
      addressDetail: {},
      anyFirstPaymentPromiseNotes: false,
      rules: [{ validator: this.validate, trigger: 'blur' }],
      isWrongPortfolio: false,
      productId: null,
      countryIdString: null,
      provinceIdString: null,
      districtIdString: null

    }
  },
  mounted() {
    this.party = this.formItemContent.alias

    if (!this.party) {
      return
    }
    this.setProductId()
    this.getSumFirstPaymentPromiseNote()
    this.getFirstPaymentAmount()
    this.isEqual = this.firstPaymentAmountPromiseSum <= this.firstPaymentAmount ? 1 : 0
    console.log('kickoff: ', this.kickOffFormItems)
    console.log('productId: ', this.productId)
    personApi.getPersonValidation(this.party)
      .then((v) => {
        this.list = v.data.result
      }).catch((err) => {
      console.log('err: ', err)
    })
    personApi.getPersonValidationAddresses(this.party).then((v) => {
      this.addressDetail = v.data
    }).catch((err) => {
      console.log('err: ', err)
    })

    productApi.anyFirstPaymentPromiseNote(this.productId)
      .then((v) => {
        this.anyFirstPaymentPromiseNotes = v.data.result
      })
      .catch((err) => {
        console.log('err: ', err)
      })
    this.getCountryList()
  },

  methods: {
    validate(rule, value, callback) {
      const { identificationNumber } = this.list
      console.log(this.anyFirstPaymentPromiseNotes)
      if (!(this.list && this.list.fatherName && this.list.fatherName.length > 0)) {
        callback(new Error(this.$t('task.required', { title: 'Müşteri Baba Adı tanımlayınız.' })))
      } else if (!(identificationNumber && identificationNumber.length === 11)) {
        callback(new Error(this.$t('task.required', { title: 'Müşteri TCKN tanımlayınız.' })))
      } else if (!(this.addressDetail && (this.addressDetail.countryId !== null && this.addressDetail.countryId !== ''))) {
        callback(new Error(this.$t('task.required', { title: 'Müşteri Adresi -> Ülke tanımlayınız.' })))
      } else if (!(this.addressDetail && (this.addressDetail.provinceId !== null && this.addressDetail.provinceId !== ''))) {
        callback(new Error(this.$t('task.required', { title: 'Müşteri Adresi -> İl tanımlayınız.' })))
      } else if (!(this.addressDetail && (this.addressDetail.districtId !== null && this.addressDetail.districtId !== ''))) {
        callback(new Error(this.$t('task.required', { title: 'Müşteri Adresi -> İlçe tanımlayınız.' })))
      } else if (!(this.addressDetail && (this.addressDetail.neighborhoodId !== null && this.addressDetail.neighborhoodId !== ''))) {
        callback(new Error(this.$t('task.required', { title: 'Müşteri Adresi -> Mahalle/Köy tanımlayınız.' })))
      } else if (this.addressDetail.road === null && this.addressDetail.street === null) {
        callback(new Error(this.$t('task.required', { title: 'Müşteri Adresi -> Cadde veya Sokak tanımlayınız.' })))
      } else if (!(this.addressDetail && (this.addressDetail.buildingNumber !== null && this.addressDetail.buildingNumber !== ''))) {
        callback(new Error(this.$t('task.required', { title: 'Müşteri Adresi -> Bina No tanımlayınız.' })))
      } else if (!(this.list && this.list.contactMechList && this.list.contactMechList.find(x => x.contactMechType === 'telecomnumber'))) {
        callback(new Error(this.$t('task.required', { title: 'Müşteri telefonu tanımlayınız.' })))
      } else if (!(this.list && this.list.contactMechList && this.list.contactMechList.find(x => x.contactMechType === 'emailaddress'))) {
        callback(new Error(this.$t('task.required', { title: 'Müşteri eposta tanımlayınız.' })))
      } else if (!(this.list && this.list.birthDay)) {
        callback(new Error(this.$t('task.required', { title: 'Müşteri Doğum Tarihi tanımlayınız.' })))
      } else if (!(this.list && this.list.portfolioType && this.list.portfolioType.portfolioType === 3)) {
        callback(new Error(this.$t('task.required', { title: 'Müşteriyi Bireysel Portföy olarak' })))
      } else if (!this.anyFirstPaymentPromiseNotes) {
        callback(new Error(this.$t('task.required', { title: 'İlk ödeme takvimi' })))
      } else if (!(this.firstPaymentAmountPromiseSum >= this.firstPaymentAmount)) {
        callback(new Error(this.$t('task.required', { title: 'İlk ödeme sözü tutarı proje ilk ödeme tutarından düşük olamaz.' })))
      } else {
        callback()
      }
    },
    setProductId() {
      for (const el of this.kickOffFormItems) {
        var elementContentJson = JSON.parse(el.content)
        console.log('elementContentJson: ', elementContentJson)
        if (elementContentJson.label === 'ProductId') {
          console.log('equal')
          this.productId = elementContentJson.value
          return
        }
      }
      // var content = JSON.parse(this.kickOffFormItems[1].content)
    },
    getSumFirstPaymentPromiseNote() {
      this.busy = true
      productApi.getSumFirstPaymentPromiseNote(this.productId)
        .then((v) => {
          this.firstPaymentAmountPromiseSum = v.data
        })
        .catch((err) => {
          console.log('err: ', err)
        })
      this.busy = false
    },

    getFirstPaymentAmount() {
      this.busy = true
      productApi.getFirstPaymentAmount(this.productId)
        .then((v) => {
          this.firstPaymentAmount = v.data
        })
        .catch((err) => {
          console.log('err: ', err)
        })
      this.busy = false
    },
    getCountryList() {
      this.busy = true
      geoApi.getCountryList()
        .then((v) => {
          this.countryIdString = v.data.find(m => m.geoId === this.addressDetail.countryId).geoName
          this.busy = false
          this.getProvinceListByCountryId()
        })
        .catch((err) => {
          console.log(err)
          this.errorMessage = this.$t('template.errorTemplateCode')
          this.busy = false
        })
    },
    getProvinceListByCountryId() {
      geoApi.getProvinceListByCountryId(this.addressDetail.countryId)
        .then((v) => {
          this.provinceIdString = v.data.find(m => m.geoId === this.addressDetail.provinceId).geoName
          this.getDistrcitListByProvinceId()
        })
        .catch((err) => {
          console.log(err)
          this.errorMessage = this.$t('template.errorTemplateCode')
        })
    },
    getDistrcitListByProvinceId() {
      geoApi.getDistrictListByProvinceId(this.addressDetail.provinceId)
        .then((v) => {
          this.districtIdString = v.data.find(m => m.geoId === this.addressDetail.districtId).geoName
        })
        .catch((err) => {
          console.log(err)
          this.errorMessage = this.$t('template.errorTemplateCode')
        })
    }
  }

}
</script>
<style scoped>
.form-element {
  display: inline-block;
}
</style>

