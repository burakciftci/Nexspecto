<template>
  <div v-loading="busy">
    <el-row>
      <el-table :data="list" style="width: 100%">
        <el-table-column prop="deliveryDateString" label="Teslimat Tarihi"/>
        <el-table-column label="Miktar">
          <template v-slot="scope">
            {{ $filters.formatTRY(scope.row.amount) }}
          </template>
        </el-table-column>
        <el-table-column label="Onay Durumu">
          <template v-slot="scope">
            <el-tag >
              {{ scope.row.productDeliveryPlanStatusName }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="Kayıt Durumu">
          <template v-slot="scope">
            <el-tag type="info">
              {{ scope.row.recordStatusName }}
            </el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
    <el-row type="flex" justify="end" style="margin-top:5px;">
      <el-col :span="4">
        <el-select v-model="isActive" @change="getProductDeliveryPlanByIdAsync">
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
import { MoneyFormats } from '@/utils/globalVars'
import { Money } from 'v-money'

export default{
  name: 'ProductDeliveryPlan',
  components: {
    Money
  },
  props: {
    productId: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      MoneyFormats,
      list: [],
      lockedDays: [],
      busy: false,
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
    await this.getProductDeliveryPlanByIdAsync()
  },
  methods: {
    async getProductDeliveryPlanByIdAsync() {
      this.busy = true

      const { data } = await partnerApi.getProductDeliveryPlanByIdAsync(this.productId, this.isActive)

      this.list = data

      this.busy = false
    }
  }
}

</script>
