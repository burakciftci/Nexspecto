<template>
  <el-card>
    <div class="clearfix">
      <span>Görüşme Bilgileri</span>
    </div>
    <el-table :data="activities">
      <el-table-column prop="callDate" label="Arama Zamanı">
        <template v-slot="scope">
          {{ $filters.parseTime(scope.row.callDate, "{dd}.{mm}.{yyyy}") }}
        </template>
      </el-table-column>
      <el-table-column prop="phoneNumber" label="Telefon Numarası" />
      <el-table-column prop="callReason" label="Arama Nedeni" />
      <el-table-column prop="callState" label="Çağrı Sonucu" />
      <el-table-column prop="callType" label="Arama Yönü" />
      <el-table-column prop="endResult" label="Görüşme Sonucu" />
      <el-table-column prop="callRound" label="Tur Sayısı" />
      <el-table-column prop="callDuration" label="Görüşme Süresi">
        <template v-slot="scope">
          {{ scope.row.callDuration }}
        </template>
      </el-table-column>
      <el-table-column prop="representative" label="Müşteri Temsilcisi" />
      <el-table-column prop="plannedCallDate" label="Planlı Görüşme Tarihi">
        <template v-slot="scope">
          <span v-if="scope.row.plannedCallDate">{{
            $filters.parseTime(scope.row.plannedCallDate, "{dd}.{mm}.{yyyy}")
          }}</span>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script>
import callCenterApi from "@/api/crm/callCenter";
export default {
  name: "CallCenterActivities",
  props: {
    partyId: {
      type: Number,
      default: null,
    },
    phoneNumber: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      activities: [],
    };
  },
  async mounted() {
    try {
      const { data } = await callCenterApi.getCallCenterActivity(
        this.phoneNumber,
        this.partyId
      );
      this.activities = data;
    } catch (e) {
      console.log(e);
    }
  },
};
</script>

<style scoped>
</style>
