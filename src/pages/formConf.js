import madeFormStore from '../utils/madeFormStore'

const conf = [
  { name: 'user', label: '用户名', placeholder: '请输入用户名' },
  { name: 'mobile', label: '手机号', placeholder: '请输入手机号' },
  {
    name: 'list',
    children: [
      [
        { name: 'top', type: 'slot' },
        { name: 'customer', label: '客户名称' },
        { name: 'starAddress', label: '出发地', required: true, value: '' },
        { name: 'targetAddress', label: '目的地', required: true, value: '' },
      ],
      [
        { name: 'top', type: 'slot' },
        { name: 'customer', label: '客户名称' },
        { name: 'starAddress', label: '出发地', required: true, value: '' },
        { name: 'targetAddress', label: '目的地', required: true, value: '' },
      ],
    ],
  },
  // { name: 'km', component: 'slot' },
]

// 初始值
const initValues = {}

const { store, mutation } = madeFormStore(conf, initValues)

export default madeFormStore

export { store, mutation }
