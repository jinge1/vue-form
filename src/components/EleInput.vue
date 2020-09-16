<template>
  <div>
    <component v-bind="$attrs" :is="component" @input="v=> $emit('input', v)"></component>
  </div>
</template>
<script>
export default {
  props: {
    component: { type: String },
  },
}
</script>