import request from '../../utils/request'

export default {
  getPortfolioParty(party) {
    return request('get', `api/crm/v1/partner/getPortfolioParty/${party}`)
  },
  getBmtCustomersByCustomerList(customerList) {
    return request('get', `api/crm/v1/partner/getBmtCustomersByCustomerList/${customerList}`)
  },
  getBmtCustomersByPortfoloPartyId(partyId) {
    return request('get', `api/crm/v1/partner/getBmtCustomersByPortfoloPartyId/${partyId}`)
  },
  getBmtlistBySystem(party, portfolioCounterType) {
    return request('get', 'api/crm/v1/partner/getBmtlistBySystem?party=' + party + '&portfolioCounterType=' + portfolioCounterType)
  },
  getCustomerBranchs(partyId) {
    return request('get', `api/crm/v1/partner/getCustomerBranchs/${partyId}`)
  },
  getBmtCustomersByBranch(branchId) {
    return request('get', `api/crm/v1/partner/getBmtCustomersByBranch/${branchId}`)
  },
}
