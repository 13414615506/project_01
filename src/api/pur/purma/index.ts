import request from "@/utils/request";
import type { PurmaResponseData,requestcontion } from "./type";
enum API {
    //获取销货信息
    ALLCOPTGH_URL = "/admin/pur/getpurma/",
    //SETSKM_URL="/admin/cop/updateSkm"
}
//获取所有供应商信息
export const reqPurmaInfo = (page: number, limit: number, findWhere:requestcontion) =>{
   return request.post<any, PurmaResponseData>(API.ALLCOPTGH_URL+`${page}/${limit}`, findWhere)
}
//设置收款码
//export const reqSetSkm = (data: reqsetskm) =>
  //request.post<any, any>(API.SETSKM_URL, data)
    
// export const reqInvmbInfo = (page: number, limit: number, article_number: string) =>{
//     return request.get<any, InvmbResponseData>(API.ALLINVMB_URL+`${page}/${limit}/${article_number}`)
//  }