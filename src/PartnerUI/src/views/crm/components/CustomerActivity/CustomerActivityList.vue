<template>
  <div>
    <div>
      <div>
        <customer-activity-create
          v-if="dialogActivity"
          :customer-id="activityCustomerId"
          :key="index"
          :finance-type="financeType"
          :focus="focus"
          :need-type="needType"
          :is-c-w="isCW"
          :customer-activity-id="customerActivityId"
          :internal-organization-id="internalOrganizationId"
          :another-branch="false"
          :from-list="true"
          @closed="closeActivityDialog"
          @closedWithSave="closeActivityDialogWithSave"
        />
      </div>
      <!-- <el-row
        v-if="!focus"
        type="flex"
        justify="end"
        class="mb-25"
        style="margin-top: 10px"
      >
        <el-button
          type="action"
          icon="el-icon-edit-outline"
          @click="openNewActivityDialog()"
        >
          {{ "Aktivite Oluştur" }}
        </el-button>
      </el-row> -->
      <el-row>
        <perspective
          ref="perspectiveparty"
          :items="items"
          :count="count"
          :loading="busy"
          :options="option"
          :size="20"
          :show-employee="showEmployee"
          :show-internal-organization="showInternalOrganization"
          :internal-organization-list-type="internalOrganizationListType"
          microservice="crm"
          search-description="Lütfen arama yapınız!"
          @get-items="getAllActivities"
        >
          <template v-slot:header />
          <template v-slot:table-columns>
            <el-table-column label="Oluşturulma" style="text-align: center">
              <el-table-column label="Oluşturan" prop="createdBy" />
              <el-table-column label="Tarih" prop="createDate" width="90px">
                <template v-slot="scope">
                  {{ getDate(scope.row.createDate) }}
                </template>
              </el-table-column>
            </el-table-column>
            <el-table-column label="Atanma" style="text-align: center">
              <el-table-column label="Atanan" prop="assignedTo" />
              <el-table-column
                v-if="haveCustomerId"
                label="Tarih"
                prop="assignedDateTime"
                width="90px"
              >
                <template v-slot="scope">
                  {{ getDate(scope.row.assignedDateTime) }}
                </template>
              </el-table-column>
              <el-table-column
                v-else
                label="Tarih"
                prop="assignedDateTime"
                width="90px"
                sortable
              >
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
            <el-table-column label="Aktivite" style="text-align: center">
              <el-table-column
                v-if="haveCustomerId"
                :label="$t('crm.customerActivity.communicationType')"
                width="120px"
                prop="communicationType"
              >
                <template v-slot="scope">
                  <el-tag v-if="scope.row.communicationType !== 'Telefon'">{{
                    scope.row.communicationType
                  }}</el-tag>
                  <el-tag v-else type="success">{{
                    scope.row.communicationType
                  }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column
                v-else
                :label="$t('crm.customerActivity.communicationType')"
                :filters="communicationTypeFilter"
                width="120px"
                prop="communicationType"
              >
                <template v-slot="scope">
                  <el-tag v-if="scope.row.communicationType !== 'Telefon'">{{
                    scope.row.communicationType
                  }}</el-tag>
                  <el-tag v-else type="success">{{
                    scope.row.communicationType
                  }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column
                v-if="haveCustomerId"
                :label="$t('crm.customerActivity.communicationPurpose')"
                prop="communicationPurpose"
              />
              <el-table-column
                v-else
                :label="$t('crm.customerActivity.communicationPurpose')"
                :filters="communicationPurposeFilter"
                prop="communicationPurpose"
              />
              <el-table-column
                :label="$t('crm.customerActivity.appointmentType')"
                prop="appointmentType"
              />
              <el-table-column
                v-if="type === 'ongoing'"
                :label="$t('crm.customerActivity.reminderNote')"
                width="120px"
                prop="reminderNote"
              >
                <template v-slot="scope">
                  <div
                    style="
                      justify-content: space-between;
                      display: flex;
                      align-items: center;
                    "
                  >
                    <el-popover trigger="hover" placement="top">
                      <div>{{ scope.row.reminderNote }}</div>
                      <div>{{ getReminderNote(scope.row) }}</div>
                    </el-popover>
                  </div>
                </template>
              </el-table-column>
              <template v-else>
                <el-table-column
                  v-if="haveCustomerId"
                  :label="$t('crm.customerActivity.customerRating')"
                  prop="rating"
                />
                <el-table-column
                  v-else
                  :label="$t('crm.customerActivity.customerRating')"
                  :filters="customerRatingFilter"
                  prop="rating"
                />
                <el-table-column
                  :label="$t('crm.customerActivity.customerActivityStatus')"
                  :filters="communicationStatusTypeFilter"
                  prop="communicationStatusType"
                />
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('focus.customer')"
              style="text-align: center"
            >
              <el-table-column
                :label="$t('crm.customerActivity.customerName')"
                prop="customerName"
              />
              <el-table-column
                :label="$t('crm.customerActivity.customerId')"
                width="80px"
                prop="customerId"
              />
              <el-table-column
                :label="$t('crm.customerActivity.phone')"
                width="120px"
                prop="customerPhoneNumber"
              >
                <template v-slot="scope">
                  <div
                    style="
                      justify-content: space-between;
                      display: block;
                      align-items: center;
                    "
                  >
                    <!-- <el-popover trigger="hover" placement="top">
                      <div>
                        Telefon: {{ getUncensoredTelecomeNumber(scope.row.customerPhoneNumber) }}
                      </div> -->
                    <div>
                      {{ getTelecomeNumber(scope.row.customerPhoneNumber) }}
                    </div>
                    <!-- </el-popover> -->
                    <el-tooltip
                      :open-delay="1"
                      content="Kopyala"
                      class="item"
                      effect="dark"
                      placement="top-start"
                    >
                      <el-button
                        v-clipboard:copy="
                          getUncensoredTelecomeNumber(
                            scope.row.customerPhoneNumber
                          )
                        "
                        class="icon-button"
                        style="width: 30px !important; height: 30px !important"
                      >
                        <svg-icon
                          style="
                            width: 20px !important;
                            height: 20px !important;
                            margin: 0 !important;
                          "
                          icon-class="copy"
                        />
                      </el-button>
                    </el-tooltip>
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                v-if="haveCustomerId"
                :label="$t('crm.customerActivity.customerStage')"
                prop="customerStage"
              >
                <template v-slot="scope">
                  <el-tag type="success">{{ scope.row.customerStage }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column
                v-else
                :label="$t('crm.customerActivity.customerStage')"
                :filters="customerStageFilter"
                prop="customerStage"
              >
                <template v-slot="scope">
                  <el-tag type="success">{{ scope.row.customerStage }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column
                :label="$t('crm.customerActivity.financeType')"
                prop="financeType"
              />
            </el-table-column>
            <el-table-column v-if="type === 'completed'" label="Tamamlanma">
              <el-table-column
                :label="$t('crm.customerActivity.completedBy')"
                prop="completedBy"
              />
              <el-table-column :label="$t('crm.customerActivity.completeDate')">
                <template v-slot="scope">
                  {{ getDate(scope.row.completeDate) }}
                </template>
              </el-table-column>
              <el-table-column
                v-if="haveCustomerId"
                :label="$t('activity.activityResult')"
                prop="communicationResult"
              >
                <template v-slot="scope">
                  {{ scope.row.communicationResult }}
                </template>
              </el-table-column>
              <el-table-column
                v-else
                :label="$t('activity.activityResult')"
                :filters="communicationResultFilter"
                prop="communicationResult"
              >
                <template v-slot="scope">
                  {{ scope.row.communicationResult }}
                </template>
              </el-table-column>
            </el-table-column>
            <el-table-column :label="$t('processlist.actions')" width="135px">
              <template v-slot="scope">
                <el-button-group>
                  <el-tooltip
                    :open-delay="delay"
                    :content="$t('focus.viewDetails')"
                    class="item"
                    effect="light"
                    placement="top-start"
                  >
                    <el-popover
                      placement="left"
                      width="1000"
                      trigger="click"
                      @hide="selectedPartyId = 0"
                      @after-leave="selectedPartyId = 0"
                    >
                      <template #reference>
                        <el-button
                          class="icon-button activities-icons"
                          style="vertical-align: text-top"
                          @click="selectedPartyId = scope.row.customerId"
                        >
                          <svg-icon icon-class="view-icon" />
                        </el-button>
                        <lifecycle
                          v-if="selectedPartyId === scope.row.customerId"
                          :party-id="scope.row.customerId"
                          :show-new-button="false"
                        />
                      </template>
                    </el-popover>
                  </el-tooltip>
                </el-button-group>
                <el-button-group>
                  <el-tooltip
                    :delay="delay"
                    :content="$t('focus.goToProcess')"
                    class="item"
                    effect="light"
                    placement="top-start"
                  >
                    <el-button
                      class="icon-button activities-icons"
                      @click="openActivityDialog(scope.row)"
                    >
                      <svg-icon icon-class="sale" />
                    </el-button>
                  </el-tooltip>
                </el-button-group>
                <el-button-group>
                  <el-tooltip
                    :delay="delay"
                    :content="$t('focus.goToCustomer')"
                    class="item"
                    effect="light"
                    placement="top-start"
                  >
                    <el-button
                      v-if="
                        scope.row.customerId !== null &&
                        (!haveCustomerId || isCW)
                      "
                      class="icon-button activities-icons"
                      @click="routePersonDetails(scope.row.customerId)"
                    >
                      <svg-icon icon-class="profile-icon" />
                    </el-button>
                  </el-tooltip>
                </el-button-group>
              </template>
            </el-table-column>
          </template>
        </perspective>
      </el-row>
    </div>
  </div>
</template>
<script>
import customerActivityApi from "@/api/crm/customerActivity";
import perspective from "@/components/Perspective";
import lifecycle from "@/components/CustomerActivities/CustomerLifeCycle.vue";
import customerActivityCreate from "./CustomerActivityCreate";

export default {
  components: {
    perspective,
    lifecycle,
    customerActivityCreate,
  },
  props: {
    internalOrganizationListType: {
      type: String,
      default: "normal",
    },
    customerId: {
      type: Number,
      default: null,
    },
    haveCustomerId: {
      type: Boolean,
      default: false,
    },
    financeType: {
      type: String,
      default: "",
    },
    needType: {
      type: String,
      default: "",
    },
    isCW: {
      type: Boolean,
      default: false,
    },
    focus: {
      type: Boolean,
      default: false,
    },
    internalOrganizationId: {
      type: String,
      default: "",
    },
    type: {
      type: String,
      default: "ongoing",
    },
  },
  data() {
    return {
      busy: false,
      delay: 1500,
      selectedPartyId: 0,
      index: 0,
      dialogActivity: false,
      activityCustomerId: 0,
      customerActivityId: 0,
      showInternalOrganization: true,
      showEmployee: true,
      internalOrganization: "",
      listQuery: null,
      communicationTypeFilter: [],
      communicationPurposeFilter: [],
      customerRatingFilter: [],
      customerStageFilter: [],
      option: {
        showSearchText: true,
        showActive: false,
        showArchive: false,
        searchType: false,
        defaultDayFilter: "1",
        showYesterdayButton: false,
        showPastButton: true,
        pageSizes: [20, 30, 50, 75],
        mode: "table",
      },
      count: 0,
      items: [],
    };
  },
  computed: {},
  mounted() {
    this.internalOrganization = this.internalOrganizationId;
    if (this.haveCustomerId) {
      this.option = {
        showSearchText: false,
        showActive: false,
        showArchive: false,
        searchType: false,
        defaultDayFilter: "1",
        showYesterdayButton: false,
        showPastButton: false,
        pageSizes: [50, 100, 150, 200],
        mode: "table",
        showTodayButton: false,
        showDatePicker: false,
        showAllDatesButton: false,
      };
      this.showInternalOrganization = false;
      this.showEmployee = false;
    }
    this.getFilterValues();
  },
  methods: {
    handleSizeChange(val) {
      this.listQuery.limit = val;
      this.getAllActivities();
    },
    handleCheckBox() {
      this.getAllActivities();
    },
    handleCurrentChange(val) {
      this.listQuery.page = val;
      this.getAllActivities();
    },
    routePersonDetails(customerId) {
      this.$router.push({
        name: "personEdit",
        params: { partyId: customerId },
      });
    },
    getDate(date) {
      var d = date === null ? "" : new Date(date);
      return d === ""
        ? ""
        : d.toLocaleDateString("tr-TR") === "31.12.1899"
        ? ""
        : d.toLocaleDateString("tr-TR");
    },
    getTime(date) {
      var d = date === null ? "" : new Date(date);
      return d.toLocaleTimeString("tr-TR") === "00:00:00"
        ? "Seçilmedi"
        : d.toLocaleTimeString("tr-TR");
    },
    getAllActivities(listQuery) {
      this.busy = true;
      this.listQuery = listQuery;
      listQuery.isCompleted = this.type === "completed";
      listQuery.haveCustomerId = this.haveCustomerId;
      listQuery.customerId = this.customerId;
      customerActivityApi
        .getActivities(listQuery)
        .then((v) => {
          this.items = v.data.data;
          this.count = v.data.count;
          this.busy = false;
        })
        .catch(() => {
          this.errorMessage = this.$t("processlist.errorMessage");
          this.busy = false;
        });
    },
    getTelecomeNumber(phoneNumber) {
      // return
      // !phoneNumber ||
      //   phoneNumber.length < 10 ||
      //   phoneNumber.trim() === "" ||
      //   phoneNumber === "0"
      //   ? ""
      //   :
      return (
        "*******" +
        phoneNumber.substring(phoneNumber.length - 4, phoneNumber.length)
      );
    },
    getUncensoredTelecomeNumber(phoneNumber) {
      return "0" + phoneNumber;
    },
    openActivityDialog(row) {
      this.index++;
      this.activityCustomerId = row.customerId;
      this.customerActivityId = row.customerActivityId;
      this.dialogActivity = true;
    },
    closeActivityDialog() {
      console.log("*****WithoutSave*****");
      this.dialogActivity = false;
      this.index++;
      this.activityCustomerId = 0;
    },
    closeActivityDialogWithSave() {
      console.log("*****Save*****");
      this.dialogActivity = false;
      this.index++;
      this.activityCustomerId = 0;
      this.getAllActivities(this.listQuery);
    },
    openNewActivityDialog() {
      this.index++;
      this.dialogActivity = true;
      this.customerActivityId = 0;
      this.activityCustomerId = this.customerId;
    },
    getReminderNote(row) {
      if (row.reminderNote !== null && row.reminderNote.length > 15) {
        return row.reminderNote.substring(0, 15) + "...";
      } else {
        return row.reminderNote;
      }
    },
    getFilterValues() {
      customerActivityApi.getDropdownValues().then((v) => {
        this.communicationTypeFilter = v.data.communicationTypeList.map((i) => {
          return { text: i.description, value: i.communicationTypeId };
        });
        this.customerRatingFilter = v.data.customerActivityRatingList.map(
          (i) => {
            return { text: i.label, value: i.value };
          }
        );
        this.communicationPurposeFilter = v.data.communicationPurposeList.map(
          (i) => {
            return { text: i.description, value: i.communicationPurposeId };
          }
        );
        this.customerStageFilter = v.data.customerStages.map((i) => {
          return { text: i.label, value: i.value };
        });
      });
    },
  },
};
</script>
<style scoped>
.el-table th > .cell.highlight {
  color: blue;
}
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
