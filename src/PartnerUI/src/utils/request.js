import axios from 'axios'
import store from '../store'
import { getToken } from '@/utils/auth'
import lang from '../lang' // Internationalization
import { ElMessage } from 'element-plus'
import router from '../router'

const i18n  = lang.global

// create an axios instance
const service = axios.create({
  timeout: 1000000, // request timeout
  maxContentLength: 200000

})

// request interceptor
service.interceptors.request.use((config) => {
  if (getToken()) {
    config.headers.Authorization = `Bearer ${getToken()}`
  }
  return config
}, (error) => {
  // Do something with request error
  Promise.reject(error)
})

// respone interceptor
service.interceptors.response.use(
  (response) => {
    if (response.status === 201) {
      const { location } = response.headers
      if (location && response.data === '') {
        response.data = { id: location.substr(location.lastIndexOf('/') + 1) }
      }
    }
    return response
  },
  (error) => {
    if (error.response.status >= 400 || error.status >= 400 || error.message !== undefined) {
      if (error.response.status === 401) {
        if (getToken()) {
          store.dispatch('LogOut').then(() => {
            router.push({ path: '/' })
          })
        }
      }
    }
    let errorMessage = error.message
    if (error.message !== undefined && error.message === 'Request failed with status code 500') {
      errorMessage = i18n.t('errors.500')
    } else if (error.message !== undefined && error.message === 'Request failed with status code 401') {
      ElMessage.error('Oturumunuz sonlandırılımıştır. Lütfen tekrar giriş yapınız.')
      router.push({ path: '/' })
    } else if (error.message !== undefined && error.message === 'Network Error') {
      errorMessage = i18n.t('errors.networkerror')// 'Giriş esnasında bir hata oluştu.(101)';
    } else {
      errorMessage = i18n.t('errors.unknownloginerror')
    }
    error.message = errorMessage
    const { response } = error
    if (response) {
      return Promise.reject(response)
    }
    return Promise.reject(error)
  }
)

export default
(method, resource, data, baseUrl, config = undefined) => service({
  method,
  url: resource,
  data,
  baseURL: baseUrl === undefined ? process.env.VUE_APP_BASE_API : baseUrl,
  config
})
