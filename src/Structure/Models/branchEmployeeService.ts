import { branchEmployee } from "./branchEmployee"

export interface branchEmployeeService{
    id?:string
    service_id?:string
    branch_employee_id?:string
    branch_employee?:branchEmployee
}