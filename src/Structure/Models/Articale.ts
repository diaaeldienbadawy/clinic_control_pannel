export type articalElementType = 'subtitle'|'paragraph'|'ul'|'img'|'video'

export interface ArticalElement{
    id?:string
    artical_id?:string
    type:articalElementType
    content:string|File
}
export interface Artical{
    id?: string
    title: string
    prief: string
    img: File|string
    keywords?:string
    slug?:string
    elements?:ArticalElement[]
}
