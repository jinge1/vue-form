<template>
  <div>
    <div>
      <van-button round type="info" @click="add">添加</van-button>
      <van-button round type="info" @click="del">删除</van-button>
      <van-button round type="info" @click="reset">重置</van-button>
      <van-button round type="info">测试</van-button>
    </div>
    <ele-form
      validate-first
      :list="list"
      @failed="onFailed"
      @submit="onSubmit"
      @change="change"
      :slotsList.sync="slotsList"
      :values.sync="values"
    >
      <template v-for="item in slotsList">
        <div :key="item.nme" :slot="item.name">top--{{ item }}</div>
      </template>
      <div slot="button">
        <van-button round block type="info" native-type="submit"
          >提交</van-button
        >
      </div>
    </ele-form>
  </div>
</template>
<script>
import EleForm from '../components/EleForm'
import madeFormStore from '../utils/madeFormStore'
// import { store, mutation, child } from './formConf'
import { conf, child } from './formConf'
const { store, mutation } = madeFormStore(conf)

export default {
  components: {
    EleForm,
  },
  data() {
    return {
      values: {},
      slotsList: {},
      store: [],
    }
  },
  created() {
    // console.log(890)
    this.updateList('list', child)
  },
  methods: {
    ...mutation,
    add() {
      // this.addItem('newName')
      // this.addItem([{ name: 'newName' }, { name: 'new2' }])
      // this.addItem(child, 'list')
      this.addItem([{ name: 'ccd' }], 'list', 0)
    },
    del() {
      // this.deleteItem('mobile')
      // this.deleteItem('list', 0, 1)
      // this.deleteItem('list', 1)
      // this.deleteItem('list', 1, 1)
      this.deleteItem('list', 1, 'targetAddress')
    },
    reset() {
      this.resetList()
    },
    onFailed(info) {
      console.log(info)
    },
    onSubmit(values) {
      console.log(values)
    },
    change(item, v) {
      // delete
      // this.updateItem('mobile')
      // this.updateItem(item)

      // add
      this.updateItem({ name: 'test', label: 'hello', value: 'uuu' })

      // delete
      this.deleteItem('mobile')

      // this.updateItem(item, v)
      // if (item.name === 'customer') {
      //   this.updateItem({ disabled: true }, 'mobile')
      // }
      // if (item.name === 'mobile') {
      //   this.updateItem(
      //     { required: false },
      //     {
      //       name: 'targetAddress',
      //       parentName: 'list',
      //       parentIndex: 0,
      //       // parentIndex: item.parentIndex,
      //     }
      //   )
      // }
    },
  },
  computed: {
    list() {
      return store.list
    },
  },
}
</script>