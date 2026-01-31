import { branch } from "./branch"
import { branchEmployeeService } from "./branchEmployeeService"
import { UserProfile } from "./User"

export interface serviceBooking{
    id?:string
    service_id?:string
    branch_employee_service_id?:string
    name:string
    mobile:string
    whatsapp:string
    service_name:string
    price?:number
    additional?:number
    discount?:number
    paid?:number
    status:'pending'|'paid'|'canceled'
    is_done:number
    booking_number?:number
    branch_employee_service?:branchEmployeeService
    notes?:string
}