<template>
  <div style="padding-right:5px;">
    <!-- <el-row>
      <el-col :span="4">
        Finansman Tutarı
      </el-col>
      <el-col :span="4">
        {{ model.financeAmount | formatTRY }}
      </el-col>
      <el-col :span="4">
        Kesinti Toplamı
      </el-col>
      <el-col :span="4">
        {{ model.costAmount | formatTRY }}
      </el-col>
      <el-col :span="4">
        Gönderilecek Tutar
      </el-col>
      <el-col :span="4">
        {{ model.deliveryAmount | formatTRY }}
      </el-col>
    </el-row> -->
    <balance-sheet v-if="transactionList && transactionList.length>0" :transaction-list="transactionList" />
    <div v-else> Herhangi bir ödeme işlemi bulunamadı...</div>
  </div>
</template>
<script>
import transactionApi from '@/api/finance/transaction'
import BalanceSheet from '@/components/BalanceSheet/index.vue'

export default {
  components: {
    BalanceSheet
  },
  props: {
    modelValue: {
      type: Object,
      default: () => {}
    },
    formItemContent: {
      type: Object,
      default: () => {}
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
    return {
      productId: null,
      uniqueProcessId: null,
      transactionList: []
    }
  },
  mounted() {
    this.productId = this.formItemContent.alias.split(',')[0]
    this.uniqueProcessId = this.formItemContent.alias.split(',')[1]
    if (this.productId) {
      this.getProductTransactionList()
    }
  },
  methods: {
    getProductTransactionList() {
      this.dialogVisible = false
      this.editDialogVisible = false
      transactionApi.getTempTransactionList(this.productId, this.uniqueProcessId)
        .then((v) => {
          this.transactionList = v.data.result.filter(x => x.tempAccountingTransactionStatus.name === 'inprogress' || x.uniqueProcessId === this.uniqueProcessId)
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

