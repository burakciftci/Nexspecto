<template>
  <el-col :span="formItemContent.cols" >
    <el-form-item
      :rules="rules"
      :prop="'formItems[' + index + '].value[0]'">
      <el-row>
        <el-col :span="12">
          <div v-if="personList && personList.fatherName && personList.fatherName.length>0">
            {{ 'Baba Adı: ' + personList.fatherName }}
            <i class="el-icon-check" style="color:green"/>
          </div>
          <div v-else>
            {{ 'Baba Adı:.......................' }}
            <i class="el-icon-close" style="color:red"/>
          </div>
        </el-col>
        <el-col :span="12">
          <div v-if="personList && personList.contactMechList && personList.contactMechList.find(x=>x.contactMechType == 'postaladdress')">
            {{ 'Adres: ' + personList.contactMechList.find(x=>x.contactMechType == 'postaladdress').infoString }}
            <i class="el-icon-check" style="color:green"/>
          </div>
          <div v-else>
            {{ 'Adres:.......................' }}
            <i class="el-icon-close" style="color:red"/>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <div v-if="personList && personList.identificationNumber && personList.identificationNumber.length>0">
            {{ 'TCKN     : ' + personList.identificationNumber }}
            <i class="el-icon-check" style="color:green"/>
          </div>
          <div v-else>
            {{ 'TCKN     :.......................' }}
            <i class="el-icon-close" style="color:red"/>
          </div>
        </el-col>
        <el-col :span="12">
          <div v-if="personList && personList.birthDay">
            {{ 'Doğum Tarihi: ' + personList.birthDay.toLocaleString() }}
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
          <div v-if="personList && personList.contactMechList && personList.contactMechList.find(x=>x.contactMechType == 'emailaddress')">
            {{ 'Eposta: ' + personList.contactMechList.find(x=>x.contactMechType == 'emailaddress').infoString }}
            <i class="el-icon-check" style="color:green"/>
          </div>
          <div v-else>
            {{ 'Eposta:.......................' }}
            <i class="el-icon-close" style="color:red"/>
          </div>
        </el-col>
        <el-col :span="12">
          <div v-if="personList && personList.contactMechList && personList.contactMechList.find(x=>x.contactMechType == 'telecomnumber')">
            {{ 'Telefon: ' + personList.contactMechList.find(x=>x.contactMechType == 'telecomnumber').infoString }}
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
          <div v-if="personList && personList.contactMechList && personList.contactMechList.filter(x => x.contactMechType == 'telecomnumber').length > 1">
            {{ '2. Telefon: ' + personList.contactMechList.filter(x => x.contactMechType == 'telecomnumber')[1].infoString }}
            <i class="el-icon-check" style="color:green"/>
          </div>
          <div v-else>
            {{ '2. Telefon:.......................' }}
            <i class="el-icon-close" style="color:red"/>
          </div>
        </el-col>
        <el-col :span="12">
          <div v-if="personList && personList.portfolioType && personList.portfolioType.portfolioType === 3">
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
          <div v-if="list && list.marriageStatus">
            {{ 'Evlilik Durumu: ' + list.marriageStatus }}
            <i class="el-icon-check" style="color:green"/>
          </div>
          <div v-else>
            {{ 'Evlilik Durumu:.......................' }}
            <i class="el-icon-close" style="color:red"/>
          </div>
        </el-col>
        <el-col :span="12">
          <div v-if="list && list.educationStatus">
            {{ 'Eğitim Durumu: ' + list.educationStatus }}
            <i class="el-icon-check" style="color:green"/>
          </div>
          <div v-else>
            {{ 'Eğitim Durumu:.......................' }}
            <i class="el-icon-close" style="color:red"/>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <div v-if="list && list.job">
            {{ 'Meslek: ' + list.job }}
            <i class="el-icon-check" style="color:green"/>
          </div>
          <div v-else>
            {{ 'Meslek:.......................' }}
            <i class="el-icon-close" style="color:red"/>
          </div>
        </el-col>
        <el-col :span="12">
          <div v-if="list && list.homeStatus">
            {{ 'Ev Mülkiyeti: ' + getHomeStatusName(list.homeStatus) }}
            <i class="el-icon-check" style="color:green"/>
          </div>
          <div v-else>
            {{ 'Ev Mülkiyeti:.......................' }}
            <i class="el-icon-close" style="color:red"/>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <div v-if="list && list.totalWorkExperience">
            {{ 'İş Tecrübesi: ' + list.totalWorkExperience }}
            <i class="el-icon-check" style="color:green"/>
          </div>
          <div v-else>
            {{ 'İş Tecrübesi:.......................' }}
            <i class="el-icon-close" style="color:red"/>
          </div>
        </el-col>
        <el-col :span="12">
          <div v-if="list && list.montlyIncome">
            {{ 'Aylık Gelir: ' + list.montlyIncome }}
            <i class="el-icon-check" style="color:green"/>
          </div>
          <div v-else>
            {{ 'Aylık Gelir:.......................' }}
            <i class="el-icon-close" style="color:red"/>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <div v-if="list && list.homeMontlyIncome">
            {{ 'Ev Toplam Gelir: ' + list.homeMontlyIncome }}
            <i class="el-icon-check" style="color:green"/>
          </div>
          <div v-else>
            {{ 'Ev Toplam Gelir:.......................' }}
            <i class="el-icon-close" style="color:red"/>
          </div>
        </el-col>
        <el-col :span="12">
          <div v-if="list && list.findexNote">
            {{ 'Findeks Notu: ' + list.findexNote }}
            <i class="el-icon-check" style="color:green"/>
          </div>
          <div v-else>
            {{ 'Findeks Notu:.......................' }}
            <i class="el-icon-close" style="color:red"/>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <div v-if="list && list.old">
            {{ 'Yaş: ' + list.old }}
            <i class="el-icon-check" style="color:green"/>
          </div>
          <div v-else>
            {{ 'Yaş:.......................' }}
            <i class="el-icon-close" style="color:red"/>
          </div>
        </el-col>
        <el-col :span="12">
          <div v-if="partnerList && partnerList.partnerIdentification && partnerList.partnerIdentification.length === 11">
            {{ 'Eş Tckn: ' + partnerList.partnerIdentification }}
            <i class="el-icon-check" style="color:green"/>
          </div>
          <div v-else>
            {{ 'Eş Tckn:.......................' }}
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <div v-if="partnerList && partnerList.partnerMontlyIncome">
            {{ 'Eş Aylık Gelir: ' + partnerList.partnerMontlyIncome }}
            <i class="el-icon-check" style="color:green"/>
          </div>
          <div v-else>
            {{ 'Eş Aylık Gelir:.......................' }}
          </div>
        </el-col>
        <el-col :span="12">
          <div v-if="partnerList && partnerList.partnerFindexNote">
            {{ 'Eş Findeks Notu: ' + partnerList.partnerFindexNote }}
            <i class="el-icon-check" style="color:green"/>
          </div>
          <div v-else>
            {{ 'Eş Findeks Notu:.......................' }}
          </div>
        </el-col>
      </el-row>
    </el-form-item>
  </el-col>
