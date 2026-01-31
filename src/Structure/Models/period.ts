import { branchEmployee } from "./branchEmployee"

export interface period{
    id?:string
    branch_employee_id?:string
    day:string
    start_time:string
    end_time?:string
    normal_booking_price:number
    urgent_booking_price:number
    follow_up_booking_price:number
    branch_employee?:branchEmployee
}