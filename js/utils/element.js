/*
 * @Author: zhangchuanzhong
 * @Date: 2021-04-15 15:09:35
 * @LastEditors: xiaoxing.zhou
 * @LastEditTime: 2022-01-29 10:17:05
 * @Description: element按需加载
 * @Copyright(c) 2021 CMIM Network Co.,Ltd. All Rights Reserved
 */
import Vue from 'vue'
import {
  Pagination,
  Dialog,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Menu,
  Submenu,
  MenuItem,
  MenuItemGroup,
  Input,
  Checkbox,
  Select,
  Option,
  OptionGroup,
  Button,
  ButtonGroup,
  Table,
  TableColumn,
  DatePicker,
  Popover,
  Tooltip,
  Form,
  FormItem,
  Tabs,
  TabPane,
  Row,
  Col,
  Slider,
  Container,
  Header,
  Aside,
  Main,
  Footer,
  Loading,
  MessageBox,
  Message,
  Notification,
  Link,
  Breadcrumb,
  BreadcrumbItem,
  Radio,
  RadioGroup,
  Tree,
  Upload
} from 'element-ui'
Vue.prototype.$ELEMENT = { size: 'small', zIndex: 3000 }

Vue.use(Pagination)
Vue.use(Dialog)
Vue.use(Dropdown)
Vue.use(DropdownMenu)
Vue.use(DropdownItem)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItem)
Vue.use(MenuItemGroup)
Vue.use(Input)
Vue.use(Checkbox)
Vue.use(Select)
Vue.use(Option)
Vue.use(OptionGroup)
Vue.use(Button)
Vue.use(ButtonGroup)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(DatePicker)
Vue.use(Popover)
Vue.use(Tooltip)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Row)
Vue.use(Col)
Vue.use(Slider)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Footer)
Vue.use(Tabs)
Vue.use(TabPane)
Vue.use(Link)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Radio)
Vue.use(RadioGroup)
Vue.use(Tree)
Vue.use(Upload)

Vue.use(Loading.directive)

Vue.prototype.$loading = Loading.service
Vue.prototype.$msgbox = MessageBox
Vue.prototype.$alert = MessageBox.alert
Vue.prototype.$confirm = MessageBox.confirm
Vue.prototype.$prompt = MessageBox.prompt
Vue.prototype.$notify = Notification
Vue.prototype.$message = Message
