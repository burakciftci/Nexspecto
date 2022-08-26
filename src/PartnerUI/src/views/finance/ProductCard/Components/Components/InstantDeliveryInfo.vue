
<template>
  <div>
    <el-row>
      <el-table :data="list" fit highlight-current-row style="width: 100%;">
        <el-table-column label="Tarih" prop="createDate"/>
        <el-table-column label="Tür" prop="infoType"/>
        <el-table-column label="Mesaj" prop="senderMessage"/>
        <el-table-column label="Yanıt" prop="receiverMessage"/>
        <el-table-column label="Durum">
          <template v-slot="scope">
            <el-tag type="blue">
              {{ scope.row.infoStatus }}
            </el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
  </div>
</template>

<script>
import partnerApi from '@/api/finance/partner'

export default {
  name: 'InstantDeliveryInfo',
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
    }
  },
  data() {
    return {
      dialogInfoVisible: false,
      processType: 0,
      list: [],
      processTypes: null,
      model: {
        productId: null,
        customerId: null,
        customerName: null,
        instantDeliveryInfoType: null
      }
    }
  },

  async created() {
    await this.getInstantDeliveryInfoTypes()
    await this.getInstantDeliveryInfoList()
  },
  methods: {
    async getInstantDeliveryInfoTypes() {
      this.busy = true

      const { data } = await partnerApi.getInstantDeliveryInfoTypes()

      this.processTypes = data

      this.busy = false
    },
    async getInstantDeliveryInfoList() {
      this.busy = true

      const { data } = await partnerApi.getInstantDeliveryInfoList(this.productId)

      console.log('data', data)

      this.list = data

      this.busy = false
    }
  }
}

</script>
