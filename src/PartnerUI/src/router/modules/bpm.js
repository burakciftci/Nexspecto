import Layout from '@/layout'

const bpmRouter = {
  path: '/bpm',
  name: 'bpmSection',
  hidden: true,
  component: () => import('@/layout/index'),
  // redirect: 'crm/CreateParameterClassification',
  meta: { noCache: false, title: 'crm', description: 'crm', tag: 'crmManagement', icon: 'department3_crm' },
  children: [
  {
    path: 'process/:id',
    hidden: true,
    component: () => import('@/views/bpm/process/process'),
    name: 'Process',
    meta: {title: 'process-id', icon: 'dashboard', affix: true}
  }
]
}

export default bpmRouter
