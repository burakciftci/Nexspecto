<template>
  <div class ="app-container">
    <table class="el-table change-limit-table">
      <thead>
      <tr>
        <th>Başlık</th>
        <th>Eski Veriler</th>
        <th>Yeni Veriler</th>
        <th>Durum</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(item, index) in oldItems" :key="index">
        <td>
          <span :class="String(oldItems[index].Value) === String(newItems[index].Value)?'same-value':'different-value'">{{ oldItems[index].Title }}</span>
        </td>
        <td>
          <el-input
            v-uppercase
            v-model="oldItems[index].Value"
            :disabled="true"
            maxlength="11"
            style="width:70%;"
            clearable/>
        </td>
        <td>
          <el-form v-if="newItems[index].Title==='TCKN'" ref="changeLimitForm" :rules="validation">
            <el-form-item :prop="newItems[0].Title" style="margin-bottom: 0px;">
              <el-input
                v-uppercase
                v-model="newItems[0].Value"
                :disabled="!isUpdate"
                :class="String(oldItems[index].Value) === String(newItems[index].Value)?'':'same-input'"
                maxlength="11"
                style="width:70%;"
                clearable/>
            </el-form-item>
          </el-form>
          <el-date-picker
            v-else-if="newItems[index].Title==='Doğum Tarihi'"
            v-model="newItems[6].Value"
            :disabled="!isUpdate"
            :picker-options="datePickerOptions"
            value-format="yyyy-MM-dd"
            format="dd/MM/yyyy"
            type="date"
            style="width:70%;"
            clearable/>
          <el-select
            v-else-if="newItems[index].Title==='Uyruk'"
            v-model="newItems[7].Value"
            :disabled="!isUpdate"
            class="itemlabel"
            style="width:70%;"
            clearable
          >
            <el-option
              v-for="item1 in citizenshipCountryList"
              :key="item1.value"
              :label="item1.label"
              :value="item1.value"/>
          </el-select>
          <el-input
            v-uppercase
            v-else
            v-model="newItems[index].Value"
            :disabled="!isUpdate"
            :class="String(oldItems[index].Value) === String(newItems[index].Value)?'':'same-input'"
            maxlength="11"
            style="width:70%;"
            clearable/>
        </td>
        <td>
          <el-tag :type="String(oldItems[index].Value) === String(newItems[index].Value)?'danger':'success'">
            {{ String(oldItems[index].Value) === String(newItems[index].Value)?'Bilgi Aynı':'Bilgi Değişti' }}
          </el-tag>
        </td>
      </tr>
      </tbody>
    </table>
  </div>
