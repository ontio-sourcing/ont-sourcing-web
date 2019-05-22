const BASE_URL=process.env.API_ROOT;
import {post,fetch} from './http'
export default{
    getHomePageRecord: p => post(BASE_URL+'api/v1/contract/explorer',p),//获取首页数据
    get2cHomeData: p => post(process.env.TOC_API_ROOT+'api/v1/c/attestation/explorer',p)//获取首页数据
}