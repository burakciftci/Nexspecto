import request from '../../utils/request'

export default {
    getPersonByUserGuid(guid) {
      return request('get', `api/hr/v1/partner/userguid/` + guid)
    },
    updateContactMech(model) {
      return request('put', `api/hr/v1/partner/updateContactMech`, model)
    },
    updatePassword(model) {
      return request('post', `api/i/v1/partnerpolicy/updatePassword?oldPassword=${model.oldPassword}&newPassword=${model.newPassword}&id=${model.id}`)
    }
}
