<template>
  <div>
    <div>
      <el-row>
        <el-table :data="guaranteeList" :v-loading="busy">
          <el-table-column :label="$t('guarantee.guaranteeName')" align="center" width="150px">
            <template v-slot="scope">
              {{ scope.row.vehicleTypeDesc }}
            </template>
          </el-table-column>
          <el-table-column :label="$t('guarantee.createDateL')" align="center" width="150px">
            <template v-slot="scope">
              {{ $filters.parseTime(scope.row.createDate, '{d}.{m}.{y}') }}
            </template>
          </el-table-column>
          <el-table-column :label="$t('guarantee.plateNumberL')" align="center" prop="plateNumber">
            <template v-slot="scope">
              {{ scope.row.plateNumber }}
            </template>
          </el-table-column>
          <el-table-column :label="$t('guarantee.creatorUser')" align="center" prop="creatorUser" width="150px"/>
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
    hasActiveProcess: {
      type: Boolean,
      default: false
    },
    customerGuid: {
      type: String,
      default: ''
    }
  },
  data() {
    const plateNumberValidator = (rule, plateNumber, callback) => {
      var firstCharIsLetter = isNaN(plateNumber.substring(0, 1))
      var secondCharIsLetter = isNaN(plateNumber.substring(1, 2))
      var thirdCharIsLetter = isNaN(plateNumber.substring(2, 3))
      var lastTwoCharsHasNumbers = !(isNaN(plateNumber.substring(plateNumber.length - 2)))
      var strLength = plateNumber.length
      var isSecondHand = this.vehicleConditionOption === 2
      var textIsOK = !!((!firstCharIsLetter && !secondCharIsLetter && lastTwoCharsHasNumbers && thirdCharIsLetter && strLength < 9))
      var everythingIsOk = false
      if (textIsOK && isSecondHand) {
        everythingIsOk = true
      }
      if (!isSecondHand) {
        everythingIsOk = true
      }

      if (everythingIsOk) {
        callback()
      } else {
        callback(new Error(''))
      }
    }
    const rangeInKMValidator = (rule, rangeInKm, callback) => {
      var isLessThanOne = rangeInKm < 1
      var isSecondHand = this.vehicleConditionOption === 2
      if (!(isLessThanOne && isSecondHand)) {
        callback()
      } else {
        callback(new Error(''))
      }
    }
    const carModelValidator = (rule, carModel, callback) => {
      if (!(this.vehicleConditionOption === 1 && carModel === '')) {
        callback()
      } else {
        callback(new Error(''))
      }
    }
    const brandValidator = (rule, carBrand, callback) => {
      if (!(this.vehicleConditionOption === 1 && carBrand === '')) {
        callback()
      } else {
        callback(new Error(''))
      }
    }
    return {
      MoneyFormats,
      processHistory: [],
      detailsVisible: false,
      hasUnfinishedProcess: false,
      hasMissingDetails: false,
      canAddGuarantee: true,
      vehicleGuaranteeModel: {
        productId: this.productId,
        calculationId: this.$route.params.calculationId,
      //  customerId: this.$store.getters.customer.partyId,
        brand: '',
        carModel: '',
        gearType: 0,
        vehicleType: 0,
        vehicleCondition: 0,
        rangeInKm: 0,
        plateNumber: ''
      },
      annotationModel: {
        guaranteeId: 0,
        productId: this.productId,
        calculationId: this.$route.params.calculationId,
        guaranteeType: 1,
        customerGuid: this.customerGuid,
        projectCode: this.projectCode,
      //  customerName: this.$store.getters.customer.partyName,
      //  customerId: this.$store.getters.customer.partyId
      },
      primaryFormVisible: false,
      updateFormVisible: false,
      busy: false,
      guaranteeList: [],
      validation: {
        carModel: [
          { required: this.carModelRequirement, message: this.$t('guarantee.message.requiredField', { title: this.$t('guarantee.carModel') }) },
          { validator: carModelValidator, message: this.$t('guarantee.message.enterValidModel', { title: this.$t('guarantee.carModel') }) }
        ],
        brand: [
          { required: this.brandRequirement, message: this.$t('guarantee.message.requiredField', { title: this.$t('guarantee.carBrand') }) },
          { validator: brandValidator, message: this.$t('guarantee.message.enterValidBrand', { title: this.$t('guarantee.carBrand') }) }
        ],
        gearType: [
          { required: false, message: this.$t('guarantee.message.requiredField', { title: this.$t('guarantee.gearType') }) }
        ],
        plateNumber: [
          { required: this.plateNumberRequirement, message: this.$t('guarantee.message.requiredField', { title: this.$t('guarantee.plateNumber') }) },
          { validator: plateNumberValidator, message: this.$t('guarantee.message.enterValidPlateNumber', { title: this.$t('guarantee.plateNumber') }) }
        ],
        rangeInKm: [
          { required: true, message: this.$t('guarantee.message.requiredField', { title: this.$t('guarantee.rangeInKm') }) },
          { validator: rangeInKMValidator, message: this.$t('guarantee.message.rangeInKmValidatorMessage', { title: this.$t('guarantee.plateNumber') }) }
        ],
        vehicleCondition: [
          { required: true, message: this.$t('guarantee.message.requiredField', { title: this.$t('guarantee.vehicleCondition') }) }
        ]
      }
    }
  },
  computed: {
    plateNumberRequirement: function implementValidationsForPlateNumber() {
      return this.vehicleGuaranteeModel.vehicleCondition === 2
    },
    brandRequirement: function implementValidationsForBrand() {
      return this.vehicleGuaranteeModel.vehicleCondition === 1
    },
    carModelRequirement: function implementValidationsForModel() {
      return this.vehicleGuaranteeModel.vehicleCondition === 1
    },
    vehicleConditionOption: function setVehicleCondition() {
      return this.vehicleGuaranteeModel.vehicleCondition
    }
  },
  created() {
    this.getGuaranteeList()
  },
  methods: {
    getGuaranteeList() {
      this.busy = true
      partnerApi.getVehicleGuarantees(this.$route.params.calculationId)
        .then((v) => {
          if (v.data.success) this.guaranteeList = v.data.result
        })
        .catch((err) => {
          console.log(err)
          console.log('listeyi getiremedim.')
        })
      this.busy = false
    }
  }
}
</script>

