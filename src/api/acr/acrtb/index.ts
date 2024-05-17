import request from "@/utils/request";
import type { AcrtabResponseData,requestcontion } from "./type";
enum API {
    //获取销售发票信息
    ALLACRTAB_URL = "/admin/acr/getacrtab/",
    //SETSKM_URL="/admin/cop/updateSkm"
}
//获取所有销售发票信息
export const reqAcrtabInfo = (page: number, limit: number, findWhere:requestcontion) =>{
   return request.post<any, AcrtabResponseData>(API.ALLACRTAB_URL+`${page}/${limit}`, findWhere)
}
