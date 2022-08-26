<template>

  <div class="customer-activity-create-complete">
    <el-dialog
      v-model="activityDialogVisiable"
      :before-close="closeActivityDialog"
      width="75%"
    >
      <template #title>
        <div class="my-header">
          <p class="title">Aktivite Oluştur</p>
          <p class="description">Oluşturmak istediğiniz aktivite ile ilgili bilgileri giriniz ve <span>"Aktivite Oluştur"</span> butonuna basınız. </p>
        </div>
      </template>
      <div>
      <el-form
        v-loading="loading"
        ref="customerActivity"
        :rules="rules"
        :disabled="disable"
        :model="model"
        style="width:100%"
        label-position="top"
      >
        <el-row>
          <el-col :span="8">
            <el-form-item :label="$t('crm.customerActivity.customerName')" prop="customerName">
              <el-input v-model="model.customerName" disabled />
            </el-form-item>           
            <el-form-item :label="$t('crm.customerActivity.customerStage')" prop="customerStage">
              <el-input v-model="model.customerStage" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t('crm.customerActivity.customerId')" prop="customerId">
              <el-input v-model="model.customerId" disabled />
            </el-form-item>
            <el-form-item
              v-if="isCW && model.financeType !== null"
              :label="$t('crm.customerActivity.financeType')"
              prop="financeType"
            >
              <el-input v-model="model.financeType" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t('crm.customerActivity.phone')" prop="phone">
              <el-input v-model="model.phone" disabled />
            </el-form-item>
            <el-form-item
              v-if="isCW && model.needType !== null && model.financeType === 'Otomobil'"
              :label="$t('crm.customerActivity.needType')"
              prop="needType"
            >
              <el-input v-model="model.needType" disabled />
            </el-form-item>
          </el-col>
        </el-row>
        <div class="divider" />
        <el-row>
          <el-col :span="8">
            <el-form-item :label="$t('crm.customerActivity.communicationType')" prop="communicationType">
              <el-select :disabled="(((!isNew || (!(ownPortfolio || isCustomerAdvisor) && !canComplete && !withoutAppointment)) && !isUserCC)) || completeDirectly" v-model="model.communicationType" style="width: 100%;" @change="communicationTypeChange">
                <el-option
                  v-for="item in communicationTypeFilteredList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t('crm.customerActivity.communicationPurpose')" prop="communicationPurpose">
              <el-select :disabled="!isNew || communicationTypeSelected" v-model="model.communicationPurpose" style="width: 100%;">
                <el-option
                  v-for="item in filteredPurposeList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item v-if="!canBeConfirmed && showAppointmentType" :label="$t('crm.customerActivity.appointmentType')" prop="appointmentType">
              <el-select
                :disabled="!isNew"
                v-model="model.appointmentType"
                style="width: 100%"
              >
                <el-option
                  v-for="item in appointmentTypeList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
           <el-form-item :label="$t('crm.customerActivity.customerActivityStatus')" prop="communicationStatusType">
              <el-select :disabled="disableCommunicationStatusType" v-model="model.communicationStatusType" style="width: 100%;" @change="communicationStatusChange">
                <el-option
                  v-for="item in communicationStatusTypeList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <div class="divider" />
        <el-row>
          <el-col :span="12">
            <el-form-item
              v-if="!isNew"
              :label="$t('crm.customerActivity.createdBy')"
              prop="createdBy"
            >
              <el-input v-model="model.createdBy" disabled />
            </el-form-item>
            
            <el-form-item
              v-if="completed"
              :label="$t('crm.customerActivity.completedBy')"
              prop="completedBy"
            >
              <el-input v-model="model.completedBy" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              v-if="!isNew"
              :label="$t('crm.customerActivity.createDate')"
              prop="createDate"
            >
              <el-date-picker
                v-model="model.createDate"
                disabled
                type="date"
                format="DD/MM/YYYY"
                value-format="YYYY-MM-DD"
                style="width: 100%"
              />
            </el-form-item>
            <el-form-item
              v-if="completed"
              :label="$t('crm.customerActivity.completeDate')"
              prop="completeDate"
            >
              <el-date-picker
                v-model="model.completeDate"
                disabled
                type="date"
                format="DD/MM/YYYY"
                value-format="YYYY-MM-DD"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <div v-if="!isNew || completed" class="divider" />
        <el-row>
          <el-col :span="12">
            <el-form-item
              v-if="!isNew && !isCustomerAdvisor"
              :label="$t('crm.customerActivity.assignedTo')"
              prop="assignedTo"
            >
              <el-input v-model="model.assignedTo" disabled />
            </el-form-item>
            <el-form-item
              v-else-if="isCustomerAdvisor && isNew"
              :label="$t('crm.customerActivity.assignedTo')"
              prop="assignedTo"
            >
              <organization-search
                ref="selectedPerson"
                v-model="model.assignedTo"
                :internal-organization-id="organizationId"
                :role-type="'Branch'"
                :has-portfolio="true"
                :contains-itself="true"
                search-place-holder="Çalışan Arayınız"
                @save="assignedToChange"/>
            </el-form-item>
          </el-col>
          <el-col :span="isNew & !isCustomerAdvisor ? '24' : '12'">
            <el-form-item
              :label="$t('crm.customerActivity.assigneDateTime')"
              prop="assignedDate"
            >
              <el-col :span="11">
                <el-date-picker
                  :disabled="(completeDirectly) && !confirmationCreatedByCC"
                  v-model="model.assignedDate"
                  :disabled-date="disabledDate"
                  type="date"
                  format="DD/MM/YYYY"
                  value-format="YYYY-MM-DD"
                  style="width: 100%"
                />
              </el-col>
              <el-col :span="2" class="line">-</el-col>
              <el-col :span="11">
                <el-time-picker
                  :disabled="(completeDirectly) && !confirmationCreatedByCC"
                  v-model="model.assignedHour"
                  value-format="YYYY-MM-DDTHH:mm"
                  format="HH:mm"
                  style="width: 100%"
                />
              </el-col>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- <div class="divider" /> -->
        <!-- <el-row>
          <el-col :span="8">
            <el-form-item :label="$t('crm.customerActivity.customerName')" prop="customerName">
              <el-input v-model="model.customerName" disabled />
            </el-form-item>           
            <el-form-item :label="$t('crm.customerActivity.customerStage')" prop="customerStage">
              <el-input v-model="model.customerStage" disabled />
            </el-form-item>
            <el-form-item
              v-if="!isNew && !isCustomerAdvisor"
              :label="$t('crm.customerActivity.assignedTo')"
              prop="assignedTo"
            >
              <el-input v-model="model.assignedTo" disabled />
            </el-form-item>
            <el-form-item
              v-else-if="isCustomerAdvisor && isNew"
              :label="$t('crm.customerActivity.assignedTo')"
              prop="assignedTo"
            >
              <organization-search
                ref="selectedPerson"
                v-model="model.assignedTo"
                :internal-organization-id="organizationId"
                :role-type="'Branch'"
                :has-portfolio="true"
                :contains-itself="true"
                search-place-holder="Çalışan Arayınız"
                @save="assignedToChange"/>
            </el-form-item>
            <el-form-item
              :label="$t('crm.customerActivity.assigneDateTime')"
              prop="assignedDate"
            >
              <el-col :span="11">
                <el-date-picker
                  :disabled="(ompleteDirectly) && !confirmationCreatedByCC"
                  v-model="model.assignedDate"
                  :disabled-date="disabledDate"
                  type="date"
                  format="DD/MM/YYYY"
                  value-format="YYYY-MM-DD"
                  style="width: 100%"
                />
              </el-col>
              <el-col :span="2" class="line">-</el-col>
              <el-col :span="11">
                <el-time-picker
                  :disabled="(completeDirectly) && !confirmationCreatedByCC"
                  v-model="model.assignedHour"
                  value-format="YYYY-MM-DDTHH:mm"
                  format="HH:mm"
                  style="width: 100%"
                />
              </el-col>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t('crm.customerActivity.customerId')" prop="customerId">
              <el-input v-model="model.customerId" disabled />
            </el-form-item>
            <el-form-item :label="$t('crm.customerActivity.communicationType')" prop="communicationType">
              <el-select :disabled="(((!isNew || (!(ownPortfolio || isCustomerAdvisor) && !canComplete && !withoutAppointment)) && !isUserCC)) || completeDirectly" v-model="model.communicationType" style="width: 100%;" @change="communicationTypeChange">
                <el-option
                  v-for="item in communicationTypeFilteredList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('crm.customerActivity.communicationPurpose')" prop="communicationPurpose">
              <el-select :disabled="!isNew || communicationTypeSelected" v-model="model.communicationPurpose" style="width: 100%;">
                <el-option
                  v-for="item in filteredPurposeList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item v-if="!canBeConfirmed && showAppointmentType" :label="$t('crm.customerActivity.appointmentType')" prop="appointmentType">
              <el-select
                :disabled="!isNew"
                v-model="model.appointmentType"
                style="width: 100%"
              >
                <el-option
                  v-for="item in appointmentTypeList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('crm.customerActivity.customerActivityStatus')" prop="communicationStatusType">
              <el-select :disabled="disableCommunicationStatusType" v-model="model.communicationStatusType" style="width: 100%;" @change="communicationStatusChange">
                <el-option
                  v-for="item in communicationStatusTypeList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item
              v-if="((!isNew || completeDirectly) && !isUserCC) && showRating"
              :label="$t('crm.customerActivity.customerRating')"
              prop="customerRating"
            >
              <el-select v-model="model.customerRating" style="width: 100%">
                <el-option
                  v-for="item in customerRatingList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item
              v-if="showCommunicationResult || completeDirectly || completed"
              :label="$t('crm.customerActivity.customerActivityResult')"
              prop="communicationResult"
            >
              <el-select
                v-model="model.communicationResult"
                style="width: 100%"
              >
                <el-option
                  v-for="item in filteredResultList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t('crm.customerActivity.phone')" prop="phone">
              <el-input v-model="model.phone" disabled />
            </el-form-item>
            
            <el-form-item
              v-if="!isNew"
              :label="$t('crm.customerActivity.createdBy')"
              prop="createdBy"
            >
              <el-input v-model="model.createdBy" disabled />
            </el-form-item>
            <el-form-item
              v-if="!isNew"
              :label="$t('crm.customerActivity.createDate')"
              prop="createDate"
            >
              <el-date-picker
                v-model="model.createDate"
                disabled
                type="date"
                format="DD/MM/YYYY"
                value-format="YYYY-MM-DD"
                style="width: 100%"
              />
            </el-form-item>
            <el-form-item
              v-if="completed"
              :label="$t('crm.customerActivity.completedBy')"
              prop="completedBy"
            >
              <el-input v-model="model.completedBy" disabled />
            </el-form-item>
            <el-form-item
              v-if="completed"
              :label="$t('crm.customerActivity.completeDate')"
              prop="completeDate"
            >
              <el-date-picker
                v-model="model.completeDate"
                disabled
                type="date"
                format="DD/MM/YYYY"
                value-format="YYYY-MM-DD"
                style="width: 100%"
              />
            </el-form-item>
            <el-form-item
              v-if="isCW && model.financeType !== null"
              :label="$t('crm.customerActivity.financeType')"
              prop="financeType"
            >
              <el-input v-model="model.financeType" disabled />
            </el-form-item>
            <el-form-item
              v-if="isCW && model.needType !== null && model.financeType === 'Otomobil'"
              :label="$t('crm.customerActivity.needType')"
              prop="needType"
            >
              <el-input v-model="model.needType" disabled />
            </el-form-item>
          </el-col>
        </el-row>
        <div class="divider" /> -->
        <el-row>
          <el-collapse class="documentGroupCollapse">
            <el-collapse-item name="1">
              <template #title>
                <div class="my-header">
                  <p class="title">
                    Notlar
                  </p>
                  <p class="description">
                    Notlar
                  </p>
                </div>
              </template>
              <el-form-item>
                <activity-note-list :page-size="5" :customer-id="customerId" />
              </el-form-item>
              <el-form-item :label="$t('crm.customerActivity.reminderNote')">
                <el-input :disabled="(!isNew || completed || completeDirectly)" v-model="model.reminderNote" type="textarea" />
              </el-form-item>
              <el-form-item v-if="(!isNew || completeDirectly) || completed" :label="$t('crm.customerActivity.completeNote')">
                <el-input :disabled="completed" v-model="model.completeNote" type="largetextarea" />
              </el-form-item>
            </el-collapse-item>
          </el-collapse>
        </el-row>
        <br>
      </el-form>
      </div>
      <template #footer>
        <span class="footer-desc">
          Gerekli işlemlerinizi tamamladıysanız <span style="font-weight: 500;color: #606266;"> “Aktivite Oluştur” </span> butonuna <br> basarak işleminizi kaydedebilirsiniz.
        </span>
        <span class="dialog-footer">
          <el-button class="default-button" @click="closeActivityDialog()">
            {{ $t("crm.customerActivity.cancel") }}
          </el-button>
          <el-button id="save-button" :disabled="completed" type="action" @click="onClick">
            {{ $t("crm.customerActivity.save") }}
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import activityNoteList from './ActivityNoteList.vue'
import customerActivityApi from '@/api/crm/callCenter'
import organizationSearch from './OrganizationSearch.vue'
import moment from 'moment'

