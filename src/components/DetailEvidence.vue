<template>
  <div class="detailEvidence">
    <div class="topBar">
      <img src="../assets/img/Rectangle.png" id="detailLogo" alt @click="toHomePage">
    </div>
    <div class="detainCon" v-loading="fullscreenLoading">
      <div class="detailImg" v-if="haveImg">
        <div class="img_title">证书图片</div>
        <div class="imgDetail">
          <div class="work-group absolute">
            <div class="group">Group :</div>
            <div class="group">{{workData[0]}}</div>
          </div>
          <div class="work-name absolute">{{workData[1]}}</div>
          <div class="work-trustAnchor absolute">
            <div class="trustAnchor">Trust Anchor :</div>
            <div class="trustAnchor">{{workData[2]}}</div>
          </div>
          <div class="work-desc absolute">
            <div class="desc">Description:{{workData[3]}}</div>
          </div>
          <div class="work-crypto absolute">
            <div class="crypto">crypto_function</div>
            <div class="upload">SHA256</div>
          </div>
          <div class="work-uploadtime absolute">
            <div class="crypto">uploadTime</div>
            <div class="upload">{{detailData._createTime}}</div>
          </div>
          <div class="work-logo absolute"></div>
          <div class="work-hash absolute">
            <div class="hash">WorkHash:{{detailData.txhash}}</div>
          </div>
        </div>
      </div>
      <div class="detailCon">
        <div style="padding:0 6%;">
          <div class="detail-title">存证详情</div>
          <div class="con">
            <div>
              存证编号：
              <p>{{detailData.txhash}}</p>
            </div>
          </div>
          <div class="con">
            <div>
              存证者 ONTID：
              <p>{{detailData.ontid}}</p>
            </div>
          </div>
          <div class="con">
            <div>
              被存证者 ONTID：
              <p>{{detailData.companyOntid}}</p>
            </div>
          </div>
          <div class="con">
            <div>
              创建时间：
              <p>{{detailData.createTime}}</p>
            </div>
          </div>
          <div class="con">
            <div>
              区块高度：
              <p>{{detailData.height}}</p>
            </div>
          </div>
          <div class="con">
            <div>
              时间戳：
              <p>{{detailData.timestamp}}</p>
            </div>
          </div>
          <div class="con">
            <div>
              存证哈希：
              <p>{{detailData.filehash}}</p>
            </div>
          </div>
          <div class="con">
            <div>
              详情：
              <p v-if="detailData.type == 'IMAGE'">
                <a :href="detailData.imgUrl">{{detailData.imgUrl}}</a>
              </p>
              <div class="timestampSign">
                <div class="detailList" v-if="detailData.type == 'INDEX'">
                  <div v-for="(item, index) in workData" :key="index">
                    <p>{{item}}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import dateFormat from '../util/dateFormat'
