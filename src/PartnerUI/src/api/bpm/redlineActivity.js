import request from '../../utils/request'

export default {  
  getCustomerCardActivityList(listQuery) {
    return request('get', `api/k/v1/partner/customerCardList?pageSize=${listQuery.pageSize}&pageIndex=${listQuery.pageIndex}&searchKey=${listQuery.searchKey}&status=${listQuery.status}&channel=${listQuery.channel}&assignedPartyId=${listQuery.assignedPartyId}&customerNo=${listQuery.customerNo}`)
  },
  getActivityStatusList() {
    return request('get', `api/k/v1/partner/activityStatusList`)
  },
  getActivityHistory(activityNo) {
    return request('get', `api/k/v1/partner/history/${activityNo}`)
  },
  getChannelList() {
    return request('get', `api/k/v1/partner/channelList`)
  },
  getActivityTypeList() {
    return request('get', `api/k/v1/partner/activityTypeList`)
  },
}
