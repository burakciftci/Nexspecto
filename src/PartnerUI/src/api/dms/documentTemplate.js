import request from '../../utils/request'

export default {
  getDocumentTypeById(documentTypeId) {
    return request('get', `api/d/v1/documentType/${documentTypeId}`)
  },
  createDocumentFromType(postForm) {
    return request('post', `api/d/v1/documentTemplate/createDocumentFromType`, postForm)
  },
  getDocumentTemplates(listQuery) {
    return request('get', `api/d/v1/documentTemplate?pageSize=` + listQuery.limit + '&pageIndex=' + listQuery.page + '&archive=' + listQuery.isArchive + '&active=' + listQuery.isActive)
  },
  getTemplateList(documentType) {
    return request('get', `api/d/v1/partner/documentTemplates?documentType=` + documentType)
  },
  getDocumentTemplateById(documentTemplateId) {
    return request('get', `api/d/v1/documentTemplate/getDocumentTemplateById/${documentTemplateId}`)
  },
  updateDocumentTemplate(documentTemplateValue) {
    return request('put', `api/d/v1/documentTemplate`, documentTemplateValue)
  },
  archiveTemplate(id) {
    return request('post', `api/d/v1/documentTemplate/archiveTemplate/${id}`)
  },
  unarchiveTemplate(id) {
    return request('delete', `api/d/v1/documentTemplate/unarchiveTemplate/${id}`)
  },
  async getDocumentTypes() {
    const i = await request('get', 'api/d/v1/documentType?pageSize=100000&pageIndex=1&archive=false&active=true&sortby=&orderby=')
    return i.data
  }
}
