import request from "@/utils/request";
import type { AcptabResponseData,requestcontion } from "./type";
enum API {
    //获取采购发票信息
    ALLACPTAB_URL = "/admin/acp/getacptab/",
    //SETSKM_URL="/admin/cop/updateSkm"
}
//获取所有采购发票信息
export const reqAcptabInfo = (page: number, limit: number, findWhere:requestcontion) =>{
   return request.post<any, AcptabResponseData>(API.ALLACPTAB_URL+`${page}/${limit}`, findWhere)
}
