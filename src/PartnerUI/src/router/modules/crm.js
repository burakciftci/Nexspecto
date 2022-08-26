
// import Layout from '@/views/layout/layout.vue'
import personApi from '@/api/crm/party'
import store from '@/store'
import { hasRoutePermissions } from '@/router'

const crmRouter = {
  path: '/crm',
  name: 'crmSection',
  hidden: true,
  component: () => import('@/layout/index'),
  // redirect: 'crm/CreateParameterClassification',
  meta: { noCache: false, title: 'crm', description: 'crm', tag: 'crmManagement', icon: 'department3_crm' },
  children: [
    {
      path: 'personEdit/:partyId',
      hidden: true,
      component: () => import('@/views/crm/PersonEdit'),
      name: 'personEdit',
      meta: { noCache: false, title: 'personEdit-partyId', icon: '', tag: 'crmManagement' },
      // beforeEnter: async(to, from, next) => {
      //   if (hasRoutePermissions(store.getters.permission_routers, 'viewPrivateCustomer')) {
      //     next()
      //     return
      //   }
      //   const { data: isAuthorized } = await personApi.isUserAuthorizedToView(to.params.partyId, 'PartyId')
      //   console.log('isAuthorized', isAuthorized)
      //   if (isAuthorized) {
      //     next()
      //   } else {
      //     next({ path: '/401', replace: true })
      //   }
      // }
    }
  ]
}

export default crmRouter
