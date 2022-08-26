<template>
  <div class="oneLine">
    <template v-if="!busy">
      <el-row>
        <div>
          <el-popover
            width="100%"
            trigger="hover">
            <template #reference>
              <el-row>
                <div class="name">
                  <div v-if="customer.name" :data-letters="customer.name.charAt(0)" style="white-space: nowrap;margin:0;" />
                  <div>
                    <div>{{ customer.name }}</div>
                    <div>{{ model.projectNumber }}</div>
                  </div>
                </div>
              </el-row>
            </template>
            <el-card>
              <span><strong class="boldGray">{{ 'Finansman Tutarı: ' }}</strong>  {{ model.financeAmount }}</span>
              <br>
              <span><strong class="boldGray">{{
                  'Çalışma Bedeli Tutarı: '
                }}</strong>{{ $filters.formatTRY(model.financeCost) }}</span>
              <br>
              <span v-if="model.workingCostAdwancePayment > 0"><strong class="boldGray">{{
                  'Çalışma Bedeli Peşinatı: '
                }}</strong>{{ $filters.formatTRY(model.workingCostAdwancePayment) }}</span>
              <br>
              <span><strong class="boldGray">{{ 'Peşinat Miktarı: ' }}</strong>{{
                  $filters.formatTRY(model.advanceAmount)
                }}</span>
              <br>
              <span><strong class="boldGray">{{ 'Ödenen Miktar: ' }}</strong>{{
                  $filters.formatTRY((parseInt(model.financeAmount) + parseInt(model.financeCost)) - parseInt(model.totalUnpaidAmount))
                }}</span>
              <br>
              <span><strong class="boldGray">{{ 'Finansman Türü: ' }}</strong>{{ model.financeType }}</span>
              <br>
              <span><strong class="boldGray">{{ 'Toplam Taksit: ' }}</strong>{{ model.totalTerm }}</span>
              <br>
              <span><strong class="boldGray">{{ 'Müşteri Numarası: ' }}</strong>{{ customer.customerId }}</span>
              <br>
              <span><strong class="boldGray">{{ 'Grubu: ' }}</strong>{{ model.productCode }}</span>
              <br>
              <span><strong class="boldGray">{{ 'Versiyon: ' }}</strong>{{ model.versionName }}</span>
              <br>
              <span><strong class="boldGray">{{ 'Tasarruf Planı Durumu: ' }}</strong>{{ model.productStatus }}</span>
              <br>
              <span><strong class="boldGray">{{ 'Peşinat Avantajı: ' }}</strong>{{ model.installmentAdvantage }}</span>
              <br>
            </el-card>
          </el-popover>
        </div>
      </el-row>
      <div v-if="hasActionPermissionNew($store.getters.permissions, 'swchProductDetailsforTasks')" class="icon-position">
        <el-tooltip :open-delay="delay" content="Ürün detaylarını görmek için tıklayınız" class="item" effect="light" placement="top-start">
          <el-button class="icon-button" @click="routeProjectDetails"><svg-icon icon-class="online-product" style="width:42px !important;height:42px !important;"/></el-button>
        </el-tooltip>
      </div>
    </template>

  </div>
</template>
<script>

import productApi from '@/api/finance/product'
import oneLineDocument from '@/components/OneLine/oneLineDocument'
import {hasActionPermission, hasActionPermissionNew} from "@/actionPermission";

