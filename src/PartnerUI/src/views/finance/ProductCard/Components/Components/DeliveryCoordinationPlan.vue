<template>
  <div v-loading="busy">
    <el-row>
      <el-table :data="list" style="width: 100%">
        <el-table-column prop="createDate" label="Tarih" width="150px"/>
        <el-table-column prop="createUserName" label="Süreci Başlatan Kişi"/>
        <el-table-column prop="status" label="Sürecin Durumu"/>
        <el-table-column prop="requestDescription" label="Talep Eden Kişi Açıklaması"/>
        <el-table-column prop="assignedUserName" label="Atanan Kişi"/>
        <el-table-column prop="feedbackDescription" label="Geri Bildirim Açıklaması"/>
      </el-table>
    </el-row>
    <el-row type="flex" justify="end" style="margin-top:5px;">
      <el-col :span="4">
        <el-select v-model="isActive" @change="getDeliveryCoordinationInfoList">
          <el-option key="all" value="all" label="Tümü" />
          <el-option key="1" value="1" label="Aktif" />
          <el-option key="0" value="0" label="Pasif" />
        </el-select>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import partnerApi from '@/api/finance/partner'
import moment from 'moment'

export default{
  name: 'ProductDeliveryPlan',
  components: {
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
    customerName: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      list: [],
      lockedDays: [],
      busy: false,
      indices: [],
      deliveryDates: {
        exactDeliveryDate: null
      },
      model: {
        productId: this.productId,
        deliveryDate: null,
        amount: 0,
        productDeliveryPlanId: null,
        updatedDeliveryAmount: null
      },
      isActive: '1',
      dialogVisible: false,
      pickerOptions: {
        disabledDate: (time, locked = this.lockedDays) => {
          return moment(time).isSameOrAfter(moment().startOf('month').add(7, 'M')) || this.lockedDays.findIndex(i => new Date(Date.parse(i.lockedDay)).toUTCString() === new Date(time).toUTCString()) > -1
        }
      }
    }
  },
  async created() {
    await this.getDeliveryCoordinationInfoList()
  },
  methods: {
    async getDeliveryCoordinationInfoList() {
      this.busy = true

      const { data } = await partnerApi.getDeliveryCoordinationInfoList(this.productId)

      console.log('data', data)

      this.list = data

      this.busy = false 
    }
  }
}

</script>