export default {
  data() {
    return {
      fullscreenLoading: false,//加载
      haveImg: true,//是否有证书图片
      hash: '',
      workData: [],//图片上的内容
      detailData: {},//详情数据
      toUrl: ''
    };
  },
  methods: {
    toHomePage() {
      this.$router.push({ name: 'Home' })
    },
    getDetail() {
      this.$http.post(this.toUrl, {
        'hash': this.hash      })
        .then((response) => {
          this.fullscreenLoading = false;
          this.detailData = response.data.result[0];
          this.detailData._createTime = this.detailData.createTime.split('T')[0];
          this.detailData.createTime = dateFormat.format('yyyy-MM-dd hh:mm:ss', new Date(this.detailData.createTime));
          this.detailData.timestamp = dateFormat.format('yyyy-MM-dd hh:mm:ss', new Date(this.detailData.timestamp));
          if (this.detailData.type == '') {//类型为空
            this.haveImg = false;
          } else if (this.detailData.type == 'IMAGE') {//图片
            this.haveImg = false;
            this.detailData.imgUrl = JSON.parse(this.detailData.detail)[0].imgUrl;
          } else if (this.detailData.type == 'INDEX') {//目录
            this.haveImg = true;
            let textData = JSON.parse(this.detailData.detail)[0].textLine;
            if (!textData) {
              textData = JSON.parse(this.detailData.detail)[0].textline;
            }
            this.workData = textData;
            var imgHashData = JSON.parse(this.detailData.detail)[0].imageList;
            for (var i in imgHashData) {
              this.workData.push(imgHashData[i]);//图片哈希
            }
          } else if (this.detailData.type == 'TEXT') {
            this.haveImg = false;
          }
        })
        .catch((error) => {
          this.fullscreenLoading = false;
          this.$message({ type: 'error', message: error });
        });
    }
  },
  mounted() {
    this.fullscreenLoading = true;
    this.hash = this.$route.params.id;
    let type = sessionStorage.getItem('TYPE')
    if (type === '2c') {
      this.toUrl = process.env.TOC_API_ROOT + 'api/v1/c/attestation/explorer/hash'
    } else {
      this.toUrl = process.env.API_ROOT + 'api/v1/contract/explorer/hash'
    }
    this.getDetail()
  }
};
</script>
<style scoped>
@media screen and (min-width: 320px) and (max-width: 414px) {
  html {
    font-size: 62.5% !important;
  }
  .detainCon {
    width: 98% !important;
    margin: 1rem auto !important;
    padding: 1rem 0 !important;
    font-size: 0.8rem !important;
  }
  .imgDetail {
    background: url(/static/img/dianqingback.85d5c41.png) no-repeat;
    background-size: 100% 100% !important;
    background-position: center !important;
    font-size: 0.8rem !important;
    height: 30rem !important;
    width: 90% !important;
  }
  .img_title,
  .detail-title {
    font-size: 1.5rem !important;
    margin-bottom: 1rem !important;
    padding-left: 5% !important;
    font-weight: bold !important;
  }
  .detail-title {
    padding-left: 0 !important;
  }
  .con {
    width: unset !important;
    font-size: 1.2rem !important;
    word-break: break-all !important;
    /*margin: 0 5% !important;*/
  }
  .work-group {
    top: 2rem !important;
    font-size: 0.8rem !important;
  }
  .work-name {
    font-size: 1.5rem !important;
    top: 5.5rem !important;
    width: 65% !important;
    overflow: hidden !important;
    text-overflow: ellipsis !important;
    display: -webkit-box !important;
    -webkit-line-clamp: 2 !important;
    -webkit-box-orient: vertical !important;
  }
  .work-trustAnchor {
    top: 11rem !important;
    font-size: 0.8rem;
  }
  .work-crypto,
  .work-uploadtime {
    top: 22.2rem !important;
    font-size: 0.5rem !important;
    left: -44% !important;
  }
  .work-uploadtime {
    left: 44% !important;
  }
  .work-logo {
    top: 22.5rem !important;
    width: 4rem !important;
    height: 2rem !important;
  }
  .work-hash {
    font-size: 0.8rem !important;
    top: 27rem !important;
  }
  .work-desc {
    font-size: 0.8rem !important;
    width: 64% !important;
    word-break: break-all !important;
    top: 14rem !important;
  }
  .hash {
    margin: 0 auto;
    text-overflow: ellipsis;
    overflow: hidden;
    width: 80%;
  }
}
@media only screen and (min-width: 768px) and (max-width: 1024px) {
  html {
    font-size: 65px !important;
  }
  .detainCon {
    width: 90% !important;
  }
}
@media only screen and (min-width: 428px) {
  html {
    font-size: 27.4px !important;
  }
}
@media only screen and (min-width: 481px) {
  html {
    font-size: 30px !important;
  }
}
@media only screen and (min-width: 569px) {
  html {
    font-size: 36px !important;
  }
}
@media only screen and (min-width: 641px) {
  html {
    font-size: 41px !important;
  }
}
@media only screen and (min-width: 750px) {
  html {
    font-size: 48px !important;
  }
}
@media only screen and (min-width: 768px) {
  html {
    font-size: 49px !important;
  }
}
@media only screen and (min-width: 1024px) {
  html {
    font-size: 65px !important;
  }
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
  width: 80%;
  background: #fff;
  margin: 2rem auto;
  padding: 3rem 0;
  font-size: 1.5rem;
}
#detailLogo {
  cursor: pointer;
}
.img_title,
.detail-title {
  font-size: 2rem;
  margin-bottom: 1rem;
  text-align: left;
  padding-left: 6%;
  font-weight: bold;
}
.detail-title {
  padding-left: 0;
}
.imgDetail {
  background: url("../assets/img/dianqingback.png") no-repeat;
  background-size: 100% 100%;
  background-position: center;
  height: 40rem;
  width: 88%;
  margin: auto;
  position: relative;
  text-align: center;
}
.absolute {
  position: absolute;
  left: 0;
  right: 0;
  margin: auto;
}
.work-group {
  top: 3.5rem;
}
.group,
.trustAnchor {
  display: inline-block;
}
.work-name {
  max-width: 66%;
  top: 7rem;
  color: rgba(181, 148, 114, 1);
  font-size: 2rem;
  font-weight: 600;
  white-space: pre-wrap;
}
.work-trustAnchor {
  top: 15rem;
}
.work-desc {
  width: 67%;
  top: 20rem;
  position: relative;
  margin: 0 auto;
  font-size: 1.5rem;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: break-all;
}
.work-crypto,
.work-uploadtime {
  font-size: 1.2rem;
  left: -50%;
  top: 30rem;
  width: 10rem;
}
.work-uploadtime {
  left: 50%;
}
.work-logo {
  top: 28rem;
  width: 10rem;
  height: 5rem;
  background: url("../assets/img/logoEN.png") no-repeat;
  background-size: 100% 100%;
}
.work-hash {
  top: 36rem;
  width: inherit;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
.con div p {
  margin: 0 0 10px;
  word-break: break-all;
  width: 90%;
}
.con span {
  font-size: 1.3rem;
}
.detailCon {
  font-size: 1.5rem;
  margin: 0 auto;
  margin-top: 2rem;
}
ul li {
  margin-top: 1rem;
  margin-top: 1rem;
  display: flex;
  justify-content: space-between;
  list-style: none;
}
.timestampSign {
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: break-all;
}
</style>
