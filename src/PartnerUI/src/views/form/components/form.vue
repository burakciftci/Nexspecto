<template>
<div>  
<el-form  ref="createForm" :model="createModel" :rules="createRules" autocorrect="off" spellcheck="false" autocomplete="off" label-position="top" class="margin-top-28">
    <el-form-item prop="networkType" label="Network ">
    <div class="pre">{{"Network"}}</div>
      <el-select v-model="createModel.networkType" placeholder="Select" ref="networkType">
         <el-option
            v-for="item in netWorksTypes"
            :key="item.id"
            :label="item.name"
            :value="item.id"
            />
        <template #prepend>Network</template>
      </el-select>
    </el-form-item>
    <el-form-item prop="transactionId" label="Transaction Id">
      <el-input
        ref="transactionId"
        v-model="createModel.transactionId"
        placeholder="TransactionId"
        name="transactionId"
        type="text"
        tabindex="1"
      >
        <template #prepend>TransactionId</template>
      </el-input>
    </el-form-item>
      <el-card>
        <el-upload
          v-loading="busy"
          ref="files"
          :file-list="fileList"
          :auto-upload="false"
          :on-change="onChange"
          :accept="acceptedExtensions"
          multiple= false
          action=""
          list-type="picture">
          <el-button  slot="trigger" size="small" class="primary-button">Dosya Seç</el-button>
        </el-upload>
      </el-card>

    <div class="margin-top-30 text-center">
      <el-button type="primary" @click.prevent="handleCreate">Add</el-button>
    </div>
  </el-form>
</div>
</template>

<script>

import formApi from '@/api/form/form'
import store from '@/store'
export default {
    components: {
  },
    data() {
    const validateTransactionId = (rule, value, callback) => {
      if (!value) {
        callback(new Error('Please Enter the TransactionID '))
      } else {
        callback()
      }
    }
    const validateNetwork = (rule, value, callback) => {
      if (!value) {
        callback(new Error('Please Select the Network '))
      } else {
        callback()
      }
    }
    return {
     id:'',
     selectedFile: null,
     acceptedExtensions : ['image/*'],
     createModel: {
        transactionId: '',
        networkType: '',
        registerUserId : '',
        image: ''
      },
      createRules: {
        transactionId: [{ required: true, trigger: 'blur',validator: validateTransactionId }],
        networkType: [{ required: true, trigger: 'blur', validator: validateNetwork }],
      },

      netWorksTypes :[
                        { "name": "Binance Smart Chain(BEP20)", "id": "1" },
                        { "name": "Tron (TRC20)", "id": "2" },
                        { "name": "Ethereum (ERC20)", "id": "3" }                  
                      ]
    }
  },

   created() {
    this.id = store.getters.user.sub
  },

  methods: {
    handleCreate(){
      console.log('this.$refs.files',this.$refs.files)
      this.$refs.createForm.validate(valid => {
        if (valid) {
          this.createModel.registerUserId = this.id          
          this.createModel.image =this.$refs.files.uploadFiles[0]
          formApi.createForm(this.createModel)
            .then((v) => {
              this.$notify.success('Success')
              this.createModel.transactionId =''
              this.createModel.networkType =''
              this.createModel.registerUserId =''
              this.$emit('done')
            })
            .catch((err) => {
              this.$notify.error(err.data)
            })

        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  },
}
</script>
<style lang="scss" scoped>
.pre{
    background-color: var(--el-bg-color);
    color: var(--el-color-info);
    vertical-align: middle;
    display: table-cell;
    position: relative;
    border: 1px solid #dcdfe6;
    border-radius: var(--el-input-border-radius);
    padding: 0 80px;
    width: 1px;
    white-space: nowrap;
}
</style>