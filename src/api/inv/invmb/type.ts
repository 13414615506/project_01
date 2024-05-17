import { NumberFormat } from "xlsx"

export interface responseData {
    code: number
    message: string
    ok: boolean
    index: number
}

export interface Invmb {
    //品号
    MB001?: string
    MB002?: string
    MB003?: string
    MB004?: string
    MB005?: string
    MB010?: string
    MB011?: string
    MB014?: number
    MB017?: string
    MB018?: string
    MB019?: string
    MB021?: string
    MB022?: string
    MB025?: string
    MB026?: string
    MB027?: string
    MB028?: string
    MB029?: string
    MB030?: string
    MB031?: string
    MB032?: string
    MB033?: string
    MB034?: string
    MB035?: string
    MB036?: number
    MB037?: number
    MB038?: number
    MB039?: number
    MB040?: number
    MB041?: number
    MB042?: string
    MB043?: string
    MB044?: string
    MB045?: number
    MB046?: number
    MB047?: number
    MB057?: number
    MB058?: number
    MB059?: number
    MB060?: number
    MB061?: number
    MB062?: number
    MB063?: number
    MB064?: number
    MB065?: number
    MB066?: string
    MB067?: string
    MB068?: string
    MB072?: string
    MB077?: string
    MB087?: string
    MB088?: number
    MB143?: string
    MB148?: string
    MB149?: string
    MB404?: number
    MB405?: string
    index?: number

}
export type Records = Invmb[]
export interface condition {
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
export type conditions = condition[]
export interface requestcontion {
    conditions: conditions
}
export interface InvmbResponseData extends responseData {
    data: {
        records: Records
        total: number
        size: number
        current: number
        pages: number
    }
}
export interface InventoryResponseData extends responseData {
    data: Inventory

}

export interface Inventory {
    PH: string
    YJQG: number
    YJJH: number
    YJSC: number
    YJLY: number
    YJXH: number
    KCSL: number
    YJKY: number
    JHCG: number
    JHSC: number
    JHLY: number
    JHXH: number
    JHKY: number
    DYSL: number
    DLSL: number
    DXSL: number
}

export interface InventoryBusiness {
    TD012: string
    TYPE: string
    TD008: number
    TD015: number
    INFIELD: number
    TD8: number
    TD9: number
    TD24: number
    TD25: number
    OUTFIELD: number
    JIECHU: number
    MC001: string
    MC002: string
    MC003: string
    MB002: string
    MEMO: string
    TD004: string
    TD009: string
    INPACKQTY: number
    OUTPACKQTY: number
    INVMB004: string
    INVMB090: string
    JIESHU: string
    TDC01: number
    TDC02: number

}
export type recordsInventoryBusiness=InventoryBusiness[]

export interface InventoryBusinessResponseData extends responseData {
    data: recordsInventoryBusiness
}

export interface BomInfo{
    MC001:string
    CMB002:string
    CMB003:string
    MC004:number
    MD002:string
    MD003:string
    DMB002:string
    DMB003:string
    MD004:string
    MD005:string
    MD006:number
    MD007:number
    MD008:number
    DMB025:string
}
export type recordsBomInfo=BomInfo[]
export interface BomInfoResponseData extends responseData{
    data:recordsBomInfo
}