import request from '../../utils/request'

export default {
createUser(viewModel) { 
    return request('post', 'api/v1/Register', viewModel)
  }
}