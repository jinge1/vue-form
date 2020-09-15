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
function madeItem(item, parent = {}) {
  const { name } = item
  const { name: parentName, index: parentIndex } = parent
  const fieldName = getItemName(item, parent)
  const defaultConf = getDefaultConf(item)
  const originInfo = parentName
    ? { parentName, parentIndex, originName: name }
    : { originName: name }
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
 * 通过所在父级下标及原始名称查找所在列表坐标
 * @param {number} index 所在父级中的下标
 * @param {string} originName 原始name
 * @param {Array} list 所有数据列表
 */
function getItemIndex(index, name, list) {
  return list.findIndex(
    ({ originName, parentIndex }) =>
      name === originName && index === parentIndex
  )
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
 */
export default function madeFormStore(list) {
  const store = vue.observable(initList(list))
  const mutation = {
    /**
     * 更新列表
     * @param {string|number|object} v
     * @param {number} index 当前项所在下标
     * @param {string|undefined} originName 原始name
     */
    updateItem(v, index, originName) {
      const nextInfo =
        typeof v === 'object' && !Array.isArray(v) ? v : { value: v }
      const i =
        typeof originName === 'string' && originName.trim() !== ''
          ? getItemIndex(index, originName, store)
          : index
      if (i > -1) {
        // 只能逐项更新
        Object.keys(nextInfo).forEach((k) => (store[i][k] = nextInfo[k]))
      } else {
        throw new Error(`${originName}-${index} is not fund`)
      }
    },
  }
  return { store, mutation }
}
