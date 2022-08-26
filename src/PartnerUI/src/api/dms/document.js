import request from '../../utils/request'

export default {

  createDocument(viewModel) {
    const data = new FormData()
    data.append('documentId', viewModel.documentId)
    data.append('documentType', viewModel.documentType)
    data.append('documentName', viewModel.documentName)
    data.append('indicesString', JSON.stringify(viewModel.indices))
    data.append('isCzmDocuments', viewModel.isCzmDocuments)
    data.append('withoutIndex', viewModel.withoutIndex)
    for (var i = 0; i < viewModel.files.length; i++) {
      const file = viewModel.files[i].raw
      data.append('files[' + i + ']', file)
    }
    return request('post', `api/d/v1/partner/createDocument`, data, undefined, { headers: { 'Content-Type': 'multipart/form-data' }})
  },
  getDocument(documentType, indices, isActive, withoutIndex, canSeeArchive, isCzmDocuments) {
    var s = JSON.stringify(indices)
    return request('get', `api/d/v1/partner/document?documentType=${documentType}&indicesString=${s}&isActive=${isActive}&withoutIndex=${withoutIndex}&canSeeArchive=${canSeeArchive}&isCzmDocuments=${isCzmDocuments}`)
  },
  archive(id) {
    return request('post', `api/d/v1/partner/archive/${id}`)
  },
  unarchive(id) {
    return request('delete', `api/d/v1/partner/unarchive/${id}`)
  },
  view(document) {
    return request('get', `api/d/v1/viewer?year=${document.year}&month=${document.month}&day=${document.day}&documentId=${document.documentId}&fileId=${document.fileId}`)
  },
  get(path) {
    return request('get', 'api/d/v1/document', path)
  },
  getImage(employeeId) {
    return request('get', `api/d/v1/integration?employeeId=${employeeId}`)
  },
  addImage(formData) {
    return request('post', `api/d/v1/document/addimage`, formData, undefined, { headers: { 'Content-Type': 'multipart/form-data' }})
  }
}
