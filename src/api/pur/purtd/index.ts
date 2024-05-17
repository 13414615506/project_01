import request from "@/utils/request";
import type { PurtcdResponseData,requestcontion } from "./type";
enum API {
    //获取采购信息
    ALLPURTCD_URL = "/admin/pur/getpurtcd/",
    //SETSKM_URL="/admin/cop/updateSkm"
}
//获取所有采购单信息
export const reqPurtcdInfo = (page: number, limit: number, findWhere:requestcontion) =>{
   return request.post<any, PurtcdResponseData>(API.ALLPURTCD_URL+`${page}/${limit}`, findWhere)
}
