import request from '../../utils/request'

export default {
  getPersonIdentityCreateLookupFields() {
    return request('get', 'api/crm/v1/personIdentity/getPersonIdentityCreateLookupFields')
  },
  getPersonIdentityEditLookupFields() {
    return request('get', `api/crm/v1/personIdentity/getPersonIdentityEditLookupFields`)
  },
  getPersonDrivingLicenseEditLookupFields() {
    return request('get', `api/crm/v1/personIdentity/getPersonDrivingLicenseEditLookupFields`)
  },
  getPersonPassportEditLookupFields() {
    return request('get', `api/crm/v1/personIdentity/getPersonPassportEditLookupFields`)
  },
  getPersonResidencePermitEditLookupFields() {
    return request('get', `api/crm/v1/personIdentity/getPersonResidencePermitEditLookupFields`)
  },
  getPersonIdentityEdit(partyId) {
    return request('get', `api/crm/v1/personIdentity/getPersonIdentityEdit/${partyId}`)
  },
  getPersonDrivingLicenseEdit(partyId) {
    return request('get', `api/crm/v1/personIdentity/getPersonDrivingLicenseEdit/${partyId}`)
  },
  getPersonPassportEdit(partyId) {
    return request('get', `api/crm/v1/personIdentity/getPersonPassportEdit/${partyId}`)
  },
  getPersonResidencePermitEdit(partyId) {
    return request('get', `api/crm/v1/personIdentity/getPersonResidencePermitEdit/${partyId}`)
  },
  updatePersonIdentity(personIdentity) {
    return request('put', 'api/crm/v1/personIdentity/updatePersonIdentity', personIdentity)
  },
  updatePersonDrivingLicense(personDrivingLicense) {
    return request('put', 'api/crm/v1/personIdentity/updatePersonDrivingLicense', personDrivingLicense)
  },
  updatePersonPassport(personPassport) {
    return request('put', 'api/crm/v1/personIdentity/updatePersonPassport', personPassport)
  },
  updatePersonResidencePermit(personResidencePermit) {
    return request('put', 'api/crm/v1/personIdentity/updatePersonResidencePermit', personResidencePermit)
  }
}
