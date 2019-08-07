<template>
  <div id="home">
    <!--菜单区域-->
    <div class="content">
      <div class="item" v-for="item in list">
        <h3 class="item_cate">{{item.title}}</h3>
        <ul class="item_list">
          <li v-for="food in item.list">
            <div class="inner">
              <router-link :to="`/pcontent?id=${food._id}`">
                <img :src="api+food.img_url" />
                <p class="title">{{food.title}}</p>
                <p class="price">¥{{food.price}}</p>
              </router-link>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <!--导航-->
    <v-navfooter></v-navfooter>

    <div id="footer_cart" class="footer_cart">
      <router-link to="/cart">
        <img src="../assets/images/cart.png"/>
        <p>购物车</p>
        <span class="num" v-if="cartNum">{{cartNum}}</span>
      </router-link>
    </div>
  </div>
</template>

<script>
  //引入公共组件
  import NavFooter from './pulic/NavFooter.vue'
  import Config from '../model/config.js'
  import storage from '../model/storage.js'
	export default {
		name: "Home",
    data () {
		  return {
		    api: Config.api,
		    list: [],
        cartNum: 0
      }
    },
    sockets: {
        connect: function () {
      },
        addcart: function (data) {  /*接受广播来的数据，将购物车数据更新*/
           this.getCartCount()
      }
    },
    mounted () {
      this.requestData()
      this.getCartCount()
    },
    methods: {
      requestData () {
		    this.$axios.get('/productlist')
          .then(res => {
		      console.log(res)
		      this.list = res.data.result.splice(0,5)
        })
          .catch(err => {
            console.log(err)
          })
      },
      getCartCount () {
		    var uid = storage.get('roomid')
		    this.$axios.get(`/cartCount?uid=${uid}`)
          .then(res => {
            this.cartNum = res.data.result
          })
          .catch(err => {
            console.log(err)
          })
      }
    },
    components: {
    'v-navfooter': NavFooter
    }
  }
</script>

<style lang="scss" scoped>
  /*列表*/
  .item {
    .item_cate {
      text-align: center;
      padding: .5rem;
    }
    .item_list {
      display: flex;
      flex-wrap: wrap;
      padding: 0px .5rem;
      li {
        width: 33.3%;
        padding: .5rem;
        box-sizing: border-box;
        text-decoration: none;
        color: black;
        .inner {
          background: #fff;
          width: 100%;
          border-radius: .5rem;
          overflow: hidden;
          a {
            color: #666;
            text-decoration: none;
          }
          img {
            width: 100%;
            height:9rem;
          }
          p {
            padding: .2rem .5rem;
          }
          .title{
            font-weight: bold;
          }
        }
      }
    }
  }
</style>
