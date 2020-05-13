import Vue from 'vue'
import VueRouter from 'vue-router'
// 导入视图中文件
import Home from '../views/home/Home.vue'
// 导入组件中文件
import Login from '../components/login/Login.vue'
import Welcome from '../components/Welcome.vue'
import Users from '../components/user/Users.vue'
import Rights from '../components/power/Rights.vue'
import Goods from '../components/goods/Goods.vue'
import Add from '../components/goods/Add.vue'
import Orders from '../components/order/Orders.vue'
import Reports from '../components/home/Reports.vue'
import Categories from '../components/goods/Categories.vue'
import Params from '../components/goods/Params.vue'
import Roles from '../components/power/Roles.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login'
    // 路由重定向功能，当用户刚进入根目录的时候，自动显示登录界面
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/home',
    component: Home,
    // 重定向路由显示，目的是为了刚进入页面时，展示一下欢迎界面，所以通过主页的子路由显示
    redirect: '/welcome',
    children: [
      { path: '/welcome', component: Welcome },
      { path: '/users', component: Users },
      { path: '/rights', component: Rights },
      { path: '/goods', component: Goods },
      { path: '/orders', component: Orders },
      { path: '/reports', component: Reports },
      { path: '/categories', component: Categories },
      { path: '/params', component: Params },
      { path: '/roles', component: Roles },
      { path: '/goods/add', component: Add }
    ]
  }
]

const router = new VueRouter({
  routes
})

// 通过路由导航守卫，来判断用户所访问的界面是否可以直接访问
// 拿到路由对象，在路由对象上挂载beforeEach
router.beforeEach((to, from, next) => {
  /**
   * to 表示将要访问的路径
   * from 表示从哪个路径跳转而来
   * next 是一个函数，表示放行，有两种方式
   *   1. next() 什么参数都不加，表示直接放行
   *   2. next('跳转路径') 表示不通过，只能跳转指定路径
   */
  // 首先判断将要跳转的路径是否为 /login 如果是，直接放行，如果不是，则跳转登录界面
  if (to.path === '/login') return next()
  // 如果不是就需要判断是否登录过，通过登录返回的 token 值来判断
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})

export default router
