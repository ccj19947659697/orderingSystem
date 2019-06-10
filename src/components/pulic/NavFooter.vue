<template>
  <div id="navfooter">
    <div id="footer_nav" class="footer_nav" @click="flag=!flag">
      <img src="../../assets/images/navigation.png"/>
      <p>导航</p>
    </div>
    <div class="footer_nav_show" v-if="flag">
      <ul class="list">
        <router-link to="/home" tag="li">
          <img src="../../assets/images/menu.png"/>
          <p>菜单</p>
        </router-link>
        <router-link to="/cart" tag="li">
          <img src="../../assets/images/cart.png"/>
          <p>购物车</p>
        </router-link>
        <router-link to="/editpeopleinfo" tag="li">
            <img src="../../assets/images/order.png"/>
            <p>首页</p>
        </router-link>
        <router-link to="/order" tag="li">
          <img src="../../assets/images/wallet.png"/>
          <p>结账</p>
        </router-link>
        <li @click="flag=!flag">
          <img src="../../assets/images/close.png"/>
          <p>返回</p>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
	export default {
		name: "NavFooter",
    data(){
		  return{
		    flag:false
      }
    }
	}
</script>

<style scoped>

</style>
