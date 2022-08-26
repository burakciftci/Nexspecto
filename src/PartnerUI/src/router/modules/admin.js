import Layout from '@/views/layout/layout.vue'

const adminRouter = {
  path: '/admin',
  component: Layout,
  redirect: 'admin',
  name: 'adminSection',
  meta: { noCache: false, title: 'policy', description: 'policy', tag: 'policyPolicy', icon: 'policy' },
  children : [
    {
      path: 'swchProcessHiddenTasks',
      component: () => import('@/views/admin/InternetBranchUser'),
      name: 'swchProcessHiddenTasks',
      hidden: true,
      meta: { noCache: false, title: 'swchProcessHiddenTasks', description: 'swchProcessHiddenTasks', tag: 'bpmSection', icon: '' }
    },
    {
      path: 'swchPersonDetailsforTasks',
      component: () => import('@/views/admin/InternetBranchUser'),
      name: 'swchPersonDetailsforTasks',
      hidden: true,
      meta: { noCache: false, title: 'swchPersonDetailsforTasks', description: 'swchPersonDetailsforTasks', tag: 'bpmSection', icon: '' }
    },
    {
      path: 'swchProductDetailsforTasks',
      component: () => import('@/views/admin/InternetBranchUser'),
      name: 'swchProductDetailsforTasks',
      hidden: true,
      meta: { noCache: false, title: 'swchProductDetailsforTasks', description: 'swchProductDetailsforTasks', tag: 'bpmSection', icon: '' }
    },
    {
      path: 'superUserAuthorizationForLookInsideTasks',
      component: () => import('@/views/admin/InternetBranchUser'),
      name: 'superUserAuthorizationForLookInsideTasks',
      hidden: true,
      meta: { noCache: false, title: 'superUserAuthorizationForLookInsideTasks', description: 'superUserAuthorizationForLookInsideTasks', tag: 'bpmSection', icon: '' }
    },
    {
      path: 'perspectiveEmployeeListAll',
      component: () => import('@/views/admin/InternetBranchUser'),
      name: 'perspectiveEmployeeListAll',
      hidden: true,
      meta: { noCache: false, title: 'perspectiveEmployeeListAll', description: 'perspectiveEmployeeListAll', tag: 'bpmSection', icon: '' }
    },
    {
      path: 'perspectiveEmployeeListLikeManager',
      component: () => import('@/views/admin/InternetBranchUser'),
      name: 'perspectiveEmployeeListLikeManager',
      hidden: true,
      meta: { noCache: false, title: 'perspectiveEmployeeListLikeManager', description: 'perspectiveEmployeeListLikeManager', tag: 'bpmSection', icon: '' }
    }
  ]
}
