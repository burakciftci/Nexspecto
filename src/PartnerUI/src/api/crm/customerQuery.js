import request from '../../utils/request'

export default {
  findById(customerId) {
    return request('get', `api/crm/v1/partner/FindById?customerId=${customerId}`)
  },
  findCustomers(searchArea, searchKey) {
    return request('get', 'api/crm/v1/partner/FindCustomers?searchArea=' + searchArea + '&searchKey=' + searchKey)
  },
  queryCustomers(listQuery) {
    return request('get', 'api/crm/v1/partner/queryCustomers?searchArea=' + listQuery.searchArea + '&pageSize=' + listQuery.limit + '&pageIndex=' +
    listQuery.page + '&archive=' + listQuery.isArchive + '&active=' + listQuery.isActive + '&orderby=' + listQuery.orderby + '&sortby=' + listQuery.sortby + '&searchKey=' + listQuery.searchText +
    '&dayFilter=' + listQuery.dayFilter + '&dateRange=' + listQuery.dateRange + '&internalOrganizationId=' + listQuery.internalOrganizationId + '&employeeId=' + listQuery.employeeId +
    '&customerTrackStatus=' + listQuery.customerTrackStatusId + '&customerStage=' + listQuery.customerStageId + '&customerTrackType=' + listQuery.customerTrackTypeId)
  },
  getCustomerListEnumerations() {
    return request('get', 'api/crm/v1/partner/getCustomerListEnumerations')
  }
}
