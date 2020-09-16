<template>
  <div>
    <div>
      <van-button round type="info" @click="add">添加</van-button>
      <van-button round type="info" @click="del">删除</van-button>
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
import { store, mutation } from './formConf'

export default {
  components: {
    EleForm,
  },
  data() {
    return {
      values: {},
      slotsList: {},
    }
  },
  methods: {
    ...mutation,
    add() {
      this.changeList('list', [
        { name: 'cc0', component: 'slot' },
        { name: 'cc', label: 'add' },
        { name: 'cc2', label: 'add2' },
      ])
    },
    del() {
      this.changeList('list', 0)
    },
    onFailed(info) {
      console.log(info)
    },
    onSubmit(values) {
      console.log(values)
    },
    change(v, item) {
      this.updateList(v, item)
      if (item.originName === 'customer') {
        this.updateList(
          { required: false },
          {
            originName: 'targetAddress',
            parentName: 'list',
            parentIndex: item.parentIndex,
          }
        )
        // this.updateList(
        //   { required: true },
        //   'mobile'
        // )
      }
    },
  },
  computed: {
    list() {
      return store
    },
  },
}
</script>