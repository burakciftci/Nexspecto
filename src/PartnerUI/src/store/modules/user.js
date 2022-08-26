import { loginByUsername, logout, getUserInfo } from '@/api/login'
import { getToken, setToken, removeToken } from '@/utils/auth'
import store from '../index'


const user = {
  state: {
    username: '',
    status: '',
    code: '',
    token: getToken(),
    name: '',
    avatar: '',
    introduction: '',
    sub: '',
    roles: [],
    position: '',
    positionType: '',
    internalOrganization: '',
    positionId: '',
    positionTypeId: '',
    internalOrganizationId: '',
    setting: {
      articlePlatform: []
    }
  },

  mutations: {
    SET_CODE: (state, code) => {
      state.code = code
    },
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_INTRODUCTION: (state, introduction) => {
      state.introduction = introduction
    },
    SET_SETTING: (state, setting) => {
      state.setting = setting
    },
    SET_STATUS: (state, status) => {
      state.status = status
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_SUB: (state, sub) => {
      state.sub = sub
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_POSITION: (state, position) => {
      state.position = position
    },
    SET_POSITION_ID: (state, positionId) => {
      state.positionId = positionId
    },
    SET_POSITION_TYPE: (state, positionType) => {
      state.positionType = positionType
    },
    SET_POSITION_TYPE_ID: (state, positionTypeId) => {
      state.positionTypeId = positionTypeId
    },
    SET_INTERNAL_ORGANIZATION: (state, internalOrganization) => {
      state.internalOrganization = internalOrganization
    },
    SET_INTERNAL_ORGANIZATION_ID: (state, internalOrganizationId) => {
      state.internalOrganizationId = internalOrganizationId
    },
    SET_USERNAME: (state, username) => {
      state.username = username
    }
  },

  actions: {
    LoginByUsername({ commit }, loginForm) {
      const { username, password } = loginForm
      return new Promise((resolve, reject) => {
        loginByUsername(username, password).then((response) => {
          const { data } = response
          commit('SET_TOKEN', data.access_token)
          setToken(data.access_token)
          getUserInfo(data.access_token).then((response) => {
            if (!response.data) {
              Promise.Reject('error')
            }
            const { data } = response
        
            if (data.role && data.role.length > 0) {
              commit('SET_ROLES', data.role)
              store.dispatch("GenerateRoutes")

            } else {
              Promise.Reject('getInfo: roles must be a non-null array !')
            }

            commit('SET_NAME', data.name)
            commit('SET_SUB', data.sub)
            commit('SET_USERNAME', data.unique_name)
            commit('SET_POSITION', data.main_position_name)
            commit('SET_POSITION_ID', data.main_position_id)
            commit('SET_POSITION_TYPE', data.position_type_name)
            commit('SET_POSITION_TYPE_ID', data.position_type_id)
            commit('SET_INTERNAL_ORGANIZATION', data.internal_organization_name)
            commit('SET_INTERNAL_ORGANIZATION_ID', data.internal_organization_id)
            resolve(response)
          }).catch((error) => {
            reject(error)
          })

          resolve()
        }).catch((error) => {
          console.log('errorerrorerrorerrorerrorerrorerror',error)
          reject(error)
        })
      })
    },

    GetUserInfo({ commit },token){
      getUserInfo(token).then((response) => {
        if (!response.data) {
          Promise.Reject('error')
        }
        const { data } = response
    
        if (data.role && data.role.length > 0) {
          commit('SET_ROLES', data.role)
          store.dispatch("GenerateRoutes")

        } else {
          Promise.Reject('getInfo: roles must be a non-null array !')
        }

        commit('SET_NAME', data.name)
        commit('SET_SUB', data.sub)
        commit('SET_USERNAME', data.unique_name)
        commit('SET_POSITION', data.main_position_name)
        commit('SET_POSITION_ID', data.main_position_id)
        commit('SET_POSITION_TYPE', data.position_type_name)
        commit('SET_POSITION_TYPE_ID', data.position_type_id)
        commit('SET_INTERNAL_ORGANIZATION', data.internal_organization_name)
        commit('SET_INTERNAL_ORGANIZATION_ID', data.internal_organization_id)
        resolve(response)
      }).catch((error) => {
        console.log(error)
      })
    },
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout(state.token).then(() => {
          commit('SET_TOKEN', '')
          commit('SET_USERNAME', '')
          commit('SET_ROLES', [])
          commit('SET_POSITION', '')
          commit('SET_POSITION_ID', '')
          commit('SET_POSITION_TYPE', '')
          commit('SET_POSITION_TYPE_ID', '')
          commit('SET_INTERNAL_ORGANIZATION', '')
          commit('SET_INTERNAL_ORGANIZATION_ID', '')
          removeToken()
          resolve()
        }).catch((error) => {
          reject(error)
        })
      })
    },

    FedLogOut({ commit }) {
      return new Promise((resolve) => {
        commit('SET_TOKEN', '')
        commit('SET_USERNAME', '')
        commit('SET_ROLES', [])
        commit('SET_POSITION', '')
        commit('SET_POSITION_ID', '')
        commit('SET_POSITION_TYPE', '')
        commit('SET_POSITION_TYPE_ID', '')
        commit('SET_INTERNAL_ORGANIZATION', '')
        commit('SET_INTERNAL_ORGANIZATION_ID', '')
        removeToken()
        resolve()
      })
    },
    ChangeRoles({ commit }, role) {
      return new Promise((resolve) => {
        commit('SET_TOKEN', role)
        setToken(role)
        getUserInfo(role).then((response) => {
          const { data } = response
          commit('SET_ROLES', data.role)
          commit('SET_NAME', data.name)
          commit('SET_AVATAR', data.avatar)
          commit('SET_POSITION', data.main_position_name)
          commit('SET_POSITION_ID', data.main_position_id)
          commit('SET_POSITION_TYPE', data.position_type_name)
          commit('SET_POSITION_TYPE_ID', data.position_type_id)
          commit('SET_INTERNAL_ORGANIZATION', data.internal_organization_name)
          commit('SET_INTERNAL_ORGANIZATION_ID', data.internal_organization_id)
          resolve()
        })
      })
    }
  }
}

export default user
