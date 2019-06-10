<template>
	<div id="cart">

    <div class="cart_content">
      <div class="cart_info" v-if="totalNum">
        <h2>购物车</h2>
        <div class="p_number">
          <div class="p_number_left">
            <p>用餐人数:{{peopleList.p_num}}</p>
            <p>备注:<span v-if="!peopleList.p_mark">无</span>{{peopleList.p_mark}}</p>
          </div>
          <div class="p_number_right">
            <router-link to="/editpeopleinfo" tag="li">
              <img src="../assets/images/edit.png"/>
              <p>修改</p>
            </router-link>
          </div>
        </div>

        <div class="cart_p_num">
          <p>购物车中总共有{{totalNum}}个菜</p>
          <p>合计：<span class="price">¥{{allPrice}}</span></p>
        </div>
      </div>

      <div class="cart_list"  v-if="totalNum">
        <ul>
          <li class="item" v-for="(item,i) in list">
            <div class="left_food">
              <img :src="`http://a.itying.com/${item.img_url}`"/>
              <div class="food_info">
                <p>{{item.title}}</p>
                <p class="price">¥{{item.price}}</p>
              </div>
            </div>

            <div id="right_cart">
              <div class="cart_num">
                <div class="input_left" @click="deNum(item,i)">-</div>
                <div class="input_center">
                  <input type="text"  readonly="readonly" v-model="item.num" name="num" id="num" />
                </div>
                <div class="input_right" @click="addNum(item)">+</div>
              </div>
            </div>
          </li>
        </ul>
      </div>

      <div class="hot_food">
        <h3>本店顾客最常点的菜</h3>
        <div class="item_list_outer">
            <ul class="item_list">
              <router-link to="/pcontent?id=5ad5b650c677913cdc50b04b" tag="li">
                  <div class="inner">
                    <img src="../assets/images/1.jpg" />
                    <p class="title" >凉拌三丝</p>
                    <p class="price">¥1</p>
                  </div>
              </router-link>
            </ul>
        </div>
      </div>
      <div v-if="!totalNum" class="cart_empty">您的购物车为空</div>
    </div>

    <v-footer></v-footer>


    <div id="footer_book" class="footer_book">
      <router-link to="/home">
         <img src="../assets/images/menu.png"/>
         <p style="text-decoration: none">菜单</p>
      </router-link>
    </div>

    <div id="footer_cart" class="footer_cart" @click="addOrder()">
      <img src="../assets/images/doorder.png"/>
      <p>下单</p>
    </div>

  </div>
</template>

