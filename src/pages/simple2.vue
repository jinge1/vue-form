<template>
  <div>
    <p>simple2</p>
    {{list}}
    <van-field v-for="(item, index) in list" :key="item.name" v-bind="item" @input="(v)=> input(v, index)" />
  </div>
</template>
<script>
// import madeFormStore from '../utils/madeFormStore'
import { store, mutation } from './formConf'
// const s = madeFormStore([{name: '111'}])
// console.log(store, mutation)
// import { store, mutation } from './formConf'
export default {
  methods: {
    ...mutation,
    input(v, index) {
      this.setItem(v, index)
      // console.log(args)
    },
  },
  computed: {
    list() {
      return store
    },
  },
}
</script>