export interface responseData{
    code:number
    message:string
    ok:boolean
    index:number
}

export interface Coptcd{
    //品号
    TC003?: string
    TC004?: string
    TC012?: string
    DDDH?: string
    PH?: string
    PM?: string
    GG?: string
    TD008?: number
    TD009?: number
    TD024?: number
    TD025?: number
    TD010?: string
    TD011?: number
    TD012?: number
    TD013?: string
    TD014?: string
    TD016?: string
    TD038?: number
    RGDJ?: number
    ZCLDJ?: number
    BCDJ?: string
    index?:number
   
}
export type Records=Coptcd[]
export interface condition{
    id?: string
    index?: number
    condition?: string
    operate?: string
    field?: string
    value?: string
    header?: boolean
    checked?: boolean
    pid?: number
    floor?: number
}
export type conditions=condition[]
export interface requestcontion{
    conditions:conditions
}
export interface CoptcdResponseData extends responseData{
    data:{
        records:Records
        total:number
        size:number
        current:number
        pages:number
    }
}