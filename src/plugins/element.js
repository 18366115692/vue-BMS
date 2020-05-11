import Vue from 'vue'
/**
 * element-ui中使用的组件都是按需导入的，所以在每一次需要使用新的element-ui组件时，都需要在此文件中重新导入
 * 注意：
 *   1. 当使用element-ui中的标签时，只需要导入并安装即可
 *   2. 当使用element-ui中的属性方法是，需要导入并挂载到vue原型上
 */
import {
  Message,
  MessageBox,
  Button,
  Form,
  FormItem,
  Input,
  Header,
  Aside,
  Main,
  Container,
  Menu,
  MenuItemGroup,
  MenuItem,
  Submenu,
  Breadcrumb,
  BreadcrumbItem,
  Card,
  Row,
  Col,
  Table,
  TableColumn,
  Switch,
  Pagination,
  Tooltip,
  Dialog,
  Tag,
  Tree,
  Select,
  Option,
  Cascader,
  Tabs,
  TabPane
} from 'element-ui'

Vue.use(Tabs)
Vue.use(TabPane)
Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Container)
Vue.use(Menu)
Vue.use(MenuItemGroup)
Vue.use(MenuItem)
Vue.use(Submenu)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Card)
Vue.use(Row)
Vue.use(Col)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Switch)
Vue.use(Pagination)
Vue.use(Tooltip)
Vue.use(Dialog)
Vue.use(Tag)
Vue.use(Tree)
Vue.use(Select)
Vue.use(Option)
Vue.use(Cascader)
// Vue.use(DropdownItem)
// 全局挂载属性
Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm
