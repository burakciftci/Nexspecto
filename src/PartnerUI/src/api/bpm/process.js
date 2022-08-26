import request from '../../utils/request'

export default {
  getTemplateSummary(templateId) {
    return request('get', `api/k/v1/process/templatesummary/${templateId}`)
  },
  create(model) {
    return request('post', 'api/k/v1/process/items/', model)
  },
  getItems(listQuery) {
    return request('get', `api/k/v1/partner/getuserprocesslist/${listQuery.sub}?pageSize=${listQuery.limit}&pageIndex=${listQuery.page}&archive=${listQuery.isArchive}
    &active=${listQuery.isActive}&status=${listQuery.status}&orderby=${listQuery.orderby}&sortby=${listQuery.sortby}&dayFilter=${listQuery.dayFilter}
    &dateRange=${listQuery.dateRange}&internalOrganizationId=${listQuery.internalOrganizationId}&employeeId=${listQuery.employeeId}&searchKey=${listQuery.searchText}`)
  },
  getProcess(user, id, type) {
    return request('get', `api/k/v1/process/items/process/${user}?id=${id}&type=${type}`)
  },
  getDoneProcess(user, id, type) {
    return request('get', `api/k/v1/partner/getdoneprocesswithtypes?userCode=${user}&id=${id}&type=${type}`)
  },
  getItem(user, processId, superUserAuthorization) {
    return request('get', `api/k/v1/partner/getuserprocess/${user}/${processId}?superUserAuthorization=${superUserAuthorization}`)
  },
  getProcessSummary(user, processId) {
    return request('get', `api/k/v1/partner/getprocessSummary/${user}/${processId}`)
  },
  createTaskComment(user, taskId, newCommentModel) {
    return request('post', `api/k/v1/partner/createtaskcomment/${user}/tasks/${taskId}/comment`, newCommentModel)
  },
  complateTaskAssingment(user, taskAssignmentId, formData) {
    return request('post', `api/k/v1/partner/taskassignmentcomplate/${user}/complate/${taskAssignmentId}`, formData)
  },
  getFocusUserTasks(listQuery) {
    return request('get', `api/k/v1/partner/focustasklist/${listQuery.sub}?pageSize=${listQuery.limit}&pageIndex=${listQuery.page}&searchKey=${listQuery.searchText}&archive=${listQuery.isArchive}&active=${listQuery.isActive}&status=${listQuery.status}&orderby=${listQuery.orderby}&sortby=${listQuery.sortby}&dayFilter=${listQuery.dayFilter}&dateRange=${listQuery.dateRange}&internalOrganizationId=${listQuery.internalOrganizationId}&employeeId=${listQuery.employeeId}&templateTitle=${listQuery.templateTitle}&taskTitle=${listQuery.title}&assignedEmployeePartyId=${listQuery.name}`)
  },
  getTaskAssignUserList(listQuery) {
    return request('get', `api/k/v1/partner/gettaskassignuserlist/${listQuery.sub}?pageSize=${listQuery.limit}&pageIndex=${listQuery.page}&searchKey=${listQuery.searchText}&archive=${listQuery.isArchive}&active=${listQuery.isActive}&status=${listQuery.status}&orderby=${listQuery.orderby}&sortby=${listQuery.sortby}&dayFilter=${listQuery.dayFilter}&dateRange=${listQuery.dateRange}&internalOrganizationId=${listQuery.internalOrganizationId}&employeeId=${listQuery.employeeId}&templateTitle=${listQuery.templateTitle}&taskTitle=${listQuery.title}&assignedEmployeePartyId=${listQuery.name}`)
  },
  updateAssignmentDeadline(sub, taskAssignmentId, deadline) {
    return request('post', `api/k/v1/partner/updateassignmentdeadline/${taskAssignmentId}/${sub}`, deadline)
  },
  updateAssignmentUser(sub, taskAssignmentId, model) {
    return request('post', `api/k/v1/partner/updateassignmentuser/${taskAssignmentId}/${sub}`, model)
  },
  getTemplateTitleList(listQuery) {
    return request('get', `api/k/v1/partner/templatetitlelist?employeeId=${listQuery.employeeId}&internalOrganizationId=${listQuery.internalOrganizationId}`)
  },
  getTaskTitleList(listQuery) {
    return request('get', `api/k/v1/partner/tasktitlelist?employeeId=${listQuery.employeeId}&internalOrganizationId=${listQuery.internalOrganizationId}`)
  }
}
