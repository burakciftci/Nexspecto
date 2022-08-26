import request from '../../utils/request'

export default {
  getContactMechTypes() {
    return request('get', `api/crm/v1/contactMech/getContactMechTypes`)
  },
  getAddressTypesForPerson() {
    return request('get', `api/crm/v1/contactMech/getAddressTypesForPerson`)
  },
  getAddressTypesForParty() {
    return request('get', `api/crm/v1/contactMech/getAddressTypesForParty`)
  },
  getContactMechTypesForOrganization() {
    return request('get', `api/crm/v1/contactMech/getContactMechTypesForOrganization`)
  },
  getContactMechTypesForPerson() {
    return request('get', `api/crm/v1/contactMech/getContactMechTypesForPerson`)
  },
  getContactListsForPersonEdit(partyId) {
    return request('get', `api/crm/v1/contactMech/getContactListsForPersonEdit/${partyId}`)
  },
  getContactListsForOrganizationEdit(partyId) {
    return request('get', `api/crm/v1/contactMech/getContactListsForOrganizationEdit/${partyId}`)
  },
  getContactMechTypesForPersonWithPartyId(partyId) {
    return request('get', `api/crm/v1/contactMech/getContactMechTypesForPersonWithPartyId/${partyId}`)
  },
  getContactMechTypesForOrganizationWithPartyId(partyId) {
    return request('get', `api/crm/v1/contactMech/getContactMechTypesForOrganizationWithPartyId/${partyId}`)
  },
  updatePersonEditContactMech(model) {
    return request('put', 'api/crm/v1/contactMech/updatePersonEditContactMech', model)
  },
  saveMakePrimary(model) {
    return request('post', 'api/crm/v1/contactMech/saveMakePrimary', model)
  },
  validateUpdateContactMech(model) {
    return request('post', 'api/crm/v1/contactMech/validateUpdateContactMech', model)
  },
  updateOrganizationEditContactMech(model) {
    return request('put', 'api/crm/v1/contactMech/updateOrganizationEditContactMech', model)
  },
  updateAddressContactMech(address) {
    return request('put', 'api/crm/v1/contactMech/updateAddressContactMech', address)
  },
  updateContactMech(contact) {
    return request('put', 'api/crm/v1/contactMech/updateContactMech', contact)
  },
  getAddressByContactMechId(contactMechId) {
    return request('get', `api/crm/v1/contactMech/getAddressByContactMechId/${contactMechId}`)
  },
  getPartyValidation(personId) {
    return request('get', `api/crm/v1/contactMech/getAddressByPersonId/${personId}`)
  },
  getCutomerEmail(personId) {
    return request('get', `api/crm/v1/contactMech/getCutomerEmail/${personId}`)
  },
  deleteContactMech(contactMechid) {
    return request('put', `api/crm/v1/contactMech/deleteContactMech/${contactMechid}`)
  },
  getContactMechPermissions(partyContactMechid, contactMechType) {
    return request('get', `api/crm/v1/contactMech/GetContactMechPermissions/${partyContactMechid}/${contactMechType}`)
  },
  makePrimary(partyId, partyContactMechid) {
    return request('post', `api/crm/v1/contactMech/makePrimary/${partyId}/${partyContactMechid}`)
  }
}
