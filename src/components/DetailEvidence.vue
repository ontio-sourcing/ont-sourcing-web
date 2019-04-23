<template>
    <div class="detailEvidence" v-loading.fullscreen.lock="fullscreenLoading">
        <div class="topBar">
            <img src="../assets/img/Rectangle.png" alt="" @click="toHomePage">
        </div>
        <div class="detainCon">
            <div class="detailImg" v-if="haveImg">
                <div class="img_title">证书图片</div>
                <div class="imgDetail">
                    <div class="work-group">
                        <div class="group">Group : </div>
                        <div class="group">{{workData[0]}}</div>
                    </div>
                    <div class="work-name">{{workData[1]}}</div>
                    <div class="work-trustAnchor">
                        <div class="trustAnchor">Trust Anchor : </div>
                        <div class="trustAnchor">{{workData[2]}}</div>
                    </div>
                    <div class="work-desc">
                        <div class="desc">Description:{{workData[3]}} </div>
                    </div>
                    <div class="work-crypto">
                        <div class="crypto">crypto_function</div>
                        <div class="upload">SHA256</div>
                    </div>
                    <div class="work-uploadtime">
                        <div class="crypto">uploadTime</div>
                        <div class="upload">{{detailData.createTime}}</div>
                    </div>
                    <div class="work-hash">
                        <div class="hash">WorkHash:{{detailData.txhash}}</div>
                    </div>
                </div>
            </div>
            <!-- <div class="detailImg" v-if="haveImg">
                <div class="img_title">证书图片</div>
                <div class="imgDetail">
                    <div class="work-group">
                        <div class="group">Group : </div>
                        <div class="group">{{work.group}}</div>
                    </div>
                    <div class="work-name">{{work.name}}</div>
                    <div class="work-trustAnchor">
                        <div class="trustAnchor">Trust Anchor : </div>
                        <div class="trustAnchor">{{work.anchor}}</div>
                    </div>
                    <div class="work-desc">
                        <div class="desc">Description:{{work.desc}} </div>
                    </div>
                    <div class="work-crypto">
                        <div class="crypto">crypto_function</div>
                        <div class="upload">SHA256</div>
                    </div>
                    <div class="work-uploadtime">
                        <div class="crypto">uploadTime</div>
                        <div class="upload">{{work.uploadTime}}</div>
                    </div>
                    <div class="work-hash">
                        <div class="hash">WorkHash:{{work.work_HASH}}</div>
                    </div>
                </div>
            </div> -->
            <div class="detailCon">
                <div style="padding:0 5%;">
                    <div class="detail-title">存证详情</div>
                    <div class="con">
                        <p>存证编号：<span>{{detailData.txhash}}</span></p>   
                    </div>
                    <div class="con">
                        <p>存证者 ONTID:<span>{{detailData.ontid}}</span></p>
                    </div>
                    <div class="con">
                        <p>被存证者 ONTID:<span>{{detailData.companyOntid}}</span></p>
                    </div>
                    <div class="con">
                        <p>创建时间：<span>{{detailData.createTime}}</span></p>
                    </div>
                    <div class="con">
                        <p>区块高度:<span>{{detailData.height}}</span></p>
                    </div>
                    <div class="con">
                        <p>时间戳：<span>{{detailData.timestamp}}</span></p>
                    </div>
                    <!-- <div class="con">
                        <p>时间戳签名：<span class="timestampSign">{{detailData.timestampSign}}</span></p>
                    </div> -->
                    <div class="con">
                        <p>存证哈希：<span>{{detailData.filehash}}</span></p>
                    </div>
                    <div class="con" v-if="detailData.imgUrl != '' && detailData.type == 'IMAGE'">
                        <p>详情:<span><a :href="detailData.imgUrl">{{detailData.imgUrl}}</a></span></p>
                    </div>
                    <div class="con" v-else>
                        <div class="timestampSign">详情:
                                <div v-for="item in workData" :key="item" style="margin-left: 5%;margin-top: -2.5%;">
                                    <p>{{iitem}}</p>
                                </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { API_ROOT } from "../config";
