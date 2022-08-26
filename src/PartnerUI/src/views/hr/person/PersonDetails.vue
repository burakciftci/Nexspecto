<template>
  <div :loading="busy" class="call-center">
    <el-dialog
      v-model="dialogVisible"
      width="43%"
      :before-close="handleClose"
    >
      <template #title>
        <div class="my-header">
          <p class="title">Hesabım Şifre Güncelle</p>
          <p class="description">Yeni şifrenizi oluşturun ve ardından <span>“Güncelle”</span> butonuna basınız. </p>
        </div>
      </template>
      <div>
        <el-form ref="passwordChange" :model="passForm" :rules="rules" label-position="top">
          <el-form-item label="Eski Şifreniz">
            <el-input v-model="passForm.oldPassword" placeholder="Eski şifrenizi giriniz."></el-input>
          </el-form-item>
          <el-form-item label="Yeni Şifreniz">
            <el-input v-model="passForm.newPassword" placeholder="Yeni şifrenizi giriniz."></el-input>
          </el-form-item>
          <el-form-item label="Tekrar Yeni Şifreniz">
            <el-input v-model="passForm.repeatNewPassword" placeholder="Tekrar Yeni şifrenizi giriniz."></el-input>
          </el-form-item>
        </el-form>
        <div class="warning">
          <i class="fa-solid fa-triangle-exclamation"></i>
          <span>Yeni şifrenizde en az bir büyük harf, bir küçük harf (A-Z, a-z), sayı (0-9), en az bir karakter (. ! @ # & ( ) - [ ] : ; ’ ? / *) kullanmanız gerekmektedir ve en az 8 karakterli olmalıdır.</span>
        </div>
      </div>
      <template #footer>
        <span class="footer-desc">
          Gerekli işlemlerinizi <br> tamamladıysanız,
        </span>
        <span class="dialog-footer">
          <el-button type="secondary" plain @click="dialogVisible = false">İptal</el-button>
          <el-button type="action" @click="handlePasswordUpdate">Güncelle</el-button>
        </span>
      </template>
    </el-dialog>
    <el-row type="card">
      <div class="person-information">
        <div class="first-letter margin-right-12">
          <span>{{ model.fullName.charAt(0) }}</span>
        </div>
        <div class="person-name margin-right-12">
          <!-- <span>{{ model.fullName.toLowerCase().replace(/\b(\w)/g, x => x.toUpperCase()) }}</span> -->
          <span>{{ model.fullName }}</span>
        </div>
        <div class="person-stage">
          <span>{{  model.internalOrganizationName + " - " + model.positionName }}</span>
        </div>
      </div>
      <el-button
        v-loading="downloading"
        type="action"
        plain
        @click="updatePassword"
        >Şifre Güncelle <i class="fa-solid fa-edit margin-left-13"></i>
      </el-button>
    </el-row>
    <el-row type="card-bottom">
      <div>
        <i class="fa-solid fa-calendar-days margin-right-8"></i>
        <span class="label margin-right-8">İşe Başlama Tarihi:</span>
        <span class="date margin-right-8">{{ $filters.parseTime(model.fulfillmentDate, "{dd}.{mm}.{yyyy}") }}</span>
        <span class="days">{{ whatDay(model.fulfillmentDate) + ". Gün" }}</span>
      </div>
    </el-row>
    <el-row type="table-header">
      <div>
        <p>Çalışan Bilgileri</p>
        <p>Çalışan personel ile ilgili genel bilgiler bu alanda yer almaktadır.</p>
      </div>
    </el-row>
    <el-row type="form">
      <el-col :span="24">
        <el-form
          ref="crmEditPersonGeneral"
          :model="model"
          label-position="left"
          label-width="150px"
        >
          <el-row>
            <el-col :span="12" class="left-side">
              <el-form-item
                :label="$t('crm.personEditGeneral.tckn')"
                prop="identificationNumber"
              >
                <el-input
                  v-model="model.identificationNumber"
                  :disabled="true"
                />
              </el-form-item>
              <el-form-item
                :label="$t('crm.personEditGeneral.firstName')"
                prop="firstName"
              >
                <el-input
                  v-uppercase
                  v-model="model.firstName"
                  :disabled="true"
                />
              </el-form-item>
              <el-form-item
                :label="$t('crm.personEditGeneral.lastName')"
                prop="lastName"
              >
                <el-input
                  v-uppercase
                  v-model="model.lastName"
                  :disabled="true"
                />
              </el-form-item>
              <el-form-item
                :label="'E-Mail'"
                prop="emailAddress"
              >
                <el-input v-uppercase v-model="model.emailAddress" />
              </el-form-item>
            </el-col>
            <el-col :span="12" class="right-side">
              <el-form-item
                :label="$t('crm.personEditGeneral.dateOfBirth')"
                prop="birthDay"
              >
                <el-input v-model="model.birthDay" :disabled="true"/>
              </el-form-item>
              <el-form-item
                :label="$t('person.internalOrganization')"
                prop="kvkStatusClassificationTypeValueId"
              >
                <el-input v-model="model.internalOrganizationName" :disabled="true"/>
              </el-form-item>
              <el-form-item
                :label="$t('person.currentPosition')"
                prop="kvkStatusClassificationTypeValueId"
              >
                <el-input v-model="model.positionName" :disabled="true"/>
              </el-form-item>
              <el-form-item
                :label="$t('crm.quickPersonCreate.telNo')"
                prop="phoneNumber"
              >
                <el-input v-model="model.phoneNumber" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-col>
    </el-row>
    <el-row type="table-footer">
      <div>
        <p>Lütfen gerekli işlemleri bitirdikten sonra <span style="font-weight: 500;color: #606266;"> “Kaydet”</span> butonuna basınız.</p>
      </div>
      <el-button type="action" @click="updateData">Kaydet</el-button>
    </el-row>
  </div>
</template>
<script>
import partnerApi from "@/api/hr/partner";

export default {
  data() {
    return {
      busy: false,
      initialPhoneNumber: "",
      initialEmailAddress: "",
      model: {
        partyId: null,
        partyType: null,
        fullName: null,
        firstName: null,
        lastName: null,
        partyStatus: null,
        positionName: null,
        createActivityId: null,
        customerStage: null,
        partyContactMechAttributeType: null,
        phoneNumber: null,
        emailAddress: null,
        identificationNumber: null,
        fulfillmentDate: null,
      },
      passForm: {
        oldPassword: '',
        newPassword: '',
        repeatNewPassword: '',
        id: this.$store.state.user.sub
      },
      rules: {
        oldPassword: [{ required: true }],
        newPassword: [{ required: true }],
        repeatNewPassword: [{ required: true }]
      },
      validation: {},
      dialogVisible: false
    };
  },
  mounted() {
    this.getUserData()
  },
  methods: {
    getUserData() {
      partnerApi
        .getPersonByUserGuid(this.$store.state.user.sub)
        .then((result) => {
          this.model = result.data
          this.initialPhoneNumber= this.model.phoneNumber
          this.initialEmailAddress= this.model.emailAddress
          this.loaded = true
        })
        .catch((err) => {
          this.errorMessage = err
        })
    },
    whatDay(initialDate) {
      // initialContactDate
      const sep = new Date(initialDate)
      const today = new Date()
      return Math.floor((today - sep) / (1000 * 60 * 60 * 24))
    },
    updatePassword(){
      this.dialogVisible = true
    },
    handlePasswordUpdate(){
      console.log(this.passForm)
      this.$refs['passwordChange'].validate((valid) => {
      console.log(this.passForm, valid)
        if (valid) {
          this.busy = true
          partnerApi
            .updatePassword(this.passForm)
            .then((v) => {
              if (v.data.success === false) {
                if (v.data.errorMessage !== null) {
                  if (v.data.errorMessage === 'passwordDoesNotMatch') {
                    this.$notify.error('Eski şifrenizi kontrol ediniz!')
                  } else if (v.data.errorMessage === 'passwordDoesntMeetRequirements') {
                    this.$notify.error('Yeni şifreniz kriterleri sağlamamaktadır lütfen kontrol ediniz!')
                  }
                }
              } else {               
                this.$notify.success(this.$t('notify.success'))
                this.dialogVisible = false
              }
            })
            .catch((err) => {
              if (err.data.status === 500) {
                err.data.errors.DomainValidations.forEach((v) => {
                  // eslint-disable-next-line
                    this.$notify.error(this.$t(('hr.error.')+ v + '  '))
                })
              } else {
                this.$notify.error(this.$t('notify.error'))
              }
              this.dialogVisible = false
            })
        }
      })    
    },
    updateData(){
      if(this.initialPhoneNumber != this.model.phoneNumber || this.initialEmailAddress != this.model.emailAddress){
        const _model ={
          partyId: this.model.partyId,
          phoneNumber:this.initialPhoneNumber != this.model.phoneNumber?  this.model.phoneNumber : "",
          emailAddress: this.initialEmailAddress != this.model.emailAddress ? this.model.emailAddress: ""
        }
        partnerApi
              .updateContactMech(_model)
              .then((result) => {
                this.$notify.success(this.$t('notify.success'))
                this.getUserData()
              })
              .catch((err) => {
                this.errorMessage = err
              })
      }
    }
  },
}
</script>

<style lang="scss" scoped>
.box-card {
  position: relative;
  z-index: 3;
  .draw{
    margin-top: 25px;
    margin-bottom: 25px;
    .line {
      background: #e5e5e5;
      height: 1px;
      width: 109%;
      position: absolute;
      left: -9%;
    }
  }
  .partyId2 {
    font-size: 14px;
    font-weight: 600;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: normal;
    color: #000000;
    margin-left: 10px;
  }  
  .lightGray {
    font-size: 14px;
    font-weight: 300;
    font-style: normal;
    font-stretch: normal;
    line-height: normal;
    letter-spacing: normal;
    color: #b7b7b7;
  }
  .sourceContent {
    font-size: 14px;
    font-weight: 300;
    font-style: normal;
    font-stretch: normal;
    line-height: normal;
    letter-spacing: normal;
    color: #000000;
  }
}
</style>

