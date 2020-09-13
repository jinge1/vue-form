<template>
  <div>
    {{list}}
    <slot :result="result"></slot>
  </div>
</template>
<script>
export default {
  props: {
    list: {
      type: Array,
      default: () => []
    },
    height: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      start: 0,
      end: 0
    }
  },
  computed: {
    result: () => this.list.slice(this.start, this.end)
  }
}
</script>