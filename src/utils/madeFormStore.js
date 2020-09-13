import vue from 'vue'

/**
 * 暂时只考虑最懂2级结构
 * @param {Array} list 表单配置列表
 * @param {Object|undefined} parentInfo 父级信息
 */
function initList(list, parentInfo) {
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
function madeItem(item, parent) {
  const { name } = item
  const { name: parentName, index } = parent || {}
  const fieldName = parentName ? `${name}_${index}_${parentName}` : name
  const defaultConf = getDefaultConf(item)
  const parentInfo = parent ? { parent: { ...parent, childName: name } } : {}
  return { ...defaultConf, ...item, name: fieldName, ...parentInfo }
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
      const { parent } = item
      if (parent) {
        // console.log(store[parent.index])
        // store[parent.index].children[index].value = v
        store[index].value = v
      } else {
        store[index].value = v
      }
    },
  }
  return { store, mutation }
}
