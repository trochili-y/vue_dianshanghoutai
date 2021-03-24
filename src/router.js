
import Vue from 'vue'
import Router from 'vue-router'
import Login from './components/Login.vue'
import Home from './components/Home.vue'
import Welcome from './components/Welcome.vue'
import Users from './components/user/Users.vue'
import Rights from './components/power/Rights.vue'
import Roles from './components/power/Roles.vue'
import Cate from './components/goods/Cate.vue'
Vue.use(Router)

const router = new Router(
  {
    routes: [
      { path: '/', redirect: '/login' },
      { path: '/login', component: Login },
      {
        path: '/home', component: Home,
        redirect: '/Welcome',
        children: [
          { path: '/welcome', component: Welcome },
          {path:'/users',component:Users},
          {path:'/rights',component:Rights},
          {path:'/roles',component:Roles},
          {path:'/categories',component:Cate}
        ]
      }
    ]
  }
)
// 挂载路由导航守卫//刷新=》to的路径
router.beforeEach((to, from, next) => {
  // to将要访问的路径
  // from从哪个路径而来
  // next放行
  if (to.path === '/login') return next()
  // 获取token
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})
export default router
