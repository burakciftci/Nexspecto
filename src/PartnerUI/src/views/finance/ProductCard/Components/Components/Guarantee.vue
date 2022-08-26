	<template>
  <div class="app-container">
    <el-tabs v-if="currentComponent=='vehicleGuarantee'" v-model="activeNameVehicle">
      <el-tab-pane :label="$t('guarantee.vehicleGuaranteeTab')" name="vehicleGuarantee">
        <keep-alive>
          <vehicle-guarantee :product-id="productId" :has-active-process="hasActiveProcess" :project-code="projectCode" :customer-guid="customerGuid" @checkProcess="setProcess" />
        </keep-alive>
      </el-tab-pane>
      <el-tab-pane :label="$t('guarantee.realEstateGuaranteeTab')" name="realEstateGuarantee">
        <keep-alive>
          <real-estate-guarantee :product-id="productId" :has-active-process="hasActiveProcess" :project-code="projectCode" :customer-guid="customerGuid" @checkProcess="setProcess"/>
        </keep-alive>
      </el-tab-pane>
      <el-tab-pane :label="$t('guarantee.agreementGuaranteeTab')" name="agreementGuarantee">
        <keep-alive>
          <agreement-guarantee :product-id="productId" :has-active-process="hasActiveProcess" :project-code="projectCode" :customer-guid="customerGuid" @checkProcess="setProcess"/>
        </keep-alive>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>

import vehicleGuarantee from './Valuation/vehicleGuarantee'
import realEstateGuarantee from './Valuation/realEstateGuarantee'
import agreementGuarantee from './Valuation/agreementGuarantee'

export default{
  name: 'Guarantee',
  components: {
    'vehicleGuarantee': vehicleGuarantee,
    'realEstateGuarantee': realEstateGuarantee,
    'agreementGuarantee': agreementGuarantee
  },
  props: {
    productId: {
      type: Number,
      default: null
    },
    projectCode: {
      type: String,
      default: null
    },
    customerGuid: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      busy: false,
      activeNameVehicle: 'vehicleGuarantee',
      currentComponent: 'vehicleGuarantee',
      hasActiveProcess: false
    }
  },
  watch: {
    model: {
      handler() {
      },
      deep: true
    }
  },
  methods: {
    setProcess(value) {
      this.hasActiveProcess = value
    }
  }
}
</script>
<style lang="scss" scoped>
</style>