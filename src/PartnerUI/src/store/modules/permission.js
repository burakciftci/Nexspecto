import store from '@/store'
import { constantRoutes , asyncRoutes} from '@/router'
function hasPermission(roles, route) {
  if (route.role === store.getters.user.roles || route.role === undefined ){
      return true
  }
  
  return false
}

// eslint-disable-next-line
function filterAsyncRouter(asyncRoutes, roles) {

  const accessedRouters = asyncRoutes.filter((route) => {   

    if (hasPermission(roles, route)) {
      if (route.children && route.children.length) {
        route.children = filterAsyncRouter(route.children, roles)
      }
      return true
    }
    return false
  })
  return accessedRouters
}

const permission  = {
  state: {
    routes: [],
    addRouters: [],
    permissions: []
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers
      state.routes = [].concat(routers)
    },
    SET_PERMISSIONS: (state, permissions) => {
      state.permissions = permissions
    },
  },
  actions: {
    GenerateRoutes({ commit }) {
      return new Promise((resolve) => {
        var list = []
        var permissions = []
        let accessedRouters

        accessedRouters = filterAsyncRouter(asyncRoutes, list)
        commit('SET_ROUTERS', constantRoutes.concat(accessedRouters))
        commit('SET_PERMISSIONS', permissions)
        resolve()
      })
    }
  }
}

export default permission

//  import { constantRoutes , asyncRoutes} from '@/router'

// // eslint-disable-next-line

// const permission = {
//   state: {
//     routers: constantRoutes,
//     addRouters: [],
//    permissions: []

//   },
//   mutations: {
//     SET_ROUTERS: (state, routers) => {
//       state.addRouters = routers
//       state.routers = routers
//     },
//     SET_PERMISSIONS: (state, permissions) => {
//       state.permissions = permissions
//     },
//   },
//   actions: {

//     GenerateRoutes({ commit }, data) {
//       return new Promise((resolve) => {
//          commit('SET_ROUTERS', constantRoutes.concat(asyncRoutes))
//          commit('SET_PERMISSIONS', permissions)

//         resolve()
//       })
//     }
//   }
// }

// export default permission

