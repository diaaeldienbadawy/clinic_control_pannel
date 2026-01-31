import { beforeAndAfterPhoto } from "./beforeAndAfterPhoto"

export interface beforeAndAfter{
    id?:string
    before_and_after_category_id?:string
    title?:string
    description?:string
    before_and_after_photos?:beforeAndAfterPhoto[]
}