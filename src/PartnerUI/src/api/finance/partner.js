import request from '../../utils/request'
import axios from 'axios'
import { getToken } from '../../utils/auth'

export default {
  getProductListById(customerId) {
    return request('get', `api/f/v1/partner/productListById/${customerId}`)
  },
  getCustomer(calculationId) {
    return request('get', `api/f/v1/partner/getCustomer/${calculationId}`)
  },
  getProductTagById(productId) {
    return request('get', 'api/f/v1/partner/getproducttagbyid?productId=' + productId)
  },
  getProductCardList(calculationId) {
    return request('get', `api/f/v1/partner/getProductCardList/${calculationId}`)
  },
  getProductRiskById(productId) {
    return request('get', `api/f/v1/partner/productrisk/${productId}`)
  },
  getCollectionEfficiencyRatio(calculationId) {
    return request('get', 'api/f/v1/partner/collectionEfficiencyRatio/' + calculationId)
  },
  getDeliveryDates(calculationId) {
    return request('get', 'api/f/v1/partner/deliverydates?calculationId=' + calculationId)
  },
  getActualOrPaymentDate(calculationId) {
    return request('get', 'api/f/v1/partner/actualorpaymentdate?calculationId=' + calculationId)
  },
  checkIfGrowthSavingsRevision(calculationId) {
    return request('get', `api/f/v1/partner/checkIfGrowthSavingsRevision?calculationId=` + calculationId)
  },
  getProductLockStatus(calculationId) {
    return request('get', 'api/f/v1/partner/lockstatus?calculationId=' + calculationId)
  },
  getProductLockDescription(calculationId) {
    return request('get', 'api/f/v1/partner/lockdescription?calculationId=' + calculationId)
  },
  getFinanceDetailTypes() {
    return request('get', 'api/f/v1/partner/financedetailtypes')
  },
  getThePersonWhoOpenedProject(calculationId) {
    return request('get', 'api/f/v1/partner/getthepersonwhoopenedproject?calculationId=' + calculationId)
  },
  getExtraBudget(calculationId) {
    return request('get', 'api/f/v1/partner/extrabudget?calculationId=' + calculationId)
  },
  getBlockedFund(calculationId) {
    return request('get', 'api/f/v1/partner/blockedfund?calculationId=' + calculationId)
  },
  getAccounts() {
    return request('get', `api/f/v1/partner/accounts`)
  },
  getPaymentPlans(calculationId) { 
    return request('get', `api/f/v1/partner/table/` + calculationId)
  },
  createPayingPlan(id) {
    return request('get', `api/f/v1/partner/createPayingPlan/${id}`)
  },
  getFirstPayment(calculationId) {
    return request('get', 'api/f/v1/partner/firstpayment?calculationId=' + calculationId)
  },
  downloadPaymentPlanExcel(calculationId, productId) {
    return axios({
      url: ('api/f/v1/partner/paymentplanexcel?calculationId=' + calculationId + '&productId=' + productId),
      headers: {
        'Authorization': `Bearer ${getToken()}`
      },
      method: 'get',
      responseType: 'blob',
      baseURL: process.env.BASE_API
    })
  },
  getTransactionListByPage(listQuery) {
    return request('get', 'api/f/v1/partner/getTransactionListByPage?pageSize=' + listQuery.limit + '&pageIndex=' + listQuery.page + '&calculation=' + listQuery.calculation + '&completed=' + listQuery.completed + '&canceled=' + listQuery.canceled)
  },
  getTotalTransactions(calculationId) {
    return request('get', `api/f/v1/partner/totalTransaction?calculation=` + calculationId)
  },
  getContractById(id) {
    return request('get', `api/f/v1/partner/getcontractbyid/${id}`)
  },
  getContractList() {
    return request('get', 'api/f/v1/partner/contractlist')
  },
  getLatestNote(productId, listQuery) {
    return request('get', 'api/f/v1/partner/latestNote?productId=' + productId + '&pageSize=' + listQuery.pageSize + '&pageIndex=' + listQuery.page)
  },
  savePartyNote(model) {
    return request('post', 'api/f/v1/partner/productNote', model)
  },

  startProductCancel(model) {
    return request('post', 'api/f/v1/product/productcancel/', model)
  },
  getProductCancelRequestById(productId) {
    return request('get', `api/f/v1/partner/productcancel/${productId}`)
  },
  getCutRatios(productId) {
    return request('get', `api/f/v1/partner/getCutRatios/${productId}`)
  },
  getGroupDrawStatuses() {
    return request('get', 'api/f/v1/partner/groupdrawstatuses')
  },
  getDrawingListByProductId(productId) {
    return request('get', `api/f/v1/partner/productdrawlist/${productId}`)
  },
  getProductTransactionList(productId) {
    return request('get', 'api/f/v1/partner/product?productId=' + productId)
  },
  getDeliveryInfo(productId) {
    return request('get', 'api/f/v1/partner/deliveryinfo?productId=' + productId)
  },
  getInstantDeliveryListByProductId(productId) {
    return request('get', 'api/f/v1/partner/getinstantdeliverylistbyproductid?productid=' + productId)
  },
  getInstantDeliveryInfoTypes() {
    return request('get', 'api/f/v1/partner/infotypes')
  },
  getInstantDeliveryInfoList(productId) {
    return request('get', 'api/f/v1/partner/instantdeliveryinfolist?productid=' + productId)
  },
  getProductDeliveryPlanByIdAsync(productId, isActive) {
    return request('get', 'api/f/v1/partner/getproductdeliveryplanbyid?productid=' + productId + '&isactive=' + isActive)
  },
  getTempTransactionList(productId) {
    return request('get', 'api/f/v1/partner/temptransactionslistbyid?productId=' + productId)
  },
  getSumOfWaitingApprovals(productId) {
    return request('get', 'api/f/v1/partner/sumofwaitingapprovals?productId=' + productId)
  },
  getUnpaidAmounts(calculationId) {
    return request('get', 'api/f/v1/partner/unpaidamounts?calculationId=' + calculationId)
  },
  getDeliveryCoordinationInfoList(productId) {
    return request('get', 'api/f/v1/partner/deliverycoordinationinfolist?productid=' + productId)
  },
  getVehicleGuarantees(calculationId) {
    return request('get', 'api/f/v1/partner/getvehiclebycalculationid?calculationId=' + calculationId)
  },
  getRealEstateGuarantees(calculationId) {
    return request('get', 'api/f/v1/partner/getrealestatebycalculationid?calculationId=' + calculationId)
  },
  getAgreementGuarantees(calculationId) {
    return request('get', 'api/f/v1/partner/getagreementbycalculationid?calculationId=' + calculationId)
  },
}