<template>
  <div v-loading="busy">
    <div class="app-container">
      <el-card>
        <el-dialog
          v-model="dialogHistoryVisible"
          :title="$t('redlineGeneralList.activityHistory')">
          <el-table
            v-loading="table.busy"
            ref="listHistory"
            :data="listHistory"
            style="width: 100%">

            <el-table-column :label="$t('redlineGeneralList.date')" width="90px" property="fromDate">
              <template v-slot="scope">
                {{ getDate(scope.row.fromDate) }}
              </template>
            </el-table-column>
            <el-table-column :label="$t('redlineGeneralList.channel')" width="80px" prop="channel">
              <template v-slot="scope">
                {{ getChannelName(scope.row.channel) }}
              </template>
            </el-table-column>
            <el-table-column :label="$t('redlineGeneralList.declarantName')" width="150px" prop="declarentName"/>
            <el-table-column :label="$t('redlineGeneralList.activityType')" width="150px" prop="activityType">
              <template v-slot="scope">
                {{ getActivityTypeName(scope.row.activityType) }}
              </template>
            </el-table-column>
            <el-table-column :label="$t('redlineGeneralList.name')" width="150px" prop="name"/>
            <el-table-column :label="$t('redlineGeneralList.phone')" width="150px" prop="phoneNumber"/>
            <el-table-column :label="$t('redlineGeneralList.email')" width="150px" prop="email"/>
            <el-table-column :label="$t('redlineGeneralList.description')" width="250px" prop="description"/>
            <el-table-column :label="$t('redlinePoolList.assignedParty')" width="200px" prop="assignedPartyName"/>
            <el-table-column :label="$t('redlineGeneralList.targetDate')" width="90px" property="targetDate">
              <template v-slot="scope">
                {{ getDate(scope.row.targetDate) }}
              </template>
            </el-table-column>
            <el-table-column :label="$t('redlineInputDetail.unitDescription')" width="100px" prop="unitDescription"/>
            <el-table-column :label="$t('redlineInputDetail.mMDescription')" width="100px" prop="mmDescription"/>
            <!-- <el-table-column :label="$t('redlineInputDetail.rootReason')" width="100px" prop="rootReason"/>
            <el-table-column :label="$t('redlineInputDetail.activityScore')" width="100px" prop="activityScore"/> -->
            <el-table-column :label="$t('redlineGeneralList.status')" width="100px" prop="status">
              <template v-slot="scope">
                {{ getStatusName(scope.row.status) }}
              </template>
            </el-table-column>
          </el-table>
        </el-dialog>
        <el-card>
          <el-table
            v-loading="table.busy"
            ref="table1"
            :data="table.data"
            style="width: 100%"
            @filter-change="filterHandler">

            <el-table-column :label="$t('redlineGeneralList.activityNo')" width="60px" prop="activityNo"/>
            <el-table-column :label="$t('redlineGeneralList.date')" width="90px" property="fromDate">
              <template v-slot="scope">
                {{ getDate(scope.row.fromDate) }}
              </template>
            </el-table-column>
            <el-table-column :filters="channelList" :label="$t('redlineGeneralList.channel')" width="90px" prop="channel" sortable>
              <template v-slot="scope">
                {{ getChannelName(scope.row.channel) }}
              </template>
            </el-table-column>
            <el-table-column :label="$t('redlineGeneralList.declarantName')" width="105px" prop="declarentName"/>
            <el-table-column :label="$t('redlineGeneralList.customerNo')" width="75px" prop="customerNo"/>
            <el-table-column :label="$t('redlineGeneralList.activityType')" width="73px" prop="activityType">
              <template v-slot="scope">
                {{ getActivityTypeName(scope.row.activityType) }}
              </template>
            </el-table-column>
            <el-table-column :label="$t('redlineGeneralList.name')" width="110px" prop="name"/>
            <el-table-column :label="$t('redlineGeneralList.phone')" width="140px" prop="phoneNumber"/>
            <el-table-column :label="$t('redlineGeneralList.email')" width="110px" prop="email"/>
            <el-table-column :label="$t('redlineGeneralList.description')" width="200px" prop="description"/>
            <el-table-column :label="$t('redlinePoolList.assignedParty')" width="150px" prop="assignedPartyName"/>
            <el-table-column :label="$t('redlinePoolList.assignedPartyUnit')" width="150px" prop="unitPartyName"/>
            <el-table-column :label="$t('redlineGeneralList.targetDate')" width="90px" property="targetDate">
              <template v-slot="scope">
                {{ getDate(scope.row.targetDate) }}
              </template>
            </el-table-column>
            <el-table-column :filters="statusList" :label="$t('redlineGeneralList.status')" width="80px" prop="status">
              <template v-slot="scope">
                {{ getStatusName(scope.row.status) }}
              </template>
            </el-table-column>

            <el-table-column label="İşlemler" style="width: 10%">
              <template v-slot="scope">
                <el-button-group>
                  <el-button class="icon-button" @click.stop="itemHistory(scope.row.activityNo)"><svg-icon icon-class="detail-icon"/></el-button>
                </el-button-group>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-card>
    </div>
  </div>
</template>

<script>
import redlineActivityApi from '@/api/bpm/redlineActivity'
import { hasActionPermission } from '@/permission.js'

