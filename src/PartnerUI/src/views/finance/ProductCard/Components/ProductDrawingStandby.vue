<template>
  <div>
    <div class="app-container">
      <el-card>
        <div v-if="drawingList.length>0">
          <el-table :data="drawingList" fit style="width=100%;">
            <el-table-column label="Çekiliş Tarihi" prop="drawingDate"/>
            <el-table-column label="Çekiliş Dönemi" prop="drawingTerm"/>
            <el-table-column :filters="groupDrawStatuses" :filter-method="filterStatus" label="Statü" prop="groupDrawStatus">
              <template v-slot="scope">
                <el-tag type="danger">{{ getText(scope.row.groupDrawStatus) }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="Kura Sayısı" prop="order"/>
          </el-table>
        </div>

        <div v-else>
          <el-alert
            title="Müşteri tarafından yapılmış herhangi bir sıra tespiti beklemeye alma talebi bulunmamaktadır."
            type="success"/>
          <br>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>

import partnerApi from '@/api/finance/partner'
import { hasActionPermission } from '@/permission.js'
import { Printd } from 'printd'

export default {
  props: {
    productId: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      model: {
        productId: this.productId,
        bankName: '',
        iban: '',
        branchName: '',
        productCancelId: 0
      },
      dialogVisible: false,
      cancelVisible: false,
      groupDrawStatuses: [],
      drawingList: [],
      productCancelRequest: []
    }
  },
  created() {
    this.cancelVisible = hasActionPermission(this.$store.getters.permission_routers, 'groupDrawStatusCancelView')
    this.getGroupDrawStatuses()
    this.getDrawingListByProductId(this.productId)
  },
  mounted() {

  },
  methods: {
    requestDrawingStandBy() {
      this.$confirm(
        'Müşteri, Sıra Tespitini Beklemeye Al Talebine yönelik süreç başlatılacaktır. Onaylıyor musunuz?',
        'Sıra Tespitini Beklemeye Alma Süreci',
        {
          confirmButtonText: this.$t('notify.ok'),
          cancelButtonText: this.$t('notify.cancel'),
          type: 'warning'
        },
      ).then(() => {
        this.busy = true
        partnerApi.starDrawingStandByProccess(this.productId)
          .then((result) => {
            if (result.data.success) {
              this.$notify.success(this.$t('notify.deleteSuccess'))
              this.busy = false
              this.getDrawingList()
            }
          })
      })
        .catch((err) => {
          console.log(err)
          this.busy = false
          this.$message({
            type: 'info',
            message: err === 'cancel' ? 'Vazgeçildi' : this.$t('notify.unknownError') // this.$t('notify.' + err)
          })
        })
    },
    getDrawInfos() {
      this.drawingList.sort(function(a, b) {
        return new Date(a.drawingDate) - new Date(b.drawingDate)
      })
      var realObject
      realObject = this.drawingList.find(function(element) {
        return element.groupDrawStatus.name === 'initial'
      })

      this.$emit('drawInfo', realObject)
    },
    getDrawingListByProductId(productId) {
      this.busy = true
      partnerApi
        .getDrawingListByProductId(productId)
        .then((v) => {
          this.drawingList = v.data.result
          if (!this.cancelVisible) {
            this.drawingList = this.drawingList.filter(i => i.groupDrawStatus !== 'canceled')
          }
          this.drawingList.forEach(i => {
            i.drawingTerm = new Date(i.drawingTerm).toLocaleDateString('tr-TR', { year: 'numeric', month: 'long' })
            i.drawingDate = new Date(i.drawingDate).toLocaleDateString('tr-TR')
          })
          this.getDrawInfos()
          console.log('this.drawingList: ', this.drawingList)
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
    getGroupDrawStatuses() {
      this.busy = true
      partnerApi.getGroupDrawStatuses()
        .then((v) => {
          this.groupDrawStatuses = v.data
          if (!this.cancelVisible) {
            this.groupDrawStatuses = this.groupDrawStatuses.filter(i => i.name !== 'canceled')
          }
          this.groupDrawStatuses = this.groupDrawStatuses.map(i => ({ text: i.title, value: i.name }))
        })
        .catch(() => {
          this.$notify.error(this.$notify.error('notify.error'))
        })
        .finally(() => {
          this.busy = false
        })
    },
    filterStatus(value, row) {
      return row.groupDrawStatus === value
    },
    getText(value) {
      return this.groupDrawStatuses.find(i => i.value === value).text
    },
    printDocument(content) {
      const d = new Printd()
      var parser = new DOMParser()
      var doc = parser.parseFromString(content, 'text/html')
      d.print(doc.documentElement)
    }

  }
}
</script>

<style scoped>
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
</style>
