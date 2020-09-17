<template>
  <div>
    <p>simple</p>
    <ele-form validate-first :list="list" @failed="onFailed" @submit="onSubmit" @change="change">
      <template v-for="item in list">
        <template v-if="item.type === 'slot'">
          <div
            :key="item.nme"
            :slot="item.name"
            v-if="item.name.startsWith('top_list')"
          >top--{{item}}</div>
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
    EleForm,
  },
  methods: {
    ...mutation,
    change(v, index, item) {
      const { originName, parentIndex } = item
      this.updateItem(v, index)
      if (originName === 'starAddress') {
        this.updateItem(
          { isShow: false, value: 'hello' },
          parentIndex,
          'targetAddress'
        )
      }
    },
    onFailed(info) {
      console.log(info)
    },
    onSubmit(values) {
      console.log(values)
    },
  },
  computed: {
    list() {
      return store
    },
  },
}
</script>