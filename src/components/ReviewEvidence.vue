<template>
    <div class="review">
        <TopBar></TopBar>
        <div class="reviewContainer" v-loading="fullscreenLoading">
            <p class="review">存证预览</p>
            <el-table
                :data="cunZhengList"
                style="width: 100%">
                <template v-for="item in tableHeader" :index="item">
                    <el-table-column
                        :key="item"
                        :prop="item"
                        :label="item"
                        width="200"
                        align="center">
                    </el-table-column>
                </template>
            </el-table>
            <div class="reviewBottom">
                <el-button type="primary" round class="back" @click="back">返回</el-button>
                <el-button type="primary" round class="confirm" @click="confirm">确认提交</el-button>
            </div>
        </div>
    </div>
</template>
<script>
import TopBar from './TopBar'
const sha256 = require("js-sha256").sha256;
export default {
    data(){
        return{
            fullscreenLoading:false,
            access_token:'',
            ontId:'',
            cunZhengList:[],
            tableHeader:[],
            newCunZheng:[],//提交给后台的hash的list
        }
    },
    components:{
        TopBar
    },
    mounted(){
        this.access_token = sessionStorage.getItem('access_token');
        this.ontId = sessionStorage.getItem('user_ontid');
        let _fileData = this.$route.params.cunZheng;
        // console.log(this.cunZhengList[0]);
        let headerList=_fileData[0];//第一行头部
        let arr=[];//
        for(let i=1,len=_fileData.length;i<len;i++){
            let obj={};
            let c = _fileData[i].join("").trim();
            if(!c){
                continue;
            }
            for(let j=0,headLen=headerList.length;j<headLen;j++){
                obj[headerList[j]]=_fileData[i][j]||'';
            }
            arr.push(obj);
        }
        this.tableHeader=headerList;
        this.cunZhengList=arr;
    },
    methods:{
        back(){
            this.$router.back();
        },
        confirm(){//确认提交，将list-》hash值
            this.getAllHash();

        },
        getAllHash(){
            var newCunZheng = [];
            var detail = [];
            let _cunZhengList=this.cunZhengList;
            let type;//存放的类型 INDEX：目录 IMAGE:图片
            for(let i = 0,len=_cunZhengList.length; i < len; i++ ){
                var detailLine = {};//每一行
                var textLine = [];//相当于一行里的文本值
                let imageList=[];//每一行存放的图片哈希值
                let index=0;
                for(var j in _cunZhengList[i]){
                    if(index<10){
                        textLine.push(_cunZhengList[i][j]);//文本
                        
                    }else{
                        //hash
                        let imageHash=sha256(_cunZhengList[i][j]);
                        imageList.push(imageHash);
                        let fileObj={};
                        let detail = [];
                        let img = {}
                        img.imgUrl = _cunZhengList[i][j];
                        detail.push(img);

                        fileObj.filehash=sha256(_cunZhengList[i][j]);
                        fileObj.detail = detail;
                        // fileObj.detail=_cunZhengList[i][j];
                        fileObj.type = 'IMAGE';//图片
                        newCunZheng.push(fileObj);
                    }
                    index++;
                }
                detailLine.textLine = textLine;//文本
                detailLine.imageList = imageList;//图片哈希
                console.log('【detailLine】 ',detailLine);
                let detail = [];
                detail.push(detailLine);
                // let detail=JSON.stringify(detailLine);//每一行  转字符串的detail
                let filehash=sha256(JSON.stringify(detail)); //一行hash-》filehash
                let fileObj={};
                fileObj.filehash=filehash;
                fileObj.detail=detail;
                fileObj.type = 'INDEX';//目录
                newCunZheng.push(fileObj);
                console.log('【newCunZheng】 ',JSON.stringify(newCunZheng));
            }
                this.newCunZheng = newCunZheng;
                this.postFileHashs();
        },
        postFileHashs(){
            var that = this;
            that.fullscreenLoading = true;
            console.log("存证：",that.newCunZheng);
            that.$http.post(process.env.API_ROOT+'api/v1/contract/put/batch',{
                "user_ontid":that.ontId,
                "access_token":that.access_token,
                "filelist":that.newCunZheng
            })
            .then( (response)=> {
                that.fullscreenLoading = false;
                if(response.data.error != 0){
                    this.$message({type:'error',message:response.data.desc});
                }else{
                    that.$router.push({name:'confirm'});
                }
            })
            .catch( (error) =>{
                that.fullscreenLoading = false;
                this.$message({type:'error',message:error});
                console.log(error);
            });
        }
    }
}
</script>
<style>
.reviewContainer{
    width: 80%;
    margin: 0 auto;
    margin-top: 2rem;
    background: #fff;
    padding-bottom: 2rem;
    /* height: 550px;; */
}
.reviewContainer .review{
    font-size: 1.4rem;
    font-weight: bold;
    text-align: center;
    border-bottom: 1px solid #eae7e7;
    line-height: 4rem;
}
.reviewBottom{
    margin-top: 5rem;
    text-align: center;
}
.back{
    margin-right: 5%;
    background:unset;
    color: #409eff;
    border-color: #409eff;
    width: 8%;
}
.el-table .cell{
    overflow: hidden !important;
    text-overflow: ellipsis !important;
    white-space: nowrap !important;
}
</style>


