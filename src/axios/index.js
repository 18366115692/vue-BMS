// 导入axios
import axios from 'axios'

// 导入 Nprogress 进度条
import Nprogress from 'nprogress'
import 'nprogress/nprogress.css'

// 配置请求的根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
// 对请求头配置处理
// 在 request 中添加进度条展示 Nprogress.start()
axios.interceptors.request.use(config => {
  Nprogress.start()
  // 将 token 值保存在 Authorization 中，方便后续接口认证
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
// 在 response 中添加进度条结束 Nprogress.done()
axios.interceptors.response.use(config => {
  Nprogress.done()
  // 将 token 值保存在 Authorization 中，方便后续接口认证
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})

export default axios
