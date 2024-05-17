export interface responseData {
    code: number
    message: string
    ok: boolean
    index: number
}

export interface Acrtab {
    XSFP?: String
    LYB?: String
    LYDH?: String
    TB008?: String
    TB011?: String
    TB012?: String
    TB013?: String
    MA003?: String
    TB017?: number
    TB018?: number
    TB019?: number
    TB020?: number
    TB021?: String
    TB022?: number
    TB023?: number
    TB024?: number
    TB039?: String
    PM?: String
    GG?: String
    TB042?: String
    TB043?: number
    TB044?: number
    TB045?: number
    TB046?: number
    TB047?: number
    HXZT?: String
    TB050?: number
    TB051?: number
    TB052?: number
    TB001?: String
    TB002?: String
    TB003?: String
    TA003?: String
    TA004?: String
    MA002?: String
    TA008?: String
    TA009?: String
    TA010?: number
    FPZL?: String
    SZ?: String
    TA013?: String
    TA014?: String
    TA015?: String
    TA016?: String


    index?: number

}
export type Records = Acrtab[]
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
export interface AcrtabResponseData extends responseData {
    data: {
        records: Records
        total: number
        size: number
        current: number
        pages: number
    }
}
