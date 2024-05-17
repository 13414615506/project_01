export interface responseData {
    code: number
    message: string
    ok: boolean
    index: number
}

export interface Acptab {
    CGFP?: String
    LY?: String
    LYDH?: String
    TB008?: String
    TB009?: number
    TB011?: String
    TB012?: String
    TB013?: String
    MA003?: String
    TB015?: number
    TB016?: number
    TB017?: number
    TB018?: number
    TB019?: number
    TB020?: number
    TB021?: number
    TB037?: String
    PM?: String
    GG?: String
    TB040?: String
    TB041?: number
    TB042?: number
    TB043?: number
    TB044?: number
    TB045?: number
    TB047?: String
    TB049?: number
    TB050?: number
    TB051?: String
    TB052?: number
    TB054?: number
    TB055?: number
    TB001?: String
    TB002?: String
    TB003?: String
    TA004?: String
    MA002?: String
    TA008?: String
    TA009?: number
    TA010?: String
    TA011?: String
    TA036?: number


    index?: number

}
export type Records = Acptab[]
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
export interface AcptabResponseData extends responseData {
    data: {
        records: Records
        total: number
        size: number
        current: number
        pages: number
    }
}
