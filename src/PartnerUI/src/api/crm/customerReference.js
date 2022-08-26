import request from '../../utils/request'

export default {
  getReferences(query) {
    return request('post', `api/crm/v1/person/getReferences/${query.customerPartyId}`, query)
  },
  addReference(model) {
    return request('post', `api/crm/v1/person/addReference/${model.customerPartyId}`, model)
  },
  resendSms(activityId, customerId) {
    return request('put', 'api/crm/v1/person/reSendSms?activityId=' + activityId + '&customerId=' + customerId)
  }
}
