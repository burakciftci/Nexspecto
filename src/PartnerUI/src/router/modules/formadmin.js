/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const formAdminRouter = {
  path: '/formlistall',
  component: Layout,
  name: 'FormManagement',
  meta: {title: 'Form List All',icon: 'peoples' },
  role: 'Admin',
  children: [
    {
      path: 'formlistall',
      component: () => import('@/views/form/formlistall'),
      name: 'FormListAll',
      meta: { noCache: false, title: 'Form List', icon: 'table', affix: true },
      role: 'Admin'
    }
  ]
}

export default formAdminRouter
