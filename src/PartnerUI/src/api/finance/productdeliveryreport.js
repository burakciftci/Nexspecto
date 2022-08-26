import request from '../../utils/request'

export default{

  getLimitFullDays() {
    return request('get', 'api/f/v1/partner/limitfulldays')
  },
  getLimitFullDaysByDeliveryAmount(deliveryAmount) {
    return request('get', 'api/f/v1/partner/limitfulldaysbydeliveryamount?deliveryamount=' + deliveryAmount)
  }
}
