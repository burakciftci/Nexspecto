<template>
  <div>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane :label="$t('focus.userActivityList')" name="userActivityList" />
      <el-tab-pane :label="$t('focus.focusUserCompletedActivityList')" name="userCompletedActivityList" />
    </el-tabs>
    <el-row style="margin-bottom:0px;">
      <el-col :span="24" style="padding-bottom:0px; padding-top:0px; min-width:66%;">
        <user-activity-list
          v-if="activeName=='userActivityList'"
          :key="activeName"
          :type="'ongoing'"
          :customer-id="customerId"
          :finance-type="financeType"
          :need-type="needType"
          :internal-organization-id="organizationId"
          :is-c-w ="isCW"
          :have-customer-id="haveCustomerId"
          :show-button="showButton"
          :internal-organization-list-type="internalOrganizationListType"/>
        <user-activity-list
          v-if="activeName=='userCompletedActivityList'"
          :key="activeName"
          :type="'completed'"
          :customer-id="customerId"
          :finance-type="financeType"
          :need-type="needType"
          :internal-organization-id="organizationId"
          :is-c-w ="isCW"
          :have-customer-id="haveCustomerId"
          :show-button="showButton"
          :internal-organization-list-type="internalOrganizationListType"/>
      </el-col>
    </el-row>
  </div>
</template>
<script>

import userActivityList from './CustomerActivityList'
import { hasActionPermission } from '@/permission.js'

export default {
  components: {
    userActivityList
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
  },
  data() {
    return {
      activeName: this.$route.query.activeName ? this.$route.query.activeName : 'userActivityList',
      internalOrganizationListType: '',
      index: 0,
      dialogActivity: false,
      internalOrganization: ''
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
      console.log(tab, event)
      // this.activeName = tab.name
    }
  }

}
</script>
<style scoped>

</style>
