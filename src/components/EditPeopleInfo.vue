<template>
  <div >
    <div class="start_content">
      <header class="start_header">
        <img src="../assets/images/canju.png"/> 修改人数
      </header>
      <p class="notice">请选择正确的用餐人数 </p>

      <div class="content">
        <ul class="user_list">
          <li v-for="(item,i) in userList" :class="{'active':parseInt(peopleList.p_num)==i+1}">
            <span>{{item}}</span>
          </li>
        </ul>
        <div class="mark_input">
          <input type="text" placeholder="请输入您的口味要求" v-model="p_mark">
        </div>
        <ul class="mark_list">
          <li>
            <span>打包带走</span>
          </li>
          <li>
            <span>本店食用</span>
          </li>
        </ul>
      </div>
    </div>

    <button id="start_cancel" class="start_cancel">
      <router-link to="/cart">取消</router-link>
    </button>
    <button id="start_ok" class="start_ok" @click="addPeopleInfo()">确定修改</button>
  </div>
</template>

<script>
  import storage from '../model/storage.js'
	export default {
		name: "Start",
    data(){
		  return{
        p_num:'1人',
        p_mark:'',
        peopleList:[],
        userList:[]
      }
    },
    mounted(){
		  this.getPeopleInfoList();
      for(var i=0;i<12;i++){
        this.userList.push(i+1+'人')
      }
      this.$nextTick(function () {
        this.addChangeEnvet();
      })
    },
    methods:{
		  addChangeEnvet(){
		    var that=this
        //人数的dom操作
		    var userLis=document.querySelectorAll('.user_list li')
		    for(var i=0;i<userLis.length;i++){
          userLis[i].onclick=function(){
		        for(var j=0;j<userLis.length;j++){
              userLis[j].className=''
            }
		        this.className='active'
		        that.p_num=this.querySelector('span').innerHTML.trim()
          }
        }

        //口味偏好的dom操作
        var markLis=document.querySelectorAll('.mark_list li')

        for(var i=0;i<markLis.length;i++){
          markLis[i].onclick=function(){

            for(var j=0;j<markLis.length;j++){
              markLis[j].className=''
            }
            this.className='active'   //this 就是li这个dom节点
            that.p_mark= that.p_mark+' '+this.querySelector('span').innerHTML.trim()
          }

        }
      },
      //添加备注信息和用餐人数
      addPeopleInfo(){
           var uid=storage.get('roomid');
           this.$axios.post('/addPeopleInfo',{
            uid:uid,
            p_num:this.p_num,
             p_mark:this.p_mark
          }).then(res=>{
            if(res.data.success==="true"){
              this.$router.push({path:'cart'})
            }
          }).catch(err=>{
              console.log(err)
           })
      },
      //获取用餐人数信息
     getPeopleInfoList(){
       var uid=storage.get('roomid')
       this.$axios.get(`/peopleInfoList?uid=${uid}`)
         .then(res=>{
           console.log(res.data)
           this.peopleList=res.data.result[0]
           this.p_mark=this.peopleList.p_mark
      })
         .catch(err=>{
           console.log(err)
      })
  }

  }
	}
</script>

<style lang="scss" scoped>
  .start_content {
    .start_header {
      height: 3.2rem;
      line-height: 3.2rem;
      background: #000;
      color: #fff;
      width: 10rem;
      margin: 5rem auto 0rem auto;
      border-radius: .5rem;
      img {
        height:2.2rem;
        line-height: 2.2rem;
        position: relative;
        top:.5rem;
        margin-left: 1rem;
      }
    }
    .notice {
      color: #ff3e3f;
      text-align: center;
      margin:1rem 0rem;
    }
    .mark_input {
      padding:1rem;
      input {
        height:2.5rem;
        line-height: 2.5rem;
        width:100%;
        border: 1px solid rgba(192, 236, 255, 0.94);
      }
    }
    .user_list,.mark_list {
      display: flex;
      flex-wrap: wrap;
      padding: .5rem;
      justify-content: space-around;
      li {
        width: 25%;
        padding: .5rem;
        box-sizing: border-box;
        span {
          display: block;
          width: 100%;
          height: 3.2rem;
          line-height: 3.2rem;
          text-align: center;
          background: #fff;
          border-radius: .5rem;
          border: 1px solid #ccc;
        }
      }
      li.active {
        span {
          background-color: #ff1c43;
          border:1px solid #ffffff;
          color: rgba(13, 13, 13, 0.99);
        }
      }
    }
  }
  .start {
    position: fixed;
    bottom: 5rem;
    left: 50%;
    margin-left: -3rem;
    width: 6rem;
    height: 6rem;
    border-radius: 50%;
    background: #ff4143;
    color: #fff;
    span {
      display: block;
      width: 2rem;
      margin: 0 auto;
      position: relative;
      top:1.5rem;
    }
  }
  .start_ok {
    position: fixed;
    bottom: 4rem;
    right:6rem;
    width: 4rem;
    height: 4rem;
    border-radius: 50%;
    background: #ff4c4c;
    color: #fff;
  }
  .start_cancel {
    position: fixed;
    bottom: 4rem;
    left:6rem;
    width: 4rem;
    height: 4rem;
    border-radius: 50%;
    background: #ff464b;
    color: #fff;
    a {
      color:#fff;
      text-decoration: none;
    }
  }
</style>