</template>
<script>

import personApi from '@/api/crm/person'

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
    var validatePass = (rule, value, callback) => {
      if (!(this.list && this.list.marriageStatus)) {
        callback(new Error(this.$t('task.required', { title: 'Müşteri için evlilik durumu tanımlayınız.' })))
      } else if (!(this.list && this.list.educationStatus)) {
        callback(new Error(this.$t('task.required', { title: 'Müşteri için eğitim durumu tanımlayınız.' })))
      } else if (!(this.list && this.list.job)) {
        callback(new Error(this.$t('task.required', { title: 'Müşteri için meslek tanımlayınız.' })))
      } else if (!(this.list && this.list.homeStatus)) {
        callback(new Error(this.$t('task.required', { title: 'Müşteri için ev mülkiyeti tanımlayınız.' })))
      } else if (!(this.list && this.list.totalWorkExperience)) {
        callback(new Error(this.$t('task.required', { title: 'Müşteri için iş tecrübesi tanımlayınız.' })))
      } else if (!(this.list && this.list.montlyIncome)) {
        callback(new Error(this.$t('task.required', { title: 'Müşteri için aylık net gelir tanımlayınız.' })))
      } else if (!(this.list && this.list.homeMontlyIncome)) {
        callback(new Error(this.$t('task.required', { title: 'Müşteriyi için hane halkı toplam gelir tanımlayınız' })))
      } else if (!(this.list && this.list.findexNote)) {
        callback(new Error(this.$t('task.required', { title: 'Müşteriyi için findeks notu tanımlayınız' })))
      } else if (!(this.list && this.list.old)) {
        callback(new Error(this.$t('task.required', { title: 'Müşteriyi için doğum tarihi tanımlayınız' })))
      } else if (!(this.list && this.list.old)) {
        callback(new Error(this.$t('task.required', { title: 'Müşteriyi için doğum tarihi tanımlayınız' })))
      } else if (!(this.personList && this.personList.fatherName && this.personList.fatherName.length > 0)) {
        callback(new Error(this.$t('task.required', { title: 'Müşteri Baba Adı tanımlayınız.' })))
      } else if (!(this.personList && this.personList.identificationNumber && this.personList.identificationNumber.length > 0)) {
        callback(new Error(this.$t('task.required', { title: 'Müşteri TCKN tanımlayınız.' })))
      } else if (!(this.personList && this.personList.contactMechList && this.personList.contactMechList.find(x => x.contactMechType === 'postaladdress'))) {
        callback(new Error(this.$t('task.required', { title: 'Müşteri Adresi tanımlayınız.' })))
      } else if (!(this.personList && this.personList.contactMechList && this.personList.contactMechList.find(x => x.contactMechType === 'telecomnumber'))) {
        callback(new Error(this.$t('task.required', { title: 'Müşteri telefonu tanımlayınız.' })))
      } else if (!(this.personList && this.personList.contactMechList && this.personList.contactMechList.find(x => x.contactMechType === 'emailaddress'))) {
        callback(new Error(this.$t('task.required', { title: 'Müşteri eposta tanımlayınız.' })))
      } else if (!(this.personList && this.personList.birthDay)) {
        callback(new Error(this.$t('task.required', { title: 'Müşteri Doğum Tarihi tanımlayınız.' })))
      } else if (!(this.personList && this.personList.portfolioType && this.personList.portfolioType.portfolioType === 3)) {
        callback(new Error(this.$t('task.required', { title: 'Müşteriyi Bireysel Portföy olarak' })))
      } else if (this.partnerList !== null) {
        if (this.partnerList.partnerIdentification === null || this.partnerList.partnerIdentification.length !== 11) {
          callback(new Error(this.$t('task.required', { title: 'Müşteri eşi için kimlik numarası tanımlayınız' })))
        }
        // if (this.partnerList.partnerMontlyIncome === null) {
        //   callback(new Error(this.$t('task.required', { title: 'Müşteri eşi için aylık net gelir tanımlayınız' })))
        // }
        if (this.partnerList.partnerFindexNote === null || !(this.partnerList.partnerFindexNote > 0)) {
          callback(new Error(this.$t('task.required', { title: 'Müşteri eşi için findeks notu tanımlayınız' })))
        } else {
          callback()
        }
      } else {
        callback()
      }
    }
    return {
      list: {},
      personList: {},
      partnerList: {},
      homeStatusList: [],
      rules: [{ validator: validatePass, trigger: 'blur' }],
      isWrongPortfolio: false
    }
  },
  mounted() {
    this.party = this.formItemContent.alias
    if (this.party != null) {
      this.getHomeStatus()
      this.getPersonValid()
      this.getBirtepValid()
      this.getParentValid()
    }
  },
  methods: {
    getHomeStatusName(val) {
      if (val !== null) {
        console
        return this.homeStatusList.find(o => o.value === val).label
      }
    },
    getPersonValid() {
      personApi.getPersonValidation(this.party)
        .then((v) => {
          this.personList = v.data.result
        })
        .catch((err) => {
          if (err.data.status === 400) {
            err.data.errors.DomainValidations.forEach((v) => {
              this.isWrongPortfolio = true
              // eslint-disable-next-line
              this.$notify.error(this.$t(('crm.error.')+ v + '  '))
            })
          } else {
            this.$notify.error(this.$t('notify.error'))
          }
          this.busy = false
        })
    },
    getHomeStatus() {
      personApi.getHomeStatus()
        .then((v) => {
          this.homeStatusList = v.data
        })
        .catch((err) => {
          if (err.data.status === 400) {
            err.data.errors.DomainValidations.forEach((v) => {
              this.isWrongPortfolio = true
              // eslint-disable-next-line
              this.$notify.error(this.$t(('crm.error.')+ v + '  '))
            })
          } else {
            this.$notify.error(this.$t('notify.error'))
          }
          this.busy = false
        })
    },
    getBirtepValid() {
      personApi.getPersonFindexValidation(this.party)
        .then((v) => {
          this.list = v.data.result
        })
        .catch((err) => {
          if (err.data.status === 400) {
            err.data.errors.DomainValidations.forEach((v) => {
              this.isWrongPortfolio = true
              // eslint-disable-next-line
              this.$notify.error(this.$t(('crm.error.')+ v + '  '))
            })
          } else {
            this.$notify.error(this.$t('notify.error'))
          }
          this.busy = false
        })
    },
    getParentValid() {
      personApi.getPersonRelationFindexValidation(this.party)
        .then((v) => {
          this.partnerList = v.data.result
          console.log('Partner', this.partnerList)
        })
        .catch((err) => {
          if (err.data.status === 400) {
            err.data.errors.DomainValidations.forEach((v) => {
              this.isWrongPortfolio = true
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
}
</script>
<style scoped>
.form-element {
  display: inline-block;
}
</style>

