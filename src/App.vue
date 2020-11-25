<template>
  <div id="app" class="app">
    <div class="bar">
      <div class="bar-inner">
        <van-nav-bar title="标题" v-bind="backInfo" @click-left="onClickLeft" />
      </div>
      <div class="bar-block"></div>
    </div>
    <div class="page">
      <router-view></router-view>
    </div>
    <van-tabbar v-model="active" @change="onChange">
      <van-tabbar-item
        :icon="icon"
        v-for="{ path, tag, icon } in links"
        :key="path"
        >{{ tag }}</van-tabbar-item
      >
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
      backInfo: {},
    }
  },
  methods: {
    /**
     * 头部返回处理
     */
    onClickLeft() {
      this.$router.go(-1)
    },
    /**
     * 底部导航切换
     */
    onChange(index) {
      const { links } = this
      this.$router.push(links[index].path)
    },
    /**
     * 首页不展示头部返回键
     */
    changeRoute() {
      const { $route, links } = this
      const { path } = $route
      const index = links.findIndex((l) => l.path === path)
      if (index > -1) {
        // 修正当前路由高亮问题
        this.active = index
      }
      this.backInfo = ['/', '/index'].includes(path)
        ? {}
        : { leftText: '返回', leftArrow: true }
    },
  },
  watch: {
    /**
     * 监听路由
     */
    $route: {
      immediate: true,
      handler() {
        this.changeRoute()
      },
    },
  },
}
</script>
<style scoped>
.app {
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




