import { branch } from "./branch";
import { branchEmployeeSubService } from "./branchEmployeeSubService";
import { period } from "./period";
import { subService } from "./subService";
import { UserProfile } from "./User";

export interface branchEmployee{
    id?:string
    branch_id?:string
    employee_id?:string
    no_follow_ups:string|null
    follow_up_weeks:string|null
    duration:string
    sub_services?:branchEmployeeSubService[]
    periods?:period[]
    employee?:UserProfile
    branch?:branch
}