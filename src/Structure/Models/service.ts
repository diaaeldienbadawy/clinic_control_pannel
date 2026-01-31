import { branchEmployeeService } from "./branchEmployeeService"


export interface service{
    id?:string
    title:string
    service_img:File|string
    prief:string
    price_without_discount?:number
    price:number
    description:string
    slug?:string
    branch_employees?:branchEmployeeService[]
}