export default {
  components: {
    oneLineDocument
  },
  props: {
    productId: {
      type: Number,
      default: 31
    },
    partyId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      busy: false,
      sumPayed: 0,
      model: [],
      delay: 1000,
      customer: [],
      calculationId: 0,
      dialogVisible: false
    }
  },
  created() {
    productApi.getCalculationId(this.productId)
      .then((v) => {
        this.calculationId = v.data.result
        this.getFields()
        this.getCustomer()
      })
      .catch((err) => {
        this.$message({ type: 'info', message: err })
      })
  },
  methods: {
    hasActionPermissionNew,
    routeProjectDetails() {
      this.$router.push({ name: 'ProductCard', params: { calculationId: this.calculationId }})
    },
    getFields() {
      this.busy = true
      productApi.getProductCardList(this.calculationId)
        .then((v) => {
          this.model = v.data
          this.renderKey++ // to do uncessary rerender of childs needs to be optimized
          if (this.model.maturityTerm === 0) this.model.maturityTerm = this.model.totalTerm
          if (this.model.maturityTerm < this.model.totalTerm + this.model.additionalTerm) {
            var total = this.model.totalTerm
            this.totalPercentage = 24
            this.deliveryPercentage = Math.round(((this.model.deliveryDate + this.model.additionalTerm) / (total + this.model.additionalTerm)) * 24)
            this.installmentPercentage = Math.ceil((this.model.currentTerm / (this.model.deliveryDate + this.model.additionalTerm)) * 24)
            if (this.installmentPercentage === 0) { this.installmentPercentage = 1 }
          } else {
            this.totalPercentage = Math.round(((this.model.totalTerm + this.model.additionalTerm) / this.model.maturityTerm) * 24)
            this.deliveryPercentage = Math.round(((this.model.deliveryDate + this.model.additionalTerm) / (this.model.totalTerm + this.model.additionalTerm)) * 24)
            this.installmentPercentage = Math.ceil((this.model.currentTerm / (this.model.deliveryDate + this.model.additionalTerm)) * 24)
          }
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
    getCustomer() {
      this.busy = true
      productApi.getCustomer(this.calculationId)
        .then((v) => {
          this.customer = v.data
          this.customerId = this.customer.customerId
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
    }
  }
}

</script>
<style lang="scss" scoped>
.icon-position {
  position: absolute;
  right: -21px;
  top: 50%;
  transform: translateY(-50%)
}
.icon-position2 {
  position: absolute;
  right: 30px;
  top: 50%;
  transform: translateY(-50%)
}
.oneLine {
  padding: 1px 2px;
  width: 100%;
  height: 60px;
  background: #ffffff;
  border-radius: 4px;
  border: solid 1px #e5e5e5;
  position: relative;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
[data-letters]:before {
  content:attr(data-letters);
  display:inline-block;
  font-size: 0.7em;
  font-weight: 100;
  width: 30px;
  height: 30px;
  line-height: 3em;
  text-align:center;
  border-radius:50%;
  background: #d8d8d8;
  vertical-align:middle;
  margin-right:1em;
  color:white;
  cursor: pointer;
  }

    .name {
      margin-left:5px;
      cursor:pointer;
      display: flex;
      align-items: center;
    div:last-child div:first-child {
      width:283px;
      white-space: pre-line;
      text-overflow: ellipsis;
      overflow: hidden !important;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }
    // span:last-child {
    //   display: inline-block;
    //   width: 250px;
    //   white-space: nowrap;
    //   overflow: hidden !important;
    //   text-overflow: ellipsis;
    // }
  }
  @media screen and (max-width: 1840px) and (min-width: 1776px) {
    .name {
     div:last-child div:first-child {
        width:235px !important;
      }
    }
  }
  @media screen and (max-width: 1775px) and (min-width: 1681px) {
    .name {
      div:last-child div:first-child {
        width:225px !important;
      }
    }
  }
  @media screen and (max-width: 1680px) and (min-width: 1545px) {
    .name {
      div:last-child div:first-child {
        width:180px !important;
      }
    }
  }
  @media screen and (max-width: 1544px) and (min-width: 1440px) {
    .name {
      div:last-child div:first-child {
        width:155px !important;
      }
    }
  }
  @media screen and (max-width: 1439px) and (min-width: 1280px) {
    .name {
      div:last-child div:first-child {
        width:155px !important;
        font-size: 12px !important;
      }
      div:last-child div:last-child {
        font-size: 12px !important;
      }
    }
    [data-letters]:before {
      margin-right: 0.3em !important;
    }
  }

  @media screen and (max-width: 1404px) and (min-width: 1280px) {
    .name {
      div:last-child div:first-child {
        width:115px !important;
        font-size: 12px !important;
      }
      div:last-child div:last-child {
        font-size: 12px !important;
      }
    }
    [data-letters]:before {
      margin-right: 0.3em !important;
    }
  }

</style>
