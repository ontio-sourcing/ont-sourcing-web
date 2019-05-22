<template>
  <div class="review">
    <TopBar></TopBar>
    <div class="reviewContainer" v-loading="fullscreenLoading" v-if="!is2c">
      <p class="review">存证预览</p>
      <el-table :data="cunZhengList" style="width: 100%">
        <template v-for="item in tableHeader" :index="item">
          <el-table-column :key="item" :prop="item" :label="item" width="200" align="center"></el-table-column>
        </template>
      </el-table>
      <div class="reviewBottom">
        <el-button type="primary" round class="back" @click="back">返回</el-button>
        <el-button type="primary" round class="confirm" @click="confirm">确认提交</el-button>
      </div>
    </div>
    <!-- 输入框 -->
    <div class="formBox" v-else>
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="文件hash" prop="filehash">
          <el-input v-model="ruleForm.filehash"></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="desc">
          <el-input type="textarea" v-model="ruleForm.desc"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">立即提交</el-button>
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-dialog
      title="扫描二维码支付"
      :visible.sync="dialogVisible"
      width="80%"
      :before-close="handleClose"
      center
    >
      <img :src="url" alt srcset id="qrImg">
      <span slot="footer" class="dialog-footer">
        <el-button @click="overClick()">取 消</el-button>
        <el-button type="primary" @click="overClick()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import TopBar from './TopBar'
