<template>
  <van-form validate-first v-on="$listeners">
    <template v-for="item in formList">
      <template v-if="item.isShow !== false ">
        <slot v-if="item.component === 'slot'" :name="item.name"></slot>
        <ele-input v-else v-bind="item" @input="change($event, item)" :key="item.name"></ele-input>
      </template>
    </template>
    <slot name="button" v-if="$slots.button"></slot>
    <van-button v-else round block type="info" native-type="submit">{{buttonText}}</van-button>
  </van-form>
</template>
<script>
import EleInput from './EleInput'
export default {
  name: 'ele-form',
  components: {
    'ele-input': EleInput,
  },
  props: {
    list: {
      type: Array,
    },
    buttonText: {
      type: String,
      default: '提交',
    },
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      this.$emit('update:slotsList', this.getSlotsList())
      this.$emit('update:values', this.getValues())
    },
    /**
     * 暂时只考虑最懂2级结构
     * @param {Array} list 表单配置列表
     * @param {Object|undefined} parentInfo 父级信息
     */
    initList(list, parentInfo) {
      return list.reduce((pre, curr) => {
        const { children, ...other } = curr
        if (Array.isArray(children) && children.length > 0) {
          return [
            ...pre,
            ...children.reduce(
              (childPre, childCurr, childIndex) => [
                ...childPre,
                ...this.initList(childCurr, { ...other, index: childIndex }),
              ],
              []
            ),
          ]
        }
        return [...pre, this.madeItem(other, parentInfo)]
      }, [])
    },
    change(v, item) {
      this.$emit('change', v, { ...item, name: item.originName })
      // console.log(list, '----')
      // this.$nextTick(() => this.init())
    },
    /**
     * 根据原始配置创建表单项
     * @param {object} item 表单配置项
     * @param {object|undefined} parent 父级信息
     */
    madeItem(item, parent = {}) {
      const { name } = item
      const { name: parentName, index: parentIndex } = parent
      const fieldName = this.getItemName(item, parent)
      const originInfo = parentName
        ? { parentName, parentIndex, originName: name }
        : { originName: name }
      return { ...item, name: fieldName, ...originInfo }
    },
    /**
     * 获取所有slots列表
     */
    getSlotsList(l, parent) {
      const { list } = this
      const arr = l ? l : list
      return arr.reduce((pre, { children = [], component, ...other }) => {
        if (component === 'slot') {
          pre = [...pre, this.madeItem(other, parent)]
        }
        children.forEach(
          (child, index) =>
            (pre = [...pre, ...this.getSlotsList(child, { ...other, index })])
        )
        return pre
      }, [])
    },
    /**
     * 获取表单结果
     */
    getValues(l) {
      const { list } = this
      const arr = l ? l : list
      return arr.reduce(
        (pre, { children, component, name, value = '', ...other }) => {
          if (component !== 'slot') {
            if (Array.isArray(children)) {
              children.forEach((child) => {
                const preArr = pre[name] || []
                pre[name] = [...preArr, this.getValues(child)]
              })
            } else {
              pre[name] = value
            }
          }
          return pre
        },
        {}
      )
    },

    /**
     * 获取转换为一位数组后的name，避免name重复
     * @param {object} item 表单配置项
     * @param {object|undefined} parent 父级信息
     */
    getItemName(item, parent = {}) {
      const { name } = item
      const { name: parentName, index } = parent || {}
      return parentName ? `${name}_${parentName}_${index}` : name
    },
    submit(...args) {
      this.$emit('submit', ...args)
    },
  },
  computed: {
    formList() {
      const { list } = this
      return this.initList(list)
    },
  },
  watch: {
    list: {
      handler() {
        this.init()
      },
      deep: true,
    },
  },
}
</script>