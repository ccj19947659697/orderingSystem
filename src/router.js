import VueRouter from 'vue-router'
import Start from './components/Start.vue'
import Home from './components/Home.vue'
import Pcontent from './components/Pcontent.vue'
import Cart from './components/Cart.vue'
import Order from './components/Order.vue'
import EditPeopleInfo from './components/EditPeopleInfo.vue'
import Success from './components/Success.vue'
const router = new VueRouter({
  routes: [{ path:'/',redirect:'/start' },
           { path:'/start',component:Start },
           { path:'/home',component:Home },
           { path:'/pcontent',component:Pcontent },
           { path:'/cart',component:Cart },
           { path:'/order',component:Order },
           { path:'/editpeopleinfo',component:EditPeopleInfo },
           { path:'/success',component:Success }
           ]
})

export default router
