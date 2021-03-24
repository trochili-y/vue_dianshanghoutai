import Vue from 'vue'
import {
    Button, Form, FormItem, Input, Message, MessageBox, Container, Header, Aside, Main, Menu, Submenu, MenuItemGroup, MenuItem
    , Breadcrumb, BreadcrumbItem, Card, Row, Col, TableColumn, Switch, Tooltip, Pagination, Dialog, MeesageBox,
    Tag, Tree, Select, Option, Cascader
} from 'element-ui'
import {
   Table
} from 'element-ui'

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItemGroup)
Vue.use(MenuItem)
Vue.use(BreadcrumbItem)
Vue.use(Breadcrumb)
Vue.use(Card)
Vue.use(Row)
Vue.use(Col)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Switch)
Vue.use(Tooltip)
Vue.use(Pagination)
Vue.use(Dialog)
Vue.use(Tag)
Vue.use(Tree)
Vue.use(Select)
Vue.use(Option)
Vue.use(Cascader)


Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm
