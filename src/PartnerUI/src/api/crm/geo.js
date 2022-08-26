import request from '../../utils/request'

export default {

  getCountryList() {
    return request('get', `api/crm/v1/partner/getCountryList`)
  },
  getProvinceListByCountryId(countryId) {
    return request('get', `api/crm/v1/partner/getProvinceListByCountryId/${countryId}`)
  },
  getDistrictListByProvinceId(provinceId) {
    return request('get', `api/crm/v1/partner/getDistrictListByProvinceId/${provinceId}`)
  }
}
