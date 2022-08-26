import request from '../../utils/request'

export default {
  getPersonByPartyId(partyId) {
    return request('get', `api/crm/v1/partner/personByPartyId/${partyId}`)
  },
  getPersonValidation(personId) {
    return request('get', `api/crm/v1/partner/validation?partyId=${personId}`)
  },
  getPersonValidationAddresses(personId) {
    return request('get', `api/crm/v1/partner/validationAddress?partyId=${personId}`)
  },
  getPersonFindexValidation(personId) {
    return request('get', `api/crm/v1/partner/getPersonFindexValidation?partyId=${personId}`)
  },
  getPersonRelationFindexValidation(personId) {
    return request('get', `api/crm/v1/partner/getPersonRelationFindexValidation?partyId=${personId}`)
  },
  getPersonGeneralEditLookupFields() {
    return request('get', 'api/crm/v1/partner/getPersonGeneralEditLookupFields')
  },
  sendApprove(model) {
    return request('post', 'api/crm/v1/partner/sendApprove', model)
  },
  getPartyDataChangesById(partyDataChangeId) {
    return request('get', `api/crm/v1/partner/getPartyDataChangesById?partyDataChangeId=${partyDataChangeId}`)
  }
}
