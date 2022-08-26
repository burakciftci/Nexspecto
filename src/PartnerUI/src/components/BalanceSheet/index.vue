<template>
  <div>
    <el-row style="border:1px solid #333; padding: 2px; margin-right: 5px;">
      <el-col :span="3">
        İşlem Türü
      </el-col>
      <el-col :span="7" style="padding-right: 10px">
        Açıklama
      </el-col>
      <el-col :span="3">
        Detay
      </el-col>
      <el-col :span="2">
        Tarih
      </el-col>
      <el-col :span="3">
        Alıcı Ad Soyad / IBAN
      </el-col>
      <el-col :span="3" style="text-align:right">
        Borç
      </el-col>
      <el-col :span="3" style="text-align:right">
        Alacak
      </el-col>
    </el-row>
    <el-row v-for="(item,index) in transactionList" :key="index"
            style="border-bottom:1px solid #333; padding: 2px; margin-right: 5px;">
      <el-col :span="3">
        <span> {{ item.accountingTransactionType.title }}</span>
        <span> {{ item.accountingTransactionDetailType.title }}</span>
      </el-col>
      <el-col :span="7" style="padding-right: 10px">
        <span> {{ item.description }}</span> <br>
      </el-col>
      <el-col :span="3">
        <div v-if="item.accountingTransactionType.name !== 'delivery'">
          {{ item.paymentSource.name == 'fromcustomer' ? 'Müşteriden Kesilecek' : 'Teslimattan Kesilecek' }}
        </div>
        <div v-if="item.sendToNameTransactionDetailId != null">
          {{ 'İsme Havale' }}
        </div>
        <div v-else>
          {{ item.iban != '' ? 'IBAN numarasına transfer' : 'Projeye transfer edilecek.' }}
        </div>
      </el-col>
      <el-col :span="2">
        {{ $filters.parseTime(item.paymentDate, '{dd}.{mm}.{yyyy}') }}
      </el-col>
      <el-col :span="3">
        {{ item.firstLastName }} <br>
        {{ item.iban }}
      </el-col>
      <el-col :span="3" style="text-align:right">
        <div v-if="item.accountingTransactionType.name == 'delivery'">
          <i v-if="item.firstLastName.length>0" class="el-icon-warning"/>
          {{ $filters.formatTRY(item.amount) }}
        </div>
        <br></el-col>
      <el-col :span="3" style="text-align:right">
        <div v-if="item.accountingTransactionType.name != 'delivery'">
          {{ $filters.formatTRY(item.amount) }}
        </div>
        <br></el-col>
    </el-row>
    <el-row style="padding: 2px; margin-right: 5px;">
      <el-col :span="18">
        Toplam
      </el-col>
      <el-col :span="3" style="text-align:right">
        {{ $filters.formatTRY(totalDeliveryAmount) }}
      </el-col>
      <el-col :span="3" style="text-align:right">
        {{ $filters.formatTRY(totalCostAmount) }}
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'BalanceSheet',
  props: {
    transactionList: {
      type: Array,
      default: null
    }
  },
  data() {
    return {
      // accountingTransactionType: '',
      // accountingTransactionDetailType: '',
      // paymentDate: new Date(Date.now()),
      // productId: this.productId,
      // amount: 0,
      // IBAN: '',
      // firstLastName: '',
      // tempAccountingTransactionId: 0,
      // description: '',
      // bankName: '',
      // accountCode: '',
      // accountingTransactionId: 0,
      // parentTransactionId: this.parentTransactionId,
      // transferProductId: null,
      // paymentSource: 'fromdelivery'
    }
  },
  computed: {
    totalCostAmount: function () {
      let total = 0

      if (this.transactionList && this.transactionList.length > 0) {
        this.transactionList.forEach(element => {
          if (element.accountingTransactionType.name !== 'delivery') {
            total += element.amount
          }
        })
      }

      return total
    },
    totalDeliveryAmount: function () {
      let total = 0

      if (this.transactionList && this.transactionList.length > 0) {
        this.transactionList.forEach(element => {
          if (element.accountingTransactionType.name === 'delivery') {
            total += element.amount
          }
        })
      }
      return total
    }
  },
  mounted() {
  },
  methods: {}
}
</script>
