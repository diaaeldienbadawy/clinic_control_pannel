import { period } from "./period"

export interface booking{
    id?:string
    name: string  
    period_id:string
    period?:period
    date:string
    mobile:string
    email:string
    type:'normal'|'urgent'|'follow up'
    reason:string
    status?:'pending'|'paid'|'canceled'
    is_done:number
    booking_number?:number
    price?:number
    additional?:number|''
    discount?:number|''
    paid?:number|''
    notes?:string
}