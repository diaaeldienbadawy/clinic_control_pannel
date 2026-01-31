import {subService} from "./subService"


export interface branchEmployeeSubService{
    id?:string
    branch_employee_id?:string
    sub_service_id?:string
    sub_service:subService
    duration:string
}