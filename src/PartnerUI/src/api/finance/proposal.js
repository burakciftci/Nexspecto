import request from '../../utils/request'

export default {
  saveProposal(calculationModel) {
    return request('post', 'api/f/v1/sale/saveProposal/', calculationModel)
  },
  saveRevisionProposal(calculationModel) {
    return request('post', 'api/f/v1/sale/saveRevisionProposal/', calculationModel)
  },
  getProposalList(queryModel) {
    return request('post', `api/f/v1/sale/proposal/`, queryModel)
  },
  getProposalListById(customerId) {
    return request('get', `api/f/v1/product/getProposalListById/${customerId}`)
  },
  sendProposalAsEmail(email, content) {
    return request('post', 'api/f/v1/product/sendProposalAsEmail/', { email: email, content: content })
  },
  getFirstPayment(calculationId) {
    return request('get', 'api/f/v1/product/firstpayment?calculationId=' + calculationId)
  }
}
