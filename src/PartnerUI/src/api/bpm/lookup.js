import request from '../../utils/request'

export default {
  getOrganization(user) {
    return request('get', `api/k/v1/partner/employeetree/${user}`)
  },
  getPositionTypeTree() {
    return request('get', 'api/k/v1/lookup/positiontypetree')
  },
  getInternalOrganizationTree() {
    return request('get', 'api/k/v1/lookup/internalorganizationtree')
  },
  getPositionEmployeeTree() {
    return request('get', 'api/k/v1/partner/positionemployeetree')
  },
  getCustomer(query, sub) {
    return request('get', `api/k/v1/partner/customer?q=${query}&sub=${sub}`)
  },
  getEmployeeList() {
    return request('get', 'api/k/v1/lookup/employeelist')
  },
  getPersons(query) {
    return request('get', `api/k/v1/lookup/persons/${query}`)
  },
  getPerspectiveInternalOrganizationTree(allBranchVisible = false) {
    return request('get', `api/k/v1/partner/getperspectiveinternalorganizationtree/${allBranchVisible}`)
  },
  getPerspectiveRegionBranchTree() {
    return request('get', 'api/k/v1/partner/getPerspectiveRegionBranchTree')
  },
  getPerspectiveRootTree() {
    return request('get', 'api/k/v1/partner/getPerspectiveRootBranchTree')
  },
  getPerspectiveEmployeeList(internalorganizationId, likeManager) {
    return request('get', `api/k/v1/partner/getPerspectivePositionEmployeeTree/${internalorganizationId}/${likeManager}`)
  },
  getPerspectiveEmployeeListWithoutTree(internalorganizationId) {
    return request('get', `api/k/v1/partner/perspectivepositionemployeelist/${internalorganizationId}`)
  },
  isSuperUser(sub) {
    return request('get', `api/k/v1/partner/isSuperUser/${sub}`)
  }
}
