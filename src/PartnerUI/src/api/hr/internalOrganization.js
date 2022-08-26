import request from '../../utils/request'

export default {
  getInternalOrganizations(listQuery) {
    return request('get', `api/hr/v1/organization/list/?searchKey=` + listQuery.searchKey + '&pageSize=' + listQuery.pageSize + '&page=' + listQuery.page + '&isActive=' + listQuery.isActive + '&isPassive=' + listQuery.isPassive)
  },
  getById(partyId) {
    return request('get', `api/hr/v1/organization/item/${partyId}`)
  },
  getByGuid(createActivityId) {
    return request('get', `api/hr/v1/organization/item/getByGuid/${createActivityId}`)
  },
  create(organization) {
    return request('post', 'api/hr/v1/organization', organization)
  },
  delete(partyId) {
    return request('delete', `api/hr/v1/organization/${partyId}`)
  },
  update(organization) {
    return request('put', 'api/hr/v1/organization', organization)
  },
  getInternalOrganizationRoleTypes() {
    return request('get', 'api/hr/v1/organization/organizationtypes')
  },
  updateBranchLevelAttribute(partyId, value) {
    return request('put', 'api/hr/v1/organization/partyrolebranchattribute?partyId=' + partyId + '&value=' + value)
  },
  getBranchLevelAttribute(partyId) {
    return request('get', 'api/hr/v1/organization/partyrolebranchattributevalue?partyId=' + partyId)
  },
  getBranchManagers(partyId) {
    return request('get', `api/hr/v1/organization/branchManagers/${partyId}`)
  },
  getCityId(internalOrganizationId) {
    return request('get', 'api/hr/v1/organization/getCityId?internalOrganizationId=' + internalOrganizationId)
  },
  isBranchHasCity(internalOrganizationId) {
    return request('get', 'api/hr/v1/organization/isBranchHasCity?internalOrganizationId=' + internalOrganizationId)
  }
}
