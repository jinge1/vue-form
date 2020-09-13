<template>
  <div>
    <component v-bind="$attrs" :is="type" @input="v=> $emit('input', v)"></component>
  </div>
</template>
<script>
export default {
  props: {
    type: { type: String }
  }
}
</script>