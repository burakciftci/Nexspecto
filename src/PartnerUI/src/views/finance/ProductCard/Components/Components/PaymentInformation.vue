<template>
  <div>
    <el-table v-loading="busy" v-if="tableData.length>0" :data="tableData" :row-style="color" fit highlight-current-row style="width: 100%;">
      <el-table-column label="İşlem Grubu">
        <template v-slot="scope">
          <el-tag> {{ scope.row.transactionTypeString }} </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="İşlem Türü">
        <template v-slot="scope">
          <el-tag> {{ scope.row.transactionDetailTypeString }} </el-tag>
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
      <el-table-column label="Açıklama" width="360px" prop="description"/>
      <el-table-column label="Hesap" prop="accountName"/>
    </el-table >
  </div>
</template>

<script>

import partnerApi from '@/api/finance/partner'

export default {
  components: {
  },
  props: {
    productId: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      dialogVisible: false,
      editDialogVisible: false,
      dialogDoPayment: false,
      busy: true,
      tableData: [],
      selectedItem: null,
      paybackAmount: 0,
      selectedAmount: 0,
      model: {
        financeAccountingTransactionId: null,
        amount: 0,
        transactionType: null,
        accountName: '',
        description: '',
        paymentDate: null,
        transactionDetailType: null,
        children: [],
        selectedAmount: 0,
        maxPaybackAmount: 0
      }
    }
  },
  watch: {
    selectedAmount: function() {
      this.paybackAmount = this.model.maxPaybackAmount - this.selectedAmount
      this.model.selectedAmount = this.selectedAmount
    }
  },
  created() {
    this.getProductTransactionList()
    this.paybackAmount = 0
  },
  methods: {
    paymentEdit(item) {
      this.selectedItem = item
      this.editDialogVisible = true
    },
    color({ row, rowIndex }) {
      if (row.transactionType === 11 || row.transactionType === 10) {
        return 'background:rgba(96,171,85,0.5);'
      }
    },
    getProductTransactionList() {
      this.dialogVisible = false
      this.editDialogVisible = false
      console.log('getProductTransactionList', this.productId)
      partnerApi.getProductTransactionList(this.productId)
        .then((result) => {
          (result.data).forEach(element => {
            if (element.transactionType === 10 || element.transactionType === 11) {
              element.amount = -(element.amount)
            }
          })
          this.tableData = result.data
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

</style>
