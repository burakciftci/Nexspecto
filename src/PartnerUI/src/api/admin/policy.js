import request from '../../utils/request'

export default {
  createUser(model) {
    return request('post', 'account/createUser/', model)
  }
}
