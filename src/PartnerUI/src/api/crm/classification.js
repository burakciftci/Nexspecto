import request from '../../utils/request'

export default {
  createClassificationTypeValue(classificationValue) {
    return request('post', `api/crm/v1/classification`, classificationValue)
  },
  deleteClassificationTypeValue(id) {
    return request('delete', `api/crm/v1/classification/deleteClassificationTypeValue/${id}`)
  },
  updateClassificationTypeValue(classificationValue) {
    return request('put', `api/crm/v1/classification`, classificationValue)
  },
  getClassificationValues(classificationType) {
    return request('get', `api/crm/v1/lookup/getClassificationTypeValues/${classificationType}`)
  },
  getClassificationTypes() {
    return request('get', `api/crm/v1/classification/getClassificationTypes`)
  },
  getSegmentCLassficationValues() {
    return request('get', `api/crm/v1/classification/getSegmentCLassficationValues`)
  },
  getClassificationValuesByOccuptionMap(occupationId) {
    return request('get', `api/crm/v1/classification/getClassificationValuesByOccuptionMap/${occupationId}`)
  },
  getClassificationValuesByPage(listQuery) {
    return request('get', 'api/crm/v1/classification/getClassificationValuesByPage?pageSize=' + listQuery.limit + '&pageIndex=' + listQuery.page + '&type=' + listQuery.type)
  },
  getNewsCategoryClassificationValues() {
    return request('get', 'api/crm/v1/classification/getNewsCategoryClassificationValues')
  }
}
