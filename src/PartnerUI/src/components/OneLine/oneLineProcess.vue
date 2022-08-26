<template>
  <div class="oneLine">
    <template v-if="!busy">
      <el-row>
        <el-col :span="10">
          <el-popover
            width="100%"
            trigger="hover">
            <template #reference>
              <el-row>
                <el-col :span="8">
                  <span style="position:relative;top:6px;">{{ processDetails.ownerUserCode }}</span>
                </el-col>
                <el-col :span="15">
                  <span style="position:relative;top:6px;"> {{ processDetails.templateCodeTitle }}</span>
                </el-col>
              </el-row>
            </template>
            <el-card>
              <span><strong class="boldGray">{{ 'Süreç Adı: ' }}</strong>{{ processDetails.processTitle }}</span>
              <br>
              <span><strong class="boldGray">{{ 'Son Tamamlanma Tarihi: ' }}</strong>{{
                  processDetails.deadline
                }}</span>
              <br>
              <span><strong class="boldGray">{{ 'Şablon Başlığı: ' }}</strong>{{ processDetails.templateTitle }}</span>
            </el-card>
          </el-popover>
        </el-col>
        <el-col :span="1">
          <router-link :to="{ path: '/bpm/process/'+ processId }">
            <el-tooltip :content="$t('tasklist.info')" class="item" effect="light" placement="top-start">
              <el-button class="icon-button">
                <svg-icon icon-class="sale"/>
              </el-button>
            </el-tooltip>
          </router-link>
        </el-col>
      </el-row>
    </template>

  </div>
</template>
<script>

import processApi from '@/api/bpm/process'

export default {
  props: {
    processId: {
      type: Number,
      default: 4
    },
    userId: {
      type: String,
      default: '4f6da564-fbf9-4c3e-932e-0c6c23100543'
    }
  },
  data() {
    return {
      busy: false,
      customer: [],
      delay: 1000,
      processDetails: {},
      taskDetails: {}
    }
  },
  created() {
    this.getProcess()
  },
  methods: {
    routePersonDetails() {
      this.$router.push({name: 'personEdit', params: {partyId: this.partyId}})
    },
    getProcess() {
      processApi.getProcessSummary(this.userId, this.processId)
        .then((v) => {
          this.processDetails = v.data
        })
    },
    routeProcessDetails() {

    }
  }
}

</script>
<style scoped>
.oneLine {
  padding: 10px 20px;
  width: 100%;
  background: linear-gradient(to bottom right, #f5f5f5, #ffffff);
  border-radius: 5px;
  border: 1px solid #f5f5f5;
}
</style>
