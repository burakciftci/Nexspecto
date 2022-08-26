import request from '../../utils/request'

export default {
  getDocumentGroupTypesWithDocumentTypes(documentGroupType, indices) {
    var s = JSON.stringify(indices)
    return request('get', `api/d/v1/documentGroupType/groupTypesWithDocumentTypes?documentGroupType=${documentGroupType}&indicesString=${s}`)
  }
}
