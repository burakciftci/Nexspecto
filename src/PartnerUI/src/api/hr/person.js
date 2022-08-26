import request from '../../utils/request'

export default {
  getPersonById(id) {
    return request('get', `api/hr/v1/person/` + id)
  },
  getPersonByUserGuid(guid) {
    return request('get', `api/hr/v1/person/userguid/` + guid)
  },
}