export default {
  components: {
    activityNoteList,
    moment,
    organizationSearch

  },
  props: {
    customerActivityId: {
      type: Number,
      default: 0
    },
    customerId: {
      type: Number,
      default: 0
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
    fromList: {
      type: Boolean,
      default: false
    },
    focus: {
      type: Boolean,
      default: false
    },
    internalOrganizationId: {
      type: String,
      default: null
    },
    anotherBranch: {
      type: Boolean,
      default: false
    },
    isCompleted: {
      type: Boolean,
      default: false
    }
  },
  data() {
    var checkCustomerRating = (rule, value, callback) => {
      if (((!this.isNew || this.completeDirectly || this.showCommunicationResult) && !this.isUserCC) && this.model.customerRating === null) {
        callback(new Error('Lütfen Projeye Yakınlık Seçiniz!'))
      } else {
        callback()
      }
    }
    var checkCommunicationResult = (rule, value, callback) => {
      if (((!this.isNew || this.completeDirectly || this.showCommunicationResult) && this.filteredResultList.length > 0) && this.model.communicationResult === null) {
        callback(new Error('Lütfen Aktivite Sonucu Seçiniz!'))
      } else {
        callback()
      }
    }
    var checkCommunicationStatusType = (rule, value, callback) => {
      if ((!this.isNew && (this.model.communicationStatusType === this.communicationStatusTypeList.find(i => i.source === 'Assigned').value))) {
        callback(new Error('Lütfen Aktivite Durumu Seçiniz!'))
      } else {
        callback()
      }
    }
    var checkAppointmentType = (rule, value, callback) => {
      if ((this.isNew && !this.isCW && this.model.appointmentType == null && !this.canBeConfirmed && this.showAppointmentType)) {
        callback(new Error('Lütfen Randevu Türü Seçiniz!'))
      } else {
        callback()
      }
    }
    var checkAssignedTo = (rule, value, callback) => {
      if ((this.isNew && this.isCustomerAdvisor && this.model.assignedTo === '')) {
        callback(new Error('Lütfen Atanacak Kişiyi Seçiniz!'))
      } else {
        callback()
      }
    }
    return {
      disabledDate:(date) => {
        if (this.isCW) {
          return !(date > moment().subtract(1, 'days') && date < moment().add(7, 'days'))
        }
        if ((this.canBeConfirmed && this.isNew) || this.confirmationCreatedByCC) {
          return !(date > moment().subtract(1, 'days') && date <= moment(this.confirmationActivityMaxDate))
        }
        return !(date > moment().subtract(1, 'days') && date < moment().add(60, 'days'))
      },
      model: {
        customerName: '',
        customerId: 0,
        phone: '',
        customerStage: '',
        assignedTo: '',
        assignedDate: null,
        assignedHour: moment().format('yyyy-MM-DDT00:00'),
        customerRating: null,
        communicationPurpose: null,
        customerActivityId: null,
        communicationType: null,
        appointmentType: null,
        communicationStatusType: null,
        communicationResult: null,
        createdBy: '',
        createDate: moment().format('yyyy-MM-DD'),
        completedBy: '',
        completeDate: null,
        completeNote: '',
        reminderNote: '',
        financeType: '',
        anotherBranch: false
      },
      organizationId: '',
      withoutAppointment: false,
      loading: false,
      showRating: false,
      communicationTypeSelected: true,
      filteredPurposeList: [],
      filteredResultList: [],
      activityDialogVisiable: false,
      communicationResultList: [],
      confirmationCreatedByCC: false,
      isCustomerAdvisor: false,
      communicationStatusTypeList: [],
      appointmentTypeList: [],
      communicationPurposeList: [],
      communicationTypeList: [],
      isUserCC: false,
      customerAdvisorActivity: false,
      ownPortfolio: true,
      disableCommunicationStatusType: false,
      customerRatingList: [],
      isNew: false,
      customerValues: {},
      canBeConfirmed: false,
      showAppointmentType: true,
      confirmationActivityMaxDate: null,
      completed: false,
      completeDirectly: false,
      showCommunicationResult: false,
      haveAnyUncompletedActivities: false,
      communicationTypeFilteredList: [],
      canComplete: false,
      disable: false,
      rules: {
        assignedDate: [
          { required: true, message: 'Lütfen Tarih Seçiniz!', trigger: 'blur' }
        ],
        communicationType: [
          { required: true, message: 'Lütfen Aktivite Tipi Seçiniz!', trigger: 'blur' }
        ],
        communicationPurpose: [
          { required: true, message: 'Lütfen Aktivite Detayı Seçiniz!', trigger: 'blur' }
        ],
        appointmentType: [
          { validator: checkAppointmentType, trigger: 'blur' }
        ],
        customerRating: [
          { validator: checkCustomerRating, trigger: 'blur' }
        ],
        communicationResult: [
          { validator: checkCommunicationResult, trigger: 'blur' }
        ],
        communicationStatusType: [
          { validator: checkCommunicationStatusType, trigger: 'blur' }
        ],
        assignedTo: [
          { validator: checkAssignedTo, trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
  //   totalCostAmount: function() {
  //     let total = 0

  //     if (this.transactionList && this.transactionList.length > 0) {
  //       this.transactionList.forEach(element => {
  //         if (element.accountingTransactionType.name !== 'delivery') {
  //           total += element.amount
  //         }
  //       })
  //     }

  //     return total
  //   }
  },
  created() {
    if (this.internalOrganizationId === '') {
      this.organizationId = this.$store.state.user.internalOrganizationId
    } else {
      this.organizationId = this.internalOrganizationId
    }
    if (this.customerActivityId === 0) {
      this.isNew = true
    }
    this.model.financeType = this.financeType
    this.model.customerActivityId = this.customerActivityId
    this.getCustomerValues()
    this.isUserCC = this.isCW
    if (this.isUserCC) {
      this.showAppointmentType = false
    }
  },
  mounted() { },
  methods: {
    onClick() {
      if (this.loading) {
        return
      }
      this.loading = true
      this.$refs['customerActivity'].validate((valid) => {
        if (valid) {
          if (this.model.financeType === 'Konut') { this.model.financeType = 'GAYRIMENKUL' }
          if (this.model.financeType === 'Otomobil') { this.model.financeType = 'ARAC' }
          if (this.model.financeType === 'Tasarruf') { this.model.financeType = 'TASARRUF' }
          if (this.model.financeType === 'Çatılı İş Yeri') { this.model.financeType = 'CATILI IS YERI' }
          this.model.anotherBranch = this.anotherBranch
          this.model.anotherBranchId = this.organizationId
          this.model.isCW = this.isCW
          var save = (this.model.customerActivityId === 0
            ? customerActivityApi.createCustomerActivity(this.model)
            : customerActivityApi.updateCustomerActivity(this.model))
          save.then(() => {
            this.loading = false
            if (!this.isNew || (this.completeDirectly && !this.haveAnyUncompletedActivities)) {
              this.activityDialogVisiable = false
              this.$confirm('Yeni bir aktivite açmak ister misiniz ?', 'Bilgilendirme', {
                confirmButtonText: 'Evet',
                cancelButtonText: 'Hayır',
                type: 'Info'
              }).then(() => {
                this.fillModel(0, '', '', '', '', '')
                this.isNew = true
                this.showRating = false
                this.anotherBranch = false
                if (this.completeDirectly && !this.haveAnyUncompletedActivities) {
                  this.withoutAppointment = true
                }
                this.showCommunicationResult = false
                this.getCustomerValues()
              }).catch(() => {
                this.closeActivityDialogWithSave()
                this.fillModel(0, '', '', '', '', '')
              })
            } else if (this.isNew) {
              this.$confirm(this.model.customerName + ' isimli müşteriye aktivite oluşturulmuştur.', 'Bilgilendirme', {
                confirmButtonText: 'Tamam',
                showCancelButton: false,
                type: 'Info'
              }).then(
                this.closeActivityDialogWithSave()
              )
            } else {
              this.$confirm(this.model.customerName + ' isimli müşterinin aktivitesi tamamlanmıştır.', 'Bilgilendirme', {
                confirmButtonText: 'Tamam',
                showCancelButton: false,
                type: 'Info'
              }).then(
                this.closeActivityDialogWithSave()
              )
            }
          })
            .catch(() => {
              this.loading = false
            })
        } else {
          this.loading = false
        }
      })
    },
    getDropdownValues() {
      this.busy = true
      customerActivityApi.getDropdownValues()
        .then((v) => {
          this.communicationStatusTypeList = v.data.communicationStatusTypeList
          if (this.isNew && ((this.ownPortfolio || this.isCustomerAdvisor) || this.canComplete)) {
            this.disableCommunicationStatusType = true
            this.model.communicationStatusType = this.communicationStatusTypeList.find(i => i.source === 'Assigned').value
          }
          this.communicationTypeList = v.data.communicationTypeList.map(i => { return { label: i.description, value: i.communicationTypeId, name: i.name, forConfirmation: i.forConfirmation, canBeConfirmed: i.canBeConfirmed } })
          this.communicationTypeFilteredList = this.communicationTypeList
          if (this.isNew) {
            this.appointmentTypeList = v.data.appointmentTypeList.filter(i => i.source !== 'Unknown')
          } else {
            this.appointmentTypeList = v.data.appointmentTypeList
          }
          if (this.completed) {
            this.communicationPurposeList = v.data.communicationPurposeList.map(i => { return { label: i.description, value: i.communicationPurposeId, name: i.name } })
          } else {
            this.communicationPurposeList = v.data.communicationPurposeList.filter(i => i.thruDate === null).map(i => { return { label: i.description, value: i.communicationPurposeId, name: i.name } })
          }
          this.customerRatingList = v.data.customerActivityRatingList.filter(i => i.value !== '4')
          this.communicationPurposeList = v.data.communicationPurposeList.map(i => { return { label: i.description, value: i.communicationPurposeId, name: i.name } })
          this.filteredPurposeList = this.communicationPurposeList
          this.filteredResultList = v.data.communicationResultList.map(i => { return { label: i.description, value: i.communicationResultId, name: i.name } })
          this.checkAvailability()
        })
    },
    fillModel(customerId, phone, customerStage, customerName, financeType, needType) {
      this.model = {
        customerId: customerId,
        phone: phone,
        customerStage: customerStage,
        customerName: customerName,
        assignedTo: '',
        assignedDate: null,
        assignedHour: moment().format('yyyy-MM-DDT00:00'),
        customerRating: null,
        communicationPurpose: null,
        customerActivityId: 0,
        communicationType: null,
        appointmentType: null,
        communicationStatusType: null,
        communicationResult: null,
        createdBy: '',
        createDate: moment().format('yyyy-MM-DD'),
        completedBy: '',
        completeDate: null,
        completeNote: '',
        reminderNote: '',
        financeType: financeType,
        needType: needType,
        anotherBranch: null
      }
    },
    getCustomerValues() {
      this.loading = true
      customerActivityApi.getCustomerValues(this.customerId)
        .then(v => {
          this.customerValues = v.data
          this.model.customerId = this.customerValues.customerId
          this.model.phone = this.customerValues.phone
          this.model.customerStage = this.customerValues.customerStage
          this.model.customerName = this.customerValues.customerName
          this.model.financeType = this.financeType !== '' ? this.financeType : this.customerValues.financeType
          this.model.needType = this.needType !== '' ? this.needType : this.customerValues.needType
        })
      this.getActivityValues(this.model.customerActivityId)
    },
    getActivityValues(activityId) {
      if (activityId !== 0) {
        customerActivityApi.getActivityValues(activityId, this.isCompleted)
          .then((v) => {
            var value = v.data
            this.model = {
              customerId: this.customerValues.customerId,
              phone: this.customerValues.phone,
              customerActivityId: activityId,
              customerStage: this.customerValues.customerStage,
              customerName: this.customerValues.customerName,
              assignedTo: value.assignedTo,
              assignedDate: value.assignedDateTime,
              assignedHour: value.assignedDateTime,
              customerRating: value.customerRating === null ? '' : (value.customerRating === 4 ? null : value.customerRating.toString()),
              communicationPurpose: value.communicationPurpose.communicationPurposeId,
              communicationType: value.communicationType.communicationTypeId,
              appointmentType: value.appointmentType === null ? '' : value.appointmentType.toString(),
              communicationStatusType: value.communicationStatusType === null ? '' : value.communicationStatusType.toString(),
              communicationResult: value.communicationResult != null ? value.communicationResult.communicationResultId : null,
              createdBy: value.createdBy,
              createDate: value.createDate,
              completedBy: value.completedBy,
              completeDate: value.completeDate,
              completeNote: value.completeNote,
              reminderNote: value.reminderNote,
              financeType: this.customerValues.financeType,
              needType: this.customerValues.needType
            }
            if (value.communicationStatusType !== 3 && value.communicationStatusType !== null) {
              this.completed = true
              this.disable = true
              this.showRating = true
              if (this.model.communicationResult === null) {
                this.showCommunicationResult = false
              }
            }
            this.loading = false
          })
      } else {
        this.loading = false
      }

      this.getDropdownValues()
      this.busy = false
    },
    checkAvailability() {
      customerActivityApi
        .checkAvailability(this.customerId, this.$store.state.user.sub, this.model.customerActivityId, this.isCompleted)
        .then(v => {
          if (!this.isUserCC) {
            this.isUserCC = v.data.isUserCC
          }
          this.canComplete = v.data.canComplete
          this.canBeConfirmed = v.data.canBeConfirmed
          this.haveAnyUncompletedActivities = v.data.haveAnyActivities
          this.isCustomerAdvisor = v.data.isCustomerAdvisor
          this.confirmationCreatedByCC = v.data.confirmationCreatedByCC
          this.ownPortfolio = v.data.isOwnPortfolio

          if (((this.haveAnyUncompletedActivities && !this.canBeConfirmed && (!this.canComplete || (this.ownPortfolio || this.isCustomerAdvisor))) && !this.isUserCC && !this.completed) && this.isNew && ((this.ownPortfolio || this.isCustomerAdvisor) || this.canComplete)) {
            this.activityDialogVisiable = false
            this.$confirm('Müşterinin bekleyen bir aktivitesi bulunmaktadır lütfen önce onu tamamlayınız!', 'Bilgilendirme', {
              confirmButtonText: 'Tamam',
              showCancelButton: false,
              type: 'Info'
            })
          } else if (this.canBeConfirmed && (this.ownPortfolio || this.isCustomerAdvisor) && this.isNew) {
            this.$confirm('Müşterinin bekleyen bir aktivitesi bulunmaktadır sadece teyit aktivitesi oluşturabilirsiniz!', 'Bilgilendirme', {
              confirmButtonText: 'Tamam',
              showCancelButton: false,
              type: 'Info'
            }).then(() => {
              this.activityDialogVisiable = true
            }
            )
          } else {
            this.activityDialogVisiable = true
          }
          if (!this.withoutAppointment && ((!(this.ownPortfolio || this.isCustomerAdvisor) && !this.canComplete) || (!(this.ownPortfolio || this.isCustomerAdvisor) && this.canComplete && this.haveAnyUncompletedActivities)) && !this.isUserCC && !this.completed && this.isNew) {
            this.disableCommunicationStatusType = true
            this.model.communicationStatusType = this.communicationStatusTypeList.find(i => i.source === 'Completed').value
            this.model.communicationType = this.communicationTypeList.find(i => i.name === 'withoutAppointment').value
            this.communicationTypeSelected = true
            this.completeDirectly = true
            this.model.assignedDate = moment().format('yyyy-MM-DD')
            this.model.assignedHour = moment().format('yyyy-MM-DDTHH:mm:ss')
            this.communicationTypeChange()
          } else {
            this.completeDirectly = false
          }
          if (this.isUserCC && this.isNew) {
            this.disableCommunicationStatusType = true
            this.model.communicationStatusType = this.communicationStatusTypeList.find(i => i.source === 'Assigned').value
            this.communicationTypeFilteredList = this.communicationTypeList.filter(i => i.name.endsWith('CC') && !i.name.endsWith('ConfirmationCC'))
            this.model.customerRating = 4
          } else {
            if ((!this.canComplete && !(this.ownPortfolio || this.isCustomerAdvisor)) && (!this.withoutAppointment && !this.completeDirectly)) {
              this.disable = true
            }
            if (this.isNew) {
              this.communicationTypeFilteredList = this.communicationTypeList.filter(i => !i.name.endsWith('CC'))
              if (this.canBeConfirmed && ((this.ownPortfolio || this.isCustomerAdvisor) || this.canComplete || this.withoutAppointment) && !this.completeDirectly) {
                this.communicationTypeFilteredList = this.communicationTypeFilteredList.filter(i => i.forConfirmation)
                this.confirmationActivityMaxDate = v.data.activityDate
              }
            }
          }
          if (this.confirmationCreatedByCC) {
            this.confirmationActivityMaxDate = v.data.activityDate
          }
        })
        .finally(
          this.busy = false
        )
    },
    communicationTypeChange() {
      customerActivityApi.getPurposeList(this.model.communicationType)
        .then((v) => {
          if (this.communicationTypeList.find(i => i.name === 'withoutAppointment').value === this.model.communicationType) {
            this.model.communicationStatusType = this.communicationStatusTypeList.find(i => i.source === 'Completed').value
            this.completeDirectly = true
            this.showAppointmentType = true
            this.model.assignedDate = moment().format('yyyy-MM-DD')
            this.model.assignedHour = moment().format('yyyy-MM-DDTHH:mm:ss')
            this.communicationStatusChange()
          } else {
            if (this.customerAdvisorActivity) {
              this.completeDirectly = true
              this.model.assignedDate = moment().format('yyyy-MM-DD')
              this.model.assignedHour = moment().format('yyyy-MM-DDTHH:mm:ss')
            }
            if (this.communicationTypeList.find(i => i.name === 'phone').value === this.model.communicationType || (this.communicationTypeList.some(i => i.forConfirmation && i.value === this.model.communicationType)) || this.isUserCC) {
              this.showAppointmentType = false
            } else {
              this.showAppointmentType = true
            }
            this.model.communicationStatusType = this.communicationStatusTypeList.find(i => i.source === 'Assigned').value
            this.model.assignedDate = null
            this.model.assignedHour = moment().format('yyyy-MM-DDT00:00')
            this.completeDirectly = false
            this.communicationStatusChange()
          }
          if (this.completed) {
            this.filteredPurposeList = this.communicationPurposeList
          } else {
            this.model.communicationPurpose = null
            this.filteredPurposeList = v.data
            this.communicationTypeSelected = false
          }
        })
    },
    communicationStatusChange() {
      if (this.communicationStatusTypeList.find(i => i.source === 'Completed').value === this.model.communicationStatusType) {
        if (this.filteredResultList.length > 0) {
          this.model.communicationResult = null
          this.showCommunicationResult = true
        }
        this.showRating = true
      } else if (this.communicationStatusTypeList.find(i => i.source === 'Canceled').value === this.model.communicationStatusType) {
        if (this.filteredResultList.length > 0) {
          this.model.communicationResult = null
          this.showCommunicationResult = true
        }
        this.model.customerRating = null
        this.showRating = false
      } else {
        this.model.customerRating = null
        this.model.communicationResult = null
        this.showCommunicationResult = false
        this.showRating = false
      }

      customerActivityApi.getResultList(this.model.communicationType, this.model.communicationStatusType)
        .then((v) => {
          this.filteredResultList = v.data
          if (this.filteredResultList.length > 0) {
            this.model.communicationResult = null
            this.showCommunicationResult = true
          } else {
            this.model.communicationResult = null
            this.showCommunicationResult = false
          }
        })
    },
    closeActivityDialog() {
      this.$emit('closed')
      this.activityDialogVisiable = false
    },
    closeActivityDialogWithSave() {
      this.$emit('closedWithSave')
      this.activityDialogVisiable = false
    },
    assignedToChange() {
      this.communicationTypeFilteredList = this.communicationTypeList.filter(i => !i.name.endsWith('CC'))
      this.model.communicationStatusType = this.communicationStatusTypeList.find(i => i.source === 'Assigned').value
      this.model.customerRating = null
      this.completeDirectly = false
      this.customerAdvisorActivity = false
      this.communicationStatusChange()
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep(.el-dialog .el-dialog__footer) {
  border-top: solid 1px #ddd;
}
::v-deep(.el-row .el-col:not(:last-child) .el-form-item) {
  padding-right: 30px;
}
::v-deep(.el-form .el-form-item .el-form-item__label) {
  width: 100% !important;
}
::v-deep(.el-col-24) {
  width: 100% !important;
}
::v-deep(.el-table__body) {
  width: 100% !important;
}
.customer-activity-create-complete {
  .divider {
    width: 100%;
    height: 1px;
    margin: 16px 0;
    background-color: #ddd;
  }
  .documentGroupCollapse {
    width: 100%;
    .el-collapse-item__header{
      height: 60px;
      margin: 14px 0 0 6px;
      padding: 4px 20px 5px 14px;
      border-radius: 12px;
      border: solid 1px #ddd;
      background-color: #fff;
      p.title {
        font-size: 16px;
        font-weight: 500;
        font-stretch: normal;
        font-style: normal;
        line-height: normal;
        letter-spacing: normal;
      }
      p.description {
        font-weight: normal;
        font-stretch: normal;
        font-style: normal;
        line-height: normal;
        letter-spacing: normal;
        color: #909399;
      }
    }
  }
}
</style>
