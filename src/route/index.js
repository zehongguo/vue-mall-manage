import Vue from 'vue';
import VueRouter from 'vue-router';
import {
  Message
} from 'element-ui';


// const HellWorld = () => import('components/HelloWorld.vue');
const Login = () => import('views/login/Login.vue');
const Home = () => import('views/home/Home.vue');
const Welcome = () => import('views/welcome/Welcome.vue');
const User = () => import('views/user/User.vue');
const Authority = () => import('views/authority/Authority.vue');
const Role = () => import('views/authority/role/Role.vue');
const GoodsCategories = () => import('views/goods/goodsCatrgories/Categories.vue');
const GoodsParam = () => import('views/goods/goodsParam/Param.vue');
const GoodsList = () => import("views/goods/goodsList/GoodsList.vue");
const AddGoods = () => import("views/goods/goodsList/addGoods/AddGoods.vue")
const Order = () => import("views/order/Order.vue")
const Report = () => import("views/report/Report.vue")
Vue.use(VueRouter);

const routes = [{
  path: '',
  redirect: '/login'
}, {
  path: '/login',
  component: Login
}, {
  path: '/home',
  component: Home,
  redirect: '/welcome',
  children: [{
    path: '/welcome',
    component: Welcome
  }, {
    path: "/users",
    component: User
  }, {
    path: "/rights",
    component: Authority
  }, {
    path: "/roles",
    component: Role
  }, {
    path: "/categories",
    component: GoodsCategories
  }, {
    path: "/params",
    component: GoodsParam
  }, {
    path: "/goods",
    component: GoodsList
  }, {
    path: "/addgoods",
    component: AddGoods
  }, {
    path: "/orders",
    component: Order
  }, {
    path: "/reports",
    component: Report
  }]
}];
const router = new VueRouter({
  routes,
});
router.beforeEach((to, from, next) => {
  // 判断请求路径是否是login
  if (to.path == "/login") return next();

  // 查看有没有token,如果有则跳转继续跳转，如果没有则跳转到login
  const token = window.sessionStorage.getItem("token");
  if (token) {
    next();
  } else {
    Message.warning("请先登录");
    next('/login');
  }
});


export default router;