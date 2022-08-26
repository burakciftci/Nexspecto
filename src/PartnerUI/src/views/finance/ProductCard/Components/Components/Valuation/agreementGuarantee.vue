<template>
  <div>
    <div>
      <el-row>
        <el-table :data="guaranteeList" :v-loading="busy">
          <el-table-column :label="$t('guarantee.guaranteeName')" align="center">
            <template v-slot="scope">
              {{ scope.row.agreementTypeDesc }}
            </template>
          </el-table-column>
          <el-table-column :label="$t('guarantee.createDateL')" align="center">
            <template v-slot="scope">
              {{ $filters.parseTime(scope.row.createDate, '{d}.{m}.{y}') }}
            </template>
          </el-table-column>
          <el-table-column :label="$t('guarantee.agreementAmount')" align="center">
            <template v-slot="scope">
              {{ scope.row.agreementAmount === null || scope.row.agreementAmount === 0 ? '': scope.row.agreementAmount }}
            </template>
          </el-table-column>
          <el-table-column :label="$t('guarantee.creatorUser')" align="center" prop="creatorUser"/>
          <el-table-column :label="$t('guarantee.approvalStatusL')" align="center" prop="approvalStatusDesc"/>
        </el-table>
      </el-row>
    </div>
  </div>
</template>

<script>
import { MoneyFormats } from '@/utils/globalVars'
import { Money } from 'v-money'
import partnerApi from '@/api/finance/partner'

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
    customerGuid: {
      type: String,
      default: ''
    },
    hasActiveProcess: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      MoneyFormats,
      isCurrentProjectBirTep: false,
      hasUnfinishedProcess: false,
      canAddGuarantee: true,
      agreementGuaranteeModel: {
        productId: this.productId,
        calculationId: this.$route.params.calculationId,
        //customerId: this.$store.getters.customer.partyId,
        agreementType: 6
      },
      listQuery: {
        guaranteeId: 0,
        productId: 0,
        calculationId: 0,
        agreementType: 6,
        projectCode: ''
      },
      annotationModel: {
        guaranteeId: 0,
        productId: this.productId,
        calculationId: this.$route.params.calculationId,
        guaranteeType: 6,
        customerGuid: this.customerGuid,
        projectCode: this.projectCode,
        //customerName: this.$store.getters.customer.partyName,
      //  customerId: this.$store.getters.customer.partyId
      },
      busy: false,
      guaranteeList: []
    }
  },
  created() {
    this.getGuaranteeList()

  },
  updated() {
  },
  methods: {
    getGuaranteeList() {
      this.busy = true
      partnerApi.getAgreementGuarantees(this.$route.params.calculationId)
        .then((v) => {
          if (v.data.success) this.guaranteeList = v.data.result
        })
        .catch((err) => {
          console.log(err)
          console.log('listeyi getiremedim.')
        })
      this.busy = false
    },
  }
}
</script>

<style lang="scss" scoped>
.tag-2 {
  font-size: 13px;
  border: 1px solid #b3d7ff;
  border-radius: 5px;
  text-align: center;
  background-color:#e6f2ff;
  color: #006be6;
  display: block;
  margin-bottom: 10px;
  justify-content: center !important;
  overflow-wrap: break-word;
  white-space: normal;
  position: relative;
  width: 100%;
}
</style>
