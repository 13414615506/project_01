import request from "@/utils/request";
import type { CoptcdResponseData, condition, conditions,requestcontion } from "./type";
enum API {
    //获取品号信息
    ALLCOPTCD_URL = "/admin/cop/getcoptcd/",
}
//获取所有品号信息
export const reqCoptcdInfo = (page: number, limit: number, findWhere:requestcontion) =>{
   return request.post<any, CoptcdResponseData>(API.ALLCOPTCD_URL+`${page}/${limit}`, findWhere)
}
    
// export const reqInvmbInfo = (page: number, limit: number, article_number: string) =>{
//     return request.get<any, InvmbResponseData>(API.ALLINVMB_URL+`${page}/${limit}/${article_number}`)
//  }