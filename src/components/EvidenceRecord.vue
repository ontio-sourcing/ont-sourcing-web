<template>
    <div class="czDetail">
        <TopBar></TopBar>
        <div class="czDetailCon">
            <div class="buttons">
                <el-button type="primary" round @click="back">返回</el-button>
                <el-button type="primary" icon="el-icon-download" round @click="exporto">导出</el-button>
            </div>
            <div class="listDetail">
                <p class="review">存证预览</p>
                <el-table
                    id="rebateSetTable"
                    v-loading.fullscreen.lock="fullscreenLoading"
                    :data="listDetail"
                    :border="false"
                    style="width: 100%">
                    <el-table-column
                    prop="txhash"
                    label="存证编号"
                    width="180">
                    </el-table-column>
                    <el-table-column
                    prop="createTime"
                    label="创建时间"
                    width="180">
                    </el-table-column>
                    <el-table-column
                    prop="height"
                    label="区块高度"
                    width="180">
                    </el-table-column>
                    <el-table-column
                    prop="timestamp"
                    label="时间戳"
                    width="180">
                    </el-table-column>
                    <el-table-column
                    prop="ontid"
                    label="存证者ONTID"
                    width="180">
                    </el-table-column>
                    <el-table-column
                    prop="companyOntid"
                    label="被存证者ONTID"
                    width="180">
                    </el-table-column>
                    <el-table-column
                    prop="type"
                    label="类型">
                    </el-table-column>
                    <el-table-column
                    type="text"
                    label="存证详情">
                        <template slot-scope="scope">
                            <el-button @click="lookDetail(scope.$index)" type="text" size="small">点击查看</el-button>
                        </template>
                    </el-table-column>
                </el-table>  
                <div class="block">
                    <el-pagination
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :page-sizes="[5, 10]"
                        :page-size="pageSize"
                        :page-count="5"
                        :current-page="nowPage"
                        background
                        layout="->,sizes, prev, pager, next"
                        :total="totalNum">
                    </el-pagination>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import TopBar from './TopBar'
import data from './listContent.json'
import FileSaver from 'file-saver'
import XLSX from 'xlsx'
import {mapGetters} from 'vuex'
export default {
    components:{
        TopBar
    },
    data(){
        return{
            fullscreenLoading:false,//加载
            totalNum:0,//总数
            listDetail:[],
            pageSize:10,//每页显示条目个数
            tableList:[],
            nowPage:1,
            activeBar:"first",
            access_token:'',
        }
    },
    mounted(){
        this.listDetail = this.listDetail.slice(0,this.pageSize);
        this.access_token = sessionStorage.getItem('access_token');
        this.getTotalNum(this.access_token);//获取总数
        this.handleCurrentChange(1);//默认获取第一页
    },
    methods:{
        getTotalNum(access_token){
            this.$http.post('http://172.168.3.17:7088/api/v1/contract/count',{
                "access_token": this.access_token})
            .then((response)=> {
                console.log(response);
                this.totalNum = response.data.result;//存证记录总数量
            })
            .catch( (error) =>{
                console.log(error);
            });
        },
        back(){
            this.$router.back();
        },
        exporto(){//导出
        /* generate workbook object from table */
            let wb = XLSX.utils.table_to_book(document.querySelector('#rebateSetTable'));  //表格的id名
            /* get binary string as output */
            let wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: true, type: 'array' });
            try {
                FileSaver.saveAs(new Blob([wbout], { type: 'application/octet-stream' }), '用户提交返利表.xlsx');
            } catch (e)
            {
                if (typeof console !== 'undefined')
                    console.log(e, wbout)
            }
            return wbout
        },
        handleSizeChange(val) {//点击条数
            // console.log(`每页 ${val} 条`);
            // console.log(val);
            this.pageSize = val;
            this.handleCurrentChange(this.nowPage);
            // this.listDetail = this.listDetail.slice(val*(this.nowPage-1),this.nowPage*val)
        },
        handleCurrentChange(val) {
            // let params = {
            //     "access_token": this.access_token,
            //     "pageNum": val,//页数
            //     "pageSize": this.pageSize,//每页记录数 10以内 
            //     "type":"INDEX"
            // }
            // this.$store.dispatch('getEvidenceRecord',params);
            this.fullscreenLoading = true;
            this.nowPage = val;
            this.$http.post('http://172.168.3.17:7088/api/v1/contract/history',{
                "access_token": this.access_token,
                "pageNum": this.nowPage,//页数
                "pageSize": this.pageSize,//每页记录数 10以内 
                "type":"INDEX"
            })
            .then((response) =>{
                this.fullscreenLoading = false;
                console.log(response);
                this.listDetail = response.data.result;
                // console.log(this.listDetail)
                
            })
            .catch( (error)=> {
                console.log(error);
            });
            // console.log(`当前页: ${val}`);
            // this.listDetail = this.listDetail.slice(this.pageSize*(val-1),this.pageSize*val)
        },
        lookDetail(index){
            this.$router.push({path:'/detailEvidence/'+this.listDetail[index].txhash});
        }
    },
    // computed:{
    //     ...mapGetters({listDetail:'evidenceRecordGet'}) // 动态计算属性，相当于this.$store.getters.resturantName
    // }
}
</script>
<style scoped>
.czDetailCon{
    width: 80%;
    margin: 0 auto;
    margin: 2rem auto;
}
.listDetail{
    margin: 0 auto;
    margin-top: 2rem;
    background: #fff;
    padding-bottom: 2rem;
    /* height: 550px;; */
}
.review{
    font-size: 1.4rem;
    font-weight: bold;
    text-align: center;
    border-bottom: 1px solid #eae7e7;
    line-height: 4rem;
}
.el-table.el-table--fit.el-table--enable-row-hover{
    height: 100%;
}
.buttons{
    display: flex;
    justify-content: space-between;
    margin-bottom: 2rem;
}
.el-table th>.cell{
    color: #000;
}
</style>


