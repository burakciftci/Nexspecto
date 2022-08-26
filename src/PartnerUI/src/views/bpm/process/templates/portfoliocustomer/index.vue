<template>
  <el-col v-loading="busy" :span="formItemContent.cols">
    <el-row>
      <el-form-item label="Şube" label-width="140px">
        <el-select v-loading="busy" v-model="value.formItems[index].value[0]" class="itemlabel" clearable @change="getLookups">
          <el-option
            v-for="item in branchList"
            :key="item.value"
            :label="item.label"
            :value="item.value"/>
        </el-select>
      </el-form-item>
    </el-row>
    <el-row>
      <el-form-item :prop="'formItems[' + index + '].value[1]'" :rules="rules" label="BMT Listesi" label-width="140px">
        <el-select v-loading="busy" v-model="value.formItems[index].value[1]" class="itemlabel" clearable>
          <el-option
            v-for="item in bmtList"
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
    const validateBmtPass = (rule, value, callback) => {
      if (!(this.model.formItems[this.index].value[1] > 0)) {
        callback(new Error(this.$t('task.required', {title: 'BMT Seçiniz'})))
      } else {
        callback()
      }
    };
    return {
      busy: false,
      partyId: null,
      bmtList: [],
      branchList: [],
      rules: [
        { validator: validateBmtPass, trigger: 'blur' }]
    }
  },
  mounted() {
    this.partyId = this.formItemContent.alias
    this.getBranchList()
  },
  created() {

  },
  methods: {
    getLookups() {
      this.getBmtList()
    },
    getBmtList() {
      this.busy = false
      portfolioApi.getBmtCustomersByBranch(this.model.formItems[this.index].value[0])
        .then((v) => {
          this.bmtList = v.data
          this.model.formItems[this.index].value[1] = this.bmtList[1].value
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
          this.busy = false
        })
    },
    getBranchList() {
      this.busy = true
      portfolioApi.getCustomerBranchs(this.partyId)
        .then((v) => {
          this.branchList = v.data
          this.model.formItems[this.index].value[0] = this.branchList[0].value
          this.busy = false
          this.getBmtList()
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
}
</script>

<style scoped>
.itemlabel {
  width:100%;
  height: 36px;
  line-height: 36px;
}
</style>

