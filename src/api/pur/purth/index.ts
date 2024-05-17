import request from "@/utils/request";
import type { PurtghResponseData,requestcontion } from "./type";
enum API {
    //获取进货信息
    ALLPURTGH_URL = "/admin/pur/getpurtgh/",
    //SETSKM_URL="/admin/cop/updateSkm"
}
//获取所有采购单信息
export const reqPurtghInfo = (page: number, limit: number, findWhere:requestcontion) =>{
   return request.post<any, PurtghResponseData>(API.ALLPURTGH_URL+`${page}/${limit}`, findWhere)
}
