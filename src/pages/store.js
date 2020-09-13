import vue from 'vue'

function initList(list) {
  return list.map((item) =>
    item.type === 'array'
      ? { ...item, items: initList(item.items) }
      : getItem(item)
  )
}

function getItem(item) {
  const {
    type = 'van-field',
    placeholder = '请输入',
    required = false,
    rules = [],
    ...other
  } = item
  return type === 'slot'
    ? item
    : {
        value: '',
        type,
        placeholder,
        rules: required
          ? [
              ...rules,
              {
                validator: (val) => val.toString().trim() !== '',
                message: `请输入${item.label}`,
              },
            ]
          : rules,
        ...other,
      }
}

export default function madeStore(list) {
  const store = vue.observable(initList(list))
  const mutation = {
    setItem(v, parentIndex, subIndex = -1) {
      if (subIndex > -1) {
        store[parentIndex].items[subIndex].value = v
      } else {
        store[parentIndex].value = v
      }
    },
  }
  return { store, mutation }
}
