<template>
  <div>
    <el-row v-if="deliveryInfo" type="flex" style="margin-bottom: 10px;">
      <el-tag v-if="deliveryInfo.isInAllocation" type="success">Dosya Tahsisat Birimindedir.</el-tag>
      <el-tag v-else>Dosya Tahsisat Biriminde Değildir.</el-tag>
      <el-col :span="0.5">
        &nbsp;
      </el-col>
      <el-tag v-if="deliveryInfo.planningDate" type="success">Planlama Tarihi: {{ new Date(deliveryInfo.planningDate).toLocaleDateString('tr-TR', { year: 'numeric', month: 'long' }) }} </el-tag>
      <el-tag v-else>Henüz Planlama Yapılmamıştır.</el-tag>
    </el-row>
    <div v-else>
      {{ 'Teslimata en az 1 ay kala süreç başlatabilirsiniz.' }}
    </div>
    <el-row>
      <el-table :data="list" fit highlight-current-row style="width: 100%;">
        <el-table-column label="Talep Tarihi" prop="fromDate" />
        <el-table-column label="Talep Tutarı">
          <template v-slot="scope">
            {{ $filters.formatTRY(scope.row.amount) }}
          </template>
        </el-table-column>
        <el-table-column label="Onaylanan Tutar">
          <template v-slot="scope">
            <span v-if="scope.row.approvedAmount">
              {{ $filters.formatTRY(scope.row.approvedAmount) }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="Onaylanan Tarih" prop="approvedDate"/>
        <el-table-column label="Açıklama" prop="description" />
        <el-table-column label="Durum">
          <template v-slot="scope">
            <el-tag type="blue">
              {{ scope.row.instantDeliveryStatus }}
            </el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
  </div>
</template>

<script>
import partnerApi from '@/api/finance/partner'
import { Money } from 'v-money'
import { MoneyFormats } from '@/utils/globalVars'

export default{
  components: {
    Money
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
      tagRulesList: null,
      busy: false,
      list: [],
      Money,
      MoneyFormats,
      dialogVisible: false,
      dialogInfoVisible: false,
      model: {
        productId: 0,
        customerGuid: '',
        code: '',
        customerName: '',
        deliveryAmount: null,
        description: ''
      },
      deliveryInfo: null,
      canStartProcess: true
    }
  },
  created() {
    this.getDeliveryInfo()
    this.model.deliveryAmount = this.financeAmount
  },
  async mounted() {
    await this.getInstantDeliveryListByProductId()
  },
  methods: {
    getDeliveryInfo() {
      this.busy = true
      partnerApi.getDeliveryInfo(this.productId)
        .then((v) => {
          this.deliveryInfo = v.data.result
        })
        .finally(() => {
          this.busy = false
        })
    },
    async getInstantDeliveryListByProductId() {
      this.busy = true

      const { data } = await partnerApi.getInstantDeliveryListByProductId(this.productId)

      this.list = data.list

      this.busy = false
    },
  }
}

</script>