export default {
  props: {
    partyId: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      showButtons: true,
      showAssignToButtons: false,
      showAssignMeButtons: false,
      statusList: [],
      channelList: [],
      activityTypeList: [],
      listHistory: [],
      employeeList: [],
      model: {
        id: 0,
        name: ''
      },
      table: {
        count: 0,
        data: [],
        busy: true,
        pageSize: 10,
        pageIndex: 1
      },
      modelActivity: {
        id: 0,
        channel: '',
        declarentName: '',
        phoneNumber: '',
        email: '',
        name: '',
        customerNo: '',
        activityType: '',
        category: '',
        subCategory: '',
        assignedPartyId: '',
        targetDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toLocaleDateString(),
        description: '',
        status: '',
        rootReason: '',
        activityScore: '',
        unitName: '',
        unitDescription: '',
        mmDescription: '',
        showUnitDescription: false,
        readOnly: false,
        readOnlyDescription: false
      },
      modelAssign: {
        partyId: ''
      },
      busy: false,
      dialogHistoryVisible: false,
      action: 'new',
      errorMessage: ''
    }
  },
  created() {
    this.getGeneralActivities()
    this.getStatusList()
    this.getChannelList()
    this.getActivityTypeList()
    if (hasActionPermission(this.$store.getters.permission_routers, 'redlineAssignToPermission')) {
      this.showAssignToButtons = true
    }
    if (hasActionPermission(this.$store.getters.permission_routers, 'redlineAssignMePermission')) {
      this.showAssignMeButtons = true
    }
  },
  methods: {
    hasActionPermission,
    getDate(date) {
      var d = date === null ? '' : new Date(date)
      return d === '' ? '' : (d.toLocaleDateString('tr-TR') === '31.12.1899' ? '' : d.toLocaleDateString('tr-TR'))
    },
    filterHandler() {
      this.table.page = 1
      this.table.channel = ''
      this.table.status = ''
      this.table.assignedPartyId = ''
      const cols = this.$refs['table1'].columns.filter(i => i.filteredValue.length > 0)
      cols.forEach(c => {
        if (c.property === 'channel') {
          this.table.channel = c.filteredValue.join(',')
        }
        if (c.property === 'status') {
          this.table.status = c.filteredValue.join(',')
        }
        if (c.property === 'assignedPartyName') {
          this.table.assignedPartyId = c.filteredValue.join(',')
        }
      })
      this.getGeneralActivities()
    },
    getGeneralActivities() {
      this.table.busy = true
      this.table.customerNo = this.partyId
      // var data = {
      //   pageSize: this.table.pageSize,
      //   pageIndex: this.table.pageIndex,
      // }
      redlineActivityApi.getCustomerCardActivityList(this.table)
        .then(res => {
          // console.log(res)
          if (res.data.success) {
            this.table.data = res.data.result.data
            this.table.count = res.data.result.count
          } else {
            this.$notify.info(this.$t('notify.' + res.data.errorMessage))
          }
        })
        .catch(err => this.$notify.error(this.$t('notify.' + err)))
        .finally(this.table.busy = false)
    },
    getStatusList() {
      redlineActivityApi.getActivityStatusList()
        .then((v) => {
          this.statusList = v.data.map(e => { return { text: e.label, value: e.value } })
        })
        .catch((err) => {
          console.log(err)
          this.errorMessage = 'getInventoryDebitTypes hata'
        })
    },
    getStatusName(id) {
      if (this.statusList.length > 0) {
        var status = this.statusList.find(e => e.value === id)
        if (status === 'undefined' || status === null) {
          return ''
        }
        return status.text
      }
    },
    getActivityTypeList() {
      redlineActivityApi.getActivityTypeList()
        .then((v) => {
          // this.channelList = v.data
          this.activityTypeList = v.data.map(e => { return { text: e.label, value: e.value } })
        })
        .catch((err) => {
          console.log(err)
          this.errorMessage = 'getInventoryDebitTypes hata'
        })
    },
    getActivityTypeName(id) {
      if (id === null) {
        return ''
      }
      // console.log(this.activityTypeList)
      // alert(id)
      if (this.activityTypeList.length > 0) {
        var activityType = this.activityTypeList.find(e => e.value === id)
        if (activityType === 'undefined' || activityType === null) {
          return ''
        }
        return activityType.text
      }
    },
    getChannelList() {
      redlineActivityApi.getChannelList()
        .then((v) => {
          // this.channelList = v.data
          this.channelList = v.data.map(e => { return { text: e.label, value: e.value } })
        })
        .catch((err) => {
          console.log(err)
          this.errorMessage = 'getInventoryDebitTypes hata'
        })
    },
    getChannelName(id) {
      return this.channelList.length > 0 ? this.channelList.find(e => e.value === id).text : ''
    },
    itemHistory(activityNo) {
      this.listHistory = []
      this.action = 'assignHistory'
      this.dialogHistoryVisible = true
      this.busyHistory = true
      redlineActivityApi
        .getActivityHistory(activityNo)
        .then((v) => {
          this.listHistory = v.data
          this.busyHistory = false
        })
        .catch((err) => {
          if (err.data.status === 400) {
            this.errorMessage = ''
            err.data.errors.DomainValidations.forEach((v) => {
              // eslint-disable-next-line
                  this.errorMessage = this.$t(`error.${v}`, {
                title: this.model.title
              }) + '<br>' + this.errorMessage
            })
            this.$emit('error', this.errorMessage)
          } else {
            this.$notify.error(this.$t('notify.error'))
          }
          this.busyAssignmentHistory = false
        })
    }
  }
}
</script>
<style scoped>
.read{
  font-weight:100
}
.unread{
  font-weight:100
}
</style>
