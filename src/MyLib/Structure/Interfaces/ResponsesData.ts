import { Token } from "../Models/Token"
import { User, UserProfile } from "../../../Structure/Models/User"

export interface IResponse<T>{
    status:boolean,
    error_code:string,
    messege:string,
    data:T
}
export interface IPaginatedResponse<T>{
    data:T[]
    pagination:{
        total: number,
        count: number,
        per_page: number,
        current_page: number,
        total_pages: number
    }
}
export interface ILoginResponseData{
    profile:UserProfile,
    role:string, 
    permissions:string[],
    accessToken:Token,
    refreshToken:Token,
    rememberToken:Token
}


