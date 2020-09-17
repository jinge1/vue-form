<template>
  <div>
    <div>
      <van-button round type="info" @click="add">添加</van-button>
      <van-button round type="info" @click="del">删除</van-button>
      <van-button round type="info" @click="reset">重置</van-button>
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
        <div :key="item.nme" :slot="item.name">top--{{item}}</div>
      </template>
      <div slot="button">
        <van-button round block type="info" native-type="submit">提交</van-button>
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
  },
  methods: {
    ...mutation,
    add() {
      this.changeList('list', child)
    },
    del() {
      this.changeList('list', 0)
      // this.changeList('list')
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
    change(v, item) {
      this.updateItem(v, item)
      if (item.name === 'customer') {
        this.updateItem({ required: true }, 'mobile')
      }
      if (item.name === 'mobile') {
        this.updateItem(
          { required: false },
          {
            name: 'targetAddress',
            parentName: 'list',
            parentIndex: 0,
            // parentIndex: item.parentIndex,
          }
        )
      }
    },
  },
  computed: {
    list() {
      return store.list
    },
  },
}
</script>