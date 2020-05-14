import Vue from 'vue'
import App from './App.vue'
import router from './router'
// 导入全局样式表
import './assets/css/global.css'
// 导入第三方字体图标文件
import './assets/css/iconfont.css'
// 导入第三方库
import TreeTable from 'vue-table-with-tree-grid'
import VueQuillEditor from 'vue-quill-editor'

// 导入配置axios, 方便发送ajax数据请求
import axios from './axios'

Vue.prototype.$http = axios

Vue.config.productionTip = false

Vue.component('tree-table', TreeTable)

// 全局挂在 VueQuillEditor
Vue.use(VueQuillEditor)

Vue.filter('dateFormat', (val) => {
  // 创建出一个时间实例
  const dt = new Date(val)
  // 获取到对应的年
  const y = dt.getFullYear()
  /**
   * 获取到对应的月
   * padStart(2, '0') 是对字符串的规则定义，有两个参数
   * 第一个参数是表示该字符串因为是几位，第二个参数表示位数不足用什么填充
   */
  const m = (dt.getMonth() + 1 + '').padStart(2, '0')
  const d = (dt.getDate() + '').padStart(2, 0)
  const hh = (dt.getHours() + '').padStart(2, 0)
  const mm = (dt.getMinutes() + '').padStart(2, 0)
  const ss = (dt.getSeconds() + '').padStart(2, 0)
  // 返回值
  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
