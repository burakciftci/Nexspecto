import request from '../../utils/request'

export default {
  getActivityNotifications(partyId, listQuery, customerId = 0) {
      return request('get', 'api/crm/v1/partner/activityNotifications?partyId=' + partyId + '&pageSize=' + listQuery.pageSize + '&pageIndex=' + listQuery.pageIndex + '&customerId=' + customerId)
  },
  savePartyNote(model) {
      return request('post', 'api/crm/v1/partner/savePartyNote', model)
  },
  updatePartyNote(model) {
      return request('put', 'api/crm/v1/partner/updatePartyNote', model)
  },
  getLatestNote(partyId) {
      return request('get', `api/crm/v1/partner/latestNote/${partyId}`)
  },
}
