import Vue from 'vue'
import App from './App.vue'
import storage from './model/storage.js'

//引入路由
import VueRouter from 'vue-router'
Vue.use(VueRouter)

//导入自己的路由模块
import router from './router.js'

//导入Axios
import Axios from 'axios'
//设置请求根路径
Axios.defaults.baseURL = 'http://a.itying.com/api'
//给Vue原型挂载一个属性
Vue.prototype.$axios =Axios

//获取url传来的桌号,保存到localstorage中
var roomid=window.location.hash.split('=')[1]
storage.set('roomid',roomid)

//导入vue-socket.io
import VueSocketIO from 'vue-socket.io'
Vue.use(new VueSocketIO({
  debug: true,
  connection: `http://a.itying.com?roomid={roomid}`,
}));


new Vue({
  el: '#app',
  render: h => h(App),
  router
})
