import request from "@/utils/request";
import type { InvmbResponseData,requestcontion,InventoryResponseData, InventoryBusinessResponseData ,BomInfoResponseData} from "./type";
enum API {
    //获取品号信息
    ALLINVMB_URL = "/admin/inv/getinvmb/",
    getInventory="/admin/inv/getInventory/",
    getInventoryBusiness="/admin/inv/getInventoryBusiness/",
    getBomInfo="/admin/inv/getBomInfo/"
}
//获取所有品号信息
export const reqInvmbInfo = (page: number, limit: number, findWhere:requestcontion) =>{
   return request.post<any, InvmbResponseData>(API.ALLINVMB_URL+`${page}/${limit}`, findWhere)
}
//获取库存可用量信息
export const reqInventory=(strPh:string,strDate:string)=>{
    return request.get<any,InventoryResponseData>(API.getInventory+`${strPh}/${strDate}`)
}
//获取未来交易量信息
export const reqInventoryBusiness=(strPh:string)=>{
    return request.get<any,InventoryBusinessResponseData>(API.getInventoryBusiness+`${strPh}`)
}
//获取品号对应BOM信息
export const reqBomInfo=(strPh:string)=>{
    return request.get<any,BomInfoResponseData>(API.getBomInfo+`${strPh}`)
}
// export const reqInvmbInfo = (page: number, limit: number, article_number: string) =>{
//     return request.get<any, InvmbResponseData>(API.ALLINVMB_URL+`${page}/${limit}/${article_number}`)
//  }