<template>
  <van-form validate-first v-on="$listeners">
    <div v-for="(item, index) in list" :key="item.name">
      <slot v-if="item.type === 'slot'" :name="item.name"></slot>
      <ele-input v-else v-bind="item" @input="$emit('change', $event, index, item)"></ele-input>
    </div>
    <slot name="button" v-if="$slots.button"></slot>
    <van-button v-else round block type="info" native-type="submit">{{buttonText}}</van-button>
  </van-form>
</template>
<script>
import EleInput from './EleInput'
export default {
  name: 'ele-form',
  components: {
    'ele-input': EleInput
  },
  props: {
    list: {
      type: Array
    },
    buttonText: {
      type: String,
      default: '提交'
    }
  },
  mounted() {
    console.log(this, 890)
  },
  methods: {
    submit(...args) {
      this.$emit('submit', ...args)
    }
  }
}
</script>