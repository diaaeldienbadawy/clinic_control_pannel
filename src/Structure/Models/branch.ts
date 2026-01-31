import { branchEmployee } from "./branchEmployee"

export interface branch{
    id?:string
    name:string
    mobile?:string
    whatsapp?:string
    email?:string
    address:string,
    location?:string
    employees?:branchEmployee[]
}