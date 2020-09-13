<template>
  <div>
    <p>simple</p>
    <ele-form validate-first :list="list" @failed="onFailed" @submit="onSubmit" @change="change">
      <template v-for="item in list">
        <template v-if="item.type === 'slot'">
          <div :key="item.nme" :slot="item.name" v-if="item.name.startsWith('top')">top--{{item}}</div>
        </template>
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
    EleForm
  },
  methods: {
    ...mutation,
    change(v, index, item) {
      console.log(v, index, item, '---')
      this.updateItem(v, index, item)
      if (index === 1 && v === '2') {
        this.updateItem('8', 0, 'list')
      }
      // if (v === '2') {
      //   this.updateItem(8, 1)
      // }
    },
    onFailed(info) {
      console.log(info)
    },
    onSubmit(values) {
      console.log(values)
    }
  },
  computed: {
    list() {
      return store
    }
  }
}
</script>