<script>
  import NavFooter from './pulic/NavFooter';
  import storage from '../model/storage.js';
	export default {
		name: "Cart",
    data(){
		  return{
        list:[],
        allPrice:0,
        totalNum:0,
        peopleList:[]
      }
    },
    sockets: {
      addcart: function (data) {  /*接受广播来的数据，将购物车数据更新*/
        this.getCartData();
      }
    },
    mounted(){
		  this.getCartData();
		  this.getPeopleInfoList();
    },
    methods:{
		  //获取菜单列表信息
		  getCartData(){
        var uid=storage.get('roomid');
		    this.$axios.get(`/cartlist?uid=${uid}`)
          .then(res=>{
            console.log(res.data)
            this.list=res.data.result;
            this.getTotalResult()
          })
          .catch(err=>{
		        console.log(err)
        })
      },
      //减少
      deNum(item,i){
        var product_id=item.product_id;
        var num=item.num;
        var uid=storage.get('roomid');
        this.$axios.get(`/decCart?uid=${uid}&product_id=${product_id}&num=${num}`)
          .then(res=>{
            this.$socket.emit('addcart','addcart');
            this.getTotalResult();
          })
          .catch(err=>{
            console.log(err);
          })
		    if(item.num===1){
          this.list.splice(i,1);
        }else{
		      --item.num
        }
      },
      //增加
      addNum(item){
		    var product_id=item.product_id;
		    var num=item.num;
        var uid=storage.get('roomid');
		    this.$axios.get(`/incCart?uid=${uid}&product_id=${product_id}&num=${num}`)
          .then(res=>{
            this.$socket.emit('addcart', 'addcart');
            this.getTotalResult();
        })
          .catch(err=>{
            console.log(err);
          });
           ++item.num
      },
      //计算总价和数量
      getTotalResult(){
        var allPrice=0;
        var totalNum=0;
        for(var i =0;i<this.list.length;i++){
          allPrice+=parseFloat(this.list[i].price*this.list[i].num);
          totalNum+=this.list[i].num;
        }
        this.allPrice=allPrice;
        this.totalNum=totalNum;
      },
      //获取用餐人数和备注信息
      getPeopleInfoList(){
        var uid=storage.get('roomid');
        this.$axios.get(`/peopleInfoList?uid=${uid}`)
          .then(res=>{
            this.peopleList=res.data.result[0];
          })
          .catch(err=>{
            console.log(err);
          })
      },
      addOrder(){
        var uid=storage.get('roomid');
        var p_num= this.peopleList.p_num;
        var p_mark= this.peopleList.p_mark;
        var total_price=this.allPrice;
        var total_num=this.totalNum;
        var order=JSON.stringify(this.list);  /*数组   把json对象转化成json字符串*/
        this.$axios.post('/addOrder',{
          uid,
          p_num,
          p_mark,
          total_price,
          total_num,
          order
        })
          .then(res=>{
            if(res.data.success){
              this.$router.push({ path: 'order' })
            }
        })
          .catch(err=>{
            console.log(err);
          })
		  }

    },
    components:{
		  'v-footer':NavFooter
    }
	}
</script>

<style lang="scss" scoped>
  .cart_content{
    padding: 1rem;

  /*头部信息*/
  .cart_info{
    background: #fff;
    h2{
    text-align: center;
    font-size: 1.8rem;
    padding: .8rem 0px;
    border-bottom: 1px solid #eee;
  }
    border-radius:.5rem;
    padding: .5rem;
   .p_number{
      display: flex;
      padding: .5rem 0;
      border-bottom: 1px solid #eee;
    .p_number_left{
      flex: 1;
      p{
        line-height: 2;
        &:first-child{
          color: red;
        }
      }
  }
    .p_number_right{
      width: 4rem;
      height: 4rem;
      text-align: center;
      img{
        width: 1.8rem;
        height: 1.8rem;
        margin: 0 auto;
        }
      p{
        color: dodgerblue;
      }
    }
   }

  /*购物车总数量*/
    .cart_p_num{
    border-bottom: 1px solid #eee;
    p{
      line-height: 2;
      .price{
        font-size: 2.4rem;
        color:red;
      }
    }
  }
  }
  /*购物车列表*/

  .cart_list{
    margin-top: 1rem;
    padding: .5rem;
    background: #fff;
    border-radius: .5rem;
    display: flex;
    ul{
    width: 100%;
      .item{
        display: flex;
        width:100%;
        border-bottom: 1px solid #eee;
        padding: 1rem 0px;
        .left_food{
          flex: 1;
          display: flex;
          img{
            width: 4rem;
            height: 4rem;
            border-radius: 10%;
            margin-right: .8rem;
            }
          .food_info{
            flex: 1;
          }
        }
        .right_cart{
          width: 10rem;
          }
        }
      }
    }
  }

  /*购车加减*/
  .cart_num{
    width: 10rem;
    display: flex;
    margin-top: .8rem;
    .input_left,.input_right{
    flex: 1;
    width: 2.8rem;
    height: 2.8rem;
    line-height: 2.8rem;
    text-align: center;
    color: red;
    border: 1px solid #eee;
    font-size: 2.4rem;
  }

  .input_center{
    flex: 1;
    input{
      width: 2rem;
      text-align: center;
      width: 100%;
      height: 2.8rem;
      border: none;
      border-top: 1px solid #eee;
      border-bottom: 1px solid #eee;
      float: left;
      }
    }
  }

  /*购车空*/

  .cart_empty{
    text-align: center;
    line-height: 3;
    h3{
    font-size: 1.8rem;
  }
  }

</style>
