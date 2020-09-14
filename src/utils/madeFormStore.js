import vue from 'vue'

/**
 * 暂时只考虑最懂2级结构
 * @param {Array} list 表单配置列表
 * @param {Object|undefined} parentInfo 父级信息
 */
function initList(list, parentInfo) {
  console.log(parentInfo, 7890)
  return list.reduce((pre, curr) => {
    const { children, ...other } = curr
    if (Array.isArray(children) && children.length > 0) {
      return [
        ...pre,
        ...children.reduce(
          (childPre, childCurr, childIndex) => [
            ...childPre,
            ...initList(childCurr, { ...other, index: childIndex }),
          ],
          []
        ),
      ]
    }
    return [...pre, madeItem(other, parentInfo)]
  }, [])
}

/**
 * 根据原始配置创建表单项
 * @param {object} item 表单配置项
 * @param {object|undefined} parent 父级信息
 */
function madeItem(item, parent = {}) {
  const { name } = item
  const { name: parentName, index } = parent
  const fieldName = getItemName(item, parent)
  const defaultConf = getDefaultConf(item)
  const originInfo = parentName ? { origin: { parentName, index, name } } : {}
  return { ...defaultConf, ...item, name: fieldName, ...originInfo }
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
 * 获取转换为一位数组后的name，避免name重复
 * @param {object} item 表单配置项
 */
function getItemIndex(item = {}, list) {
  const { name } = item
  return list.findIndex((l) => l.name === name)
}

/**
 * 获取表单项默认配置
 * @param {object} item 表单项
 */
function getDefaultConf(item) {
  const {
    type = 'van-field',
    label = '',
    placeholder,
    required = false,
    rules = [],
  } = item
  const tips = type === 'van-picker' ? `请选择${label}` : `请输入${label}`
  if (type === 'slot') {
    return {}
  }
  return {
    value: '',
    type,
    placeholder: typeof placeholder === 'undefined' ? tips : placeholder,
    rules: required ? [{ required: true, message: tips }, ...rules] : rules,
  }
}

/**
 * 生成表单局部store
 * @param {Array} list
 * @param {Boolean} isSaveScroll
 */
export default function madeFormStore(list) {
  const store = vue.observable(initList(list))
  const mutation = {
    updateItem(v, index, item) {
      // const nextInfo =
      //   typeof v === 'object' && !Array.isArray(v) ? v : { value: v }
      const i =
        item && Object.keys(item).length > 0 ? getItemIndex(item, store) : index
      
      // store[i] = { ...store[i], ...nextInfo }
      store[i] = {value: '009'}
      console.log(store)
      // if (origin) {
      //   // console.log(store[parent.index])
      //   // store[parent.index].children[index].value = v
      //   store[index].value = v
      // } else {
      //   store[index].value = v
      // }
    },
  }
  return { store, mutation }
}
