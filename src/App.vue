<template>
  <div id="app" class="app">
    <div class="bar">
      <div class="bar-inner">
        <van-nav-bar title="标题" left-text="返回" left-arrow @click-left="onClickLeft" />
      </div>
      <div class="bar-block"></div>
    </div>
    <router-view></router-view>
    <van-tabbar v-model="active" @change="onChange">
      <van-tabbar-item :icon="icon" v-for="({path, tag, icon}) in links" :key="path">{{tag}}</van-tabbar-item>
    </van-tabbar>
  </div>
</template>
<script>
export default {
  data() {
    return {
      active: 0,
      links: [
        { path: '/index', tag: '标签', icon: 'home-o' },
        { path: '/simple', tag: '标签', icon: 'search' },
        { path: '/simple2', tag: '标签', icon: 'search' },
      ],
    }
  },
  methods: {
    onClickLeft() {
      this.$router.go(-1)
    },
    onChange(index) {
      const { links } = this
      this.$router.push(links[index].path)
    },
  },
}
</script>
<style scoped>
.app{
  padding: 0 0 60px 0;
}
.bar-inner {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
}
.bar-block {
  height: 46px;
}
</style>




