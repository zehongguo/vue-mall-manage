import Vue from 'vue';
import VueRouter from 'vue-router';

// const HellWorld = () => import('components/HelloWorld.vue');
const HelloWorld = () => import('@/components/HelloWorld.vue');

Vue.use(VueRouter);

const routes = [{
  path: '',
  redirect: '/home'
}, {
  path: "/home",
  component: HelloWorld
}];


export default new VueRouter({
  routes
});