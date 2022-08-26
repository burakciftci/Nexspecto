
import request from '../../utils/request'

export default {
  getInternalOrganization(query, sub, partyRoleType, internalOrganizationId, onlyActive, hasPortfolio = false, containsItself = false) {
    return request('get', `api/k/v1/partner/internalOrganizations?q=${query}&sub=${sub}&partyRoleType=${partyRoleType}&internalOrganizationId=${internalOrganizationId}&onlyActive=${onlyActive}&hasPortfolio=${hasPortfolio}&containsItself=${containsItself}`)
  }
}
