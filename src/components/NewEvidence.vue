<template>
  <div class="newCunzheng">
    <TopBar></TopBar>
    <div class="cunZhengTab" v-loading="loading">
      <el-tabs v-model="activeBar" type="card" @tab-click="changeTab">
        <el-tab-pane label="新建存证" name="first">
          <!-- 步骤条 -->
          <div style="height: 400px;padding-left:2rem;padding-top:2rem;">
            <el-steps direction="vertical" :active="0">
              <el-step>
                <template slot="title">
                  点击下载
                  <span
                    id="download"
                    @click="download"
                    style="color:#409eff;text-decoration:underline;"
                  >存证模板Excel</span>
                </template>
              </el-step>
              <el-step title>
                <template slot="title">
                  <el-upload
                    class="upload-demo"
                    ref="upload"
                    accept=".xls, .xlsx"
                    action
                    :limit="1"
                    :file-list="fileList"
                    :on-change="readExcel"
                    :auto-upload="false"
                  >
                    <el-button round slot="trigger" size="small" type="primary">上传存证Excel</el-button>
                  </el-upload>
                </template>
              </el-step>
              <el-step title>
                <template slot="title" v-if="hasfile">
                  <el-button round size="small" type="info">确认提交</el-button>
                </template>
                <template slot="title" v-else>
                  <el-button round size="small" type="primary" @click="toReview">确认提交</el-button>
                </template>
              </el-step>
            </el-steps>
          </div>
        </el-tab-pane>
        <el-tab-pane label="存证记录" name="second"></el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>
<script>
import TopBar from './TopBar'
import XLSX from 'xlsx'
export default {
  data() {
    return {
      loading: false,
      activeBar: "first",//默认显示第一个
      fileList: [],//上传文件
      hasfile: true,//是否有文件上传
      fileData: [],//读取的excel内容
    }
  },
  components: {
    TopBar
  },
  mounted() {
    if (this.fileData.length > 0) {//有文件上传
      this.hasfile = false;
    } else {
      this.hasfile = true;
    }
  },
  methods: {
    readExcel(file, fileList) {
      this.loading = true;
      var fileReader = new FileReader();
      fileReader.onload = (ev) => {
        try {
          //判断上传的是否是excel文件
          for (var i in fileList) {
            if (!/\.(xls|xlsx)$/.test(fileList[i].name)) {
              this.$confirm('文件类型不正确，请上传Excel的文件格式！', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {//确定
                this.fileList = [];
              }).catch(() => {
                this.fileList = [];
              });
            }
          }
          var data = ev.target.result;
          var workbook = XLSX.read(data, {
            type: 'binary'
          });
          for (let sheet in workbook.Sheets) {
            const sheetArray = XLSX.utils.sheet_to_json(workbook.Sheets[sheet], {
              header: 1
            });  //获得以第一列为键名的sheet数组对象 
            this.fileData = sheetArray;
            if (this.fileData.length > 0) {//有文件上传
              this.hasfile = false;
            } else {
              this.hasfile = true;
            }
          }
          setTimeout(() => {
            this.loading = false;
          }, 1000);
        } catch (e) {

        }
      };
      fileReader.readAsBinaryString(file.raw);
    },
    changeTab(tab, event) {//存证记录tab
      if (tab.index == 1) {
        this.$router.push({ name: 'evidenceRecord' });
      }
    },
    download() {
      window.open(window.location.origin + process.env.fileUrl);
    },
    toReview() {
      this.$router.push({ name: 'reviewEvidence', params: { cunZheng: this.fileData } });
    }
  }
}
</script>
<style>
.cunZhengTab {
  width: 80%;
  margin: 0 auto;
  background: #fff;
  margin-top: 2rem;
  /* height: 550px; */
}
#download {
  cursor: pointer;
}
.el-step__head.is-wait {
  color: #000;
  border-color: #000;
}
.el-step__line {
  background-color: #000;
}
input.el-upload__input {
  display: none;
}
li.el-upload-list__item.is-success {
  width: 25%;
}
.el-upload-list__item .el-icon-close {
  color: #000;
}
.upload-demo {
  display: flex;
}
ul.el-upload-list.el-upload-list--text {
  width: 40%;
}
.el-step__title.is-process {
  font-weight: unset;
}
#pane-second {
  width: 80%;
  margin: auto;
}
.table {
  width: 100%;
  margin: 0.8rem 2rem 0.8rem 0;
}
.block {
  padding: 2rem 0;
}
.pagination {
  margin-top: 30px;
}
div#pane-first {
  height: 40rem;
}
</style>


