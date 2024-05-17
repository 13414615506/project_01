export interface responseData {
    code: number
    message: string
    ok: boolean
    index: number
}

export interface Purma {
    MA001?: String
    MA002?: String
    MA003?: String
    MA004?: String
    MA005?: String
    MA006?: String
    MA007?: String
    MA008?: String
    MA009?: String
    MA010?: String
    MA011?: String
    MA012?: String
    MA013?: String
    MA014?: String
    MA015?: String
    MA016?: String
    MA017?: String
    MA018?: number
    MA019?: number
    MA020?: String
    MA021?: String
    MA022?: String
    MA023?: String
    MA024?: String
    MA025?: String
    MA026?: String
    MA027?: String
    MA028?: String
    MA029?: String
    MA030?: String
    MA031?: String
    MA032?: String
    MA033?: String
    MA034?: String
    MA035?: String
    MA036?: String
    MA037?: String
    MA038?: String
    MA039?: String
    MA040?: String
    MA041?: String
    MA042?: String
    MA043?: String
    MA044?: String
    MA045?: String
    MA046?: String
    MA047?: String
    MA048?: String
    MA049?: String
    MA050?: String
    MA051?: String
    MA052?: String
    MA053?: String
    MA054?: number
    MA055?: String
    MA056?: String
    MA057?: String
    MA058?: number
    MA059?: String
    MA060?: String
    MA061?: String
    MA062?: String
    MA063?: String
    MA064?: number
    MA065?: String
    MA066?: number
    MA067?: String
    MA068?: String
    MA069?: String
    MA070?: String
    MA071?: String
    MA072?: number
    MA073?: number
    MA074?: number
    MA075?: String
    MA076?: String
    MA077?: String
    MA078?: String
    MA079?: String

    index?: number

}
export type Records = Purma[]
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
export interface PurmaResponseData extends responseData {
    data: {
        records: Records
        total: number
        size: number
        current: number
        pages: number
    }
}
