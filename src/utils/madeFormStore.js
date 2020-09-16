import vue from 'vue'

/**
 *
 * @param {*} item
 */
function formatItem(item) {
  const {
    component = 'van-field',
    label = '',
    placeholder,
    isShow = true,
    required = false,
    rules = [],
  } = item
  const tips = component === 'van-picker' ? `请选择${label}` : `请输入${label}`
  if (component === 'slot') {
    return { isShow, ...item }
  }
  const valueInfo = Array.isArray(item.children) ? {} : { value: '' }
  return {
    component,
    isShow,
    ...valueInfo,
    placeholder: typeof placeholder === 'undefined' ? tips : placeholder,
    rules: required ? [{ required: true, message: tips }, ...rules] : rules,
    ...item,
  }
}

function initList(list) {
  return list.map(({ children, ...other }) => {
    if (Array.isArray(children)) {
      return { ...other, children: children.map((c) => initList(c)) }
    }
    return formatItem(other)
  })
}

/**
 * 获取转换为一位数组后的name，避免name重复
 * @param {object} item 表单配置项
 * @param {object|undefined} parent 父级信息
 */
function getItemName(item, parent = {}) {
  const { name } = item
  const { name: parentName, index } = parent || {}
  return parentName ? `${name}_${parentName}_${index}` : name
}

/**
 * 生成表单局部store
 * @param {Array} list
 */
export default function madeFormStore(list) {
  const store = vue.observable(initList(list))

  const mutation = {
    /**
     * 修改表单项
     * @param {string|number|array|object} v 修改后的值
     * @param {string|object} item 当前表单项信息或当前字段名
     */
    updateList(v, item) {
      const valueInfo =
        !Array.isArray(v) && typeof v === 'object' ? v : { value: v }
      const { originName, parentName, parentIndex } =
        typeof item === 'object' ? item : { originName: item }
      const s = parentName ? parentName : originName
      const index = store.findIndex(({ name }) => name === s)
      if (parentName) {
        const subIndex = store[index].children[parentIndex].findIndex(
          ({ name }) => name === originName
        )
        Object.keys(valueInfo).forEach(
          (key) =>
            (store[index].children[parentIndex][subIndex][key] = valueInfo[key])
        )
      } else {
        Object.keys(valueInfo).forEach(
          (key) => (store[index][key] = valueInfo[key])
        )
      }
    },
    changeList(name, info) {
      const index = store.findIndex(({ name: m }) => name === m)
      if (Array.isArray(info)) {
        store[index].children.push(initList(info))
      }
      if (!isNaN(info)) {
        store[index].children = store[index].children.filter(
          (f, i) => i !== info
        )
      }
    },
    /**
     * 更新列表
     * @param {string|number|object} v
     * @param {number} index 当前项所在下标
     * @param {string|undefined} originName 原始name
     */
    update() {
      store[2].children[store[2].children.length - 1][0].label = true
      store[2].children[0][0].label = Date.now()
      store[0] = { value: 10 }
      store[0].isShow = !store[0].isShow
    },
    add() {
      store[2].children.push([
        { name: 'top', type: 'slot' },
        { name: 'customer', label: '客户名称' },
        { name: 'starAddress', label: '出发地', required: true, value: '' },
        { name: 'targetAddress', label: '目的地', required: true, value: '' },
      ])
    },
    del() {},
  }

  return { store, mutation }
}
