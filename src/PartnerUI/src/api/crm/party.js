
import request from '../../utils/request'
import axios from 'axios'
import { getToken } from '../../utils/auth'
export default {
  createParty(party) {
    return request('post', 'api/crm/v1/party/createParty', party)
  },
  updateParty(party) {
    return request('put', 'api/crm/v1/party/updateParty', party)
  },
  updateRole(partyRoleId, selectedRole, endDate, selectedResponsibility) {
    return request('get', 'api/crm/v1/party/updateRole?partyRoleId=' + partyRoleId + '&selectedrole=' + selectedRole + '&endDate=' + endDate + '&selectedResponsibility=' + selectedResponsibility)
  },
  createRole(partyId, selectedRole, endDate, selectedResponsibility) {
    return request('get', 'api/crm/v1/party/createRole?partyId=' + partyId + '&selectedrole=' + selectedRole + '&endDate=' + endDate + '&selectedResponsibility=' + selectedResponsibility)
  },
  deleteParty(partyId) {
    return request('delete', `api/crm/v1/party/deleteParty/${partyId}`)
  },
  getPartyById(partyId) {
    return request('get', `api/crm/v1/party/getPartyById/${partyId}`)
  },
  deleteRole(partyRoleId) {
    return request('get', 'api/crm/v1/party/deleteRole?partyRoleId=' + partyRoleId)
  },
  getPartyRoles(listQuery, filteredRoleTypeNames) {
    return request('get', 'api/crm/v1/party/getPartyRoles/?pageSize=' + listQuery.limit + '&pageIndex=' + listQuery.pageIndex + '&searchQuery=' + listQuery.searchQuery + '&filteredRoleTypeNames=' + filteredRoleTypeNames)
  },
  getAllParties(searchQueryParty, party, listQuery) {
    return request('get', 'api/crm/v1/party/getAllParties?searchQueryParty=' + searchQueryParty + '&party=' + party + '&pageSize=' + listQuery.limit + '&pageIndex=' + listQuery.pageIndex)
  },
  getAllReferences(searchQueryParty, source, listQuery) {
    return request('get', 'api/crm/v1/party/getAllReferences?searchQueryParty=' + searchQueryParty + '&source=' + source + '&pageSize=' + listQuery.limit + '&pageIndex=' + listQuery.pageIndex)
  },
  getAllRoles() {
    return request('get', 'api/crm/v1/party/getAllRoles')
  },
  getRoles() {
    return request('get', 'api/crm/v1/party/getRoles')
  },
  isPortfolioUpdate() {
    return request('get', 'api/crm/v1/party/isPortfolioUpdate')
  },
  getParties() {
    return request('get', 'api/crm/v1/party/getParties')
  },
  getPartyTypes() {
    return request('get', 'api/crm/v1/party/getPartyTypes')
  },
  getInternalOrganizationTree() {
    return request('get', 'api/crm/v1/party/internalorganizationtree')
  },
  getEmployeeList(internalOrganizationId) {
    return request('get', `api/crm/v1/party/employeeList/${internalOrganizationId}`)
  },
  getPersonListByPage(listQuery) {
    return request('get', 'api/crm/v1/party/getPersonListByPage?pageSize=' + listQuery.limit + '&pageIndex=' +
     listQuery.page + '&archive=' + listQuery.isArchive + '&active=' + listQuery.isActive + '&orderby=' + listQuery.orderby + '&sortby=' + listQuery.sortby + '&searchKey=' + listQuery.searchText +
     '&dayFilter=' + listQuery.dayFilter + '&dateRange=' + listQuery.dateRange + '&roleType=' + listQuery.roleType)
  },
  queryCustomers(listQuery) {
    return request('get', 'api/crm/v1/partner/queryCustomers?searchArea=' + listQuery.searchArea +
        '&pageSize=' + listQuery.limit +
        '&pageIndex=' + listQuery.page +
        '&archive=' + listQuery.isArchive +
        '&active=' + listQuery.isActive +
        '&orderby=' + listQuery.orderby +
        '&sortby=' + listQuery.sortby +
        '&searchKey=' + listQuery.searchText +
        '&dayFilter=' + listQuery.dayFilter +
        '&dateRange=' + listQuery.dateRange +
        '&internalOrganizationId=' + listQuery.internalOrganizationId +
        '&employeeId=' + listQuery.employeeId +
        '&customerTrackStatus=' + listQuery.customerTrackStatusId +
        '&customerStage=' + listQuery.customerStageId +
        '&customerTrackType=' + listQuery.customerTrackTypeId +
        '&utmReference=' + listQuery.utmReference +
        '&utmSource=' + listQuery.partySource +
        '&occupation=' + listQuery.occupation +
        '&city=' + listQuery.city +
        '&district=' + listQuery.county +
        '&czmId=' + (listQuery.czmPartyId || '')
    )
  },
  getPassiveList(startDate, endDate, searchArea, pageSize, pageIndex, cityId) {
    return request('get', 'api/crm/v1/customer/getPassivePersonList?startDate=' + startDate + '&endDate=' + endDate + '&searchArea=' + searchArea + '&pageSize=' + pageSize + '&pageIndex=' + pageIndex + '&cityId=' + cityId)
  },
  exportPassiveCustomersExcel(startDate, endDate, cityId) {
    return axios({
      url: 'api/crm/v1/customer/GetPassiveCustomersExcel?startDate=' + startDate + '&endDate=' + endDate + '&cityId=' + cityId,
      headers: {
        'Authorization': `Bearer ${getToken()}`
      },
      method: 'get',
      responseType: 'blob',
      baseURL: process.env.BASE_API
    })
  },
  buildQueryFromObject(queryObject) {
    const query = Object.keys(queryObject).map(key => `${key}=${queryObject[key]}`).join('&')
    return query
  },
  isUserAuthorizedToView(partyId, authorizationType = 'PartyId') {
    return request('get', `api/crm/v1/party/isUserAuthorizedToView/${partyId}/${authorizationType}`)
  }
}
