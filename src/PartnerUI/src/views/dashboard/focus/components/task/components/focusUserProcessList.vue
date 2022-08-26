<template>
  <div>
    <div class="focusUserProcessList">
      <perspective
        ref="perspectiveparty"
        :items="items"
        :count="count"
        :loading="busy"
        :options="option"
        :show-employee="false"
        :show-internal-organization="false"
        :internal-organization-list-type="internalOrganizationListType"
        :on-card="onCard"
        microservice = "kernel"
        search-description ="Lütfen arama yapınız!"
        :is-partner="true"
        @get-items="getAllCompletedProcess">
        <template v-slot:header/>
        <template v-slot:table-columns>
          <el-table-column :label="$t('processlist.processTitle')" width="300px">
            <template #default="scope">
              <span>{{ scope.row.templateTitle }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('processlist.process')">
            <template #default="scope">
              <span>{{ scope.row.processTitle }}</span>
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('processlist.progression')"
            width="100px">
            <template #default="scope"> {{ scope.row.completedTaskCount }}/{{ scope.row.totalTaskCount }}</template>
          </el-table-column>
          <el-table-column
            :label="$t('processlist.actions')"
            width="120px">
            <template #default="scope">
              <el-tooltip :open-delay="delay" :content="$t('tooltips.viewProcess')" class="item" effect="light" placement="top-start">
                <el-button type="action" class="table-button" plain @click="goToProcess(scope.row.processId)">Süreç <i class="fa-solid fa-arrow-right margin-left-12"></i></el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </template>
      </perspective>
    </div>
  </div>
</template>
<script>
import Sticky from '@/components/Sticky'
import processApi from '@/api/bpm/process'
//import chart from '@/components/Charts/chart'
import perspective from '@/components/Perspective'

export default {
  components: {
    Sticky,
    // chart,
    perspective
  },
  props: {
    internalOrganizationListType: {
      type: String,
      default: 'normal'
    },
    onCard: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: ''
    },
    id: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      busy: false,
      delay: 1000,
      option: {
        showSearchText: true,
        showActive: false,
        showArchive: false,
        searchType: false,
        defaultDayFilter: '0',
        showPaging: true,
        showAllDatesButton: false,
        showYesterdayButton: false,
        showTodayButton: false,
      },
      showInternalOrganization: true,
      showEmployee: true,
      count: 0,
      items: []
    }
  },
  mounted() {
    if (this.onCard) {
      this.option.showSearchText = false
      this.option.searchType = false
      this.option.defaultDayFilter = '0'
      this.showEmployee = false
      this.showInternalOrganization = false
      this.option.showYesterdayButton = false
      this.option.showTodayButton = false
      this.option.showAllDatesButton = false
      this.option.showDatePicker = false
      this.option.showActive = false
      this.option.showArchive = false
    }
  },
  methods: {
    handleSizeChange(val) {
      this.listQuery.limit = val
      this.getAllCompletedProcess()
    },
    handleCheckBox() {
      this.getAllCompletedProcess()
    },
    goToProcess(processId) {
      this.$router.push({ name: 'Process', params: { id: processId }})
    },
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.getAllCompletedProcess()
    },
    getAllCompletedProcess(listQuery) {
      this.busy = true
      var api = this.onCard ? processApi.getDoneProcess(this.$store.state.user.sub, this.id, this.type, this.searchWithType) : processApi.getItems(listQuery)
      api
        .then((v) => { this.items = v.data.data; this.count = v.data.count; this.busy = false })
        .catch(() => { this.errorMessage = this.$t('processlist.errorMessage'); this.busy = false })
    }
  }
}
</script>
<style lang="scss" scoped>
:deep(.focusUserProcessList) {
  .el-table--striped .el-table__body tr.el-table__row--striped td {
    background: transparent !important; }
}
</style>