const sha256 = require("js-sha256").sha256;
import QRCode from 'qrcode'
import { clearInterval, setInterval } from 'timers';
export default {
  data() {
    return {
      url: '',
      fullscreenLoading: false,
      access_token: '',
      ontId: '',
      cunZhengList: [],
      tableHeader: [],
      ruleForm: {
        filehash: '',
        desc: ''
      },
      rules: {
        filehash: [
          { required: true, message: '请输入文件hash', trigger: 'blur' }
        ]
      },
      is2c: false,
      dialogVisible: false,
      checkHash: '',
      checkTimer: null
    }
  },
  components: {
    TopBar
  },
  mounted() {
    this.access_token = sessionStorage.getItem('access_token');
    this.ontId = sessionStorage.getItem('ontid');
    let _fileData = this.$route.params.cunZheng;
    let type = sessionStorage.getItem('TYPE')
    if (type === '2c') {
      this.is2c = true
    } else {
      let headerList = _fileData[0];//第一行头部
      let arr = [];//

      for (let i = 1, len = _fileData.length; i < len; i++) {
        let obj = {};
        let c = _fileData[i].join("").trim();
        if (!c) {
          continue;
        }
        headerList.map((val, j) => {
          obj[headerList[j]] = _fileData[i][j] || "";
        })
        arr.push(obj);
      }
      this.tableHeader = headerList;
      this.cunZhengList = arr;
    }

  },
  methods: {
    back() {
      this.$router.back();
    },
    confirm() {//确认提交，将list-》hash值
      this.postFileHashs();
    },
    postFileHashs() {
      this.fullscreenLoading = true;
      this.$http.post(process.env.API_ROOT + 'api/v1/attestations/put/custom', {
        "user_ontid": this.ontId,
        "access_token": this.access_token,
        "filelist": this.newCunZheng
      })
        .then((response) => {
          this.fullscreenLoading = false;
          if (response.data.error != 0) {
            this.$message({ type: 'error', message: response.data.desc });
          } else {
            this.$router.push({ name: 'confirm' });
          }
        })
        .catch((error) => {
          this.fullscreenLoading = false;
          this.$message({ type: 'error', message: error });
        });
    },
    submitForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          let prs = {
            access_token: this.access_token,
            filehash: this.ruleForm.filehash,
            metadata: {
              name: '',
              Title: '',
              Tags: '',
              Description: '',
              Timestamp: '',
              Location: '',
            },
            context: {
              image: [],
              text: []
            },
            signature: '',
            type: 'TEXT'
          }

          try {
            let res = await this.$http.post(process.env.TOC_API_ROOT + 'api/v1/c/attestation/put', prs)
            let params = res.data.result
            if (!params) {
              this.$message({ type: 'error', message: '二维码已失效，请重试！' });
              return
            }
            params.params.qrcodeUrl = process.env.TOC_API_ROOT + params.params.qrcodeUrl
            params.params.callback = process.env.TOC_API_ROOT + params.params.callback
            let qrstr = JSON.stringify(params)
            QRCode.toDataURL(qrstr)
              .then(url => {
                this.url = url
                this.dialogVisible = true
              })
              .catch(err => {
                console.error(err)
              })

            let str = params.params.qrcodeUrl
            let idx = str.indexOf('cyano/') + 6
            this.checkHash = str.slice(idx)

            clearInterval(this.checkTimer)
            this.checkTimer = setInterval(() => {
              try {
                this.checkPay()
              } catch (error) {
                clearInterval(this.checkTimer)
                this.dialogVisible = false
                this.$message({ type: 'error', message: error });
              }
            }, 3000);
          } catch (error) {
            this.dialogVisible = false
            this.$message({ type: 'error', message: error });
          }
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    handleClose(done) {
      clearInterval(this.checkTimer)
      done()
    },
    async checkPay() {
      let res = await this.$http.post(process.env.TOC_API_ROOT + 'api/v1/c/attestation/hash', {
        access_token: this.access_token,
        hash: this.checkHash
      })
      if (res.data.result.length > 0 && res.data.result[0].height > 0) {
        this.dialogVisible = false
        this.url = ''
        clearInterval(this.checkTimer)
        this.$router.push({ name: 'confirm' });
      } else { }
    },
    overClick() {
      clearInterval(this.checkTimer)
      this.dialogVisible = false
    }
  },
  computed: {
    newCunZheng() {
      let newCunZheng = [];
      let detail = [];
      let _cunZhengList = this.cunZhengList;
      let type;//存放的类型 INDEX：目录 IMAGE:图片
      _cunZhengList.map((outer, i) => {
        let detailLine = {};//每一行
        let textLine = [];//相当于一行里的文本值
        let imageList = [];//每一行存放的图片哈希值
        let index = 0;
        for (let j in _cunZhengList[i]) {
          if (index < 10) {
            textLine.push(_cunZhengList[i][j]);//文本
          } else {
            //hash
            let imageHash = sha256(_cunZhengList[i][j]);
            imageList.push(imageHash);
            let fileObj = {};
            let detail = [];
            let img = {}
            img.imgUrl = _cunZhengList[i][j];
            detail.push(img);

            fileObj.filehash = sha256(_cunZhengList[i][j]);
            fileObj.detail = detail;
            // fileObj.detail=_cunZhengList[i][j];
            fileObj.type = 'IMAGE';//图片
            newCunZheng.push(fileObj);
          }
          index++;
        }
        detailLine.textLine = textLine;//文本
        detailLine.imageList = imageList;//图片哈希
        let detail = [];
        detail.push(detailLine);
        // let detail=JSON.stringify(detailLine);//每一行  转字符串的detail
        let filehash = sha256(JSON.stringify(detail)); //一行hash-》filehash
        let fileObj = {};
        fileObj.filehash = filehash;
        fileObj.detail = detail;
        fileObj.type = 'INDEX';//目录
        newCunZheng.push(fileObj);
      })
      return newCunZheng
    }
  },
}
</script>
<style>
.reviewContainer {
  width: 80%;
  margin: 0 auto;
  margin-top: 2rem;
  background: #fff;
  padding-bottom: 2rem;
}
.reviewContainer .review {
  font-size: 1.4rem;
  font-weight: bold;
  text-align: center;
  border-bottom: 1px solid #eae7e7;
  line-height: 4rem;
}
.reviewBottom {
  margin-top: 5rem;
  text-align: center;
}
.back {
  margin-right: 5%;
  background: unset;
  color: #409eff;
  border-color: #409eff;
}
.el-table .cell {
  overflow: hidden !important;
  text-overflow: ellipsis !important;
  white-space: nowrap !important;
}
.formBox {
  width: 50%;
  margin: 100px auto;
}
@media screen and (min-width: 768px) and (max-width: 991px) {
  .formBox {
    width: 70%;
  }
}

@media screen and (min-width: 575px) and (max-width: 767px) {
  .formBox {
    width: 80%;
  }
}

@media screen and (max-width: 574px) {
  .formBox {
    width: 90%;
  }
}
/* 
.qr_code {
  width: 200px;
  height: 200px;
  background: #000;
  margin: 100px auto;
  overflow: hidden;
}

.qr_code img {
  width: 100%;
  height: 100%;
} */
#qrImg {
  width: 200px;
  height: 200px;
  display: block;
  /* background: #000; */
  margin: 0 auto;
}
</style>


