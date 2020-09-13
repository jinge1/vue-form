<template>
  <div>
    <ele-form
      validate-first
      @failed="onFailed"
      :store="store"
      :mutation="mutation"
      @submit="onSubmit"
    >
      <div slot="button">
        <van-button round block type="info" native-type="submit">提交</van-button>
      </div>
    </ele-form>
  </div>
</template>
<script>
import EleForm from '../components/EleForm'
import madeStore from './store'

const formList = [
  // type slot array form-input form-select
  { name: 'name1', type: 'slot' },
  { name: 'name2', label: '用户名2', required: true },
  { name: 'name3', label: '用户名3', on: { input: (v) => console.log(v) } },
  {
    name: 'list',
    type: 'array',
    items: [
      { name: 'name4', label: '用户名4', rules: [{ required: true }] },
      { name: 'name5' },
    ],
  },
  {
    name: 'list2',
    type: 'array',
    items: [
      { name: 'name4', label: '用户名4', rules: [{ required: true }] },
      { name: 'name6' },
    ],
  },
]
const { store, mutation } = madeStore(formList)

export default {
  components: {
    'ele-form': EleForm,
  },
  data() {
    return {
      // value: Date.now()
      store,
      mutation,
    }
  },
  methods: {
    onFailed(info) {
      console.log(info)
    },
    onSubmit(values) {
      console.log(values)
    },
  },
}
</script>