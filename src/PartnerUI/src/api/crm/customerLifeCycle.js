import request from '../../utils/request'

export default {  
  getCustomerLifeCycleListByPartyId(partyId, listQuery) {
      return request('get', 'api/crm/v1/partner/customerLifeCycleListByPartyId?partyId=' + partyId + '&pageSize=' + listQuery.pageSize + '&pageIndex=' + listQuery.pageIndex)
  },
  // getPartySourceTypeList() {
  //   return request('get', 'api/crm/v1/customerLifeCycle/getPartySourceTypeList')
  // },
  getCustomerPortfolioLifeCycleListByPartyId(partyId, listQuery) {
    return request('get', 'api/crm/v1/partner/customerPortfolioLifeCycleListByPartyId?partyId=' + partyId + '&pageSize=' + listQuery.pageSize + '&pageIndex=' + listQuery.pageIndex)
  },
  getPartyPortfolioRegulations(partyPortfolioId) {
    return request('get', 'api/crm/v1/partner/getPartyPortfolioRegulations/' + partyPortfolioId)
  }
}
