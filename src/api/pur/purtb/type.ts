export interface responseData {
    code: number
    message: string
    ok: boolean
    index: number
}

export interface Purtab {
    TA003?: String
    TA004?: String
    ME002?: String
    TA006?: String
    TA012?: String
    QGRY?: String
    QGDH: String
    TB004?: String
    PM?: String
    GG?: String
    TB007?: String
    TB009?: number
    TB010?: String
    TB011?: String
    TB012?: String
    TB013?: String
    CGRY?: String
    TB014?: number
    TB015?: String
    TB016?: String
    TB017?: number
    TB018?: number
    TB019?: String
    TB020?: String
    TB021?: String
    TB022?: String
    TB024?: String
    TB025?: String
    TB026?: String
    CKDH?: String
    TB032?: String
    TB039?: String
    TB043?: String
    TB044?: number
    TB045?: number
    TB046?: number
    TB056?: number
    TB057?: String
    TB058?: String
    TB059?: String

    index?: number

}
export type Records = Purtab[]
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
export interface PurtabResponseData extends responseData {
    data: {
        records: Records
        total: number
        size: number
        current: number
        pages: number
    }
}
