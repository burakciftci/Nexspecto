<template>
  <div>
    <div>
      <el-tabs v-model="activeName">
        <el-tab-pane label="Tahsisat Gün Talebi" name="first">
          <keep-alive>
            <InstantDelivery :product-id="productId" :calculation-id="calculationId" :customer-guid="customerGuid" :project-code="projectCode" :customer-name="customerName" :finance-amount="financeAmount"/>
          </keep-alive>
        </el-tab-pane>
        <el-tab-pane label="Hızlı Teslimat Bilgilendirme" name="second">
          <keep-alive>
            <InstantDeliveryInfo :product-id="productId" :calculation-id="calculationId" :customer-guid="customerGuid" :project-code="projectCode" :customer-name="customerName"/>
          </keep-alive>
        </el-tab-pane>
        <el-tab-pane label="Teslimat Planı" name="third">
          <keep-alive>
            <ProductDeliveryPlan :key="activeName" :product-id="productId"/>
          </keep-alive>
        </el-tab-pane>
        <el-tab-pane label="Tahsisat Kordinasyon Bilgilendirme" name="fourth">
          <keep-alive>
            <DeliveryCoordinationPlan :key="activeName" :product-id="productId" :customer-guid="customerGuid" :customer-name="customerName"/>
          </keep-alive>
        </el-tab-pane>  
      </el-tabs>
    </div>
  </div>
</template>

<script>

import InstantDelivery from './InstantDelivery'
import InstantDeliveryInfo from './InstantDeliveryInfo'
import ProductDeliveryPlan from './ProductDeliveryPlan'
import DeliveryCoordinationPlan from './DeliveryCoordinationPlan.vue'

export default {
  name: 'InstantDeliveryBase',
  components: {
    InstantDelivery,
    InstantDeliveryInfo,
    ProductDeliveryPlan,
    DeliveryCoordinationPlan
  },
  props: {
    productId: {
      type: Number,
      default: 0
    },
    customerGuid: {
      type: String,
      default: ''
    },
    projectCode: {
      type: String,
      default: ''
    },
    customerName: {
      type: String,
      default: ''
    },
    calculationId: {
      type: Number,
      default: 0
    },
    financeAmount: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      activeName: 'first'
    }
  },
  methods: {
    handleClick(tab, event) {
      this.activeName = tab.name
    }
  }
}
</script>

<style lang="scss" scoped>
.itemlabel{
  width:100%;
  height: 36px;
  line-height: 36px;
}
.scrollArea {
  overflow-y: auto;
  height: 680px;
  &::-webkit-scrollbar {
    width: 5px;
    height:80%;
  }

  &::-webkit-scrollbar-track {
    box-shadow: inset 0 0 5px grey;
    border-radius: 10px;
  }

  &::-webkit-scrollbar-thumb {
    background: #C84243;
    border-radius: 10px;

  }

  &::-webkit-scrollbar-thumb:hover {
    background: #b30000;
  }
}
@media screen and (max-height: 900px) {
  .scrollArea {
    height: 633px !important;
  }
}
@media screen and (max-height: 768px) {
  .scrollArea {
    height: 494px !important;
  }
}
@media screen and (max-height: 680px) {
  .scrollArea {
    height: 430px !important;
  }
}
</style>

