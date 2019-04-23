// const rooturl=process.env.API_ROOT;
import axios from 'axios'
import data from '../components/listContent.json'
export const getEvidenceRecord = ({commit},params) => {
    // this.$http.post(rooturl+'/api/v1/contract/history',{
    //     "access_token": params.access_token,
    //     "pageNum": params.pageNum,//页数
    //     "pageSize": params.pageSize,//每页记录数 10以内 
    //     "type":params.type
    // })
    // .then((response) =>{
    //     commit('getEvidenceRecord', response.data.result);
    //     console.log(response);
    //     // this.listDetail = response.data.result;
    //     // console.log(this.listDetail)
        
    // })
    // .catch( (error)=> {
    //     console.log(error);
    // });
    axios.get('http://localhost:8080')
    .then((response) =>{
        commit('getEvidenceRecord', data);
        console.log(response);
        // this.listDetail = response.data.result;
        // console.log(this.listDetail)
        
    })
    .catch( (error)=> {
        console.log(error);
    });
}