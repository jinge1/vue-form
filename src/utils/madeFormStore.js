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
 * 找出列表中某项的index
 * @param {string|object} item 列表项或列表项name
 * @param {array} list 表单数组
 */
function getIndex(item, list = []) {
  if (!isNaN(item)) {
    return item >= list.length ? -1 : item
  }
  const info = typeof item === 'string' ? { name: item } : item
  return list.findIndex((l) => l.name === info.name)
}

/**
 * 生成表单局部store
 * @param {Array} list
 */
export default function madeFormStore(list) {
  // 当前状态
  const store = vue.observable({
    list: initList(list),
    values: {},
  })

  // 操作store的方法
  const mutation = {
    /**
     * 修改表单项(如修改值，控制显示隐藏，其他配置，配置项同vant)
     * @param {string|object} item 当前表单项信息或当前字段名
     * @param {string|number|array|object} v 修改后的值
     */
    updateItem(item, v) {
      const itemInfo = typeof item === 'object' ? item : { name: item }
      const { name, parentName, parentIndex } = itemInfo
      // 通过是否有parentName来判断当前项是否为子集，若为子集，首先找出父级所在index
      const topName = parentName ? parentName : name
      const topIndex = store.list.findIndex(({ name }) => name === topName)

      // 若修改内容不存在，则为删除某项
      if (typeof v === 'undefined') {
        if (topIndex === -1) {
          if (typeof item === 'object') {
            store.list.push(formatItem(item))
          } else {
            console.error(`${topName} is not found!`)
          }
          return false
        }
        if (typeof item === 'string') {
          store.list.splice(topIndex, 1)
          return false
        }
      }
      // 没有该项，则为新增
      // if (topIndex === -1) {
      //   const addList = Array.isArray(v) ? initList(v) : [formatItem[v]]
      //   store.list = [...store.list, ...addList]
      // }

      // const valueInfo =
      //   !Array.isArray(v) && typeof v === 'object' ? v : { value: v }

      //
      // // 查找当前项失败
      // if (index === -1) {
      //   console.error(`${topName} is not found!`)
      //   return false
      // }
      // if (parentName) {
      //   // 若有父级则判断子集情况
      //   if (
      //     !Array.isArray(store.list[index].children) ||
      //     !Array.isArray(store.list[index].children[parentIndex])
      //   ) {
      //     // 父级中parentIndex项不存在
      //     console.error(`${parentName}-${parentIndex} is not array!`)
      //     return false
      //   }
      //   // 待修改项所在父级中的index值
      //   const subIndex = store.list[index].children[parentIndex].findIndex(
      //     ({ name: n }) => n === name
      //   )
      //   if (subIndex === -1) {
      //     console.error(`${parentName}-${parentIndex}-${name} is not found!`)
      //     return false
      //   }
      //   // 这里只能逐项替换，统一替换无效
      //   Object.keys(valueInfo).forEach(
      //     (key) =>
      //       (store.list[index].children[parentIndex][subIndex][key] =
      //         valueInfo[key])
      //   )
      // } else {
      //   // 这里只能逐项替换，统一替换无效
      //   Object.keys(valueInfo).forEach(
      //     (key) => (store.list[index][key] = valueInfo[key])
      //   )
      // }
    },
    /**
     * 删除某项或某个子项
     * @param {string|object} item 待删除项或待删除项name
     * @param {undefined|number} childIndex 子项index
     * @param {undefined|number|string|object} endIndex 子项index
     */
    deleteItem(item, childIndex, endIndex) {
      const index = getIndex(item, store.list)
      // 未找到删除项
      if (index === -1) {
        return false
      }
      // 没有子节点信息，则直接删除顶级项
      if (isNaN(childIndex)) {
        store.list.splice(index, 1)
        return false
      }
      // 存在指定孩子节点项
      if (
        Array.isArray(store.list[index].children) &&
        Array.isArray(store.list[index].children[childIndex])
      ) {
        // 未指定第三级index，则直接删除指定孩子结点
        if (typeof endIndex === 'undefined') {
          store.list[index].children.splice(childIndex, 1)
          return false
        }
        // 删除第3级结点
        const i = getIndex(endIndex, store.list[index].children[childIndex])
        if (i === -1) {
          return false
        }
        store.list[index].children[childIndex].splice(i, 1)
      }
    },
    /**
     * 新增表单项或子项
     * @param {object|array} item 新增项内容
     * @param {undefined|string|} parent
     * @param {number} childIndex 子节点index
     */
    addItem(item, parent, childIndex) {
      const info = typeof item === 'string' ? { name: item } : item
      const infoArr = Array.isArray(info) ? initList(info) : [formatItem(info)]
      const len = store.list.length

      // 新增顶级项，不存在该项才加
      if (typeof parent === 'undefined') {
        infoArr.forEach((each) => {
          if (getIndex(each, store.list) === -1) {
            store.list.splice(len, 0, each)
          }
        })
        return false
      }
      const parentInfo = typeof parent === 'string' ? { name: parent } : parent
      const parentIndex = getIndex(parentInfo, store.list)
      // const currInex = parentIndex > -1 ? parentIndex : len
      // 新增父级及子集
      if (parentIndex === -1) {
        if (!(Array.isArray(item) && item.every((it) => Array.isArray(it)))) {
          console.error(`in ${parent}, 添加项必须为数组!`)
          return false
        }
        store.list.splice(
          len,
          0,
          ...initList([{ ...parentInfo, children: item }])
        )
      }
      // 父级已存在，仅新增子集
      if (parentIndex > -1) {
        const current = store.list[parentIndex]
        const arr = Array.isArray(current.children) ? current.children : []
        if (typeof childIndex === 'undefined') {
          store.list[parentIndex].children = [...arr, infoArr]
          return false
        }
        if (
          typeof childIndex === 'undefined' ||
          !Array.isArray(arr[childIndex])
        ) {
          console.error(`in ${parent}, ${childIndex} is not fund!`)
          return false
        }
        store.list[parentIndex].children = arr.map((a, i) =>
          i === childIndex ? [...a, ...infoArr] : a
        )
      }
    },
    /**
     * 新增或删除表单列表项
     * @param {string|number} name 修改项名称
     * @param {undefined|number|array} info 若为数字，则为需要删除的下标，若为数组，则为需要新增的内容
     */
    updateList(name, info) {
      const index = isNaN(name)
        ? store.list.findIndex(({ name: m }) => name === m)
        : name
      if (index === -1) {
        console.error(`${name} is not found!`)
        return false
      }
      if (typeof info === 'undefined') {
        store.list = store.list.filter((s, i) => i !== index)
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
    }
  }

  return { store, mutation }
}
