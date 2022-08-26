<template>
<div>
  <el-form  ref="createForm" :model="createModel" :rules="createRules" autocorrect="off" spellcheck="false" autocomplete="off" label-position="top" class="margin-top-28">
    <el-row>
      <el-col :span="11">
        <el-form-item prop="firstName" label="First Name">
              <el-input
                ref="firstName"
                v-model="createModel.firstName"
                placeholder="FirstName"
                name="firstName"
                type="text"
                tabindex="1"
              />
         </el-form-item>
      </el-col>
      <el-col :span="2">
        &nbsp;
      </el-col>
      <el-col :span="11">
        <el-form-item prop="lastName" label="Last Name">
          <el-input
            ref="lastName"
            v-model="createModel.lastName"
            placeholder="LastName"
            name="lastName"
            type="text"
            tabindex="1"
          />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="11">
        <el-form-item prop="phoneNumber" label="Phone Number">
          <el-input
            ref="phoneNumber"
            v-model="createModel.phoneNumber"
            placeholder="PhoneNumber"
            name="phoneNumber"
            type="text"
            tabindex="1"
          >
            <template #prepend>(+90)</template>
          </el-input>
        </el-form-item>
      </el-col>
      <el-col :span="2">
        &nbsp;
      </el-col>
      <el-col :span="11">
        <el-form-item prop="emailAdress" label="E-Mail Adress">
          <el-input
            ref="emailAdress"
            v-model="createModel.emailAdress"
            placeholder="EmailAdress"
            name="emailAdress"
            type="text"
            tabindex="1"
          />
        </el-form-item>
      </el-col>
    </el-row>
        <el-row>
      <el-col :span="11">
       <el-form-item prop="walletAdress" label="Wallet Adress">
        <el-input
          ref="walletAdress"
          v-model="createModel.walletAdress"
          placeholder="walletAdress"
          name="WalletAdress"
          type="text"
          tabindex="1"
        />
    </el-form-item>
      </el-col>
      <el-col :span="2">
        &nbsp;
      </el-col>
      <el-col :span="11">
      <el-form-item prop="walletProvider" label="Wallet Provider">
        <el-input
          :disabled="true"
          ref="walletProvider"
          v-model="createModel.walletProvider"
          placeholder="WalletProvider"
          name="WalletProvider"
          type="text"
          tabindex="1"
        />
      </el-form-item>
      </el-col>
    </el-row>
    <div class="margin-top-30 text-center">
       <vue-recaptcha @verify="verifyMethod" @expired="expiredMethod" ref="recaptcha" sitekey="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"> </vue-recaptcha>
    </div>
    <div class="margin-top-30 text-center">
      <el-button  :disabled="!buttonVisible" type="primary" @click.prevent="handle">Register</el-button>
    </div>
  </el-form>
</div>
</template>

<script>

import { validEmail } from '@/utils/validate'
import registerApi from '@/api/register/register'
import policyApi from '@/api/admin/policy'
import { VueRecaptcha } from 'vue-recaptcha';

export default {
  components: { VueRecaptcha },

    data() {
    const validateFirstName = (rule, value, callback) => {
      if (!value) {
        callback(new Error('Please Enter the First Name '))
      } else {
        callback()
      }
    }
    const validateLastName = (rule, value, callback) => {
      if (!value) {
        callback(new Error('Please Enter the Last Name '))
      } else {
        callback()
      }
    }
    const validateEmailAdress = (rule, value, callback) => {
      if (!validEmail(value)) {
        callback(new Error('Please Enter valid E-Mail Adress'))
      } else {
        callback()
      }
    }
    const validatePhoneNumber = (rule, value, callback) => {
      if (value.length !== 10) {
        callback(new Error('The Number can not be less than 10 digits '))
      } else {
        callback()
      }
    }
    const validateWalletAdress = (rule, value, callback) => {
      if (!value) {
        callback(new Error('Please Enter the Wallet Adress '))
      } else {
        callback()
      }
    }
    return {
      dialogPasswordResetVisible: false,
     createModel: {
        firstName:'' ,
        lastName:'' ,
        emailAdress:'',
        phoneNumber:'',
        walletAdress:'',
        walletProvider:'MateMask'

      },
      createModelIdentityModel: {
        email:'' ,
        name:'' ,
        phoneNumber:'',
      },
      createRules: {
        firstName: [{ required: true, trigger: 'blur',validator: validateFirstName }],
        lastName: [{ required: true, trigger: 'blur', validator: validateLastName }],
        emailAdress: [{ required: true, trigger: 'blur', validator: validateEmailAdress }],
        phoneNumber: [{ required: true, trigger: 'blur', validator: validatePhoneNumber }],
        walletAdress: [{ required: true, trigger: 'blur', validator: validateWalletAdress }],

      },
      passwordType: 'password',
      loading: false,
      capsTooltip: false,
      buttonVisible:false
    }
  },

  methods: {
  async  handle(){
    await this.handleCreate()
    this.createModelIdentityModel.email = this.createModel.emailAdress
    this.createModelIdentityModel.name = this.createModel.firstName.concat(" ",this.createModel.lastName)
    this.createModelIdentityModel.phoneNumber = this.createModel.phoneNumber
    await this.handleIdentiyCreate()
    },
    async handleCreate(){
      this.$refs.createForm.validate(valid => {
        if (valid) {
          registerApi.createUser(this.createModel)
            .then((v) => {          

            })
            .catch((err) => {
              this.$notify.error(err.data)
            })

        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
   async handleIdentiyCreate(){
      policyApi.createUser(this.createModelIdentityModel)
        .then((v) => {
          this.createModel.firstName = ''
          this.createModel.lastName = ''
          this.createModel.emailAdress = ''
          this.createModel.phoneNumber = ''
          this.createModel.walletAdress = ''
          this.$emit('done')
          this.$notify.success('Success')

        })
        .catch((err) => {
          this.$notify.error(err.data)
        })   
    },
    verifyMethod(){
      this.buttonVisible = true
    },
    expiredMethod(){
      this.buttonVisible = false
    },
  },
}
</script>
<style lang="scss" scoped>

</style>