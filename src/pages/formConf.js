import madeFormStore from '../utils/madeFormStore'

const conf = [
  { name: 'top666', component: 'slot' },
  { name: 'user', isShow: true, label: '用户名', placeholder: '请输入用户名' },
  { name: 'mobile', label: '手机号', placeholder: '请输入手机号' },
  {
    name: 'list',
    children: [
      [
        { name: 'top', component: 'slot' },
        { name: 'customer', label: '客户名称' },
        { name: 'starAddress', label: '出发地', required: true, value: '' },
        { name: 'targetAddress', label: '目的地', required: true, value: '' },
      ],
      [
        { name: 'top', component: 'slot' },
        { name: 'customer', label: '客户名称' },
        { name: 'starAddress', label: '出发地', required: true, value: '' },
        { name: 'targetAddress', label: '目的地', required: true, value: '' },
      ],
    ],
  },
]

// 初始值
const initValues = {}

const { store, mutation } = madeFormStore(conf, initValues)

export default madeFormStore

export { store, mutation }
