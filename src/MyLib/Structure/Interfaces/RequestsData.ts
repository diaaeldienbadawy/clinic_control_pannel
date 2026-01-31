export interface ILoginData{
    employee_key:string,
    password:string,
    remember:boolean
}

export interface SearchData{
    search?:string ,
    filter?:string, 
    max?:string , 
    min?:string , 
    current_page?:number ,
    page_count?:number
}