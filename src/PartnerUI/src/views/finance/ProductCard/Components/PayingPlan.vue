<template>
  <div>
    <div>
      <el-dialog
        v-model="paymentTableDialogVisible"
        class="payment-plan-dialog"
        top="8vh"
        style="text-align:center;"
        center>
        <span slot="title">
          <div class="modal-header">
            <h4 class="modal-title">Ödeme Planı</h4>
          </div>
        </span>
        <paying-table-document
          ref="paymentTableDialog"
          :calculation-id="calculation"
          :delivery-date="deliveryDate"
          :project-code="projectCode"
          :blocked-amount="blockedAmount"
        />
      </el-dialog>
    </div>
    <el-row type="flex" justify="end" align="middle">
      <el-button type="secondary" icon="el-icon-tickets" @click="paymentTableDialogVisible = true">
        Ödeme Planı
      </el-button>
      <el-button type="secondary" icon="el-icon-download" @click="downloadPaymentPlan">
        Excel İndir
      </el-button>
    </el-row>
    <br>
    <table class="table summary" style="width:100%">
      <thead>
        <tr>
          <th>Kalan Miktar</th>
          <th>Ödenen Miktar</th>
          <th>Kalan Proje Taksiti</th>
          <th>Ödenen Proje Taksiti</th>
          <th>Artan Bakiye</th>
          <th>Bloke Bakiye</th>
        </tr>
      </thead>
      <tbody id="product-detailtable2">
        <tr>
          <td>{{ $filters.formatTRY(finalRemainAmount) }} </td>
          <td>{{ $filters.formatTRY(payedAmount)  }} </td>
          <td>{{ remainInstallment }} </td>
          <td>{{ payedInstallment }}</td>
          <td>{{ $filters.formatTRY(extraBudget) }}</td>
          <td>{{ $filters.formatTRY(blockedAmount) }}</td>
        </tr>
      </tbody>
    </table>
    <table class="table" style="width:100%">
      <thead>
        <tr class="tableHeader">
          <th class="text-center">Sıra </th>
          <th class="text-center">Dönem </th>
          <th class="text-center">Aylık Taksit</th>
          <th class="text-center">Kalan Ödeme</th>
          <th class="text-center">Aylık Ödeme</th>
          <!-- <th class="text-center" style="width: 130px;">Ara Ödeme</th> -->
          <th class="text-center">Ödeme Durumu</th>
          <th class="text-center">Tipi</th>
          <!-- <th class="text-center">Ödeme Miktarı</th> -->
          <th v-if="productStatus !== 'Teklif'" class="text-center"/>
        </tr>
      </thead>
      <tbody id="product-detailtable">
        <tr v-for="(item,index) in paymentModel" :key="index" :class="[rowClass(index,item), rowClass2(item.paymentType, item.isStatic),rowClass3(item.paymentType, item.isStatic)]">
          <td class="text-center">{{ orderMethod(item, item.paymentType, item.order, item.paymentDate, index) }} </td>
          <td class="text-center">{{ new Date(item.paymentDate).toLocaleDateString('tr-TR', { year: 'numeric', month: 'long', day: '2-digit' }) }} </td>
          <td class="text-center"><span v-show="!item.isPostpone">{{ $filters.formatTRY(item.amount) }}</span> </td>
          <td
            class="text-center"><span v-show="!item.isPostpone">{{ $filters.formatTRY(item.remainAmount) }}</span>
          </td>
          <td class="text-center"><span v-show="!item.isPostpone">{{ $filters.formatTRY(item.monthlyPayAmount) }}</span></td>
          <!-- <td class="text-center"><span v-show="!item.isPostpone">{{ item.interimAmount | formatTRY }}</span> </td> -->
          <td class="text-center"><span v-show="!item.isPostpone">{{ item.paymentStatusText }}</span> </td>
          <!-- <td class="text-center">{{ item.order +'. '+ item.isStatic === true ? 'Revize Farkı': item.paymentTypeText }} </td> -->
          <td :class="interimStyle(item.paymentType)" :style="item.isStatic?'font-weight:500;color:#C84243;':''" class="text-center">
            <div v-show="!item.isPostpone">
              <el-tag v-if="item.isStatic && item.paymentType === 'interimpayment'" class="projectInstallmentCostTag">
                Revize Farkı
              </el-tag>
              <el-tag v-else-if="item.isStatic && item.paymentType === 'workingcostinstallment'" class="workingCostTag">
                Revize ÇB Farkı
              </el-tag>
              <el-tag v-else-if="item.isDeliveryWorkingCost && item.paymentType === 'workingcostinstallment'" class="workingCostTag">
                Tesilmat ÇB Taksiti
              </el-tag>
              <el-tag v-else :type="tagType(item)">
                {{ item.paymentTypeText }}
              </el-tag>
            </div>
          </td>
        
          <td v-if="productStatus !== 'Teklif'" class="text-center">
            
            <i v-if="!item.isPostpone && item.paymentStatus === 'payed'" class="el-icon-check"/>
            <el-button v-if="item.isPostpone && !item.isAddedBySystem" style="object-fit: contain;border-radius: 4px;box-shadow: 0 20px 20px 0 rgba(182, 49, 69, 0.1);background-image: linear-gradient(106deg, rgb(79, 130, 73), #149c18);cursor:not-allowed; color:#fff; font-size:16px; font-weight:normal;">Taksit Atlatma</el-button>
            <el-button v-if="item.isPostpone && item.isAddedBySystem" style="object-fit: contain;border-radius: 4px;box-shadow: 0 20px 20px 0 rgba(182, 49, 69, 0.1);background-image: linear-gradient(106deg, rgb(193, 179, 81), rgb(136, 132, 26));cursor:not-allowed; color:#fff; font-size:16px; font-weight:normal;"> Gecikme </el-button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>