export default {
  data() {
    return {
        fullscreenLoading:false,//加载
        haveImg:true,//是否有证书图片
        hash:'',
        workData:[],//图片上的内容
        detailData:{},//详情数据
    };
  },
  methods:{
      toHomePage(){
          this.$router.push({name:'Home'})
      }
  },
  mounted(){
      this.fullscreenLoading = true;
      this.hash = this.$route.params.id;
      console.log(this.hash);
      this.$http.post('http://172.168.3.17:7088/api/v1/contract/explorer/hash',{
                "access_token": this.access_token,
                "hash":this.hash
        })
        .then((response) =>{
            this.fullscreenLoading = false;
            console.log(response);
            this.detailData = response.data.result[0];
            this.detailData.imgUrl = JSON.parse(this.detailData.detail)[0].imgUrl;
            if(this.detailData.type == 'IMAGE'){//图片
                this.haveImg = false;
                this.detailData.imgUrl = JSON.parse(this.detailData.detail)[0].imgUrl;
            }else if(this.detailData.type == 'INDEX'){//目录
                this.haveImg = true;
                this.workData = JSON.parse(this.detailData.detail)[0].textLine;
                // for(var i = 0 ;i < this.workData.length; i++){
                //     if(this.workData[i] == ''){//只要有一个不为空就显示图片
                //          this.haveImg = false;
                //          break;
                //     }
                // }
            }
        })
        .catch( (error)=> {
            console.log(error);
        });
  }
};
</script>
<style scoped>
@media screen and (min-width:320px) and (max-width:414px) {
    html{
        font-size: 62.5% !important;
    }
    .detainCon{
        width: 100% !important;
        margin: 1rem auto !important;
      padding: 1rem !important;
    }
    .imgDetail {
      background: url('../assets/img/dianqingback.png') no-repeat;
      background-size: 100% 100% !important;
      background-position: center !important;
      font-size: 1.2rem !important;
      height: unset !important;
      }
    .img_title,.detail-title{
      font-size: 1.5rem !important;
      margin-bottom: 1rem !important;
      padding-left: 0% !important;
      font-weight: bold !important;
    }
    .con{
        width: unset !important;
        font-size: 1.2rem !important;
      word-break: break-all !important;
    }
    .work-group{
      top: 25% !important;
      font-size: .8rem !important;
      /* left: 30% !important; */
      padding-top: 1.6rem;
    }
    .work-name{
      font-size: 1rem !important;
      padding-top: 0.5rem !important;
      width: 60% !important;
    }
    .work-trustAnchor{
      padding-top: 1rem !important;
      font-size: .8rem;
    }
    .work-crypto{
      top: unset !important;
      font-size: .5rem !important;
      padding-bottom: -4% !important;
      position: absolute !important;
      left: 20% !important;
      margin-top: -4rem !important;
      padding-bottom: 1rem !important;
    }
    .work-uploadtime{
      right: -17% !important;
      top: unset !important;
      font-size: .5rem !important;
      position: absolute !important;
      left: 20% !important;
      margin-top: -4rem !important;
      padding-bottom: 1rem !important;
    }
    /* .work-crypto,.work-uploadtime{
        font-size: .8rem !important;
    } */
    .work-hash{
        font-size: .8rem !important;
        width: unset !important;
    }
    .work-desc{
      font-size: .8rem !important;
      width: 64% !important;
      word-break: break-all !important;
      margin-bottom: 4rem !important;
    }
    .hash{
      position: relative;
      top: -1rem;
      /* word-break: break-all; */
      /* width: 90%; */
      margin: 0 auto;
      /* font-size: .1rem; */
      text-overflow: ellipsis;
      overflow: hidden;
      width: 80%;
    }
}


@media only screen and (min-width: 414px) {

  html {font-size: 22.08px !important;}

}

@media only screen and (min-width: 480px) {

  html {font-size: 25.6px !important;}
}

html {

  font-family: sans-serif;

  -ms-text-size-adjust: 100%;

  -webkit-text-size-adjust: 100%;

}
.topBar {
  height: 4rem;
  line-height: 4rem;
  padding: 0 5rem;
  background: #fff;
}
.detainCon {
  width: 70%;
  background: #fff;
  margin: 2rem auto;
  padding: 3rem 0;
}
.detailImg {
  text-align: center;
}
.img_title{
  font-size: 2rem;
  margin-bottom: 1rem;
  text-align: left;
  padding-left: 5%;
  font-weight: bold;
}
.detail-title {
  font-size: 2rem;
  margin-bottom: 1rem;
  text-align: left;
  font-weight: bold;
}
.con{
    width: 950px;
    margin: 0 auto;
}
.con span{
    font-size: 1.3rem;
}
.imgDetail {
  background: url('../assets/img/dianqingback.png') no-repeat;
  background-size: 90% 699px;
  background-position: center;
  height: 699px;
  font-size: 2rem;
  position: relative;
  /* background: url(/static/img/dianqingback.85d5c41.png) no-repeat;
    background-size: 100% 100%;
    background-position: center;
    height: 20rem; */
}
.work-group{
    position: relative;
    top: 10%;
}
.group{
    display: inline-block;
}
.work-name{
    width: 39rem;
    margin: auto;
    position: relative;
    top: 17%;
    color: rgba(181,148,114,1);
    font-size: 2.4rem;
    font-weight:600;
}
.work-trustAnchor{
 position: relative;
 top: 25%;
}
.work-trustAnchor .trustAnchor{
    display: inline-block;
}
.work-desc{
    height: 6rem;;
    top: 30%;
    position: relative;
    width: 45rem;
    margin: 0 auto;
    font-size: 1.5rem;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
    overflow: hidden;
    text-overflow: ellipsis;
    word-break: break-all;
}
.work-desc .desc{
  text-align: left;
}
.work-crypto{
    top: 49%;
    position: relative;
    /*left: -22%;*/
    left:-17.5rem;
    font-size: 1.5rem;
}
.work-uploadtime{
        top: 42%;
    position: relative;
    font-size: 1.5rem;
    /*left: 22%;*/
    left: 17.5rem;
}
.work-hash{
    position: relative;
    top: 45%;
    font-size: 1.3rem;
    width: auto;
    margin: 0 auto;
    /*margin-left: 20%;*/
}
.detailCon{
    font-size: 1.5rem;
    margin: 0 auto;
    margin-top: 2rem;
}
ul li{
    margin-top: 1rem;
    margin-top: 1rem;
    display: flex;
    justify-content: space-between;
    list-style: none;
}
.timestampSign{
    overflow: hidden;
    text-overflow: ellipsis;
    word-break: break-all;
}
</style>
