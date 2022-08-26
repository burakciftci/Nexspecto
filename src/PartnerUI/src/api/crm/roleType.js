import request from '../../utils/request'

export default {

  createRoleType(roleTypeValue) {
    return request('post', `api/crm/v1/roleType/createRoleType`, roleTypeValue)
  },
  updateRoleType(roleTypeValue) {
    return request('put', `api/crm/v1/roleType/updateRoleType`, roleTypeValue)
  },
  getRoleTypes() {
    return request('get', `api/crm/v1/roleType/getRoleTypes`)
  },
  getCustomerRoles(partyId) {
    return request('get', 'api/crm/v1/party/getCustomerRoles?partyId=' + partyId)
  },
  getRoleTypeValuesByPage(listQuery) {
    return request('get', 'api/crm/v1/roleType/getRoleTypeValuesByPage?pageSize=' + listQuery.limit + '&pageIndex=' + listQuery.page)
  }
}
