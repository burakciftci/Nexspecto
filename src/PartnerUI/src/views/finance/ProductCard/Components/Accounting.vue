<template>
  <div>
    <div v-loading="busy">
    </div>
    <div>
      <el-button v-loading="downloading" type="secondary" icon="el-icon-download" style="float:right; margin-bottom: 10px;" @click="exportExcel">Excel İndir</el-button>
      <br>
      <br>
      <table class="table" style="width:100%">
        <thead>
          <tr>
            <th class="text-center">Toplam Teslimat</th>
            <th class="text-center">Toplam Ödeme</th>
            <th class="text-center">Toplam Teslimat Masrafı</th>
            <th class="text-center">Bloke Miktarı</th>
          </tr>
        </thead>
        <tbody id="product-detailtable">
          <tr>
            <td class="text-center">{{ $filters.formatTRY(totalTransaction.totalDelivery) }} </td>
            <td class="text-center">{{ $filters.formatTRY(totalTransaction.totalReceive) }} </td>
            <td class="text-center">{{ $filters.formatTRY(totalTransaction.totalDeliveryCost) }} </td>
            <td class="text-center">{{ $filters.formatTRY(blockedAmount) }} </td>
          </tr>
        </tbody>
      </table>
      <el-table v-loading="busy" :data="transactionList" :row-style="color" fit style="width: 100%;">
        <el-table-column v-if="visible" label="Id" prop="financeAccountingTransactionId"/>
        <el-table-column type="expand" prop="code">
          <template v-slot="props">
            <el-row v-for="(item,index) in props.row.accountingTransactionDetail" :key="index" :gutter="10" style="margin-bottom:10px;">
              <el-col :span="6">  <el-tag> {{ item.transactionDetailTypeString }} </el-tag></el-col>
              <el-col :span="6">  Taksit Tutarı : {{ $filters.formatTRY(item.amount) }}    </el-col>
              <el-col :span="6">  Taksit Dönemi : {{ new Date(item.installmentDate).toLocaleDateString('tr-TR', { year: 'numeric', month: 'short' }) }} </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column label="No" width="40px" type="index"/>
        <el-table-column label="Ödeme Tarihi" prop="paymentDate">
          <template v-slot="props">
            <div style="width:100%;">
              {{ new Date(props.row.paymentDate).toLocaleDateString('tr-TR', { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute:'numeric' }) }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="Tutar" prop="amount" width="150px;">
          <template v-slot="scope">
            <div v-if="scope.row.transactionTypeString === 'Teslimat' || scope.row.transactionTypeString === 'İade' || scope.row.transactionTypeString === 'Kısmi İade'" style="width:100%;"> {{ '-' + scope.row.amount | formatTRY }} </div>
            <div v-else style="width:100%;">  {{ $filters.formatTRY(scope.row.amount) }} </div>
          </template>
        </el-table-column>
        <el-table-column label="Toplam Bakiye" prop="amount" width="150px;">
          <template v-slot="scope">
            <div style="width:100%;">  {{ $filters.formatTRY(scope.row.budget) }} </div>
          </template>
        </el-table-column>
        <el-table-column label="Hesap" prop="accountName"/>
        <el-table-column label="Açıklama" prop="description"/>
        <el-table-column label="İşlem Grubu">
          <template v-slot="scope">
            <el-tag :type="scope.row.transactionTypeString=== 'Tahsilat'?'success':scope.row.transactionTypeString==='İade'?'info':'danger'" effect="dark"> {{ scope.row.transactionTypeString }} </el-tag>
            <el-tag v-if="scope.row.transactionTypeString === 'İade' && scope.row.accountName === 'MAHSUP'" effect="dark">Mahsup</el-tag>
            <el-tag v-if="scope.row.transactionTypeString === 'İade' && scope.row.accountName !== 'MAHSUP'" effect="dark">Ayrılma</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="İşlem Grubu">
          <template v-slot="scope">
            <el-tag> {{ scope.row.transactionStatus === 1 ? 'Tamamlandı': 'İptal Edildi' }} </el-tag>
          </template>
        </el-table-column>
      </el-table >
    </div>
    <div>
      <el-col :span="20">
        <el-pagination
          :current-page="listQuery.page"
          :page-sizes="[10,20,30,50,100,200]"
          :page-size="listQuery.limit"
          :total="count"
          background
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"/>
      </el-col>
    </div>
  </div>
</template>

<script>

import partnerApi from '@/api/finance/partner'
import Sticky from '@/components/Sticky'

export default {
  components: {
    Sticky
  },
  props: {
    customerName: {
      type: String,
      default: null
    },
    projectCode: {
      type: String,
      default: null
    },
    calculationId: {
      type: Number,
      default: null
    },
    productId: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      busy: false,
      transactionList: [],
      count: null,
      visible: false,
      downloading: false,
      listQuery: {
        page: 1,
        limit: 20,
        calculation: this.calculationId,
        completed: true,
        canceled: false
      },
      blockedAmount: 0,
      totalTransaction: {
        totalDelivery: 0,
        totalReceive: 0,
        totalDeliveryCost: 0
      }
    }
  },
  created() {
    this.getTransactions()
    this.getTotalTransaction()
    this.getBlockedFund()
  },
  methods: {
    color({ row, rowIndex }) {
      if (row.transactionTypeString === 'Teslimat' || row.transactionTypeString === 'İade' || row.transactionTypeString === 'Kısmi İade') {
        return 'background:rgba(96,171,85,0.5);'
      }
    },
    exportExcel() {
      this.transactionList.forEach(i => {
        if (i.transactionTypeString === 'Teslimat' || i.transactionTypeString === 'İade' || i.transactionTypeString === 'Kısmi İade') {
          i.amount = (i.amount * (-1))
        }
      })
      this.downloading = true
        import('@/vendor/Export2Excel').then(excel => {
          const tHeader = ['Proje NO', 'Musteri Adı', 'Tutar', 'Türü', 'Tarihi', 'Hesap', 'Açıklama']
          const filterVal = ['projectCode', 'customerName', 'amount', 'transactionTypeString', 'paymentDate', 'accountName', 'description']
          const data = this.formatJson(filterVal, this.transactionList)

          excel.export_json_to_excel({
            header: tHeader, // Header Required
            data, // Specific data Required
            filename: this.customerName + ' CARI HESAP DOKUMU ' + this.projectCode, // Optional
            autoWidth: true, // Optional
            bookType: 'xlsx' // Optional
          })
          this.downloading = false
        })
    },

    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'projectCode' || j === 'customerName') {
          return this[j]
        } else if (j === 'paymentDate') {
          return new Date(v[j]).toLocaleDateString('tr-TR', { year: 'numeric', month: 'long', day: '2-digit' })
        } else {
          return v[j]
        }
      }))
    },
    getBlockedFund() {
      this.busy = true
      partnerApi.getBlockedFund(this.calculationId)
        .then((result) => {
          console.log('blocked', result)
          this.blockedAmount = result.data
        })
        .finally(() => {
          this.busy = false
        })
    },
    getTransactions() {
      partnerApi.getTransactionListByPage(this.listQuery)
        .then((v) => {
          this.transactionList = v.data.data
          console.log('transactionList: ', v.data)
          this.count = v.data.count
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
    getTotalTransaction() {
      this.busy = true
      partnerApi.getTotalTransactions(this.calculationId)
        .then((v) => {
          // console.log('v: ', v)
          this.totalTransaction = v.data
        })
    },
    handleSizeChange(val) {
      this.listQuery.limit = val
      this.getTransactions()
    },
    handleCheckBox() {
      this.listQuery.page = 1
      this.getTransactions()
    },
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.getTransactions()
    }
  }
}
</script>

<style lang="scss" scope>
.itemlabel{
  width:100%;
  height: 36px;
  line-height: 36px;
}
#product-detailtable tr:nth-child(2n+1){
      background-blend-mode: multiply;
      background: #fff;
      height: 66px;
    }
    #product-detailtable tr:nth-child(2n){
      background-blend-mode: multiply;
      background: #ededed;
      height: 66px;
    }
table{
  border-spacing: 0px;
  thead{
    border-radius: 4px;
    background-image: linear-gradient(92deg, #b63049, #c94343);
    tr{
      th{
        padding: 10px;
        font-size: 16px;
        font-weight: 100;
        font-style: normal;
        font-stretch: normal;
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

    .postpone{
background-image: linear-gradient(45deg, #78ab41 25%, #7cb341 25%, #7cb341 50%, #78ab41 50%, #78ab41 75%, #7cb341 75%, #7cb341 100%) !important;
background-size: 67.88px 67.88px !important;
border-radius: 6px !important;

    }

  }
}
</style>

