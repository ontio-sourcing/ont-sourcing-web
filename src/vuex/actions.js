import api from '../api/index'
import dateFormat from '../util/dateFormat'
import store from './index'
// console.log(sessionStorage.getItem('TYPE'))
export const getHomePageRecord = ({commit},params)=>{
    api.getHomePageRecord(params)
    .then(response=>{
        store.state.loading = false;
        const  listContent = response.data.result;
        listContent.forEach(item => {
            item.createTime = dateFormat.format('yyyy-MM-dd hh:mm:ss',new Date(item.createTime));
            item._txhash=item.txhash.substring(0,10)+'.....'+item.txhash.substring(item.txhash.length-5);
            item._ontId = item.ontid.substring(0,10)+'.....'+item.ontid.substring(item.ontid.length-5);
        });
        commit('getHomePageRecord',listContent);
    })
    .catch(error=>{
        console.log(error);
    })
}
export const get2cHomeData = ({commit},params)=>{
    api.get2cHomeData(params)
    .then(response=>{
        store.state.loading = false;
        const  listContent = response.data.result;
        listContent.forEach(item => {
            item.createTime = dateFormat.format('yyyy-MM-dd hh:mm:ss',new Date(item.createTime));
            item._txhash=item.txhash.substring(0,10)+'.....'+item.txhash.substring(item.txhash.length-5);
            item._ontId = item.ontid.substring(0,10)+'.....'+item.ontid.substring(item.ontid.length-5);
        });
        commit('getHomePageRecord',listContent);
    })
    .catch(error=>{
        console.log(error);
    })
}