<template>
  <div class="login-container">
    <el-dialog
      v-model="dialogPasswordResetVisible"
      :modal-append-to-body="false"
      class="pop-up"
      width="45%"
    >
      <template #title>
        <div class="my-header">
          <p>Şifre Yenileme</p>
          <p>Yeni şifrenizi oluşturun ve ardından <span>Kaydet</span> butonuna basınız. </p>
        </div>
      </template>
      <el-form
        ref="passwordChange"
        :rules="validation"
        :model="model"
        label-position="top">
        <el-form-item label="Kullanıcı Adınız">
          <el-input
            v-model="model.id"
            placeholder="Kullanıcı Adını Giriniz."
            autocomplete="new-password"
          />
        </el-form-item>
        <el-form-item label="Eski Şifreniz">
          <el-input
            v-model="model.oldPassword"
            placeholder="Eski Şifrenizi Giriniz."
            autocomplete="new-password"
          />
        </el-form-item>
        <el-form-item label="Yeni Şifreniz">
          <el-input
            v-model="model.newPassword"
            :type="passwordAgainType"
            show-password
            placeholder="Yeni Şifrenizi Giriniz."
            autocomplete="new-password"
          >
            <span slot="suffix" class="show-pwd" @click="showAgainPwd" />
          </el-input>
        </el-form-item>
        <el-form-item label="Yeni Şifreniz Şifreniz">
          <el-input
            v-model="model.newPasswordAgain"
            :type="passwordAgainType"
            show-password
            placeholder="Yeni Şifrenizi Tekrar Giriniz"
            autocomplete="new-password"
          >
            <span slot="suffix" class="show-pwd" @click="showAgainPwd" />
          </el-input>
        </el-form-item>
      </el-form>
      <div class="warning">
          <i class="fa-solid fa-triangle-exclamation"></i>
          <div>
            <p>Yeni şifrenizde;</p>
            <ul>
              <li><p>Bir büyük harf (A-Z)</p></li>
              <li><p>Bir küçük harf (a-z)</p></li>
              <li><p>Sayı (0-9)</p></li>
              <li><p>En az bir karakter (. ! @ # & ( ) – [ { } ] : ; ', ? / *)</p></li>
            </ul>
            <p>kullanmanız gerekmektedir ve en az <strong>8 karakterli</strong> olmalıdır.</p>
          </div>
        </div>
        <template #footer>
          <span class="footer-desc">
            Gerekli işlemlerinizi <br> tamamladıysanız,
          </span>
          <span class="dialog-footer">
            <el-button type="action" @click="updatePassword">
              Onayla
            </el-button>
          </span>
        </template>
    </el-dialog>
 <!-- <el-dialog 
  v-model="dialogRegister"
  :modal-append-to-body="false"
  class="pop-up"
  width="50%"
 >
    <Form></Form>
 </el-dialog> -->
 <el-row>
    <el-col :span="16" class="left-col">
      <img src="../../assets/img/hero.png" class="background-image" alt="">
      <img src="../../assets/img/hero.png" class="background-image" alt="">
      <img src="../../assets/img/hero.png" class="background-image" alt="">
    </el-col>
    <el-col v-if="showCongrats" :span="8" class="right-col congrats">
      <el-row class="tick">
        <i class="fa-solid fa-check"></i>
      </el-row>
      <el-row>
        <h2>Tebrikler</h2>
      </el-row>
      <el-row>
        <p>Şifreniz başarılı bir şekilde mail adresinize gönderilmiştir. Şifrenizi kullanarak giriş yapabilirsiniz.</p>
      </el-row>
      <el-row style="width:100%;margin-top:20px;">
        <el-button type="primary" style="width:100%;" @click="showCongrats=false">
          {{ 'Giriş Yap Sayfasına Dön' }}
        </el-button>
      </el-row>
    </el-col>
    <el-col v-else :span="8" class="right-col">
      <div v-if="dialogRegister" class="go-back-container" @click="dialogRegister = false">
        <div class="go-back-button">
          <i class="fa-solid fa-arrow-left" />
        </div>
        <span>Geri</span>
      </div>
      <div class="login-form">
        <el-row type="flex" justify="center">
          <img src="../../assets/img/logo-color.svg" class="logo" alt="partner">
        </el-row>
        <div class="margin-top-40" style="text-align: center;">
          <h3 v-if="!dialogRegister">Nexspecto</h3>
          <h3 v-else>REGISTER</h3>
          <p v-if="!dialogRegister" class="login-text">Please Login</p>
          <p v-else class="login-text"></p>
        </div>
        <el-form v-show="!dialogRegister" ref="loginForm" :model="loginForm" :rules="loginRules" autocorrect="off" spellcheck="false" autocomplete="off" label-position="top" class="margin-top-28">
          <el-form-item prop="username" label="User Name">
            <el-input
              ref="username"
              v-model="loginForm.username"
              placeholder="E-Mail Adress"
              name="username"
              type="text"
              tabindex="1"
            />
          </el-form-item>
          <el-tooltip v-model="capsTooltip" content="Capslock açık" placement="top" manual>
            <el-form-item prop="password" label="Password">
              <el-input
                :key="passwordType"
                ref="password"
                v-model="loginForm.password"
                :type="passwordType"
                placeholder="Phone Number Without Country Code"
                name="password"
                tabindex="2"
                @keyup.native="checkCapslock"
                @blur="capsTooltip = false"
                @keyup.enter.native="handleLogin"
              />
              <span class="show-pwd" @click="showPwd">
                <i class="fa-solid fa-eye"></i>
              </span>
            </el-form-item>
          </el-tooltip>
          <br>
          <!-- <el-form-item>
            <el-row type="flex" justify="space-between" align="middle" class="remember-me-area margin-top-20 margin-bottom-20">
              <span>Beni Hatırla</span>
              <el-switch
                  v-model="rememberMeSwitch"
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                />
            </el-row>
          </el-form-item> -->
          <el-button :loading="loading" type="primary" style="width:100%;" @click.native.prevent="handleLogin">Login</el-button>
          <div  class="margin-top-30 text-center">
            <!-- <el-button type="text" @click="handlePassword">Şifremi Unuttum</el-button> -->
            <el-button style="width:100%;"  type="primary" @click.prevent="dialogRegister=true">Register</el-button>
          </div>
        </el-form>
         <el-form 
            v-show="dialogRegister"
            v-loading="loading"
            autocorrect="off"
            spellcheck="false"
            autocomplete="off"
            label-position="top"
            class="margin-top-28"
          >
    <Form @done=done></Form>
 </el-form>
        <!-- <el-form
          v-show="dialogRegister"
          v-loading="loading"
          autocorrect="off"
          spellcheck="false"
          autocomplete="off"
          label-position="top"
          class="margin-top-28">
          <el-form-item :label="$t('login.username')">
            <el-input v-model="usernameForPwd" placeholder="Kullanıcı adınızı giriniz."/>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" style="width:100%;" @click="sendPassword">
              {{ $t('login.send') }}
            </el-button>
          </el-form-item>
        </el-form> -->
      </div>
    </el-col>
  </el-row>
  </div>
</template>

<script>
import LangSelect from '@/components/LangSelect'
import policyApi from '@/api/admin/policy'
import Form from '../register/registerForm.vue'


export default {
  name: 'Login',
  components: { LangSelect ,Form},
  data() {
    const validatePassword = (rule, value, callback) => {
      if (value.length !== 10) {
        callback(new Error('The password can not be less than 10 digits'))
      } else {
        callback()
      }
    }
    const validateMatch = (rule, value, callback) => {
      if (this.model.newPassword !== this.model.newPasswordAgain) {
        callback(new Error('Girilen şifreler eşleşmiyor! '))
      } else {
        callback()
      }
    }
    return {
      dialogPasswordResetVisible: false,
      loginForm: {
    
        username: 'alice',
        password: 'Pass123$'
      },

      loginRules: {
        username: [{ required: true, trigger: 'blur'}],
        // password: [{ required: true, trigger: 'blur', validator: validatePassword }]
      },
      passwordType: 'password',
      showOk: false,
      dialogRegister: false,
      passwordAgainType: 'password',
      model: {
        oldPassword: '',
        newPassword: '',
        newPasswordAgain: '',
        id: ''
      },
      usernameForPwd: '',
      validation: {
        oldPassword: [
          { required: true, message: this.$t('dms.dmsKey.valCategoryType') }
        ],
        newPassword: [
          { validator: validatePassword, required: true, message: 'Şifrenizi kurallara uygun giriniz.', trigger: 'blur' }
        ],
        newPasswordAgain: [
          { validator: validateMatch, trigger: 'blur' }
        ]
      },
      capsTooltip: false,
      dialogRegister:false,
      loading: false,
      showDialog: false,
      redirect: undefined,
      otherQuery: {},
      rememberMeSwitch: true,
      showCongrats: false
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        const query = route.query
        if (query) {
          this.redirect = query.redirect
          this.otherQuery = this.getOtherQuery(query)
        }
      },
      immediate: true
    }
  },
  created() {
 },
  mounted() {
    if (this.loginForm.username === '') {
      this.$refs.username.focus()
    } else if (this.loginForm.password === '') {
      this.$refs.password.focus()
    }
  },
  destroyed() {
    // window.removeEventListener('storage', this.afterQRScan)
  },
  methods: {
    done(){
      this.dialogRegister = false

    },
    checkCapslock(e) {
      const { key } = e
      this.capsTooltip = key && key.length === 1 && (key >= 'A' && key <= 'Z')
    },
     handlePassword() {
      this.dialogRegister = true
    },
     showAgainPwd() {
      if (this.passwordAgainType === 'password') {
        this.passwordAgainType = ''
      } else {
        this.passwordAgainType = 'password'
      }
    },
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    sendPassword() {
      if (this.usernameForPwd === '') {
        this.$notify.error(this.$t('login.enterValidUserName'))
        return
      }
      this.loading = true

      policyApi.sendPassword(this.usernameForPwd)
        .then((v) => {
          if (v.data.success) {
            this.showCongrats = true
          } else {
            this.$notify.error(v.data.errorMessage)
          }
        })
        .catch((err) => {
          this.$notify.error(this.$t('notify.' + err))
        })
        .finally(() => {
          this.loading = false
          this.dialogRegister = false
        })
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {          
          this.loading = true
          this.$store.dispatch('LoginByUsername', this.loginForm)
            .then(() => {
              this.$router.push({ path: this.redirect || '/', query: this.otherQuery })
              this.loading = false
            }).catch(ex => {
              this.loading = false

             if (ex.data.error === 'Password must be renewed.') {
                this.dialogPasswordResetVisible = true
              }
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    getOtherQuery(query) {
      return Object.keys(query).reduce((acc, cur) => {
        if (cur !== 'redirect') {
          acc[cur] = query[cur]
        }
        return acc
      }, {})
    },
    updatePassword() {
      if (this.model.newPassword !== this.model.newPasswordAgain) {
        this.$notify.error('Girilen şifreler eşleşmiyor!')
        return
      }

      if (this.busy === true) return
      
      this.$refs['passwordChange'].validate((valid) => {
        if (valid) {
          this.busy = true
          policyApi
            .updatePassword(this.model)
            .then((v) => {
              console.log('v.data: ', v)
              if (v.data.success === false) {
                if (v.data.errorMessage !== null) {
                  if (v.data.errorMessage === 'passwordDoesNotMatch') {
                    this.$notify.error('Eski şifrenizi kontrol ediniz!')
                  } else if (v.data.errorMessage === 'passwordDoesntMeetRequirements') {
                    this.$notify.error('Yeni şifreniz kriterleri sağlamamaktadır lütfen kontrol ediniz!')
                  } else if (v.data.errorMessage === 'fillEmptyFields') {
                    this.$notify.error('Boş alan bırakmayınız!')
                  }
                }
              } else {
                this.dialogPasswordResetVisible = false
                this.showOk = true
              }
            })
            .catch((err) => {
              if (err.response.data.status === 500) {
                err.response.data.errors.DomainValidations.forEach((v) => {
                  // eslint-disable-next-line
                    this.$notify.error(this.$t(('hr.error.')+ v + '  '))
                })
              } else {
                this.$notify.error(this.$t('notify.error'))
              }
              this.busy = false
            })
          this.busy = false
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>

.login-container {
  height: 100vh;
  width: 100%;
  overflow: hidden;
  .background-image {
    width: 100%;
    height: 100%;
  }
  .left-col {
    height: 100vh;
    z-index: -5;
  }
  .right-col {
    padding: 40px 80px 40px 56px;
    border: solid 1px #ddd;
    border-left: none;
    background-color: #fff;
    position: relative;
    height: 100vh;
    &::before {
      content: "";
      position: absolute;
      left: -20px;
      height: calc(100% + 2px);
      width: 44px;
      top: -1px;
      background: white;
      border-top-left-radius: 24px;
      border: 1px solid #ddd;
      z-index: -3;
      border-bottom-left-radius: 24px;
    }
    .go-back-container {
        position: absolute;
        left: 30px;
        top: 40px;
        cursor: pointer;
      .go-back-button {
        width: 30px;
        height: 30px;
        border-radius: 12px;
        border: solid 1px #ddd;
        background-color: #f5f5f5;
        display: inline-flex;
        justify-content: center;
        align-items: center;
        i {
          font-size: 14px;
          color: #909399;
        }
      }
      span {
        font-size: 14px;
        font-weight: normal;
        font-stretch: normal;
        font-style: normal;
        line-height: normal;
        letter-spacing: normal;
        color: #909399;
        margin-left: 6px;
      }
    }
    .login-form {
      width: 100%;
      height: 100%;
      .login-text {
        font-size: 16px;
        font-weight: normal;
        font-stretch: normal;
        font-style: normal;
        line-height: normal;
        letter-spacing: normal;
        text-align: center;
        color: #606266;
      }
      .show-pwd {
        position: absolute;
        right: 10px;
      }
      ::v-deep(.el-form) {
        .el-form-item {
          margin: 0;
          &:first-child {
            margin-bottom: 20px !important;
          }
          .el-form-item__label {
            &::before {
              display: none;
            }
          }
          .el-switch {
            .el-switch__core {
              width: 60px !important;
              height: 30px;
              border-radius: 15px;
            }
            &.is-checked .el-switch__action {
              width: 25px !important;
              height: 25px !important;
              left: 84% !important;
            }
            .el-switch__action {
              width: 25px !important;
              height: 25px !important;
              left: 4% !important;
            }
          }
        }
      }
      h3 {
        margin: 0;
      }
      p {
        margin-top: 14px;
        margin-bottom: 0;
      }
      .remember-me-area {
        span {
          font-weight: normal;
          font-stretch: normal;
          font-style: normal;
          line-height: normal;
          letter-spacing: normal;
          color: #909399;
        }
        width: 100%;
      }
      ::v-deep(.el-button--text) {
        color: #ff7c52 !important;
      }
    }
  }
  .congrats {
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    .tick {
      border-radius: 48px;
      background-color: #68c23a;
      display: flex;
      align-items: center;
      justify-content: center;
      i {
        color: #fff;
      }
    }
    h2 {
      color: #68c23a;
    }
    p {
      font-size: 16px;
      font-weight: normal;
      font-stretch: normal;
      font-style: normal;
      line-height: normal;
      letter-spacing: normal;
      text-align: center;
      color: #606266;
      margin: 0;
    }
  }
}
@media screen and (max-width: 1536px) {
  .remember-me-area span {font-size: 14px;}
  .congrats {.tick {width: 140px;height: 140px; i{font-size:60px;}}p{font-size: 16px;}}

  .background-image:first-child { display: block; }
  .background-image:nth-child(2) { display: none; }
  .background-image:first-child { display: none; }
}
@media (min-width: 1537px) and (max-width: 1920px) {
  .logo {width: 270px;}
  .remember-me-area span {font-size: 18px;}
  .congrats {.tick {width: 185px;height: 185px; i{font-size:72px;}}p{font-size: 21px;}}
  .background-image:first-child { display: none; }
  .background-image:nth-child(2) { display: block; }
  .background-image:first-child { display: none; }
}
@media (min-width: 1921px) and (max-width: 2560px) {
  .logo {width: 350px;}
  .remember-me-area span {font-size: 24px;}
  .congrats {.tick {width: 248px;height: 248px; i{font-size:88px;}}p{font-size: 28px;}}
  .background-image:first-child { display: none; }
  .background-image:nth-child(2) { display: none; }
  .background-image:first-child { display: block; }
}
</style>
