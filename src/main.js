import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './assets/css/global.css'
import './assets/fonts/iconfont.css'
import TreeTable from 'vue-table-with-tree-grid'
require('vue-table-with-tree-grid')
import axios from 'axios'
// 配置请求根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
// 路由拦截
axios.interceptors.request.use(config => {
  // console.log(config)
  config.headers.Authorization = window.sessionStorage.getItem('token')

  return config
})
Vue.prototype.$http = axios

Vue.config.productionTip = false

Vue.component('TreeTable', TreeTable)
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
