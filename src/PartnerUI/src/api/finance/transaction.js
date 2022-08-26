import request from '../../utils/request'

export default {
  getTempTransactionList(productId) {
    return request('get', 'api/f/v1/partner/temptransactionslistbyid?productId=' + productId)
  }
}


