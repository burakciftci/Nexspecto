<template>
  <div>
    <el-row>
      <el-table
        v-loading="busy"
        :data="portfolioLifeCycleList"
        :header-row-class-name="tableHeader"
        :header-cell-class-name="tableCell"
        :row-class-name="rowStyle"
        element-loading-text="Loading..."
        element-loading-spinner="el-icon-loading"
        style="width: 100%;">
        <el-table-column label="Portföy Adı" prop="title">
          <template v-slot="listscope">
            {{ listscope.row.title }}
          </template>
        </el-table-column>
        <el-table-column label="Başlangıç Tarih" prop="fromDate">
          <template v-slot="listscope">
            {{ new Date(listscope.row.fromDate).toLocaleDateString('tr-TR', { year: 'numeric', month: 'long', day: '2-digit',hour:'numeric',minute:'numeric' }) }}
          </template>
        </el-table-column>
        <el-table-column label="Bitiş Tarihi" prop="thruDate">
          <template v-slot="listscope">
            <span v-if="listscope.row.thruDate === null">{{ 'Devam Ediyor' }}</span>
            <span v-else>{{ new Date(listscope.row.thruDate).toLocaleDateString('tr-TR', { year: 'numeric', month: 'long', day: '2-digit',hour:'numeric',minute:'numeric' }) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="İşlemi Yapan Kullanıcı" prop="name">
          <template v-slot="listscope">
            {{ listscope.row.name === null ? 'REDCASE GEÇİŞ': listscope.row.name }}
          </template>
        </el-table-column>
        <el-table-column label="İşlemler">
          <template v-slot="listscope">
            <el-button-group>
             <el-button v-if="listscope.row.hasRegulation" class="icon-button" @click="viewItem(listscope.row.id)"><svg-icon icon-class="view-icon"/></el-button>
            </el-button-group>
          </template>
        </el-table-column>
      </el-table >
    </el-row>
    <div>
      <el-pagination
        :current-page="listQuery.pageIndex"
        :page-sizes="[10,20,30, 50]"
        :page-size="listQuery.pageSize"
        :total="count"
        background
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
    <!--VIEW DIALOG BEGIN-->
    <el-dialog v-model="regulationView.dialogVisible" width="70%">
      <regulation-view :key="regulationView.key" :party-portfolio-id="regulationView.partyPortfolioId"/>
    </el-dialog>
    <!--VIEW DIALOG END-->
  </div>
</template>
<script>
import lifecycleApi from '@/api/crm/customerLifeCycle'
import regulationView from './CustomerPortfolioLifeCycleRegulationView'

export default {
  components: {
    regulationView
  },
  props: {
    partyId: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      busy: false,
      portfolioLifeCycleList: [],
      model: {
        partyId: this.partyId,
        notes: '',
        partyNoteId: 0
      },
      listQuery: {
        pageSize: 10,
        pageIndex: 1
      },
      count: 0,
      process: false,
      regulationView: {
        dialogVisible: false,
        key: 0,
        partyPortfolioId: 0
      },
      isFirstPortfolio: false
    }
  },
  created() {
    this.getCustomerPortfolioLifeCycleList();
  },
  methods: {
    viewItem: function(partyPortfolioId) {
      this.regulationView.partyPortfolioId = partyPortfolioId
      this.regulationView.dialogVisible = true
      this.regulationView.key++
    },
    tableHeader({ row, rowIndex }) {
      return 'tableHeader'
    },
    tableCell({ row, rowIndex, column, columnIndex }) {
      return 'transparent'
    },
    rowStyle({ row, rowIndex }) {
      if (rowIndex % 2 === 0) {
        return 'light'
      } else {
        return 'dark'
      }
    },
    handleCurrentChange(val) {
      this.listQuery.pageIndex = val
      this.getCustomerPortfolioLifeCycleList()
    },
    handleSizeChange(val) {
      this.listQuery.pageSize = val
      this.getCustomerPortfolioLifeCycleList()
    },
    getCustomerPortfolioLifeCycleList() {
      this.busy = true
      lifecycleApi
        .getCustomerPortfolioLifeCycleListByPartyId(this.partyId, this.listQuery)
        .then((v) => {
          this.portfolioLifeCycleList = v.data.data
          this.count = v.data.count
          this.busy = false
          if (this.count === 0) {
            this.$notify.success(this.$t('notify.thisCustomerCardHasNoPortfolioHistory'))
            return
          }
        })
        .catch(() => {
          this.$notify.error(this.$t('notify.error'))
          this.busy = false
        })
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
