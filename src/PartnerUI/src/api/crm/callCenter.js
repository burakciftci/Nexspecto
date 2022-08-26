import request from '../../utils/request'

export default {
    searchCallCenter(phoneNumber) {
        return request('get', 'api/crm/v1/partner/searchCallCenter?phoneNumber=' + phoneNumber)
    },
    saveCallCenter(model, inboundString) {
        return request('post', `api/crm/v1/partner/saveCallCenter/` + inboundString, model)
    },
    updateCallCenter(model, inboundString) {
        return request('put', `api/crm/v1/partner/updateCallCenter/` + inboundString, model)
    },
    getLookupValues(countryId) {
        return request('get', `api/crm/v1/partner/lookupValues/${countryId}`)
    },
    getProvinceListByCountryId(countryId) {
        return request('get', `api/crm/v1/partner/getProvinceListByCountryId/${countryId}`)
    },
    getDistrictListByProvinceId(provinceId) {
        return request('get', `api/crm/v1/partner/getDistrictListByProvinceId/${provinceId}`)
    },
    findBranchesByIds(provinceId, districtId) {
        return request('get', 'api/crm/v1/partner/findbranchesbyids?provinceId=' + provinceId + '&districtId=' + districtId)
    },
    getSourceOptions(callCenter) {
        return request('get', 'api/crm/v1/partner/getSourceOptions?callCenter=' + callCenter)
    },
    getAvailableData(partyId) {
        return request('get', 'api/crm/v1/partner/getAvailableData?partyId=' + partyId)
    },
    getReferanceOptions(source) {
        return request('get', 'api/crm/v1/partner/getReferanceOptions?source=' + source)
    },
      getCampaignOptions(source) {
        return request('get', 'api/crm/v1/partner/getCampaignOptions?source=' + source)
    },
      getCorporateCampaignOptions(source) {
        return request('get', 'api/crm/v1/partner/getCorporateCampaignOptions?source=' + source)
    },
    getAllParties(searchQueryParty, party, listQuery) {
        return request('get', 'api/crm/v1/partner/getAllParties?searchQueryParty=' + searchQueryParty + '&party=' + party + '&pageSize=' + listQuery.limit + '&pageIndex=' + listQuery.pageIndex)
    },
    getAllReferences(searchQueryParty, source, listQuery) {
        return request('get', 'api/crm/v1/partner/getAllReferences?searchQueryParty=' + searchQueryParty + '&source=' + source + '&pageSize=' + listQuery.limit + '&pageIndex=' + listQuery.pageIndex)
    },
    getCustomerCallCenterStageById(partyId) {
        return request('get', 'api/crm/v1/partner/getCustomerCallCenterStageById?partyId=' + partyId)
    },
    createActivityLog(activityType, infoString, customerCallCenterId, callId) {
        return request('post', 'api/crm/v1/partner/callcenterlog?activitytype=' + activityType + '&infostring=' + infoString + '&customerCallCenterId=' + customerCallCenterId + '&callId=' + callId)
    },
    getInternalOrganization(query, sub, partyRoleType, internalOrganizationId, onlyActive, hasPortfolio = false, containsItself = false) {
        return request('get', `api/hr/v1/partner/internalOrganization?q=${query}&sub=${sub}&partyRoleType=${partyRoleType}&internalOrganizationId=${internalOrganizationId}&onlyActive=${onlyActive}&hasPortfolio=${hasPortfolio}&containsItself=${containsItself}`)
    },
    getCustomerValues(customerId) {
        return request('get', `api/crm/v1/partner/customerValues/` + customerId)
    },
    getActivityValues(activityId, isCompleted) {
        return request('get', `api/crm/v1/partner/activityValues/?activityId=` + activityId + '&isCompleted=' + isCompleted)
    },
    createCustomerActivity(model) {
        return request('post', `api/crm/v1/partner/createCustomerActivity`, model)
    },
    updateCustomerActivity(model) {
        return request('put', `api/crm/v1/partner/updateCustomerActivity`, model)
    },
    getPurposeList(typeId) {
        return request('get', `api/crm/v1/partner/communicationPurposes?typeId=` + typeId)
    },
    getResultList(typeId, statusId) {
        return request('get', `api/crm/v1/partner/communicationResults?typeId=` + typeId + '&statusId=' + statusId)
    },
    checkAvailability(customerId, agentPartyId, activityId, isCompleted) {
        return request('get', `api/crm/v1/partner/checkAvailability/?customerId=` + customerId + '&agentPartyId=' + agentPartyId + '&activityId=' + activityId + '&isCompleted=' + isCompleted)
    },
    getCallCenterActivity(phoneNumber, partyId) {
        let query = '?'
        if (phoneNumber) {
          query += `phoneNumber=${phoneNumber}`
        } else {
          query += `partyId=${partyId}`
        }
        return request('get', `api/crm/v1/partner/getCallCenterActivity${query}`)
    },
    validateOtp(model) {
        return request('post', `api/crm/v1/partner/validateOtp/`, model)
    },
    getOtpCode(model) {
        return request('post', `api/crm/v1/partner/getOtpCode/`, model)
    },
    isPhoneNumberExist(phoneNumber) {
        return request('get', 'api/crm/v1/partner/isPhoneNumberExist?phoneNumber=' + phoneNumber)
    },
    checkHasActiveProject(partyId) {
        return request('get', 'api/crm/v1/partner/checkHasActiveProject?partyId=' + partyId)
    },
    resendVerificationEmail(model) {
        return request('post', 'api/crm/v1/partner/resendVerificationEmail', model)
    },
    getDropdownValues() {
        return request('get', `api/crm/v1/partner/dropdownValues`)
    },
}
