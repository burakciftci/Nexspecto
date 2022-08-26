/* eslint-disable */
import request from '../../utils/request'
import axios from 'axios'
import { getToken } from '../../utils/auth'

export default {
    getProductRiskById(productId) {
        return request('get', `api/f/v1/product/productrisk/${productId}`)
    },
    getProductRisks(listQuery) {
        return request('get', 'api/f/v1/product/productrisks?pageSize=' + listQuery.limit + '&pageIndex=' + listQuery.page + '&archive=' + listQuery.isArchive + '&active=' + listQuery.isActive + '&sortby=' + listQuery.sortby + '&orderby=' + listQuery.orderby + '&searchText=' + listQuery.query + '&type=' + listQuery.type + '&startDay=' + listQuery.startDay + '&endDay=' + listQuery.endDay)
    },
    getRiskTypes() {
        return request('get', `api/f/v1/product/riskTypes`)
    },
    createLegalFollowUpProcess(productRiskStatusId) {
        return request('put', 'api/f/v1/product/legalfollowup?productRiskStatusId=' + productRiskStatusId)
    },
    startCallConversation(calculationId) {
        return request('get', `api/f/v1/product/startcallconversation?calculationId=` + calculationId)
    },
    createLegalPursuit(productRiskStatusId) {
        return request('put', 'api/f/v1/product/legalpursuit?productriskstatusId=' + productRiskStatusId)
    },
    undoLegalPursuit(productId) {
        return request('put', 'api/f/v1/product/undolegalpursuit?productId=' + productId)
    },
    getFollowListNotesByProductId(productId) {
        return request('get', 'api/f/v1/product/followlistnotes?productId=' + productId)
    },
    getList(listQuery) {
        return axios({
            url: ('api/f/v1/product/risklist?pageSize=' + listQuery.limit + '&pageIndex=' + listQuery.page + '&excel=' + listQuery.excel + '&special=' + listQuery.special + '&sortby=' + listQuery.sortby + '&orderby=' + listQuery.orderby + '&searchText=' + listQuery.query + '&type=' + listQuery.type + '&startDay=' + listQuery.startDay + '&endDay=' + listQuery.endDay +
            '&branchNames=' + listQuery.branchNames + '&sortColumn=' + listQuery.sortColumn + '&riskNoteTypes=' + listQuery.riskNoteTypes + '&dateRange=' + listQuery.dateRange + '&birtep=' + listQuery.birtep + '&dateRangeCommitment=' + listQuery.dateRangeCommitment + '&deliveryDetailStatusTypes=' + listQuery.deliveryDetailStatusTypes +
            '&unpaidAmountInitial=' + listQuery.unpaidAmountInitial + '&unpaidAmountEnd=' + listQuery.unpaidAmountEnd)
            ,
            headers: {
                'Authorization': `Bearer ${getToken()}`
            },
            method: 'get',
            responseType: listQuery.excel ? 'blob' : '',
            baseURL: process.env.BASE_API
        })
    },
    getRiskTypeList() {
        return request('get', 'api/f/v1/product/risktypelist')
    },
    getRiskNoteTypes() {
        return request('get', 'api/f/v1/product/risknotetypes')
    },
    getDeliveryDetailStatusTypes() {
        return request('get', 'api/f/v1/product/getdeliverydetailstatustypes')
    },
    getLegalFollowupList(customerId) {
        return request('get', `api/f/v1/product/legalfollowuplist/${customerId}`)
    },
    getDelayInformation(customerId) {
        return request('get', `api/f/v1/product/getdelayinformation/${customerId}`)
    },
    riskAmount(calculationId) {
        return request('get', `api/f/v1/product/riskamount?calculationId=` + calculationId)
    },
    getPaymentCommitmentDetails(productId) {
        return request('get', `api/f/v1/product/paymentcommitments?productId=` + productId)
    }
}