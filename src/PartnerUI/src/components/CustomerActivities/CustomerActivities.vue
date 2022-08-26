<template>

  <div class="call-center-perspective">
        <customer-activity
          v-if="dialogActivity"
          :customer-id="activityCustomerId"
          :key="index"
          :finance-type="financeType"
          :focus="focus"
          :need-type="needType"
          :is-c-w ="isCW"
          :customer-activity-id="customerActivityId"
          :internal-organization-id="organizationId"
          :another-branch="anotherBranch"
          :from-list="true"
          @closed="closeActivityDialog"
          @closedWithSave="closeActivityDialogWithSave"/>
      <el-row type="header-bg">
        <div>
          <p>Aktivitelerim</p>
          <p>Aktivitelerinizi kontrol edebilir ve yeni aktiviteler oluşturabilirsiniz.</p>
        </div>
        <div>
          <el-button v-if="showOtherBranchActivity" type="action" class="table-button" plain @click="openNewOtherBranchActivityDialog()">
            Farklı Şubeye Aktivite Oluştur
          </el-button>
          <el-button type="action" class="table-button" plain @click="openNewActivityDialog()"><i class="fa-solid fa-plus margin-right-10"></i>
            Aktivite Oluştur
          </el-button>
        </div>
      </el-row>
    <el-tabs v-model="activeName" class="tab_bg" @tab-click="handleClick">
      <el-tab-pane :label="$t('focus.userActivityList')" name="userActivityList">
        <user-activity-list
          v-if="activeName=='userActivityList'"
          :key="activeName && index"
          :focus="focus"
          :customer-id="customerId"
          :finance-type="financeType"
          :need-type="needType"
          :internal-organization-id="organizationId"
          :is-c-w ="isCW"
          :have-customer-id="haveCustomerId"
          :show-button="showButton"
          :show-other-branch-activity="showOtherBranchActivity"
          :internal-organization-list-type="internalOrganizationListType"/>
      </el-tab-pane>
      <el-tab-pane :label="$t('focus.focusUserCompletedActivityList')" name="userCompletedActivityList">
        <user-completed-activity-list
          v-if="activeName=='userCompletedActivityList'"
          :focus="focus"
          :customer-id="customerId"
          :finance-type="financeType"
          :need-type="needType"
          :internal-organization-id="organizationId"
          :is-c-w ="isCW"
          :have-customer-id="haveCustomerId"
          :show-button="showButton"
          :show-other-branch-activity="showOtherBranchActivity"
          :key="activeName && index"
          :internal-organization-list-type="internalOrganizationListType"/>
      </el-tab-pane>
      <el-tab-pane :label="$t('focus.focusUserActivityHistory')" name="userActivityHistory">
        <user-activity-history
          v-if="activeName=='userActivityHistory'"
          :focus="focus"
          :customer-id="customerId"
          :key="activeName && index"
          />
      </el-tab-pane>
    </el-tabs>
    </div>
</template>
<script>

import userActivityList from './CustomerActivityList.vue'
import userCompletedActivityList from './CustomerActivityCompletedActivityList.vue'
import userActivityHistory from './CustomerActivityHistory.vue'
import { hasActionPermission } from '@/permission.js'
import CustomerActivity from './CustomerActivityCreateComplete.vue'

export default {
  components: {
    'userActivityList': userActivityList,
    'userCompletedActivityList': userCompletedActivityList,
    'userActivityHistory': userActivityHistory,
    CustomerActivity
  },
  props: {
    customerId: {
      type: Number,
      default: 0
    },
    haveCustomerId: {
      type: Boolean,
      default: false
    },
    focus: {
      type: Boolean,
      default: false
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
    organizationId: {
      type: String,
      default: ''
    },
    showOtherBranchActivity: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      activeName: this.$route.query.activeName ? this.$route.query.activeName : 'userActivityList',
      internalOrganizationListType: '',
      index: 0,
      dialogActivity: false,
      internalOrganization: '',
      customerActivityId: 0
    }
  },
  created() {
    if (hasActionPermission(this.$store.getters.permission_routers, 'branchInternalOrganizationListTypeActivityList')) {
      this.internalOrganizationListType = 'branch'
    } else {
      this.internalOrganizationListType = 'normal'
    }
  },
  methods: {
    hasActionPermission,
    handleClick(tab, event) {
      this.activeName = tab.props.name
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
      // this.getAllActivities(this.listQuery)
    },
  }

}
</script>
<style lang="scss" scoped>

.call-center-perspective {
  margin: 80px 0 0;
  padding: 0 0 20px;
  border-radius: 12px;
  border: solid 1px #ddd;
  background-color: #fff;

  .header-bg {
    height: 80px;
    padding: 15px 20px;
    border-top-left-radius: 12px;
    border-top-right-radius: 12px;
    border-bottom: solid 1px #ddd;
    background-color: #fff;
    align-items: center;
    justify-content: space-between;

    div {
    p:first-child {
      font-size: 16px;
      font-weight: 500;
      font-stretch: normal;
      font-style: normal;
      line-height: normal;
      letter-spacing: normal;
      color: #ff7c52;
      margin: 0;
      }
    p:last-child {
      font-weight: normal;
      font-stretch: normal;
      font-style: normal;
      line-height: normal;
      letter-spacing: normal;
      color: #909399;
      margin: 0;
      }
    }
  }
  .tab_bg {
  // border-radius: 12px;
  // border: solid 1px #ddd;
  background-color: #fff;
  }
}
</style>
