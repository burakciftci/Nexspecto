import request from '../../utils/request'

export default { 
  getActivities(listQuery) {
      return request('get', `api/crm/v1/partner/focusactivitylist/${listQuery.sub}?pageSize=${listQuery.limit}&pageIndex=${listQuery.page}&searchKey=${listQuery.searchText}&archive=${listQuery.isArchive}&active=${listQuery.isActive}&status=${listQuery.status}&orderby=${listQuery.orderby}&sortby=${listQuery.sortby}&dayFilter=${listQuery.dayFilter}&activityType=${listQuery.activityType}&activityRating=${listQuery.activityRating}&dateRange=${listQuery.dateRange}&internalOrganizationId=${listQuery.internalOrganizationId}&employeeId=${listQuery.employeeId}&activityDetailType=${listQuery.activityDetailType}&createCustomerStage=${listQuery.createCustomerStage}&isCompleted=${listQuery.isCompleted}&haveCustomerId=${listQuery.haveCustomerId}&customerId=${listQuery.customerId}
      &communicationType=${listQuery.communicationType}&communicationPurpose=${listQuery.communicationPurpose}&customerRating=${listQuery.rating}&communicationStatus=${listQuery.communicationStatus}&communicationResult=${listQuery.communicationResult}&customerStage=${listQuery.customerStage}`)
  },
  getDropdownValues() {
      return request('get', `api/crm/v1/partner/dropdownValues`)
  },
  
  getCustomerValues(customerId) {
    return request('get', `api/crm/v1/partner/customerValues/` + customerId)
  },
  getActivityValues(activityId) {
    return request('get', `api/crm/v1/partner/activityValues/` + activityId)
  },
  createCustomerActivity(model) {
    return request('post', `api/crm/v1/partner/createCustomerActivity`, model)
  },
  updateCustomerActivity(model) {
    return request('put', `api/crm/v1/partner/updateCustomerActivity`, model)
  },
  getPurposeList(typeId) {
    return request('get', `api/crm/v1/partner/communicationPurposes?typeId=` + typeId)
  },
  getResultList(typeId, statusId) {
    return request('get', `api/crm/v1/partner/communicationResults?typeId=` + typeId + '&statusId=' + statusId)
  },
  checkAvailability(customerId, agentPartyId, activityId) {
    return request('get', `api/crm/v1/partner/checkAvailability/?customerId=` + customerId + '&agentPartyId=' + agentPartyId + '&activityId=' + activityId)
  },
  getCustomerLifeCycleListByPartyId(partyId, listQuery) {
    return request('get', 'api/crm/v1/partner/customerLifeCycleListByPartyId?partyId=' + partyId + '&pageSize=' + listQuery.pageSize + '&pageIndex=' + listQuery.pageIndex)
  },
}
