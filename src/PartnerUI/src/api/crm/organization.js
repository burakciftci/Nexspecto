import request from '../../utils/request'

export default {
  getCorporateOrganizationValidation(partyId) {
    return request('get', `api/crm/v1/partner/getCorporateOrganizationValidation?partyId=${partyId}`)
  },
  getCorporateOrganizationAddressValidation(partyId) {
    return request('get', `api/crm/v1/partner/getCorporateOrganizationAddressValidation?partyId=${partyId}`)
  }
}
