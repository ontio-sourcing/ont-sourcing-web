<template>
    <div class="home">
        <TopBar></TopBar>
        <!-- <Top></Top> -->
        <div class="searchBar">
            <div class="searchInput">
                <input v-model="inputvalue" @keyup.enter="search" type="text" autocomplete="off"
               placeholder="请输入存证编号" value="" id="id_hash" style="vertical-align: middle;">
                 <el-button size="small" type="primary" round class="searchIcon" @click="search">搜索</el-button>
            </div>
            
        </div>
        <div class="content" v-if="firstFlag">
            <p class="content_title">最新存证</p>
            <div class="content_data">
                <el-table
                    v-loading="conloading"
                    :data="listContent"
                    style="width: 100%">
                    <el-table-column
                        align="center"
                        prop="_txhash"
                        label="存证编号"
                        width="300">
                    </el-table-column>
                    <el-table-column
                        prop="_ontId"
                        label="ONTID"
                        width="300"
                        align="center">
                    </el-table-column>
                    <el-table-column
                        prop="createTime"
                        label="创建时间"
                        width="300"
                        align="center">
                    </el-table-column>
                    <el-table-column
                        prop="详情"
                        label="存证详情"
                        align="center">
                        <template slot-scope="scope">
                            <el-button
                            @click="lookConDetail(scope.$index)"
                            type="text">
                            点击查看详情
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>
        <div class="searchContent" v-else>
            <p class="searchTop">
                <span class="search_title">存证信息</span><span class="num">共{{allNum}}条</span>
            </p>
            <div class="search_data">
                <el-table
                    v-loading="loading"
                    :data="searchContent"
                    style="width: 100%">
                    <el-table-column
                        prop="_txhash"
                        label="存证编号"
                        width="300"
                        align="center">
                    </el-table-column>
                    <el-table-column
                        prop="_ontId"
                        label="ONTID"
                        width="300"
                        align="center">
                    </el-table-column>
                    <el-table-column
                        prop="createTime"
                        label="创建时间"
                         width="300"
                         align="center">
                    </el-table-column>
                    <el-table-column
                        label="存证详情"
                        align="center">
                        <template slot-scope="scope">
                            <el-button
                            @click="lookSearDetail(scope.$index)"
                            type="text">
                            点击查看详情
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>
    </div>
</template>
<script>
import {API_ROOT} from '../config'
import TopBar from './TopBar'
// import Top from './Top'
export default {
    components:{
        TopBar,
        // Top
    },
    data(){
        return{
            showLoading:false,
            firstFlag:true,//首次显示内容true false:搜索内容
            inputvalue:'',//输入框值
            listContent:[],//内容值
            // listContent:data,
            allNum:0,//信息条数
            searchContent:[],
            loading:false,//搜索加载
            conloading:false,//首页列表加载
        }
    },
    created(){
        //请求首页列表
        this.conloading = true;
        this.getHomeData();
        //每隔10秒获取最新内容
        this.intervalBlock = setInterval(this.getHomeData,10000);
    },
    beforeDestroy() {
      clearInterval(this.intervalBlock)
    },
    methods:{
        getHomeData(){//获取首页列表
            this.$http.post(process.env.API_ROOT+'api/v1/contract/explorer',{
                "pageNum": 1,"pageSize": 10})
                .then((response)=> {
                    this.conloading = false;
                    console.log(response)
                    this.listContent = response.data.result;
                    this.listContent.forEach(item => {
                        item.createTime = item.createTime.replace(/^(\d{4}-\d{2}-\d{2})(T)(\d{2}:\d{2}:\d{2})(.*)$/,'$1 $3');
                        item._txhash=item.txhash.substring(0,10)+'.....'+item.txhash.substring(item.txhash.length-5);
                        item._ontId = item.ontid.substring(0,10)+'.....'+item.ontid.substring(item.ontid.length-5);
                    });
                })
                .catch((error)=> {
                    this.conloading = false;
                    console.log(error);
                });
        },
        //搜索内容
        search(){
            if(this.inputvalue != ''){
                this.firstFlag = false;//变成search内容
                this.loading = true;
                this.$http.post(process.env.API_ROOT+'api/v1/contract/explorer/hash',
                  {"hash":this.inputvalue})
                    .then( (response) =>{
                    this.loading = false;
                    this.searchContent = response.data.result;
                    this.searchContent.forEach(item =>{
                        item._txhash=item.txhash.substring(0,10)+'.....'+item.txhash.substring(item.txhash.length-5);
                        item._ontId = item.ontid.substring(0,10)+'.....'+item.ontid.substring(item.ontid.length-5);
                    })
                    this.allNum=response.data.result.length;
                })
                .catch( (error) =>{
                    this.loading = false;
                    console.log(error);
                });
            }else{
                this.$confirm('请输入存证编号进行搜索','提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                    }).then(() => {//确定
                    
                    }).catch(() => {
                            
                });
            }
        },
        lookConDetail(index){//内容点击详情
            this.$router.push({path:'/detailEvidence/'+this.listContent[index].txhash});
        },
        lookSearDetail(index){//搜索点击详情
            this.$router.push({path:'/detailEvidence/'+this.searchContent[index].txhash});
        }
    }
}
</script>
<style scoped>
button.el-button.el-button--default{
    position: absolute;
    right: 5%;
    top: 5%;
}
.searchBar{
    width: 100%;
    height: 330px;
    background: url(../assets/img/topBanner.png) no-repeat;
    background-size: 100% 100%;
}
.searchInput{
    width: 70%;
    position: relative;
    left: 15%;
    top: 40%;
}
.load{
    margin-top: 40px;
}
.load img{
    width: 4%;
}
.searchIcon{
    position: absolute;
    right: 2%;
    /* top: 34%; */
    font-size: 1.2rem;
    /* font-weight: bold; */
    float: right;
    top: 24%;
}
.el-button--small, .el-button--small.is-round {
    padding: 9px 20px;
}
.el-table .cell {
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    white-space: normal;
    word-break: unset !important;
    line-height: 23px;
    text-overflow: ellipsis;
    overflow: hidden;
    text-align: center;
}
input {
    width: 100%;
    padding: 1rem;
    border-radius: 30px;
    border: 5px solid #019fff;
    background-color: #fff;
    outline: none;
    height: 5rem;
    font-size: 1.5rem;
  }
.content,.searchContent{
    width: 85%;
    margin: 0 auto;
    text-align: center;
    background: #fff;
    padding: 3rem 0 8rem 0;
    margin-bottom: 5rem;
}
.content_data,.search_data{
    margin: 0 auto;
    padding: 0 3rem;
}
.content_title{
    font-size: 2rem;
    text-align: center;
    /* margin-top: 20px; */
    border-bottom: 1px solid #ddd;
    /* margin: 20px auto; */
    height: 50px;
    /* line-height: 50px; */
}
.el-row{
    text-align: center;
    margin: 0 auto;
    border-bottom: 1px solid #efecec    ;
    padding-bottom: 10px;
    vertical-align: middle;
    height: 45px;
    line-height: 45px;
}
.el-table thead{
    color: #3f4042;
}
.searchTop{
    /* margin: 30px 0; */
    font-size: 2rem;
}
/* .search_title{
    font-weight: bold;
    font-size: 30px;
} */
.num{
    margin-left: 10px;
}
.el-col-7 {
    width: 29.16667%;
    text-overflow: ellipsis;
    overflow: hidden;
}
</style>
