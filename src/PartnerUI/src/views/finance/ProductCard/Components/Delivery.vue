<template>
  <div class="delivery">
    <el-tabs :tab-position="tabPosition">
       <el-tab-pane label="Teminat Değerleme">
        <guarantee :key="randerKey" :product-id="productId" :calculation-id="calculationId" :project-code="projectCode" :customer-guid="customerGuid"/>
      </el-tab-pane>
      <el-tab-pane label="Gerçekleşen Ödemeler">
        <payment-information :product-id="productId" :key="randerKey" />
      </el-tab-pane>
      <el-tab-pane label="Ödeme Bilgileri">
        <temp-payment-information-v2
          :product-id="productId"
          :calculation-id="calculationId"
          :key="randerKey"
          :project-code="projectCode"
          :finance-amount="financeAmount"
        />
      </el-tab-pane>
      <el-tab-pane label="Hızlı Teslimat">
        <instant-delivery-base
          :product-id="productId"
          :calculation-id="calculationId"
          :key="randerKey"
          :customer-guid="customerGuid"
          :project-code="projectCode"
          :customer-name="customerName"
          :finance-amount="financeAmount"
        />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import Guarantee from "./Components/Guarantee.vue";
import PaymentInformation from "./Components/PaymentInformation.vue";
import TempPaymentInformationV2 from "./Components/TempPaymentInformationV2";
import InstantDeliveryBase from "./Components/InstantDeliveryBase";

export default {
  components: {
    guarantee: Guarantee,
    "payment-information": PaymentInformation,
    "instant-delivery-base": InstantDeliveryBase,
    "temp-payment-information-v2": TempPaymentInformationV2,
    InstantDeliveryBase,
  },
  props: {
    productId: {
      type: Number,
      default: null,
    },
    customerId: {
      type: Number,
      default: null,
    },
    customerGuid: {
      type: String,
      default: "",
    },
    productCode: {
      type: String,
      default: "",
    },
    projectCode: {
      type: String,
      default: "",
    },
    calculationId: {
      type: Number,
      default: 0,
    },
    remainAmount: {
      type: Number,
      default: 0,
    },
    financeAmount: {
      type: Number,
      default: 0,
    },
    proposalId: {
      type: Number,
      default: 0,
    },
    customerName: {
      type: String,
      default: "",
    },
    identificationNumber: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      tabPosition: "left",
      randerKey: 0,
    };
  },
  created() {},
  methods: {},
};
</script>

<style lang="scss" scoped>
label {
  text-align: left;
}
::v-deep(.delivery) {
  .el-collapse-item__wrap {
    padding: 0px !important;
    border: none !important;
  }
  .el-collapse-item__content {
    padding: 0px !important;
  }
  .el-collapse-item__header {
    height: 80px !important;
  }
  .el-collapse-item__content {
    .el-collapse-item__header {
      background: #fff !important;
      height: 60px !important;
    }
  }
  .el-collapse {
    border-radius: 4px;
    box-shadow: 0 10px 20px 0 rgba(0, 0, 0, 0.1);
    border: solid 1px #e5e5e5;
    .el-collapse {
      border: none;
      .el-collapse-item__header {
        border: none;
      }
    }
  }
  .el-collapse-item {
    border-radius: 4px;
    box-shadow: 0 10px 20px 0 rgba(0, 0, 0, 0.1);
    border: none;
  }
}
</style>
