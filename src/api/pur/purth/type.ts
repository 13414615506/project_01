export interface responseData {
    code: number
    message: string
    ok: boolean
    index: number
}

export interface Purtgh {
    JHDH?: String
    TG003?: String
    TG005?: String
    TG021?: String
    TG006?: String
    TG007?: String
    TG008?: number
    TG009?: String
    TG010?: String
    TH004?: String
    PM?: String
    GG?: String
    TH007?: number
    TH008?: String
    TH009?: String
    MC002?: String
    CGDH?: String
    TH014?: String
    TH015?: number
    TH016?: number
    TH017?: number
    TH018?: number
    TH019?: number
    TH026?: String
    TH027?: String
    TH029?: String
    TH030?: String
    TH031?: String
    TH033?: String
    TH034?: number
    TH035?: String
    TH038?: String
    MV002?: String
    TH045?: number
    TH046?: number
    TH047?: number
    TH048?: number
    TH054?: number
    TH060?: number
    TH061?: number
    TH064?: String
    TH065?: String
    TH001?: String
    TH002?: String
    TH003?: String


    index?: number

}
export type Records = Purtgh[]
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
export interface PurtghResponseData extends responseData {
    data: {
        records: Records
        total: number
        size: number
        current: number
        pages: number
    }
}
