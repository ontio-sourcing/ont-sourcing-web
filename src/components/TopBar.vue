<template>
  <div id="topBar">
    <el-row type="flex" class="row-bg" justify="end" v-if="noLogin">
      <el-col :span="16"><img id="logo" src="../assets/img/Rectangle.png" alt="" @click="toHomePage"></el-col>
      <el-col :span="8"><el-button type="info" size="mini" round @click="toLogin">我要存证</el-button></el-col>
    </el-row>
    <el-row type="flex" class="row-bg" justify="end" v-else>
      <el-col :span="12"><img id="logo" src="../assets/img/Rectangle.png" alt="" @click="toHomePage"></el-col>
      <el-col :span="12" style="text-align:right;">
        <img src="../assets/img/avatar.png" style="width:3rem;" alt="">
        <span>{{username}}</span>
        <el-button type="info" round size="mini" @click="signOut">退出登录</el-button>
        <el-button type="info" round size="mini" @click="toNewEvidence">我要存证</el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  data(){
    return{
      cusor:'cusor',
      noLogin:true,//默认未登录
      username:''//用户名
    }
  },
  methods:{
    toLogin(){//登录
      var callback_url = window.location.origin+'/#/newEvidence';
      var appontid = 'did:ont:ANqiHycikgyzkfz36faP5ymXLVg1uovhXh';
      var appname = 'OntSourcing';
      var value = window.encodeURIComponent(appontid + '&' + appname + '&' + callback_url+'&'+'zh');
      window.location.href = "http://139.219.136.188:10390?params="+value;
    },
    toNewEvidence(){
      this.$router.push({name:'newEvidence'});
    },
    toHomePage(){//首页
      if(this.$route.name == 'Home'){
        window.location.reload();
      }else{
        this.$router.push({name:'Home'});
      }
    },
    signOut(){//退出
      this.$confirm('确定退出当前登录吗？','提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {//确定
          this.noLogin = true,//默认未登录
          sessionStorage.removeItem("user_ontid");
          sessionStorage.removeItem("access_token");
          // window.location.reload();
          this.$router.push({name:'Home'});
        }).catch(() => {
                  
        });
      
    }
  },
  mounted(){//得到token值保存session
      if(sessionStorage.getItem("user_ontid")){
        this.noLogin = false;
        this.username = sessionStorage.getItem("user_ontid");  
      }
      else{
        var result = this.$route.query.result;
        if(result){
          var response = JSON.parse(decodeURIComponent(result));
          sessionStorage.setItem("user_ontid",response.user_ontid);
          sessionStorage.setItem("access_token",response.access_token);
          this.username = sessionStorage.getItem("user_ontid");
          this.noLogin = false;
        }
      }
  }
}
</script>


<style scoped>
#topBar{
    width: 100%;
    /* height: 2rem;
    line-height: 2rem;
    padding: 0 2rem; */
    height: 4rem;
    line-height: 4rem;
    padding: 0 5rem;
    background: #fff;
}
#logo{
  cursor: pointer;
}
.el-button--info {
    /* border-radius: 1rem;
    padding: .3rem 1rem; */
    color: #FFF;
    background-color: #000;
}
.el-col.el-col-8 {
    text-align: right;
}
</style>
