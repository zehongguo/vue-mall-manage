import Vue from 'vue';
import VueRouter from 'vue-router';

// const HellWorld = () => import('components/HelloWorld.vue');
const Login = () => import('views/login/Login.vue');
const Home = () => import('views/home/Home.vue');

Vue.use(VueRouter);

const routes = [{
  path: '',
  redirect: '/login'
}, {
  path: "/home",
  component: Home
}, {
  path: '/login',
  component: Login
}];
const router = new VueRouter({
  routes,
})
router.beforeEach((to,from,next) => {
    // 判断请求路径是否是login
    if(to.path == "/login") return next();

    // 查看有没有token,如果有则跳转继续跳转，如果没有则跳转到login
    const token =  window.sessionStorage.getItem("token");
    if(token){
       next();
    }else{
      next({
            path:"/login",
            query:{
              status:true
            }
      });
    }
});

export default router;