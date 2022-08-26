<template>
  <el-dialog v-model="showDialogInner" @closed="$emit('dialogClosed')">
    <el-card v-loading="busy">
      <div class="centered">
        <h1> {{ title }} </h1>
      </div>
      <el-row type="flex" justify="center" style="margin-bottom:20px" >
        <span class="phone-info"> <b>{{ phoneNumber }} </b></span><span class="info-detail"> No'lu telefona gönderilen {{ otpLength }} Haneli SMS Kodunu Giriniz </span>
      </el-row>
      <div class="centered">
        <v-otp-input
          ref="otpInput"
          :num-inputs="otpLength"
          :should-auto-focus="true"
          :is-input-num="true"
          input-classes="otp-input"
          separator="-"
          @on-complete="otpOnComplete"
        />
      </div>
      <el-row justify="center" type="flex" style="margin-top: 10px">
        <el-col >
          <el-row class="countdown" justify="center" type="flex">
            <el-col>
              <div class="seconds"> {{ countDown }}</div>
              <div class="seconds-hint">saniye</div>
            </el-col>
          </el-row>
          <el-row v-if="otpErrorMessage" style="color: darkred;margin-top: 10px;margin-bottom: 10px" type="flex" justify="center">
            <span class="otp-error">  {{ otpErrorMessage }}</span>
          </el-row>
          <el-row v-if="showResend" justify="center" type="flex" style="margin-top:10px">
            <el-button class="action-button xl-button" icon="el-icon-refresh" @click="getOTPCode">
              Tekrar Gönder
            </el-button>
          </el-row>
        </el-col>
      </el-row>

    </el-card>
  </el-dialog>
</template>

<script>
import personApi from '@/api/crm/callCenter'
import { generateUUID } from '@/utils/tool'

export default {
  name: 'OtpInput',
  props: {
    phoneNumber: {
      type: String,
      default: ''
    },
    firstName: {
      type: String,
      default: ''
    },
    lastName: {
      type: String,
      default: ''
    },
    showDialog: {
      type: Boolean,
      default: true
    },
    sendGdprMessage: {
      type: Boolean,
      default: true
    },
    title: {
      type: String,
      default: ''
    },
    smsType: {
      type: String,
      default: ''
    },
    placeHolders: {
      type: Object,
      default: function() {
        return {}
      }
    }
  },
  data() {
    return {
      otpErrorMessage: '',
      countDown: 0,
      intervalHandle: null,
      formId: null,
      otpId: null,
      busy: false,
      defaultCountdown: 0,
      showDialogInner: false,
      showResend: false,
      otpLength: 4
    }
  },
  watch: {
    showDialog: {
      handler: function(value) {
        console.log('showdialog changed', value)
        this.showDialogInner = value
      },
      immediate: true
    }
  },
  async mounted() {
    this.busy = true
    this.showDialogInner = true
    await this.getOTPCode()
    this.busy = false
    // this.showDialog = true
  },
  destroyed() {
    this.clearOtpCountDown()
  },
  methods: {
    async otpOnComplete(value) {
      const model = {
        formId: this.formId,
        otpId: this.otpId,
        code: value
      }

      this.busy = true
      try {
        const res = await personApi.validateOtp(model)
        if (res.status === 200) {
          this.otpErrorMessage = ''
          this.clearOtpCountDown()
          this.showDialogInner = false
          this.$emit('onOtpValidated', model)
        } else {
          console.log('otp is invalid')
          this.otpErrorMessage = 'Hatalı kod girdiniz lütfen tekrar deneyiniz.'
          this.showResend = true
          this.$notify.error('Sms Doğrulama Kodu Yanlış...')
        }
      } catch (e) {
        this.otpErrorMessage = 'Hatalı kod girdiniz lütfen tekrar deneyiniz.'
        this.showResend = true
      } finally {
        this.$refs.otpInput.clearInput()
        this.busy = false
      }
    },
    async getOTPCode() {
      this.formId = generateUUID()
      let phone = this.phoneNumber
      this.otpErrorMessage = ''
      this.showResend = false
      if (phone && (phone.indexOf('(') > -1 || phone.length === 12)) {
        const sliceLength = phone.length === 12 ? 2 : 3
        phone = phone.slice(sliceLength).replace(/[^0-9]+/g, '')
      }
      if (!phone || !this.firstName || !this.lastName || phone.length !== 10) {
        this.$notify.error('Sms OTP için Telefon Numarası, İsim ve Soyisim zorunludur.')
        this.showDialogInner = false
        return
      }
      const fullName = `${this.firstName} ${this.lastName}`
      const model = {
        formId: this.formId,
        phone,
        fullName,
        sendGdprMessage: this.sendGdprMessage,
        smsType: this.smsType,
        placeHolders: this.placeHolders
      }
      try {
        const { data } = await personApi.getOtpCode(model)
        const { otpId, timeoutInSecs, otpLength } = data
        this.otpLength = otpLength
        this.otpId = otpId
        this.countDown = timeoutInSecs
        this.defaultCountdown = timeoutInSecs
        this.startOtpCountdown()
      } catch (e) {
        this.$notify.error(this.$t('notify.error'))
      }
    },
    startOtpCountdown() {
      clearInterval(this.intervalHandle)
      this.intervalHandle = setInterval(() => {
        this.countDown -= 1
        if (this.countDown === 0) {
          this.clearOtpCountDown()
          this.$notify.error('SMS Doğrulama Kodu Zaman Aşımına Uğradı, Tekrar Deneyiniz...')
          this.showResend = true
        }
      }, 1000)
    },
    clearOtpCountDown() {
      this.countDown = 0
      clearInterval(this.intervalHandle)
    }
  }
}
</script>

<style >
.itemlabel {
  width:100%;
  height: 36px;
  line-height: 36px;
}
.otp-input {
  width: 40px !important;
  height: 40px !important;
  margin: 0 10px;
  font-size: 20px;
  border-radius: 4px;
  padding: 11px 14px 9px 11px;
  box-shadow: 0 10px 20px 0 rgba(0, 0, 0, 0.08);
  border: solid 1px #000000;
  background-color: #ffffff;
  align-content: center;
  align-items: center;
  text-align: center;
}
.error {
  border: 1px solid red !important;
}
.centered{
  display: flex;
  flex-direction: column;
  align-items:center;
  justify-content:center
}
.countdown{
  font-size: 16px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  text-align: center;
  color: #ff7501;
}
.countdown .seconds{
  font-size: 32px;
}
.seconds-hint{
  margin-top: -5px;
  font-size: 18px;
}
.otp-error {

  font-size: 18px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  text-align: center;
  color: #fa5550;
}
.otp-input .el-icon-refresh{
  font-size: 18px !important;
  font-weight: normal;
}
.phone-info{
  font-size:22px
}
.info-detail{
  margin-left: 5px;
  font-size:22px;
  font-weight: 300;
}
.xl-button{
  font-size:18px;
}
</style>
