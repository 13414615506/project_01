export interface responseData {
    code: number
    message: string
    ok: boolean
    index: number
}

export interface Purtcd {
    CGDH?: String
    TD004?: String
    PM?: String
    GG?: String
    MC002?: String
    TD008?: number
    TD009?: String
    TD010?: number
    TD011?: number
    TD012?: String
    CKDH?: String
    TD014?: String
    TD015?: number
    TD016?: String
    TD018?: String
    TD019?: number
    TD024?: String
    TD025?: String
    QGDH?: String
    TD033?: number
    TD034?: number
    TD035?: number
    TD038?: number
    TD039?: number
    TC003?: String
    TC004?: String
    MA002?: String
    TC005?: String
    TC006?: number
    TC007?: String
    TC008?: String
    TC009?: String
    TC011?: String
    MV002?: String
    TC018?: String
    TD001?: String
    TD002?: String
    TD003?: String
   
    index?: number

}
export type Records = Purtcd[]
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
export interface PurtcdResponseData extends responseData {
    data: {
        records: Records
        total: number
        size: number
        current: number
        pages: number
    }
}
