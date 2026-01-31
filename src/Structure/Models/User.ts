import { certificate } from "./certificate"

export interface User{
    id?: string,
    emp_key?: string,
    password?:string,
    status?: string,
    admin:string
}
export interface UserProfile{
    id?:string
    user_admin_id?:string,
    name:string
    email?:string 
    mobile?:string
    img:File|string
    role_id?:string
    specialization_id?:string
    is_male:string
    description?:string
    is_visible:string
    role?:{
        id:string 
        role:string
    }
    specialization?:{
        id:string
        specialization:string
    }
    user_admin?:User
    certificates?:certificate[]
}
