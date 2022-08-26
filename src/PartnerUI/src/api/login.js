import request from '../utils/request'
import store from '../store'

export function loginByUsername(username, password) {
  const data = {
    client_id: 'spa',
    grant_type: 'password',
    username,
    password
  }
  const config = {
    headers: {
      'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
      'Content-Type': 'application/x-www-form-urlencoded',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'no-cache',
      'Access-Control-Allow-Credentials': true
    }
  }
  const dataString = Object.keys(data).map(k => `${encodeURIComponent(k)}=${encodeURIComponent(data[k])}`).join('&')
  console.log('env :', process.env)
  const identityServerUrl = process.env.VUE_APP_BASE_API !== undefined ? process.env.VUE_APP_BASE_API : 'https://redcaseid.birevim.com/'
  return request(
    'post',
    'auth/token',
    dataString,
    identityServerUrl,
    config
  )
}

export function logout() {
  return new Promise((resolve) => {
    var identityServerUrl = process.env.VUE_APP_BASE_API !== undefined ? process.env.VUE_APP_BASE_API : 'https://redcaseid.birevim.com/'
    request('get', '/account/logout?userName=' + store.getters.user.username, undefined, identityServerUrl)
      .then(() => resolve())
      .catch(() => resolve())
  })
}

export function getParameterTypes() {
  return request('get', 'api/f/v1/parameter/parameters?isActive=' + true + '&isPassive=' + false)
  // return request('get', 'connect/parameters', undefined, identityServerUrl)
}

export function getUserInfo() {
  var identityServerUrl = process.env.VUE_APP_BASE_API !== undefined ? process.env.VUE_APP_BASE_API : 'https://redcaseid.birevim.com/'
  return request(
    'get',
    'auth/userinfo',
    undefined,
    identityServerUrl
  )
}
