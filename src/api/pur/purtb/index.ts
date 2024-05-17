import request from "@/utils/request";
import type { PurtabResponseData,requestcontion } from "./type";
enum API {
    //获取请购单信息
    ALLPURTAB_URL = "/admin/pur/getpurtab/",
    //SETSKM_URL="/admin/cop/updateSkm"
}
//获取所有请购单信息
export const reqPurtabInfo = (page: number, limit: number, findWhere:requestcontion) =>{
   return request.post<any, PurtabResponseData>(API.ALLPURTAB_URL+`${page}/${limit}`, findWhere)
}
