import request from '../../utils/request'

export default {
 createForm(viewModel) {
    const data = new FormData()
    data.append('networkType', viewModel.networkType)
    data.append('transactionId', viewModel.transactionId)
    data.append('registerUserId', viewModel.registerUserId)
    const file = viewModel.image.raw
    data.append('image', file)
    return request('post', 'api/v1/Form', data,undefined, { headers: { 'Content-Type': 'multipart/form-data' }})
  },
  getList(viewModel) {
    return request('get', 'api/v1/Form/list?networkType=' + viewModel.networkType + '&transactionId=' + viewModel.transactionId +  '&pageSize=' + viewModel.pageSize + '&pageIndex=' + viewModel.pageIndex)
  },
  getAll() {
    return request('get', `api/v1/Form/`)
  },
  updateUserForm(id, viewModel) {
    return request('put', `api/v1/Form/${id}`, viewModel)
  },
  getById(id) {
    return request('get', `api/v1/Form/${id}`)
  }

}
