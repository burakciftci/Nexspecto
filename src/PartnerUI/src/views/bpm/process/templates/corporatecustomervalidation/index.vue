<template>
  <el-col :span="formItemContent.cols" >
    <el-form-item
      :rules="rules"
      :prop="'formItems[' + index + '].value[0]'">
      <el-row>
        <el-col :span="12">
          <div v-if="list && list.groupName && list.groupName.length>0">
            {{ 'Ünvan: ' + list.groupName }}
            <i class="el-icon-check" style="color:green"/>
          </div>
          <div v-else>
            {{ 'Ünvan:.......................' }}
            <i class="el-icon-close" style="color:red"/>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <div v-if="list && list.identificationNumber && list.identificationNumber.length === 10">
            {{ 'VKN     : ' + list.identificationNumber }}
            <i class="el-icon-check" style="color:green"/>
          </div>
          <div v-else>
            {{ 'VKN     :.......................' }}
            <i class="el-icon-close" style="color:red"/>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12"/>
      </el-row>
      <el-row>
        <el-col :span="12">
          <div v-if="list && list.contactMechList && list.contactMechList.find(x=>x.contactMechType == 'telecomnumber')">
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
          <div v-if="list && list.portfolioType && list.portfolioType.portfolioType === 3">
            {{ 'Portföy:  Bireysel Portföy' }}
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

import organizationApi from '@/api/crm/organization'
import geoApi from '@/api/crm/geo'

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
      if (!(this.list && this.list.groupName && this.list.groupName.length > 0)) {
        callback(new Error(this.$t('task.required', { title: 'Ünvan tanımlayınız.' })))
      } else if (!(this.list && this.list.identificationNumber && this.list.identificationNumber.length === 10)) {
        callback(new Error(this.$t('task.required', { title: 'Kurumsal Müşteri VKN tanımlayınız.' })))
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
      } else if (!(this.list && this.list.contactMechList && this.list.contactMechList.find(x => x.contactMechType === 'postaladdress'))) {
        callback(new Error(this.$t('task.required', { title: 'Kurumsal Müşteri Adresi tanımlayınız.' })))
      } else if (!(this.list && this.list.contactMechList && this.list.contactMechList.find(x => x.contactMechType === 'telecomnumber'))) {
        callback(new Error(this.$t('task.required', { title: 'Kurumsal Müşteri telefonu tanımlayınız.' })))
      } else if (!(this.list && this.list.portfolioType && this.list.portfolioType.portfolioType === 3)) {
        callback(new Error(this.$t('task.required', { title: 'Müşteriyi Bireysel Portföy olarak' })))
      } else {
        callback()
      }
    }
    return {
      list: {},
      addressDetail: {},
      countryIdString: null,
      provinceIdString: null,
      districtIdString: null,
      rules: [{ validator: validatePass, trigger: 'blur' }]
    }
  },
  mounted() {
    this.party = this.formItemContent.alias
    if (this.party != null) {
      organizationApi.getCorporateOrganizationValidation(this.party)
        .then((v) => {
          this.list = v.data.result
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
      organizationApi.getCorporateOrganizationAddressValidation(this.party)
        .then((v) => {
          this.addressDetail = v.data
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
      this.getCountryList()
    }
  },
  methods: {
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
          this.errorMessage = this.$('template.errorTemplateCode')
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
          this.errorMessage = this.$('template.errorTemplateCode')
        })
    },
    getDistrcitListByProvinceId() {
      geoApi.getDistrictListByProvinceId(this.addressDetail.provinceId)
        .then((v) => {
          this.districtIdString = v.data.find(m => m.geoId === this.addressDetail.districtId).geoName
        })
        .catch((err) => {
          console.log(err)
          this.errorMessage = this.$('template.errorTemplateCode')
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

