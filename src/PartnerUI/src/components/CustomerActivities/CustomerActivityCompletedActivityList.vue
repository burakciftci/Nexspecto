<template>

  <div>
    <div>
      <customer-activity
        v-if="dialogActivity"
        :customer-id="activityCustomerId"
        :key="index"
        :finance-type="financeType"
        :focus="focus"
        :need-type="needType"
        :is-c-w ="isCW"
        :customer-activity-id="customerActivityId"
        :internal-organization-id="internalOrganizationId"
        :another-branch="anotherBranch"
        :from-list="true"
        :is-completed="isCompleted"
        @closed="closeActivityDialog"
        @closedWithSave="closeActivityDialogWithSave"/>
      <el-row v-if="!focus" type="flex" justify="end" class="mb-25" style="margin-top:10px;">
        <!-- <el-button v-if="showOtherBranchActivity" type="action" icon="el-icon-edit-outline" @click="openNewOtherBranchActivityDialog()">
          {{ 'Farklı Şubeye Aktivite Oluştur' }}
        </el-button> -->
        <!-- <el-button type="action" icon="el-icon-edit-outline" @click="openNewActivityDialog()">
          {{ 'Aktivite Oluştur2' }}
        </el-button> -->
      </el-row>
      <perspective
        ref="perspectiveparty"
        :items="items"
        :count="count"
        :loading="busy"
        :options="option"
        :day-filter="'1'"
        :size="20"
        :show-employee="showEmployee"
        :show-internal-organization="showInternalOrganization"
        :internal-organization-list-type="internalOrganizationListType"
        :is-call-center-screen="true"
        microservice = "kernel"
        search-description ="Lütfen arama yapınız!"
        @get-items="getAllActivities">
        <template v-slot:header/>
        <template v-slot:table-columns>
          <!-- <el-table-column
            :label="$t('focus.activityDetail')"
            prop="activityDetailType">
            <template slot-scope="scope">
              <span v-i" class="bold">{{ scope.row.key }}</span>
              <span v-else>{{ scope.row.activityDetailType }}</span>
            </template>
          </el-table-column> -->
          <el-table-column label="Oluşturulma" style="text-align:center;">
            <el-table-column label="Oluşturan" prop="createdBy"/>
            <el-table-column label="Tarih" prop="createDate">
              <template v-slot="scope"> 
                {{ getDate(scope.row.createDate) }}

              </template>
            </el-table-column>

          </el-table-column>
          <el-table-column label="Atanma" style="text-align:center;">
            <el-table-column label="Atanan" prop="assignedTo"/>
            <el-table-column label="Tarih" prop="assignedDateTime">
              <template v-slot="scope"> 
                {{ getDate(scope.row.assignedDateTime) }}
              </template>
            </el-table-column>
            <el-table-column label="Saat">
              <template v-slot="scope"> 
                {{ getTime(scope.row.assignedDateTime) }}
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column label="Aktivite">
            <el-table-column
              v-if="haveCustomerId"
              :label="$t('crm.customerActivity.communicationType')"
              prop="communicationType">
              <template v-slot="scope"> 
                <el-tag v-if="scope.row.communicationType !== 'Telefon'">{{ scope.row.communicationType }}</el-tag>
                <el-tag v-else type="success">{{ scope.row.communicationType }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column
              v-else
              :label="$t('crm.customerActivity.communicationType')"
              :filters="communicationTypeFilter"
              prop="communicationType">
              <template v-slot="scope"> 
                <el-tag v-if="scope.row.communicationType !== 'Telefon'" type="danger">{{ scope.row.communicationType }}</el-tag>
                <el-tag v-else type="success">{{ scope.row.communicationType }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column
              v-if="haveCustomerId"
              :label="$t('crm.customerActivity.communicationPurpose')"
              prop="communicationPurpose"/>
            <el-table-column
              v-else
              :label="$t('crm.customerActivity.communicationPurpose')"
              :filters="communicationPurposeFilter"
              prop="communicationPurpose"/>
            <el-table-column
              :label="$t('crm.customerActivity.appointmentType')"
              prop="appointmentType"/>
            <el-table-column
              v-if="haveCustomerId"
              :label="$t('crm.customerActivity.customerRating')"
              prop="rating"/>
            <el-table-column
              v-else
              :label="$t('crm.customerActivity.customerRating')"
              :filters="customerRatingFilter"
              prop="rating"/>
            <el-table-column
              :label="$t('crm.customerActivity.customerActivityStatus')"
              :filters="communicationStatusTypeFilter"
              prop="communicationStatusType"/>
          </el-table-column>
          <el-table-column label="Müşteri">
            <el-table-column
              :label="$t('crm.customerActivity.customerName')"
              prop="customerName"/>
            <el-table-column
              :label="$t('crm.customerActivity.customerId')"
              prop="customerId"/>
            <el-table-column
              :label="$t('crm.customerActivity.phone')"
              width="120px"
              prop="customerPhoneNumber">
              <template v-slot="scope"> 
                <div style="justify-content:space-between;display:flex;align-items:center;">
                  <el-popover trigger="hover" placement="top">
                    <div>Telefon: {{ getUncensoredTelecomeNumber(scope.row) }}</div>
                    <div slot="reference">
                      <div>{{ getTelecomeNumber(scope.row) }}</div>
                    </div>
                  </el-popover>
                  <el-tooltip :open-delay="1" content="Kopyala" class="item" effect="dark" placement="top-start">
                    <el-button v-clipboard:copy="getUncensoredTelecomeNumber(scope.row)" class="icon-button" style="width:30px !important;height:30px !important;" >
                      <svg-icon style="width:20px!important;height:20px!important;margin:0 !important;" icon-class="copy" />
                    </el-button>
                  </el-tooltip>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              v-if="haveCustomerId"
              :label="$t('crm.customerActivity.customerStage')"
              prop="customerStage">
              <template v-slot="scope"> 
                <el-tag type="success">{{ scope.row.customerStage }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column
              v-else
              :label="$t('crm.customerActivity.customerStage')"
              :filters="customerStageFilter"
              prop="customerStage">
              <template v-slot="scope"> 
                <el-tag type="success">{{ scope.row.customerStage }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('crm.customerActivity.financeType')"
              prop="financeType"/>
          </el-table-column>
          <el-table-column label="Tamamlanma">
            <el-table-column :label="$t('crm.customerActivity.completedBy')" prop="completedBy"/>
            <el-table-column :label="$t('crm.customerActivity.completeDate')">
              <template v-slot="scope"> 
                {{ getDate(scope.row.completeDate) }}
              </template>
            </el-table-column>
            <el-table-column v-if="haveCustomerId" :label="$t('activity.activityResult')" prop="communicationResult" >
              <template v-slot="scope"> 
                {{ scope.row.communicationResult }}
              </template>
            </el-table-column>
            <el-table-column v-else :label="$t('activity.activityResult')" :filters="communicationResultFilter" prop="communicationResult" >
              <template v-slot="scope"> 
                {{ scope.row.communicationResult }}
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column
            :label="$t('processlist.actions')">
           <template v-slot="scope"> 
              <el-button-group>
                <el-tooltip :open-delay="delay" :content="$t('focus.viewDetails')" class="item" effect="light" placement="top-start">
                  <el-popover
                    placement="left"
                    width="1000"
                    trigger="click"
                    @hide="selectedPartyId = 0"
                    @after-leave="selectedPartyId = 0">
                    <el-button
                      slot="reference"
                      class="icon-button"
                      style="vertical-align:text-top;"
                      @click="selectedPartyId = scope.row.customerId"
                    >
                      <svg-icon icon-class="view-icon"/>
                    </el-button>
                    <lifecycle v-if="selectedPartyId === scope.row.customerId" :party-id="scope.row.customerId" :show-new-button="false" />
                  </el-popover>
                </el-tooltip>
              </el-button-group>
              <el-button-group>
                <el-tooltip :open-delay="delay" :content="$t('focus.goToProcess')" class="item" effect="light" placement="top-start">
                  <el-button v-if="scope.row.processId !== null" class="icon-button" @click="openActivityDialog(scope.row)">
                    <svg-icon icon-class="sale" />
                  </el-button>
                </el-tooltip>
                <el-tooltip :delay="delay" :content="$t('focus.goToCustomer')" class="item" effect="light" placement="top-start">
                  <el-button v-if="(scope.row.customerId !== null && (!haveCustomerId || isCW))" class="icon-button" @click="routePersonDetails(scope.row.customerId)">
                    <svg-icon icon-class="profile-icon"/>
                  </el-button>
                </el-tooltip>
              </el-button-group>
            </template>
          </el-table-column>
        </template>
      </perspective>
    </div>

  </div>
</template>
<script>
import customerActivityApi from '@/api/crm/customerActivity'
import perspective from '@/components/Perspective/index.vue'
import lifecycle from './CustomerLifeCycle.vue'
import CustomerActivity from './CustomerActivityCreateComplete.vue'

export default {
  components: {
    perspective,
    lifecycle,
    CustomerActivity
  },
  props: {
    internalOrganizationListType: {
      type: String,
      default: 'normal'
    },
    customerId: {
      type: Number,
      default: null
    },
    haveCustomerId: {
      type: Boolean,
      default: false
    },
    focus: {
      type: Boolean,
      default: false
    },
    internalOrganizationId: {
      type: String,
      default: ''
    },
    financeType: {
      type: String,
      default: ''
    },
    needType: {
      type: String,
      default: ''
    },
    isCW: {
      type: Boolean,
      default: false
    },
    showButton: {
      type: Boolean,
      default: false
    },
    showOtherBranchActivity: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      busy: false,
      isHidden: false,
      delay: 1500,
      selectedPartyId: 0,
      dialogActivity: false,
      index: 0,
      showInternalOrganization: true,
      showEmployee: true,
      customerActivityId: 0,
      communicationTypeFilter: [],
      communicationPurposeFilter: [],
      customerRatingFilter: [],
      customerStageFilter: [],
      communicationResultFilter: [],
      listQuery: null,
      appointmentTypeFilter: [],
      communicationStatusTypeFilter: [],
      isCompleted: true,
      anotherBranch: false,
      option: {
        showSearchText: true,
        showActive: false,
        showArchive: false,
        searchType: false,
        defaultDayFilter: '1',
        pageSizes: [20, 30, 50, 75],
        mode: 'table'
      },
      count: 0,
      items: []
    }
  },
  mounted() {
    if (this.haveCustomerId) {
      this.option = {
        showSearchText: false,
        showActive: false,
        showArchive: false,
        searchType: false,
        defaultDayFilter: '1',
        showYesterdayButton: false,
        showPastButton: false,
        pageSizes: [50, 100, 150, 200],
        mode: 'table',
        showTodayButton: false,
        showDatePicker: false,
        showAllDatesButton: false
      }
      this.showInternalOrganization = false
      this.showEmployee = false
    }
  },
  methods: {
    handleSizeChange(val) {
      this.listQuery.limit = val
      this.getAllActivities()
    },
    handleCheckBox() {
      this.getAllActivities()
    },
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.getAllActivities()
    },
    routePersonDetails(customerId) {
      this.$router.push({ name: 'personEdit', params: { partyId: customerId }})
    },
    getDate(date) {
      var d = date === null ? '' : new Date(date)
      return d === '' ? '' : (d.toLocaleDateString('tr-TR') === '31.12.1899' ? '' : d.toLocaleDateString('tr-TR'))
    },
    getTime(date) {
      var d = date === null ? '' : new Date(date)
      return (d.toLocaleTimeString('tr-TR') === '00:00:00' ? 'Seçilmedi' : d.toLocaleTimeString('tr-TR'))
    },
    getAllActivities(listQuery) {
      this.listQuery = listQuery
      this.busy = true
      listQuery.isCompleted = this.isCompleted
      listQuery.haveCustomerId = this.haveCustomerId
      listQuery.customerId = this.customerId
      this.getFilterValues()
      customerActivityApi
        .getActivities(listQuery)
        .then((v) => {
          this.items = v.data.data
          this.count = v.data.count
          this.busy = false
        })
        .catch(() => {
          this.errorMessage = this.$t('processlist.errorMessage')
          this.busy = false
        })
    },
    openActivityDialog(row) {
      this.index++
      this.activityCustomerId = row.customerId
      this.customerActivityId = row.customerActivityId
      this.dialogActivity = true
    },
    closeActivityDialog() {
      console.log('*****WithoutSave*****')
      this.dialogActivity = false
      this.index++
      this.activityCustomerId = 0
      this.anotherBranch = false
    },
    closeActivityDialogWithSave() {
      console.log('*****Save*****')
      this.dialogActivity = false
      this.index++
      this.activityCustomerId = 0
      this.anotherBranch = false
      this.getAllActivities(this.listQuery)
    },
    openNewActivityDialog() {
      this.index++
      this.dialogActivity = true
      this.customerActivityId = 0
      this.activityCustomerId = this.customerId
    },
    openNewOtherBranchActivityDialog() {
      this.index++
      this.dialogActivity = true
      this.customerActivityId = 0
      this.activityCustomerId = this.customerId
      this.anotherBranch = true
    },
    getFilterValues() {
      customerActivityApi.getDropdownValues()
        .then((v) => {
          this.communicationTypeFilter = v.data.communicationTypeList.map(i => { return { text: i.description, value: i.communicationTypeId } })
          this.customerRatingFilter = v.data.customerActivityRatingList.map(i => { return { text: i.label, value: i.value } })
          this.communicationPurposeFilter = v.data.communicationPurposeList.map(i => { return { text: i.description, value: i.communicationPurposeId } })
          this.customerStageFilter = v.data.customerStages.map(i => { return { text: i.label, value: i.value } })
          this.communicationResultFilter = v.data.communicationResultList.map(i => { return { text: i.description, value: i.communicationResultId } })
          this.communicationStatusTypeFilter = v.data.communicationStatusTypeList.filter(i => i.source !== 'Assigned').map(i => { return { text: i.label, value: i.value } })
        })
    },
    getTelecomeNumber(row) {
      return (!row.customerPhoneNumber || row.customerPhoneNumber.length < 10 || row.customerPhoneNumber.trim() === '' || row.customerPhoneNumber === '0') ? '' : ('*******' + row.customerPhoneNumber.substring(row.customerPhoneNumber.length - 4, row.customerPhoneNumber.length))
    },
    getUncensoredTelecomeNumber(row) {
      return ('0' + row.customerPhoneNumber)
    }
  }
}
</script>
<style scoped>
.bg-purple-light {
    background: #e5e9f2;
  }
  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }
  .bold {
    font-weight: 500;
    font-size: 18px;
  }
</style>
