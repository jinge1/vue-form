
import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)

export default new VueRouter({
  routes: [
    { path: '/', redirect: '/index' },
    { path: '/index', component: () => import('../pages/index') },
    { path: '/simple', component: () => import('../pages/simple') },
    { path: '/simple2', component: () => import('../pages/simple2') },
  ],
})
