<template>
  <div>
    <el-row type="flex" justify="start">
      <el-col>
        <el-tag v-if="hasUnfinishedTakbisProcess" type = "info" class = "info">{{ $t('guarantee.message.activeTakbis') }}</el-tag>
      </el-col>
    </el-row>
    <div>
      <el-row>
        <el-table :data="guaranteeList" :v-loading="busy">
          <el-table-column :label="$t('guarantee.guaranteeName')" align="center" width="120px">
            <template v-slot="scope">
              {{ scope.row.realEstateTypeDesc }}
            </template>
          </el-table-column>
          <el-table-column :label="$t('guarantee.createDateL')" align="center" width="160px">
            <template v-slot="scope">
              {{  $filters.parseTime(scope.row.createDate, '{d}.{m}.{y}') }}
            </template>
          </el-table-column>
          <el-table-column :label="$t('guarantee.city')" align="center" prop="city" />
          <el-table-column :label="$t('guarantee.district')" align="center" prop="district" />
          <el-table-column :label="$t('guarantee.blockplot')" align="center" width="120px">
            <template v-slot="scope">
              {{ scope.row.block }} {{ '-' }} {{ scope.row.plot }}
            </template>
          </el-table-column>
          <el-table-column :label="$t('guarantee.creatorUser')" align="center" prop="creatorUser" width="160px"/>
          <el-table-column :label="$t('guarantee.approvalStatusL')" align="center" prop="approvalStatusDesc" width="150px"/>
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
    const telephoneValidator = (rule, telephoneNumber, callback) => {
      var firstTwoChars = telephoneNumber.substring(0, 1) === '0'
      var hasValidLength = telephoneNumber.length === 11
      if (firstTwoChars && hasValidLength) {
        callback()
      } else {
        callback(new Error(''))
      }
    }
    return {
      MoneyFormats,
      hasTakbisRecords: false,
      currentCalculationId: this.$route.params.calculationId,
      hasUnfinishedProcess: false,
      hasUnfinishedTakbisProcess: false,
      canAddGuarantee: true,
      realEstateGuaranteeModel: {
        productId: this.productId,
        calculationId: this.$route.params.calculationId,
       // customerId: this.$store.getters.customer.partyId,
        guaranteeId: 0,
        boxKeeperCommunicationDetails: '',
        boxKeeperName: '',
        realEstateType: 2
      },
      listQuery: {
        guaranteeId: 0,
        productId: 0,
        calculationId: 0,
        realEstateType: 0,
        projectCode: '',
        realEstateId: 0
      },
      annotationModel: {
        guaranteeId: 0,
        productId: this.productId,
        calculationId: this.$route.params.calculationId,
        guaranteeType: 4,
        customerGuid: this.customerGuid,
        projectCode: this.projectCode,
       // customerName: this.$store.getters.customer.partyName,
       // customerId: this.$store.getters.customer.partyId
      },
      guaranteeAddFormVisible: false,
      detailsVisible: false,
      busy: false,
      processHistory: [],
      guaranteeList: [],
      takbisList: [],
      validation: {
        boxKeeperName: [
          { required: true, message: this.$t('guarantee.message.requiredField', { title: this.$t('guarantee.carBrand') }) }
        ],
        realEstateType: [
          { required: true, message: this.$t('guarantee.message.requiredField', { title: this.$t('guarantee.realEstateType') }) }
        ],
        boxKeeperCommunicationDetails: [
          { required: true, message: this.$t('guarantee.message.requiredField', { title: this.$t('guarantee.boxKeeperCommunicationDetails') }) },
          { validator: telephoneValidator, message: this.$t('guarantee.message.telephoneValidatorMessage', { title: this.$t('guarantee.plateNumber') }) }
        ]
      }
    }
  },
  watch: {
    guaranteeList: function(newVal, oldVal) {
      if (oldVal > 0) {
        location.reload()
      }
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
      partnerApi.getRealEstateGuarantees(this.$route.params.calculationId)
        .then((v) => {
          if (v.data.success) this.guaranteeList = v.data.result
        })
        .catch((err) => {
          console.log(err)
          console.log('gayrimenkul listesi alınırken hata oluştu.')
        })
      this.busy = false
    }
  }
}
</script>

<style lang="scss" scoped>
.bigger-fonts {
  font-size: 20px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #00000c;
  display: block;
  font-weight: 600;
  margin-bottom: 1px;
}
.tag-1 {
  font-size: 40px;
  text-align: center;
  color: #00000c;
  display: block;
  font-weight: 600;
  margin-bottom: 40px;
}
.assessmentCompany {
  text-align: left;
  display: block;
  width: 77px;
  word-break: normal;
}
.buttonColumn{
  text-align: right;
}
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