</template>
<script>
import personApi from '@/api/crm/person'
import { validateTCKN } from '@/utils/validate'
export default {
  props: {
    partyId: {
      type: Number,
      default: null
    },
    oldIdentificationNumber: {
      type: String,
      default: null
    },
    oldFirstName: {
      type: String,
      default: null
    },
    oldMiddleName: {
      type: String,
      default: null
    },
    oldLastName: {
      type: String,
      default: null
    },
    oldFatherName: {
      type: String,
      default: null
    },
    oldMotherName: {
      type: String,
      default: null
    },
    oldBirthDay: {
      type: Date,
      default: null
    },
    oldCitizenshipCountryGeoId: {
      type: Number,
      default: null
    },
    oldPassportNumber: {
      type: String,
      default: null
    },
    newIdentificationNumber: {
      type: String,
      default: null
    },
    newFirstName: {
      type: String,
      default: null
    },
    newMiddleName: {
      type: String,
      default: null
    },
    newLastName: {
      type: String,
      default: null
    },
    newFatherName: {
      type: String,
      default: null
    },
    newMotherName: {
      type: String,
      default: null
    },
    newBirthDay: {
      type: Date,
      default: null
    },
    newCitizenshipCountryGeoId: {
      type: Number,
      default: null
    },
    newPassportNumber: {
      type: String,
      default: null
    },
    isUpdate: {
      type: Boolean,
      default: false
    },
    kickOffFormItems: {
      type: Array,
      default: () => {
      }
    }
  },
  data() {
    const validTckn = (rule, value, callback) => {
      if (value !== null && value !== '') {
        const isValid = validateTCKN(this.newItems.find(m => m.Title === 'TCKN').Value)
        if (!isValid) {
          this.validTckn = false
          callback(new Error('Hatalı TCKN!'))
        }
        callback()
      } else {
        callback()
      }
    }
    return {
      newItems: [],
      oldItems: [],
      citizenshipCountryList: [],
      oldCountry: null,
      newCountry: null,
      cancelText: 'Vazgeç',
      partyDataChangeId: 1,
      datePickerOptions: {
        firstDayOfWeek: 1,
        disabledDate(time) {
          return time.getTime() > Date.now()
        }
      },
      validation: {
        TCKN: [
          { validator: validTckn, trigger: 'blur' }
        ]
      },
      validTckn: true,
      hiddenButton: false
    }
  },
  created() {
    this.partyDataChangeId = parseInt((this.kickOffFormItems.filter(p => p.content.includes('PartyDataChangeId')).map(p => p.valueString)))

    if (this.partyDataChangeId === 1) {
      this.newItems.push(
        { Title: 'TCKN', Value: this.newIdentificationNumber },
        { Title: 'Adı', Value: this.newFirstName },
        { Title: 'İkinci Adı', Value: this.newMiddleName },
        { Title: 'Soy Adı', Value: this.newLastName },
        { Title: 'Ana Adı', Value: this.newMotherName },
        { Title: 'Baba Adı', Value: this.newFatherName },
        { Title: 'Doğum Tarihi', Value: this.newBirthDay },
        { Title: 'Uyruk', Value: this.newCitizenshipCountryGeoId },
        { Title: 'Pasaport No', Value: this.newPassportNumber }
      )
      this.oldItems.push(
        { Title: 'TCKN', Value: this.oldIdentificationNumber },
        { Title: 'Adı', Value: this.oldFirstName },
        { Title: 'İkinci Adı', Value: this.oldMiddleName },
        { Title: 'Soy Adı', Value: this.oldLastName },
        { Title: 'Ana Adı', Value: this.oldMotherName },
        { Title: 'Baba Adı', Value: this.oldFatherName },
        { Title: 'Doğum Tarihi', Value: this.oldBirthDay },
        { Title: 'Uyruk', Value: this.oldCitizenshipCountryGeoId },
        { Title: 'Pasaport No', Value: this.oldPassportNumber }
      )
    }
    this.getLookupFields()

    if (this.partyDataChangeId !== 1) {
      this.getPartyDataChangesById()
      this.hiddenButton = true
    }
    if (!this.isUpdate) {
      this.cancelText = 'Kapat'
    }
  },
  methods: {
    sendApprove() {
      if (this.validTckn) {
        this.busy = true
        const innerOldItems =
          {
            oldIdentificationNumber: null,
            oldFirstName: null,
            oldMiddleName: null,
            oldLastName: null,
            oldMotherName: null,
            oldFatherName: null,
            oldBirthDate: null,
            oldCitizenshipCountryGeoId: null,
            oldPassportNumber: null
          }
        const innerNewItems =
          {
            newIdentificationNumber: null,
            newFirstName: null,
            newMiddleName: null,
            newLastName: null,
            newMotherName: null,
            newFatherName: null,
            newBirthDate: null,
            newCitizenshipCountryGeoId: null,
            newPassportNumber: null
          }
        innerOldItems.oldIdentificationNumber = this.oldItems.find(m => m.Title === 'TCKN').Value
        innerOldItems.oldFirstName = this.oldItems.find(m => m.Title === 'Adı').Value
        innerOldItems.oldMiddleName = this.oldItems.find(m => m.Title === 'İkinci Adı').Value
        innerOldItems.oldLastName = this.oldItems.find(m => m.Title === 'Soy Adı').Value
        innerOldItems.oldMotherName = this.oldItems.find(m => m.Title === 'Ana Adı').Value
        innerOldItems.oldFatherName = this.oldItems.find(m => m.Title === 'Baba Adı').Value
        innerOldItems.oldBirthDate = this.oldItems.find(m => m.Title === 'Doğum Tarihi').Value
        innerOldItems.oldCitizenshipCountryGeoId = this.oldItems.find(m => m.Title === 'Uyruk').Value
        innerOldItems.oldPassportNumber = this.oldItems.find(m => m.Title === 'Pasaport No').Value
        innerNewItems.newIdentificationNumber = this.newItems.find(m => m.Title === 'TCKN').Value
        innerNewItems.newFirstName = this.newItems.find(m => m.Title === 'Adı').Value
        innerNewItems.newMiddleName = this.newItems.find(m => m.Title === 'İkinci Adı').Value
        innerNewItems.newLastName = this.newItems.find(m => m.Title === 'Soy Adı').Value
        innerNewItems.newMotherName = this.newItems.find(m => m.Title === 'Ana Adı').Value
        innerNewItems.newFatherName = this.newItems.find(m => m.Title === 'Baba Adı').Value
        innerNewItems.newBirthDate = this.newItems.find(m => m.Title === 'Doğum Tarihi').Value
        innerNewItems.newCitizenshipCountryGeoId = this.newItems.find(m => m.Title === 'Uyruk').Value
        innerNewItems.newPassportNumber = this.newItems.find(m => m.Title === 'Pasaport No').Value

        var items = [innerOldItems, innerNewItems]
        const model = new {
          partyId: this.partyId,
          items: items
        }
        personApi.sendApprove(model)
          .then((result) => {
            if (result.data.resultType === 1 || result.data.resultType === 2) {
              this.$notify.error(result.data.resultMessage)
            } else {
              this.$notify.success(result.data.resultMessage)
            }
          }).catch((err) => {
          this.$notify.error(this.$t('notify.error', err))
        })
          .finally(() => {
            this.busy = false
          })
        this.$emit('childData', false)
      }
    },
    cancelChanges() {
      this.$emit('childData', false)
    },
    getLookupFields() {
      this.busy = true
      personApi.getPersonGeneralEditLookupFields()
        .then((v) => {
          this.citizenshipCountryList = v.data.citizenshipCountryList
          this.oldCountry = (this.citizenshipCountryList.find(m => m.value === (this.oldItems.find(m => m.Title === 'Uyruk')).Value)).label
          this.newCountry = (this.citizenshipCountryList.find(m => m.value === (this.newItems.find(m => m.Title === 'Uyruk')).Value)).label
          this.busy = false
        })
        .catch(() => {
          this.busy = false
          this.errorMessage = this.$t('crm.common.errorLookupFields')
        })
    },
    getPartyDataChangesById() {
      personApi.getPartyDataChangesById(this.partyDataChangeId)
        .then((v) => {
          this.newItems.push(
            { Title: 'TCKN', Value: v.data.result[0].newIdentificationNumber },
            { Title: 'Adı', Value: v.data.result[0].newFirstName },
            { Title: 'İkinci Adı', Value: v.data.result[0].newMiddleName },
            { Title: 'Soy Adı', Value: v.data.result[0].newLastName },
            { Title: 'Ana Adı', Value: v.data.result[0].newMotherName },
            { Title: 'Baba Adı', Value: v.data.result[0].newFatherName },
            { Title: 'Doğum Tarihi', Value: v.data.result[0].newBirthDate },
            { Title: 'Uyruk', Value: v.data.result[0].newCitizenshipCountryGeoId },
            { Title: 'Pasaport No', Value: v.data.result[0].newPassportNumber }
          )
          this.oldItems.push(
            { Title: 'TCKN', Value: v.data.result[0].oldIdentificationNumber },
            { Title: 'Adı', Value: v.data.result[0].oldFirstName },
            { Title: 'İkinci Adı', Value: v.data.result[0].oldMiddleName },
            { Title: 'Soy Adı', Value: v.data.result[0].oldLastName },
            { Title: 'Ana Adı', Value: v.data.result[0].oldMotherName },
            { Title: 'Baba Adı', Value: v.data.result[0].oldFatherName },
            { Title: 'Doğum Tarihi', Value: v.data.result[0].oldBirthDate },
            { Title: 'Uyruk', Value: v.data.result[0].oldCitizenshipCountryGeoId },
            { Title: 'Pasaport No', Value: v.data.result[0].oldPassportNumber }
          )
        })
        .catch(() => {
          this.errorMessage = this.$t('crm.common.errorLookupFields')
        })
    }
  }
}
</script>
<style lang="scss" scoped>
.change-limit-table {
  border-collapse: collapse;
  th, td {
    padding: 5px !important;
  }
  thead tr th:first-child {
    padding-left: 15px !important;
  }
  tbody tr td:first-child {
    padding-left: 15px !important;
  }
}
.same-value{
  color: #909399;
}
.different-value{
  color: #68c23a;
}
.same-input :deep(.el-input__inner){
  color: #68c23a;
  border: 1px solid #68c23a;
}
@media screen and (max-width: 1440px) {
  .el-input, .el-date-picker, .el-select {
    width: 100% !important;
  }
}
</style>
