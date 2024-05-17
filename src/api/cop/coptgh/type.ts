export interface responseData{
    code:number
    message:string
    ok:boolean
    index:number
}

export interface Coptgh{
    XHDH?:	String
    TH004?:	String
    TH005?:	String
    TH006?:	String
    TG003?:	String
    TG004?:	String
    MA002?:	String
    TH008?:	number
    TH009?:	String
    TH012?:	number
    TH013?:	number
    DDDH?:	String
    TD008?:	number
    TD009?:	number
    TD013?:	String
    TD016?:	String
    TH019?:	String
    TC012?:	String
    RGDJ?:	number
    RGCB?:	number
    ZCLDJ?:	number
    ZCLCB?:	number
    BCDJ?:	number
    BCCB?:	number
    TH027?:	String
    TH028?:	String
    TH029?:	String
    XSFP?:	String
    TH042?:	number
    TB044?:	number
    SKM?:String
    confirmAuthor?:string
    confirmDate?:string
    MB143?:String
    index?:number
   
}
export type Records=Coptgh[]
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
export interface CoptghResponseData extends responseData{
    data:{
        records:Records
        total:number
        size:number
        current:number
        pages:number
    }
}
export interface reqsetskm{
    xhdb?:string
    xhdh?:string
    xhxh?:string
    skm?:string
    userid?:string
    confirmdate?:string
}