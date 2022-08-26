<template>
  <div class="temp-payment-information-v2">
    <el-row style="margin-bottom:5px;">
      <el-tag>Finansman Tutarı : {{ $filters.formatTRY(financeAmount) }} </el-tag>
      <el-tag v-if="false">Masraflar Toplamı : {{ $filters.formatTRY(totalCostAmount) }} </el-tag>
      <el-tag>Yapılan Teslimat : {{ $filters.formatTRY(accountingTransactionAmounts + totalDeliveryAmount) }} </el-tag>
      <el-tag>Kalan Teslimat : {{ $filters.formatTRY((financeAmount - totalDeliveryAmount - accountingTransactionAmounts).toFixed(2)) }} </el-tag>
      <el-tag>Onaylandığında Kalan: {{ $filters.formatTRY(((financeAmount - totalDeliveryAmount - accountingTransactionAmounts) - afterApprovedAmount).toFixed(2))  }}</el-tag>
    </el-row>
    <el-row v-if="unPaidAmounts" style="margin-top: 3px; margin-bottom: 3px;">
      <el-tag>Ödenmeyen Ç.B Toplamı : {{ $filters.formatTRY(unPaidAmounts.workingCostAmount) }} </el-tag>
      <el-tag>Ödenmeyen Taksit Toplamı : {{ $filters.formatTRY(unPaidAmounts.installmentAmount) }} </el-tag>
    </el-row>
    <el-row v-else>
      <el-tag>
        {{ 'Ödenmeyen Ç.B Tutarı:  ' }}
      </el-tag>
      <el-tag>
        {{ 'Ödenmeyen Taksit Miktarı: ' }}
      </el-tag>
    </el-row>
    <el-table v-loading="busy" v-if="tableData&&tableData.length>0" :data="tableData" fit highlight-current-row style="width: 100%;">
      <el-table-column label="İşlem Grubu">
        <template v-slot="scope">
          <el-tag> {{ scope.row.accountingTransactionTypeString }} </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="İşlem Türü" width="140px">
        <template v-slot="scope">
          <el-tag> {{ scope.row.accountingTransactionDetailTypeString }} </el-tag>
        </template>
      </el-table-column>
      <el-table-column width="170px" label="İşlem Detay">
        <template v-slot="scope">
          <div v-if="scope.row.accountingTransactionType !== 4">
            {{ scope.row.paymentSource === 3 ? 'Tasarruf Sahibinden Kesilecek': 'Teslimattan Kesilecek' }}
          </div>
          <div v-if="scope.row.sendToNameTransactionDetailId != null">
            {{ 'İsme Havale' }}
          </div>
          <div v-else>
            {{ scope.row.iban != '' ? scope.row.firstLastName + ' ' +scope.row.iban : 'Tasarruf Planına transfer edilecek.' }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="Ödeme Tarihi" prop="paymentDate" width="120px">
        <template v-slot="props">
          <div style="width:100%; text-align:center;">
            {{ new Date(props.row.paymentDate).toLocaleDateString('tr-TR', { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute:'numeric' }) }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="Tutar" prop="amount" width="100px;">
        <template v-slot="scope">
          <div style="text-align:right; width:100%;">  {{ $filters.formatTRY(scope.row.amount) }} </div>
        </template>
      </el-table-column>
      <el-table-column label="Açıklama" width="350px" prop="description"/>
      <el-table-column label="Hesap" width="100px;" prop="accountCode"/>
      <el-table-column label="Durum" width="140px;" align="center">
        <template v-slot="scope">
          <el-tag>{{ scope.row.tempAccountingTransactionStatusString }}</el-tag>
        </template>
      </el-table-column>
    </el-table >
  </div>
</template>

<script>

import partnerApi from '@/api/finance/partner'
import { Money } from 'v-money'
import { MoneyFormats } from '@/utils/globalVars'
import { hasActionPermission } from '@/permission.js'


export default {
  directives: {
  },
  components: {
    Money,
  },
  props: {
    productId: {
      type: Number,
      default: null
    },
    projectCode: {
      type: String,
      default: ''
    },
    financeAmount: {
      type: Number,
      default: 0
    },
    calculationId: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      saveButtonIsActive: true,
      sendToName: this.$t('crm.paymentTransfer.sendToName'),
      sendToIBAN: this.$t('crm.paymentTransfer.sendToIBAN'),
      sendToProject: this.$t('crm.paymentTransfer.sendToProject'),
      MoneyFormats,
      dialogVisible: false,
      editDialogVisible: false,
      labelPosition: 'left',
      busy: true,
      productList: [],
      code: '',
      tableData: [],
      localAmount: 0,
      buttonShow: false,
      accounts: [],
      paymentSources: [],
      selectedItem: null,
      payedAmount: 0,
      unPaidAmounts: null,
      afterApprovedAmount: 0,
      accountingTransactionAmounts: 0,
      validated: false,
      model: {
        accountingTransactionType: '',
        accountingTransactionDetailType: '',
        paymentDate: new Date(Date.now()),
        productId: this.productId,
        amount: 0,
        IBAN: '',
        birthDay: null,
        phone: null,
        fatherName: null,
        address: null,
        targetProductId: null,
        firstLastName: '',
        tempAccountingTransactionId: 0,
        description: '',
        identificationNumber: null,
        bankName: null,
        bankBranchName: null,
        accountCode: '',
        accountingTransactionId: 0,
        parentTransactionId: this.parentTransactionId,
        transferProductId: null,
        paymentSource: 'fromdelivery',
        motherName: null,
        paymentTransferType: 0
      },
      transactionTypeList: [],
      transactionDetailList: [],
      pickerOptions: {
        firstDayOfWeek: 1
      }
    }
  },
  computed: {
    totalCostAmount: function() {
      let total = 0

      if (this.tableData && this.tableData.length > 0) {
        this.tableData.forEach(element => {
          if (element.accountingTransactionType !== 4 && element.paymentSource !== 3 && element.tempAccountingTransactionStatus !== 4) {
            total += element.amount
          }
        })
      }

      return total
    },

    totalDeliveryAmount: function() {
      let total = 0

      if (this.tableData && this.tableData.length > 0) {
        this.tableData.forEach(element => {
          if ((element.tempAccountingTransactionStatus === 3) && ((element.accountingTransactionType === 4) || (element.accountingTransactionType !== 4 && element.paymentSource === 1))) {
            total += element.amount
          }
        })
      }
      return total
    }
  },
  watch: {
    'model.accountingTransactionType': function() {
      this.model.targetProductId = null
    },
    'model.paymentTransferType': function() {
      this.model.targetProductId = null
    }
  },
  created() {
    this.getProductTransactionList()
    this.getSumOfWaitingApprovals()
    this.getUnPaidAmounts()
    this.code = this.projectCode
  },
  methods: {
    hasActionPermission,
    handleChange(val) {
      var temp = this.productList.find(i => i.productId === val).productId
      this.model.targetProductId = temp
    },
    getUnPaidAmounts() {
      this.busy = true
      partnerApi.getUnpaidAmounts(this.calculationId)
        .then((result) => {
          if (result.data.resultType === 0) {
            this.unPaidAmounts = result.data.data
          }
        })
        .finally(() => {
          this.busy = false
        })
    },
    getSumOfWaitingApprovals() {
      this.busy = true
      partnerApi.getSumOfWaitingApprovals(this.productId)
        .then((v) => {
          this.afterApprovedAmount = v.data
        })
        .catch((err) => {
          console.log(err)
        })
        .finally(() => {
          this.busy = false
        })
    },
    getProductTransactionList() {
      this.dialogVisible = false
      this.editDialogVisible = false
      partnerApi.getTempTransactionList(this.productId)
        .then((v) => {
          this.tableData = v.data.result
          console.log('this.tableData: ', this.tableData)

          if (this.tableData.length > 0) {
            if (this.tableData.some(i => i.tempAccountingTransactionStatus === 3)) {
              this.buttonShow = true
            }
          }
          this.busy = false
        })
        .catch((err) => {
          console.log(err)
          this.busy = false
          this.$message({
            type: 'info',
            message: this.$t('notify.unknownError')
          })
        })
    },
    clearDialog() {
      this.model.accountingTransactionType = ''
      this.model.accountingTransactionDetailType = ''
      this.model.paymentDate = new Date(Date.now())
      this.model.productId = this.productId
      this.model.amount = 0
      this.model.IBAN = ''
      this.model.targetProductId = null
      this.model.firstLastName = ''
      this.model.description = ''
      this.model.bankName = ''
      this.model.accountCode = ''
      this.model.parentTransactionId = this.parentTransactionId
      this.model.transferProductId = null
      this.model.paymentSource = 'fromdelivery'
      this.dialogVisible = true
      this.saveButtonIsActive = true
    },
  }
}
</script>

<style lang="scss" scoped>
.temp-payment-information-v2 {
   ::v-deep(.iban) { 
    .el-input__inner::placeholder {
      font-weight: bold;
      color: #000;
    }
  }
}
</style>
