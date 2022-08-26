
<template>
  <div class="contract-product-card">
    <el-table
      v-loading="busy"
      :data="contractList"
      fix
      highlight-current-row
      style="width: 100%;">
      <el-table-column label="Belge Tipi" align="center">
        <template v-slot="props">
          <el-tag v-if="props.row.documentTypeString === 'Şirket-i Milk Sözleşmesi'" type="success">
            {{ props.row.documentTypeString }}
          </el-tag>
          <el-tag v-else>
            {{ props.row.documentTypeString }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="Oluşturulma Tarihi" align="center">
        <template v-slot="props">
          <el-tag>
            {{ $filters.parseTime(props.row.createDate, '{d}.{m}.{y} {h}:{i}:{s}') }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('category.list.actions')"
        class-name="action-buttons td-actions"
        align="right">
        <template v-slot="props">
          <el-button-group>
            <el-tooltip content="İncele" placement="left" effect="light">
              <el-button
                class="icon-button"
                @click="printDocument(props.row.content)">
                <svg-icon icon-class="sale"/>
              </el-button>
            </el-tooltip>
          </el-button-group>
        </template>
      </el-table-column>
    </el-table >
    <el-tabs :tab-position="tabPosition" v-model="activeTabName">
      <el-tab-pane label="Proje" name="proje">
        <documentGroup v-if="activeTabName == 'proje'" :key="activeTabName" :indices="[{ keyType: 'PRODUCTID', value: product }, { keyType: 'CUSTOMERID', value: customer }]" document-group-type="projectdocumentgroup"/>
      </el-tab-pane>
      <el-tab-pane label="Masraf" name="masraf">
        <documentGroup v-if="activeTabName == 'masraf'" :key="activeTabName" :indices="[{ keyType: 'PRODUCTID', value: product }, { keyType: 'CUSTOMERID', value: customer }]" document-group-type="expensedocumentgroup"/>
      </el-tab-pane>
      <el-tab-pane label="Talep" name="talep">
        <documentGroup v-if="activeTabName == 'talep'" :key="activeTabName" :indices="[{ keyType: 'PRODUCTID', value: product }, { keyType: 'CUSTOMERID', value: customer }]" document-group-type="RequestDocumentGroup"/>
      </el-tab-pane>
      <el-tab-pane v-if="isCzmProduct" label="Çözüm Dökümanları" name="czmDocuments">
        <documentGroup v-if="activeTabName == 'czmDocuments'" :key="activeTabName" :is-czm-documents="true" :indices="[{ keyType: 'PRODUCTID', value: product }, { keyType: 'CUSTOMERID', value: customer }]" document-group-type="CzmDocumentGroup"/>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>

import Sticky from '@/components/Sticky'
import partnerApi from '@/api/finance/partner'
import { Printd } from 'printd'
import documentGroup from '@/views/dms/documentGroup'

export default {
  components: {
    Sticky, documentGroup },
  props: {
    calculationId: {
      type: Number,
      default: null
    },
    productId: {
      type: Number,
      default: null
    },
    customerId: {
      type: Number,
      default: null
    },
    customerGuid: {
      type: String,
      default: ''
    },
    isProduct: {
      type: Boolean,
      default: true
    },
    isCzmProduct: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      cssText: `
      @page {margin: 10px auto 45px;}
      body {
        font-family: "Poppins", sans-serif;
      }
      div {
        font-size: 14px;
      }
      .payment-plan div:nth-child(23) div.table-row:last-child {
        height: 80px !important;
      }
      .payment-plan div:nth-child(47) div.table-row:last-child {
        height: 80px !important;
      }
      .payment-plan div:nth-child(72) div.table-row:last-child {
        height: 80px !important;
      }
      .payment-plan div:nth-child(97) div.table-row:last-child {
        height: 80px !important;
      }
      .payment-plan div:nth-child(122) div.table-row:last-child {
        height: 80px !important;
      }
      .payment-plan div:nth-child(147) div.table-row:last-child {
        height: 80px !important;
      }
      .payment-plan div:nth-child(172) div.table-row:last-child {
        height: 80px !important;
      }
      .payment-plan div:nth-child(197) div.table-row:last-child {
        height: 80px !important;
      }
      .payment-plan div:nth-child(222) div.table-row:last-child {
        height: 80px !important;
      }
      .payment-plan div:nth-child(247) div.table-row:last-child {
        height: 80px !important;
      }
      .payment-plan div:nth-child(24) div.table-row:last-child {
        height: 10px !important;
      }
      .payment-plan div:nth-child(49) div.table-row:last-child {
        height: 10px !important;
      }
      .payment-plan div:nth-child(74) div.table-row:last-child {
        height: 10px !important;
      }
      .payment-plan div:nth-child(99) div.table-row:last-child {
        height: 10px !important;
      }
      .payment-plan div:nth-child(124) div.table-row:last-child {
        height: 10px !important;
      }
      .payment-plan div:nth-child(149) div.table-row:last-child {
        height: 10px !important;
      }
      .payment-plan div:nth-child(174) div.table-row:last-child {
        height: 10px !important;
      }
      `,
      calculation: null,
      model: {
        contractId: 0,
        content: '',
        contractStatus: null,
        productid: 0,
        createDate: '',
        signeddate: null,
        recordstatus: null,
        calculationId: 0
      },
      listQuery: {
        page: 1,
        limit: 20
      },
      activeTabName: 'proje',
      contractList: null,
      dialogVisible: false,
      busy: true,
      delay: 1000,
      visible: false,
      count: 0,
      product: 0,
      tabPosition: 'left',
      customer: 0,
      buttonVisible: false
    }
  },
  computed: {
    getSaveButtonName() {
      return this.$t('crm.common.save')
    }
  },

  created() {
    this.calculation = this.calculationId
    this.getContractById(this.calculation)
    this.product = this.productId
    this.customer = this.customerGuid
    // this.getButtonVisible(this.productId)
    // this.getAllValues()
  },
  methods: {
   // hasActionPermission,
    getAllValues() {
      this.busy = true
      partnerApi.getContractList()
        .then((v) => {
          this.contractList = v.data
          console.log('contractList', v)
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
    getContractById(id) {
      this.busy = true
      partnerApi.getContractById(id)
        .then((v) => {
          this.contractList = v.data
          console.log('this.contractList: ', this.contractList)
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
    update(id) {
      this.busy = true
      partnerApi.update(id)
        .then(() => {
          this.$emit('statusUpdated')
        // this.busy = false
        // this.getById(id)
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
    printDocument(content) {
      const d = new Printd()
      var parser = new DOMParser()
      var doc = parser.parseFromString(content, 'text/html')
      console.log('doc: ', doc)
      d.print(doc.documentElement, [this.cssText])
    },
    handler: function(id, content) {
      this.printDocument(content)
      this.update(id)
    },
    handleSizeChange(val) {
      this.listQuery.limit = val
      this.getAllValues()
    },
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.getAllValues()
    }
  }
}

</script>
<style lang="scss" scoped>
.contract-product-card ::v-deep(.delivery) {

}
.itemlabel{
  width:100%;
  height: 36px;
  line-height: 36px;
}
</style>