// import paymentApi from '@/api/finance/payment'
// import transactionApi from '@/api/finance/transaction'
// import paymentReturnApi from '@/api/finance/paymentReturn'
// import productApi from '@/api/finance/product'
import partnerApi from '@/api/finance/partner'

import { Money } from 'v-money'
import { MoneyFormats } from '@/utils/globalVars'
import PayingTableDocument from './PayingTableDocument'
// import { hasActionPermission } from '@/permission.js'
import { saveAs } from 'file-saver'

export default {
  components: {
    Money,
    PayingTableDocument
  },
  props: {
    productId: {
      type: Number,
      default: 0
    },
    calculationId: {
      type: Number,
      default: null
    },
    productStatus: {
      type: String,
      default: ''
    },
    methodType: {
      type: String,
      default: 'ordered'
    },
    deliveryDate: {
      type: Object,
      default: null
    },
    additionalTerm: {
      type: Number,
      default: null
    },
    projectCode: {
      type: String,
      default: null
    },
    productDelayInformation: {
      type: Array,
      default: null
    }
  },
  data() {
    var validAmount = (rule, value, callback) => {
      if (value > 0) {
        callback()
      } else {
        callback(new Error('Lütfen sıfırdan büyük bir değer giriniz!'))
      }
    }
    return {
      MoneyFormats,
      getPaymentDateItem: null,
      pickPaymentDateDialogVisible: false,
      paymentTableDialogVisible: false,
      model: {
        accountingTransactionId: 0,
        customerId: 0,
        productId: 0,
        calculationId: this.calculationId,
        amount: 0,
        transactionStatus: 0,
        accountCode: '',
        description: '',
        paymentDate: new Date(Date.now()),
        remainAmount: 0,
        transactionType: 'receive',
        transactionDetailType: 'projectinstallment'
      },
      sumRemainAmount: 0,
      finalRemainAmount: 0,
      remainInstallment: 0,
      sumTotalAmount: 0,
      busy: false,
      extraBudget: 0,
      payedAmount: 0,
      blockedAmount: 0,
      payedInstallment: 0,
      accounts: [],
      paymentModel: {},
      calculation: null,
      validation: {
        paymentDate: [
          { required: true, message: 'Lütfen bir değer giriniz!' }
        ],
        amount: [
          { validator: validAmount, trigger: 'blur' }
        ]
      },
      pickerOptions: {
        firstDayOfWeek: 1
      }
    }
  },
  computed: {
    paymentOrder: function() {
      const payment = this.paymentModel.find(x => x.paymentStatus === 'initial' || x.paymentStatus === 'partialpayed')

      // Math.max(...this.paymentModel.filter(x => x.paymentStatus === 'payed').map(x => x.order))
      return payment ? payment.order : 0
    }
  },
  watch: {
    productId: function(val) {
      this.model.productId = this.productId
    }
  },
  created() {
    this.initialRun()
  },

  methods: {
    // hasActionPermission,
    openPaymentTable() {
      debugger
      this.paymentTableDialogVisible = true;
    },
    hidingAddPostponeButton(item) {
      var d1 = Date.parse(item.paymentDate)
      var d2 = Date.parse(new Date(Date.now()))
      if (d1 <= d2) {
        return true
      } else {
        return false
      }
    },
    tagType(item) {
      if (item.paymentType === 'workingcostadvancepayment') {
        return 'type3'
      } else if (item.paymentType === 'workingcostinstallment') {
        return 'type2'
      } else if (item.paymentType === 'advancepayment') {
        return 'type4'
      } else if (item.paymentType === 'projectinstallment') {
        return 'type5'
      } else if (item.paymentType === 'interimpayment') {
        return 'type7'
      } else {
        return ''
      }
    },
    interimStyle(paymentType) {
      if (paymentType === 'interimpayment') {
        return 'interimStyle'
      }
    },

    initialRun() {
      this.calculation = this.calculationId
    //  this.deliveryDate = this.deliveryDate
    //  this.additionalTerm = this.additionalTerm
      this.getPaymentPlans()
      this.getAccounts()
      this.getExtraBudget()
      this.getBlockedFund()
    },
    deliveryDisabled(index, item) {
      if (this.dateCompare(item.paymentDate) && (item.paymentType === 'projectinstallment' || (item.isDeliveryWorkingCost && item.paymentType === 'workingcostinstallment'))) {
        return true
      } else {
        return false
      }
    },
    rowClass(index, item) {
      // var additional = this.methodType === 'ordered' ? 1 : 0
      if (item.isPostpone) {
        if (item.isAddedBySystem) {
          return 'systemPostpone'
        }
        return 'postpone'
      } else if (this.dateCompare(item.paymentDate) && (item.paymentType === 'projectinstallment' || (item.isDeliveryWorkingCost && item.paymentType === 'workingcostinstallment'))) {
        return 'orange'
      }
      return ''
    },
    rowClass2(paymentType, isStatic) {
      if (paymentType === 'interimpayment' && isStatic === true) {
        return 'revision-difference'
      }
    },
    rowClass3(paymentType, isStatic) {
      if (paymentType === 'workingcostinstallment' && isStatic === true) {
        return 'workingcostinstallment-difference'
      }
    },
    orderMethod(item, paymentType, order, paymentDate, index) {
      if (paymentType === 'projectinstallment') {
        return order
      }
      if (paymentType === 'interimpayment' || paymentType === 'workingcostadvancepayment' || paymentType === 'advancepayment') {
        return '#'
      }
      if (paymentType === 'workingcostinstallment') {
        if ((new Date(this.paymentModel[0].paymentDate).getMonth() === new Date(this.paymentModel[1].paymentDate).getMonth()) && (index === 0 || index === 1)) {
          return '1'
        }
        return order
      }
    },
    findMonthlyPaymentAmount() {
      this.busy = true
      var sum = 0
      if (this.paymentModel && this.paymentModel.length > 0) {
        this.paymentModel.forEach((element) => {
          sum = sum + element.amount
          element.monthlyPayAmount = sum
        })
      }

      this.busy = false
    },
    getExtraBudget() {
      this.busy = true
      partnerApi.getExtraBudget(this.calculationId)
        .then((v) => {
          this.extraBudget = v.data
        })
        .catch((err) => {
          console.log(err)
        })
        .finally(() => {
          this.busy = false
        })
    },
    getBlockedFund() {
      this.busy = true
      partnerApi.getBlockedFund(this.calculationId)
        .then((result) => {
          // console.log('blocked', result)
          this.blockedAmount = result.data
          this.getPaymentPlans()
        })
        .finally(() => {
          this.busy = false
        })
    },
    applyBlockedFundToPlan(amount) {
      for (let index = this.paymentModel.length - 1; amount > 0; index--) {
        if (index < 0) break
        var element = this.paymentModel[index]
        if (amount < element.remainAmount) {
          element.remainAmount = element.remainAmount - amount
          element.paymentStatusText = 'Kısmi Ödeme'
          element.paymentStatus = 'partialpayed'
          amount = 0
        } else {
          amount = amount - element.remainAmount
          element.paymentStatus = 'payed'
          element.paymentStatusText = 'Ödenmiş'
          element.remainAmount = 0
        }
      }
    },
    downloadPaymentPlan() {
      this.busy = true
      partnerApi.downloadPaymentPlanExcel(this.calculationId, this.productId)
        .then((v) => {
          saveAs(new Blob([v.data], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
          }), 'Ödeme_Planı.xlsx')
          this.$notify.success(this.$t('notify.success'))
        })
        .catch((err) => {
          console.log(err)
        })
        .finally(() => {
          this.busy = false
        })
    },
    getAccounts() {
      this.busy = true
      partnerApi
        .getAccounts()
        .then((result) => {
          if (result.data.success) {
            this.busy = false
            this.accounts = result.data.result
            this.model.accountCode = this.accounts && this.accounts.length > 0 ? this.accounts[0].value : ''
          }
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
    monthDiff(d1, d2) {
      var months
      months = (d2.getFullYear() - d1.getFullYear()) * 12
      months -= d1.getMonth() + 1
      months += d2.getMonth()
      return months <= 0 ? 0 : months
    },

    getPaymentPlans() {
      this.busy = true
      partnerApi
        .getPaymentPlans(this.calculation)
        .then((result) => {
          if (result.data.success) {
            this.busy = false
            this.paymentModel = result.data.result
            var initialValue = 0
            this.$emit('paymentModel', this.paymentModel)
            var projectInstallment = this.paymentModel.filter(i => i.paymentType === 'projectinstallment')
            this.sumRemainAmount = this.paymentModel.reduce((accumulator, currentValue) => {
              return (accumulator + currentValue.remainAmount)
            }, initialValue)
            this.remainInstallment = projectInstallment.reduce((accumulator, currentValue) => {
              if (currentValue.remainAmount !== 0) {
                return (accumulator + 1)
              } else return accumulator
            }, initialValue)
            this.payedInstallment = projectInstallment.length - this.remainInstallment
            this.sumTotalAmount = this.paymentModel.reduce((accumulator, currentValue) => {
              return (accumulator + currentValue.amount)
            }, initialValue)
            this.payedAmount = this.sumTotalAmount - this.sumRemainAmount
            this.finalRemainAmount = this.calculateFinalRemainAmount(this.sumRemainAmount, this.blockedAmount)
            this.findMonthlyPaymentAmount()
            if (this.blockedAmount > 0) {
              this.applyBlockedFundToPlan(this.blockedAmount)
            }
            this.$emit('remainAmount', this.finalRemainAmount)
          }
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

    calculateFinalRemainAmount(remainAmount, blockedAmount) {
      if (remainAmount > blockedAmount) return remainAmount - blockedAmount
      if (remainAmount < blockedAmount || remainAmount === blockedAmount || remainAmount < 0) return 0
      return 0
    },
    getPaymentDate(item) {
      if (this.productStatus === 'Onay Bekleniyor') {
        this.$message({
          type: 'info',
          message: this.$t('notify.approveRequired')
        })
      } else {
        this.getAccounts()
        this.pickPaymentDateDialogVisible = true
        this.getPaymentDateItem = item
        this.model.amount = this.getPaymentDateItem.remainAmount
      }
    },
    handleClose(done) {
      this.$confirm('Kapatmak istediğinize emin misiniz?')
        .then(_ => {
          done()
        })
        .catch(_ => {})
    },
    dateCompare(date) {
      var options = { year: 'numeric', month: 'numeric' }
      var paymentDate = new Date(date)
      if (this.deliveryDate !== undefined && this.deliveryDate !== null) {
        var newDeliveryDate = new Date(this.deliveryDate.exactDeliveryDate !== null ? this.deliveryDate.exactDeliveryDate : this.deliveryDate.iDeliveryDate)
        paymentDate = paymentDate.toLocaleDateString('tr-TR', options)
        newDeliveryDate = newDeliveryDate.toLocaleDateString('tr-TR', options)
        if (paymentDate === newDeliveryDate) {
          return true
        }
      }
      return false
    },
  }
}

</script>

<style lang="scss" scoped>
.product-delay {
  min-height: 50px;
  height: auto;
  padding: 10px;
  border-radius: 4px;
  box-shadow: 0 10px 20px 0 rgba(0, 0, 0, 0.08);
  border: solid 1px #e5e5e5;
  background-color: #f5f5f5;
  display: flex;
  align-items: center;
}
::v-deep(.payment-plan-dialog) .el-dialog {
  width: 850px !important;
}
#product-detailtable tr:nth-child(2n+1){
      background-blend-mode: multiply;
      background: #fff;
      height: 66px;
      .el-icon-check {
        width: 21px;
        height: 14px;
        font-size: 21px;
        font-weight: bold;
        font-stretch: normal;
        font-style: normal;
        line-height: 0.67;
        letter-spacing: normal;
        color: #68c23a;

      }
    }
    #product-detailtable tr:nth-child(2n){
      background-blend-mode: multiply;
      background: #ededed;
      height: 66px;
      .el-icon-check {
        width: 21px;
        height: 14px;
        font-size: 21px;
        font-weight: bold;
        font-stretch: normal;
        font-style: normal;
        line-height: 0.67;
        letter-spacing: normal;
        color: #68c23a;

      }
    }
    #product-detailtable2 tr:nth-child(2n+1){
      background-blend-mode: multiply;
      background: transparent;
      td {
        background: transparent;
        height: 34px;
        font-size: 21px;
        font-weight: 500;
        font-stretch: normal;
        font-style: normal;
        line-height: normal;
        letter-spacing: normal;
        color: #000;
      }
    }
    #product-detailtable2 tr:nth-child(2n){
      background-blend-mode: multiply;
      background: transparent;
      td {
        background: transparent;
        height: 34px;
        font-size: 21px;
        font-weight: 500;
        font-stretch: normal;
        font-style: normal;
        line-height: normal;
        letter-spacing: normal;
        color: #000;
      }
    }
table{
  border-spacing: 0px;
  thead{
    border-radius: 4px;
    background-image: linear-gradient(92deg, #ff5252, #c94343);
    tr{
      th{
        padding: 5px;
        font-size: 16px;
        font-weight: 500;
        font-stretch: normal;
        font-style: normal;
        line-height: normal;
        letter-spacing: normal;
        color: #ffffff;
      }
    }
  }
  tbody{
    tr{
      td:nth-child(1), td:nth-child(2), td:nth-child(3), td:nth-child(4){
        font-weight: bold;
      }
      padding: 10px 5px;
    }
    .style1{
      color: #1a84ff !important;
    }
    .style2{
      color: #f59f3e !important;
    }
    .style3{
      color: #000000 !important;
    }
    .white{
      background-blend-mode: multiply;
      background-image: #fff;
      height: 66px;
    }
    .gray{
      background-blend-mode: multiply;
      background-image: linear-gradient(to left, rgba(0, 0, 0, 0.03), rgba(0, 0, 0, 0.05));
      height: 66px;
    }
    .orange{
      background-color: #C84243 !important;
    }
    // .revision-difference {
    //   background-color: #b590ca !important;
    // }

    .postpone{
background-image: linear-gradient(45deg, #78ab41 25%, #7cb341 25%, #7cb341 50%, #78ab41 50%, #78ab41 75%, #7cb341 75%, #7cb341 100%) !important;
background-size: 67.88px 67.88px !important;
border-radius: 6px !important;

    }

    .systemPostpone{
background-image: linear-gradient(45deg, #ecdeae 25%, #eee8d3 25%, #eee8d3 50%, #ecdeae 50%, #ecdeae 75%, #eee8d3 75%, #eee8d3 100%) !important;
background-size: 67.88px 67.88px !important;
border-radius: 6px !important;

    }

  }
  &.summary {
    object-fit: contain;
    border-radius: 4px;
    background-color: #f5f5f5;
    margin-bottom: 30px;
    padding: 15px 30px;
    thead {
      background-image: none;
      tr th {
        font-size: 14px;
        text-align: left;
        padding: 0px;
        color: #909399;
      }
    }
    tbody {
      tr td {
        font-size: 21px;
        font-weight: 500;
        font-stretch: normal;
        font-style: normal;
        line-height: normal;
        letter-spacing: normal;
        color: #000;
      }
    }
  }
}
.workingCostTag {
  background-color: lightskyblue;
  color: currentcolor;
}
.projectInstallmentCostTag {
  background-color: #AED581;
  color: currentcolor;
}

.interimStyle span {
  background: #7fb3a0;
  border-radius: 4px;
  color: #000;
  font-weight: 400;
}
</style>
