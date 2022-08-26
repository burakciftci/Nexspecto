import request from '../../utils/request'

export default {
  getContactListsForGeneral(partyId) {
    return request('get', `api/crm/v1/partner/contactListsForGeneral/${partyId}`)
  },
  getPersonGeneralLookup() {
    return request('get', 'api/crm/v1/partner/personGeneralLookup')
  },
  getPersonGeneral(partyId) {
    return request('get', `api/crm/v1/partner/personGeneral/${partyId}`)
  },
  getPersonByPartyId(partyId) {
    return request('get', `api/crm/v1/partner/personByPartyId/${partyId}`)
  },
  getPersonFindex(partyId) {
    return request('get', `api/crm/v1/partner/personFindex/${partyId}`)
  },
  getRelationLookupFields() {
    return request('get', `api/crm/v1/partner/relationLookup`)
  },
  getRelations(listQuery) {
    return request('get', 'api/crm/v1/partner/relations?pageSize=' + listQuery.limit + '&pageIndex=' + listQuery.page + '&partyId=' + listQuery.party + '&relationType=' + listQuery.relationType)
  },
  getProvinceName(partyId) {
    return request('get', 'api/crm/v1/partner/getProvinceName?partyId=' + partyId)
  },
}
