import vue from 'vue'

/**
 * 添加表单项初始值，若初始值不存在，会导致后续修改无法及时更新
 * @param {object} item 原始表单项
 */
function formatItem(item) {
  const {
    component = 'van-field', // 默认组件
    label = '', // label 为非必选项
    placeholder, // 默认自动生成，若不需要显示 placeholder，可以给空字符串
    isShow = true, // 是否显示该项
    required = false, // 是否为必填项，若已配置rules，则不要配置这个
    rules = [],
  } = item

  const tips = component === 'van-picker' ? `请选择${label}` : `请输入${label}`
  if (component === 'slot') {
    return { isShow, ...item }
  }
  // 若该项有children项，则不用默认给value
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

/**
 * 初始化表单项，逐项增加默认值，目前仅支持一级children
 * @param {Array} list 表单列表
 */
function initList(list) {
  return list.map(({ children, ...other }) => {
    if (Array.isArray(children)) {
      return { ...other, children: children.map((c) => initList(c)) }
    }
    return formatItem(other)
  })
}

/**
 * 生成表单局部store
 * @param {Array} list
 */
export default function madeFormStore(list) {
  // 当前状态
  const store = vue.observable({
    list: initList(list),
  })

  // 操作store的方法
  const mutation = {
    /**
     * 修改表单项(如修改值，控制显示隐藏，其他配置，配置项同vant)
     * @param {string|number|array|object} v 修改后的值
     * @param {string|object} item 当前表单项信息或当前字段名
     */
    updateItem(v, item) {
      const valueInfo =
        !Array.isArray(v) && typeof v === 'object' ? v : { value: v }
      const itemInfo = typeof item === 'object' ? item : { name: item }
      const { name, parentName, parentIndex } = itemInfo
      // 通过是否有parentName来判断当前项是否为子集，若为子集，首相找出父级所在index
      const s = parentName ? parentName : name
      const index = store.list.findIndex(({ name }) => name === s)
      // 查找当前项失败
      if (index === -1) {
        console.error(`${s} is not found!`)
        return false
      }
      if (parentName) {
        // 若有父级则判断子集情况
        if (
          !Array.isArray(store.list[index].children) ||
          !Array.isArray(store.list[index].children[parentIndex])
        ) {
          // 父级中parentIndex项不存在
          console.error(`${parentName}-${parentIndex} is not array!`)
          return false
        }
        // 待修改项所在父级中的index值
        const subIndex = store.list[index].children[parentIndex].findIndex(
          ({ name: n }) => n === name
        )
        if (subIndex === -1) {
          console.error(`${parentName}-${parentIndex}-${name} is not found!`)
          return false
        }
        Object.keys(valueInfo).forEach(
          (key) =>
            (store.list[index].children[parentIndex][subIndex][key] =
              valueInfo[key])
        )
      } else {
        Object.keys(valueInfo).forEach(
          (key) => (store.list[index][key] = valueInfo[key])
        )
      }
    },
    /**
     * 新增或删除表单列表项
     * @param {string|number} name 修改项名称
     * @param {number|array} info 若为数字，则为需要删除的下标，若为数组，则为需要新增的内容
     */
    changeList(name, info) {
      const index = isNaN(name)
        ? store.list.findIndex(({ name: m }) => name === m)
        : name
      if (index === -1) {
        console.error(`${name} is not found!`)
        return false
      }
      if (typeof info === 'undefined') {
        store.list[index].children = []
      }
      if (Array.isArray(info)) {
        store.list[index].children.push(initList(info))
      }
      if (!isNaN(info)) {
        store.list[index].children = store.list[index].children.filter(
          (f, i) => i !== info
        )
      }
    },
    resetList() {
      store.list = initList(list)
      // store = []
      // store.forEach(({name, children})=> {
      // })
      // console.log(arr)
      // arr.forEach()
    },
  }

  return { store, mutation }
}
