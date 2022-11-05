import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/",
    name: "login",
    component: import("@/views/login.vue"),
  },
  {
    path: "/home",
    name: "home",
    component: import("@/views/home.vue")
  },
  {
    path: "/chart",
    name: "chart",
    component: import("@/views/Chart.vue")
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

let expire = (time=Date.now()) => {
  return (Date.now() - time) < 1000*60*60*24
}
// 给路由设置守卫函数
router.beforeEach((to, form, next) => {
  // to表示将要访问的路径
  // form表示从那个页面跳转而来
  // next表示允许跳转到指定位置
  // console.log(next)
  if (to.path === "/login") return next();
  // 获取用户本地的token, 如果token不存在则跳转到登录页
  // console.log(to)
  let islogin = JSON.parse(localStorage.getItem('logininfo111')||'{}')

  if(islogin.login&&expire(islogin.timestamp)){
    console.log('已登录')
    next();
  }else{
    console.log('去登录')
    return next({ name: 'login' })
    return '/login'
  }
});

export default router;