<style lang="scss" scoped>
.bigger-fonts {
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #00000c;
  display: block;
  font-weight: 300;
  margin-bottom: 1px;
}
.dialog {
  border-style: dotted;
  border-width: thick;
  color: #c00101;
}
.dialog2 {
  outline: 10px solid green;
}
.form-area {
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #00000c;
  display: block;
  font-weight: 300;
  margin-bottom: 3px;
  margin-left: 3px;
  margin-right: 3px;
  margin-top: 3px;
}
.form-area2 {
  display: block;
  font-weight: 300;
  margin-bottom: 3px;
  margin-left: 3px;
  margin-right: 3px;
  margin-top: 3px;
}
.tag-1 {
  font-size: 40px;
  text-align: center;
  color: #00000c;
  display: block;
  font-weight: 600;
  margin-bottom: 40px;
  word-break: break-all;
  overflow-wrap: break-word;
  white-space: normal;
  position: relative;
  width: 100%;
}
.tag-2 {
  font-size: 13px;
  border: 1px solid #b3d7ff;
  border-radius: 5px;
  text-align: center;
  background-color:#e6f2ff;
  color: #006be6;
  justify-content: center !important;
  display: block;
  // font-weight: 600;
  margin-bottom: 10px;
  // word-break: break-all;
  overflow-wrap: break-word;
  white-space: normal;
  position: relative;
  width: 100%;
}
</style>
