import request from '../../utils/request'
// import { equal } from 'assert';
import axios from 'axios'
import { getToken } from '../../utils/auth'

export default {
  getList(listQuery) {
    console.log('listQuery: ', listQuery)
    return request('get', `api/k/v1/performance/internalorganization?pageSize=${listQuery.limit}&pageIndex=${listQuery.page}&isActive=${listQuery.isActive}&isArchive=${listQuery.isArchive}&sortby=${listQuery.sortby}&orderby=${listQuery.orderby}&internalOrganizationId=${listQuery.internalOrganizationId}&searchKey=${listQuery.searchText}&branchPartyIds=${listQuery.branchName}`)
  },
  get(sub, year) {
    return request('get', `api/k/v1/performance/employee?sub=${sub}&year=${year}`)
  },
  create(model) {
    return request('post', 'api/k/v1/performance/internalorganization', model)
  },
  update(model) {
    return request('put', `api/k/v1/performance/internalorganization`, model)
  },
  delete(id) {
    return request('delete', `api/k/v1/performance/internalorganization/${id}`)
  },
  createEmployeeGoals(model) {
    return request('post', 'api/k/v1/performance/employeeperformance', model)
  },
  getItems(partyId) {
    return request('get', `api/k/v1/performance/employeegoals?partyId=${partyId}`)
  },
  getPerformanceValues(listQuery) {
    return request('get', `api/k/v1/partner/getperformance?id=${listQuery.name}&type=${listQuery.type}&pageSize=${listQuery.limit}&pageIndex=${listQuery.page}&sortby=${listQuery.sortby}&orderby=${listQuery.orderby}&internalOrganizationId=${listQuery.internalOrganizationId}&employeeId=${listQuery.employeeId}&dateRange=${listQuery.dateRange}`)
  },
  getPerformanceCompare(listQuery) {
    return request('get', `api/k/v1/performance/performanceCompare?employeeId=${listQuery.employeeId}&internalOrganizationId=${listQuery.internalOrganizationId}&firstDate=${listQuery.firstDate}&secondDate=${listQuery.secondDate}&pageSize=${listQuery.limit}&pageIndex=${listQuery.page}&sortby=${listQuery.sortby}&orderby=${listQuery.orderby}`)
  },
  getPerfomanceAndTargetValues(model) {
    return request('get', `api/k/v1/performance/performanceGoalActualValues?internalOrganizationId=${model.internalOrganizationId}&employeeId=${model.employeeId}&dateRange=${model.dateRange}&daily=${model.daily}`)
  },
  getPerformanceGoalValues(model) {
    return request('get', `api/k/v1/performance/performanceGoalValues?internalOrganizationId=${model.internalOrganizationId}&employeeId=${model.employeeId}&dateRange=${model.dateRange}&daily=${model.daily}`)
  },
  exportExcelFromServer(listQuery) {
    return axios({
      url: 'api/f/v1/product/download?pageSize=' + listQuery.limit + '&pageIndex=' + listQuery.page + '&methodType=' + listQuery.methodType +
        '&searchText=' + listQuery.searchText + '&orderby=' + listQuery.orderby + '&internalOrganizationId=' + listQuery.internalOrganizationId +
        '&employeeId=' + listQuery.employeeId + '&archive=' + listQuery.isArchive + '&active=' + listQuery.isActive + '&sortby=' + listQuery.sortby + '&searchKey=' + listQuery.searchText +
        '&dayFilter=' + listQuery.dayFilter + '&dateRange=' + listQuery.dateRange,
      headers: {
        'Authorization': `Bearer ${getToken()}`
      },
      method: 'get',
      responseType: 'blob',
      baseURL: process.env.BASE_API
    })
  },
}
