/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const formCustomerRouter = {
  path: '/formlist',
  component: Layout,
  name: 'FormManagementt',
  meta: {title: 'Form List',icon: 'peoples' },
  role: 'Customer',
  children: [
    {
      path: 'formlist',
      component: () => import('@/views/form/formlist'),
      name: 'FormList',
      meta: { noCache: false, title: 'Form List', icon: 'table', affix: true },
      role: 'Customer'
    }
  ]
}

export default formCustomerRouter
