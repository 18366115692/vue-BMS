import Vue from 'vue'
/**
 * element-ui中使用的组件都是按需导入的，所以在每一次需要使用新的element-ui组件时，都需要在此文件中重新导入
 * 注意：
 *   1. 当使用element-ui中的标签时，只需要导入并安装即可
 *   2. 当使用element-ui中的属性方法是，需要导入并挂载到vue原型上
 */
import { Button, Form, FormItem, Input, Message } from 'element-ui'
// import { Form, FormItem } from 'element-ui'
// import { Input } from 'element-ui'

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
// 全局挂载属性
Vue.prototype.$message = Message
