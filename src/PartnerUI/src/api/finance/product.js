import request from '../../utils/request'

export default {
  getCalculationId(productId) {
    return request('get', `api/f/v1/partner/getCalculationId/${productId}`)
  },

  getProductCardList(calculationId) {
    return request('get', `api/f/v1/partner/getProductCardList/${calculationId}`)
  },

  getCustomer(calculationId) {
    return request('get', `api/f/v1/partner/getCustomer/${calculationId}`)
  },

  anyFirstPaymentPromiseNote(productId) {
    return request('get', `api/f/v1/partner/anyFirstPaymentPromiseNote/${productId}`)
  },

  getSumFirstPaymentPromiseNote(productId) {
    return request('get', `api/f/v1/partner/getSumFirstPaymentPromiseNote/${productId}`)
  },

  getFirstPaymentAmount(productId) {
    return request('get', `api/f/v1/partner/getFirstPaymentAmount/${productId}`)
  },
}
