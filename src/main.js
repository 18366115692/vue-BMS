import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
// 导入全局样式表
import './assets/css/global.css'
// 导入第三方字体图标文件
import './assets/css/iconfont.css'
import TreeTable from 'vue-table-with-tree-grid'

// 导入配置axios, 方便发送ajax数据请求
import axios from 'axios'
// 配置请求的根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
// 对请求头配置处理
axios.interceptors.request.use(config => {
  // 将 token 值保存在 Authorization 中，方便后续接口认证
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
Vue.prototype.$http = axios

Vue.config.productionTip = false

Vue.component('tree-table', TreeTable)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
