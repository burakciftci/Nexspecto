<template>
  <div class="productCancel">
    <div>
     <br>
     <br>
      <el-card>
        <el-table v-if="productCancelRequest.length>0" :data="productCancelRequest" fit highlight-current-row style="width: 100%;">
          <el-table-column label="İptal Talep Tarihi" prop="cancelDate" align="center" header-align="center">
            <template v-slot="props">
              <el-tag>{{  $filters.parseTime(props.row.cancelDate,'{d}.{m}.{y}') }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="Banka Adı" prop="bankName" align="center" header-align="center"/>
          <el-table-column label="Şube Adı" prop="branchName" align="center" header-align="center" class-name="cell"/>
          <el-table-column label="IBAN" prop="iban" align="center" header-align="center" class-name="cell"/>
          <el-table-column label="Statüsü" align="center">
            <template v-slot="props">
              <el-tag>
                {{ props.row.productCancelStatus === 1 ? 'İptal Talebi Reddedildi' :
                   props.row.productCancelStatus === 2 ? 'Devam Ediyor' :
                   props.row.productCancelStatus === 3 ? 'İptal Talebi Kabul Edildi': 'Talep Zaman Aşımına Uğradı' }}
              </el-tag>
            </template>
          </el-table-column>
        </el-table >
        <div v-else>
          <el-alert
            title="Müşteri tarafından yapılmış aktif bir iptal talebi bulunmamaktadır."
            type="success"/>
        </div>
      </el-card>
      <br>
      <el-card v-if="productCutRatios.length>0">
        <el-row>
          <el-table v-loading="busy" :data="productCutRatios" fit highlight-current-row style="width: 100%;">
            <el-table-column label="Tarih" prop="fromDate">
              <template v-slot="listscope">
                {{ $filters.parseTime(listscope.row.fromDate, '{d}.{m}.{y}') }}
              </template>
            </el-table-column>
            <el-table-column label="Kesinti Tipi" prop="cutRatioType">
              <template v-slot="listscope">
                {{ listscope.row.cutRatioType }}
              </template>
            </el-table-column>
            <el-table-column label="Kesinti Oranı" prop="cutRatio">
              <template v-slot="listscope">
                % {{ listscope.row.cutRatio * 100 }}
              </template>
            </el-table-column>
            <el-table-column label="Kesinti Kaynağı" prop="cutResource">
              <template v-slot="listscope">
                {{ listscope.row.cutResource }}
              </template>
            </el-table-column>
            <el-table-column label="Kayıt Durumu" prop="recordStatus">
              <template v-slot="listscope">
                {{ listscope.row.recordStatus }}
              </template>
            </el-table-column>
          </el-table >
        </el-row>
      </el-card>
    </div>
  </div>
</template>

<script>

import partnerApi from '@/api/finance/partner'
import { MoneyFormats } from '@/utils/globalVars'
import { Money } from 'v-money'


export default {
  components: {
    Money
  },
  props: {
    productId: {
      type: Number,
      default: 0
    },
    calculationId: {
      type: Number,
      default: 0
    },
    projectCode: {
      type: String,
      default: ''
    },
    customerName: {
      type: String,
      default: ''
    },
    customerGuid: {
      type: String,
      default: ''
    },
    customerId: {
      type: Number,
      default: 0
    },
    createDate: {
      type: String,
      default: null
    },
    isReceivedService: {
      type: Boolean,
      default: false
    },
    isMergeProduct: {
      type: Boolean,
      default: false
    },
    isProtocolDelivery: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      valuesProject: {},
      cutRatioTransfer: 0,
      cutRatioNormal: 0,
      MoneyFormats,
      compName: 'productcancel',
      productCutRatios: [],
      model: {
        productId: this.productId,
        bankName: '',
        iban: '',
        branchName: '',
        productCancelId: 0,
        cutRatioTransfer: 0,
        cutRatioNormal: 0,
        isCutRatioOfTransferForWorkingCost: false,
        isCutRatioOfNormalForWorkingCost: false,
        isNormalCutTypeWC: false,
        totalWorkingCost: 0,
        paidWorkingCost: 0
      },
      amountCanRequest: 0,
      totalPayedAmount: 0,
      dialogVisible: false,
      dialogVisibleAddTransferCutRatio: false,
      dialogVisibleAddNormalCutRatio: false,
      dialogVisibleChangeProductStatus: false,
      showButton: false,
      productStatuses: [
        { text: 'Onay Bekleniyor', value: 'approverequired' },
        { text: 'İlk Ödeme Bekleniyor', value: 'paymentrequired' },
        { text: 'Devam Ediyor', value: 'continue' },
        { text: 'İptal Edildi', value: 'cancel' },
        { text: 'Ayrılma Bekleniyor', value: 'leaverequired' }
      ],
      productStatusType: '',
      newProductStatus: {
        productStatus: null,
        productCode: this.projectCode
      },
      targetProduct: null,
      action: 'productcancel',
      productCancelRequest: [],
      obj: {
        workingCostTransactions: [],
        deductionRefund: 0,
        virementRefund: 0,
        reason: '',
        paidWorkingCost: 0,
        totalWorkingCost: 0,
        cutWorkingCost: 0
      },
      validation: {
        cutRatioTransfer: [
          { validator: this.validateCutRatio, trigger: 'change' }
        ],
        cutRatioNormal: [
          { validator: this.validateCutRatio, trigger: 'change' }
        ]
      }
    }
  },
  watch: {
    'model.cutRatioTransfer': function() {
      this.calculateCut()
    },
    'model.isCutRatioOfTransferForWorkingCost': function() {
      this.calculateCut()
    },
    'model.cutRatioNormal': function() {
      this.calculateCut()
    },
    'model.isCutRatioOfNormalForWorkingCost': function() {
      this.calculateCut()
    },
    'obj': function() {
      this.getProductCancelRequestById(this.productId)
    },
    'obj.cutWorkingCost': function() {
      console.log('cutt')
      this.calculateCutRatio()
    }
  },
  created() {
    this.getCutRatios()
    this.getProductCancelRequestById()
  },
  mounted() {

  },
  methods: {
    calculateCut() {
      var cut = 0
      if (this.dialogVisibleAddTransferCutRatio && !isNaN(this.model.cutRatioTransfer)) {
        if (this.model.isCutRatioOfTransferForWorkingCost) {
          cut = this.obj.totalWorkingCost * this.model.cutRatioTransfer / 100
        } else {
          cut = this.obj.paidWorkingCost * this.model.cutRatioTransfer / 100
        }
      }
      if (this.dialogVisibleAddNormalCutRatio && !isNaN(this.model.cutRatioNormal)) {
        if (this.model.isCutRatioOfNormalForWorkingCost) {
          cut = this.obj.totalWorkingCost * this.model.cutRatioNormal / 100
        } else {
          cut = this.obj.paidWorkingCost * this.model.cutRatioNormal / 100
        }
      }
      if (cut !== 0) {
        this.obj.cutWorkingCost = cut.toFixed(2)
      }
    },
    calculateCutRatio() {
      var cutRatio = 0
      if (this.dialogVisibleAddTransferCutRatio) {
        if (this.model.isCutRatioOfTransferForWorkingCost) {
          cutRatio = this.obj.cutWorkingCost * 100 / this.obj.totalWorkingCost
        } else {
          cutRatio = this.obj.cutWorkingCost * 100 / this.obj.paidWorkingCost
        }
        this.model.cutRatioTransfer = cutRatio.toFixed(2)
      }
      if (this.dialogVisibleAddNormalCutRatio) {
        if (this.model.isCutRatioOfNormalForWorkingCost) {
          cutRatio = this.obj.cutWorkingCost * 100 / this.obj.totalWorkingCost
        } else {
          cutRatio = this.obj.cutWorkingCost * 100 / this.obj.paidWorkingCost
        }
        this.model.cutRatioNormal = cutRatio.toFixed(2)
      }
    },
    validateCutRatio(rule, value, callback) {
      if (value === '' || value === undefined) {
        callback(new Error(this.$t('sale.nullValueValidation')))
      } else if (value < 0) {
        callback(new Error(this.$t('sale.positiveValidation')))
      } else if (value > 100) {
        callback(new Error(this.$t('sale.maxRatioValidation')))
      } else {
        callback()
      }
    },
    getCutRatios() {
      this.busy = true
      partnerApi.getCutRatios(this.model.productId)
        .then((v) => {
          this.productCutRatios = v.data
        })
        .catch((err) => {
          console.log('err: ', err)
        })
      this.busy = false
      this.dialogVisibleAddTransferCutRatio = false
      this.dialogVisibleAddNormalCutRatio = false
    },
   
    closeDialog() {
      this.dialogVisibleAddTransferCutRatio = false
      this.dialogVisibleAddNormalCutRatio = false
      this.dialogVisibleChangeProductStatus = false
    },


    getIBAN(iban) {
      this.model.bankName = iban.bankName
      this.model.iban = iban.iban
      this.model.branchName = iban.branchName
    },
    create() {
      this.busy = true
      partnerApi.startProductCancel(this.model)
        .then((v) => {
          if (v.data.success) {
            this.model = v.data
            this.getProductCancelRequestById(this.productId)
            this.busy = false
            this.dialogVisible = false
          } else {
            this.busy = false
            this.dialogVisible = false
            this.$notify.info(this.$t(v.data.errorMessage))
          }
        })
        .catch((err) => {
          console.log(err)
          this.busy = false
          this.dialogVisible = false
          this.$message({
            type: 'info',
            message: this.$t('notify.unknownError')
          })
        })
    },
    getProductCancelRequestById() {
      this.busy = true
      partnerApi
        .getProductCancelRequestById(this.productId)
        .then((v) => {
          v.data.forEach(data => {
            var payedWorkingCost = 0
            this.obj.workingCostTransactions.forEach(transaction => {
              if (transaction.createDate <= data.cancelDate) {
                if (transaction.transactionType === 1) {
                  payedWorkingCost += transaction.amount
                } else if (transaction.transactionType === 2 || transaction.transactionType === 6) {
                  payedWorkingCost = transaction.amount < 0 ? payedWorkingCost + transaction.amount : payedWorkingCost - transaction.amount
                }
              }
            })
            data.payedWorkingCost = payedWorkingCost
            data.totalWorkingCost = this.obj.totalWorkingCost
          })
          this.productCancelRequest = v.data
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
    }

  }
}
</script>

<style lang="scss" scoped>
.itemlabel{
  width:100%;
  height: 36px;
  line-height: 36px;
}
.mb-25{
  margin-bottom: 25px;
}
.rowStyle {
  padding: 10px;
  margin: 5px;
}
.cell {
  text-overflow: ellipsis !important;
  white-space: pre-wrap !important;
  word-break: keep-all !important;
}
.el-input__inner{
  font-size: 25px;
}

::v-deep(.productCancel) {
  .v-modal {
    z-index: 2;
  }
}
</style>
