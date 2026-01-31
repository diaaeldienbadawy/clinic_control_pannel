import axios, { AxiosInstance, HttpStatusCode } from "axios";
import { IPaginatedResponse, IResponse } from "../Interfaces/ResponsesData";
import { Notify } from "./Notifications";
import { Globals } from "../Globals/GlobalObs";


type HeadersKey = 'Authorization'|'x-device-key'|'Content-Type'

class HttpRequestHeader{
    private headers: Record<string, string>

    constructor(headers: Record<HeadersKey, string> = {'Content-Type':'application/json','Authorization':'','x-device-key':''}){
        this.headers = headers
    }

    public get(){
        return this.headers
    }

    //headers
    setHeaders(headers: Record<string, string>): this {
        this.headers = headers;
        return this;
    }
    setAuthorization(token:string): this{
        this.headers['Authorization'] = 'Bearer '+token
        return this
    }
    setDeviceKey(deviceKey:string): this{
        this.headers['x-device-key'] = deviceKey 
        return this
    }
    setContentType(contentType:'application/json'|'multipart/form-data'|'application/x-www-form-urlencoded'): this{
        this.headers['Content-Type'] = contentType
        return this
    }
    addHeader(header:{key:string, value:string}){
        this.headers[header.key] = header.value
        return this
    }
}

class HttpRequestParameters{
    private params:Record<string,string>={}

    constructor(params: Record<string, string> = {}){
        this.params = params
    }

    public get(){
        return Object.keys(this.params).length>0?
        (
            '?'+Object.entries(this.params)
            .map(([key, value]) => `${key}=${value}`)
            .join('&')
        ):('')
    }

    setParams(params: Record<string, string>): this {
        this.params = params;
        return this;
    }
    addParameter(param:{key:string , value:string} ): this {
        this.params[param.key] = param.value;
        return this;
    }
}

export class FormDataBuilder {
    static build(json: Record<string, any>): FormData {
        const formData = new FormData();

        const processValue = (key: string, value: any) => {
            if (value === null || value === undefined) {
                formData.append(key, '');
            } else if (value instanceof File) {
                formData.append(key, value);
            } else if (Array.isArray(value)) {
                value.forEach((item, index) => {
                    processValue(`${key}[${index}]`, item);
                });
            } else if (typeof value === 'object') {
                Object.keys(value).forEach((nestedKey) => {
                    processValue(`${key}[${nestedKey}]`, value[nestedKey]);
                });
            } else {
                formData.append(key, value.toString());
            }
        };

        Object.keys(json).forEach((key) => {
            processValue(key, json[key]);
        });

        return formData;
    }
}

abstract class AxiosClientBase{
    private debug:boolean = true
    protected get baseUrl():string { return this.debug?"http://127.0.0.1:8000/api/v1/":"https://be.beauty2beclinics.com/api/v1/" }
    protected abstract endPoint:string
    protected deviceControl:boolean = false
    protected authorized:boolean = true
    protected headers: HttpRequestHeader = new HttpRequestHeader()
    protected params:HttpRequestParameters= new HttpRequestParameters()

    protected async AxiosRequest<T>(data:{action:(client:AxiosInstance)=>Promise<any> , onSuccess?:(data:{data?:T})=>void, onfail?:()=>void , onDrop?:()=>void}){
        try{
            let client:AxiosInstance = axios.create({baseURL:this.baseUrl,headers:this.headers.get()})
            const response = await data.action(client)
            if(response){
                if(response.status === HttpStatusCode.Ok || response.status === HttpStatusCode.Created){
                    if(response.data.status){
                        if(data.onSuccess)data.onSuccess(response.data.data?{data:response.data.data}:{})
                        return response.data.data?response.data.data:response.data.status
                    }else {
                        if(data.onfail)data.onfail()
                        if(response.data.error_code == 'A0004') {
                            Globals.auth.logout()
                            Notify({type:'danger' , title:'فشل العملية' , body:'انتهاء صلاحية الجلسة'})
                        }else Notify({type:'danger' , title:'فشل العملية' , body:response.data.messege})
                    }
                }else {
                    if(data.onDrop)data.onDrop()
                    Notify({type:'danger' , title:'خطأ' , body:'مشكلة من طرف الخادم '})                
                }
            }
        }catch(e){
            if(data.onDrop)data.onDrop()
            if(axios.isAxiosError(e)){
                if(e.code === 'ECONNABORTED' || e.message.includes('Network Error')) Notify({type:'danger' , title:'خطأ' , body:'مشكلة فى الاتصال '})
                else  Notify({type:'danger' , title:'خطأ' , body:'خطأ غير معروف'})
            }
            else  Notify({type:'danger' , title:'خطأ' , body:'خطأ غير معروف'})        
        }
    } 

    public addParameter(key:string , value:string){
        this.params.addParameter({key:key , value:value})
    }
}

export abstract class AxiosClientRepository<T extends {id?:string}> extends AxiosClientBase{

    public async getAll(reverse:boolean = true,data?:{onSuccess?:(data:{data?:T[]})=>void, onfail?:()=>void , onDrop?:()=>void}):Promise<(T[])|undefined>{
        this.params.addParameter({key:'reverse' , value:reverse?'1':'0'})
        const url = this.baseUrl+this.endPoint
        return this.AxiosRequest({
            action:(client)=>client.get<IResponse<T[]>>(url),
            onSuccess:data?.onSuccess,
            onDrop:data?.onDrop,
            onfail:data?.onfail
        })
    }
    public async getCollection(first:string='1' , count:string='10',reverse:boolean=true,data?:{onSuccess?:(data:{data?:T[]})=>void, onfail?:()=>void , onDrop?:()=>void}):Promise<(T[])|undefined>{
        this.params.addParameter({key:'first' , value:first})
        this.params.addParameter({key:'count' , value:count})
        this.params.addParameter({key:'reverse' , value:reverse?'1':'0'})
        const url = this.baseUrl+this.endPoint+this.params.get()
        return this.AxiosRequest({
            action:(client)=>client.get<IResponse<T[]>>(url),
            onSuccess:data?.onSuccess,
            onDrop:data?.onDrop,
            onfail:data?.onfail
        })
    }
    public async getPage(page?:number,reverse:boolean=false,data?:{onSuccess?:(data:{data?:T[]})=>void, onfail?:()=>void , onDrop?:()=>void}):Promise<(IPaginatedResponse<T>)|undefined>{
        if(page)this.params.addParameter({key:'page' , value:page.toString()})    
        this.params.addParameter({key:'reverse' , value:reverse?'1':'0'})
        const url = this.baseUrl+this.endPoint+this.params.get()
        return this.AxiosRequest({
            action:(client)=>client.get<IResponse<IPaginatedResponse<T>>>(url),
            onSuccess:data?.onSuccess,
            onDrop:data?.onDrop,
            onfail:data?.onfail
        })
    }
    public async find(id:string,data?:{onSuccess?:(data:{data?:T})=>void, onfail?:()=>void , onDrop?:()=>void}):Promise<(T)|undefined>{
        const url = this.baseUrl+this.endPoint+('/'+id)
        return this.AxiosRequest({
            action:(client)=>client.get<IResponse<T>>(url),
            onSuccess:data?.onSuccess,
            onDrop:data?.onDrop,
            onfail:data?.onfail
        })
    }
    public async delete(id:string,data?:{onSuccess?:(data:{data?:T})=>void, onfail?:()=>void , onDrop?:()=>void}):Promise<boolean>{
        const url = this.baseUrl+this.endPoint+('/'+id)
        const token = await Globals.auth.getToken()
        if(token) this.headers.setAuthorization(token)
        return this.AxiosRequest({
            action:(client)=>client.delete<T,IResponse<null>>(url),
            onSuccess:data?.onSuccess,
            onDrop:data?.onDrop,
            onfail:data?.onfail
        })
    }
    public async insert(item:T,data?:{onSuccess?:(data:{data?:T})=>void, onfail?:()=>void , onDrop?:()=>void}):Promise<(T)|undefined>{
        
        this.headers.setContentType('multipart/form-data')
        const token = await Globals.auth.getToken()
        if(token) this.headers.setAuthorization(token)
        const url = this.baseUrl + this.endPoint
        return this.AxiosRequest({
            action:(client)=>client.post<T,IResponse<T>>(url,item),
            onSuccess:data?.onSuccess,
            onDrop:data?.onDrop,
            onfail:data?.onfail
        })
    }
    public async insertRange(items:T[], foreignKey:string , foreignId:string ,data?:{onSuccess?:(data:{data?:T})=>void, onfail?:()=>void , onDrop?:()=>void}):Promise<(boolean)>{
        this.headers.setContentType('multipart/form-data')
        const url = this.baseUrl + this.endPoint
        const insertedData = {list:items , parent:{foreign_key:foreignKey , foreign_id:foreignId}}
        const token = await Globals.auth.getToken()
        if(token) this.headers.setAuthorization(token)
        return this.AxiosRequest({
            action:(client)=>client.post<{list:T[] , parent:{foreign_key:string , foreign_id:string}},IResponse<null>>(url,insertedData),
            onSuccess:data?.onSuccess,
            onDrop:data?.onDrop,
            onfail:data?.onfail
        })
    }
    public async update(item:T,data?:{onSuccess?:(data:{data?:T})=>void, onfail?:()=>void , onDrop?:()=>void}):Promise<(T)|undefined>{
        this.headers.setContentType('multipart/form-data')
        const token = await Globals.auth.getToken()
        if(token) this.headers.setAuthorization(token)
        const url = this.baseUrl+this.endPoint
        return this.AxiosRequest({
            action:(client)=>client.post<T,IResponse<T>>(url,item),
            onSuccess:data?.onSuccess,
            onDrop:data?.onDrop,
            onfail:data?.onfail
        })
    }

}

/*export abstract class AxiosClientRepository<T extends {id?:string} , TFile extends { id?: string } | undefined = undefined> extends AxiosClientBase{
    //public abstract insert(item:any,data?:{onSuccess?:(data:{data?:T})=>void, onfail?:()=>void , onDrop?:()=>void}):Promise<(T)|undefined>
    //public abstract update(item:any,data?:{onSuccess?:(data:{data?:T})=>void, onfail?:()=>void , onDrop?:()=>void}):Promise<(T)|undefined>

    public async getAll(reverse:boolean = true,data?:{onSuccess?:(data:{data?:T[]})=>void, onfail?:()=>void , onDrop?:()=>void}):Promise<(T[])|undefined>{
        this.params.addParameter({key:'reverse' , value:reverse?'1':'0'})
        const url = this.baseUrl+this.endPoint
        return this.AxiosRequest({
            action:(client)=>client.get<IResponse<T[]>>(url),
            onSuccess:data?.onSuccess,
            onDrop:data?.onDrop,
            onfail:data?.onfail
        })
    }
    public async getCollection(first:string='1' , count:string='10',reverse:boolean=true,data?:{onSuccess?:(data:{data?:T[]})=>void, onfail?:()=>void , onDrop?:()=>void}):Promise<(T[])|undefined>{
        this.params.addParameter({key:'first' , value:first})
        this.params.addParameter({key:'count' , value:count})
        this.params.addParameter({key:'reverse' , value:reverse?'1':'0'})
        const url = this.baseUrl+this.endPoint+this.params.get()
        return this.AxiosRequest({
            action:(client)=>client.get<IResponse<T[]>>(url),
            onSuccess:data?.onSuccess,
            onDrop:data?.onDrop,
            onfail:data?.onfail
        })
    }
    public async getPage(page?:string,reverse:boolean=true,data?:{onSuccess?:(data:{data?:T[]})=>void, onfail?:()=>void , onDrop?:()=>void}):Promise<(IPaginatedResponse<T>)|undefined>{
        if(page)this.params.addParameter({key:'page' , value:page})
        this.params.addParameter({key:'reverse' , value:reverse?'1':'0'})
        const url = this.baseUrl+this.endPoint+this.params.get()
        return this.AxiosRequest({
            action:(client)=>client.get<IResponse<IPaginatedResponse<T>>>(url),
            onSuccess:data?.onSuccess,
            onDrop:data?.onDrop,
            onfail:data?.onfail
        })
    }
    public async find(id:string,data?:{onSuccess?:(data:{data?:T})=>void, onfail?:()=>void , onDrop?:()=>void}):Promise<(T)|undefined>{
        const url = this.baseUrl+this.endPoint+('/'+id)
        return this.AxiosRequest({
            action:(client)=>client.get<IResponse<T>>(url),
            onSuccess:data?.onSuccess,
            onDrop:data?.onDrop,
            onfail:data?.onfail
        })
    }
    public async delete(id:string,data?:{onSuccess?:(data:{data?:T})=>void, onfail?:()=>void , onDrop?:()=>void}):Promise<(T)|undefined>{
        const url = this.baseUrl+this.endPoint+('/'+id)
        return this.AxiosRequest({
            action:(client)=>client.delete<T,IResponse<null>>(url),
            onSuccess:data?.onSuccess,
            onDrop:data?.onDrop,
            onfail:data?.onfail
        })
    }
    public async insert(item:T|TFile,data?:{onSuccess?:(data:{data?:T})=>void, onfail?:()=>void , onDrop?:()=>void}):Promise<(T)|undefined>{
        this.headers.setContentType('multipart/form-data')
        console.log(item)
        const url = this.baseUrl + this.endPoint
        return this.AxiosRequest({
            action:(client)=>client.post<T|TFile,IResponse<T>>(url,item),
            onSuccess:data?.onSuccess,
            onDrop:data?.onDrop,
            onfail:data?.onfail
        })
    }
    public async update(item:T|TFile,data?:{onSuccess?:(data:{data?:T})=>void, onfail?:()=>void , onDrop?:()=>void}):Promise<(T)|undefined>{
        this.headers.setContentType('multipart/form-data')
        const url = this.baseUrl+this.endPoint
        return this.AxiosRequest({
            action:(client)=>client.post<T|TFile,IResponse<T>>(url,item),
            onSuccess:data?.onSuccess,
            onDrop:data?.onDrop,
            onfail:data?.onfail
        })
    }

}*/

//export abstract class AxiosClientRepositoryJson<T> extends AxiosClientRepository<T>{
    /*public async insert(item:T,data?:{onSuccess?:(data:{data?:T})=>void, onfail?:()=>void , onDrop?:()=>void}):Promise<(T)|undefined>{
        const url = this.baseUrl+this.endPoint
        return this.AxiosRequest({
            action:(client)=>client.post<T,IResponse<T>>(url,item),
            onSuccess:data?.onSuccess,
            onDrop:data?.onDrop,
            onfail:data?.onfail
        })
    }
    public async update(item:T,data?:{onSuccess?:(data:{data?:T})=>void, onfail?:()=>void , onDrop?:()=>void}):Promise<(T)|undefined>{
        const url = this.baseUrl+this.endPoint
        return this.AxiosRequest({
            action:(client)=>client.post<T,IResponse<T>>(url,item),
            onSuccess:data?.onSuccess,
            onDrop:data?.onDrop,
            onfail:data?.onfail
        })
    }*/
//}

//export abstract class AxiosClientRepositoryFiles<T,TFile extends Record<string, any>> extends AxiosClientRepository<T> {
    //public abstract convert(data:T):TFile
    
    /*public async insert(item:TFile,data?:{onSuccess?:(data:{data?:T})=>void, onfail?:()=>void , onDrop?:()=>void}):Promise<(T)|undefined>{
        this.headers.setContentType('multipart/form-data')
        const url = this.baseUrl+this.endPoint
        return this.AxiosRequest({
            action:(client)=>client.post<TFile,IResponse<T>>(url,item),
            onSuccess:data?.onSuccess,
            onDrop:data?.onDrop,
            onfail:data?.onfail
        })
    }
    public async update(id:string,item:TFile,data?:{onSuccess?:(data:{data?:T})=>void, onfail?:()=>void , onDrop?:()=>void}):Promise<(T)|undefined>{
        this.headers.setContentType('multipart/form-data')
        const url = this.baseUrl+this.endPoint+('/'+id)
        return this.AxiosRequest({
            action:(client)=>client.patch<TFile,IResponse<T>>(url,item),
            onSuccess:data?.onSuccess,
            onDrop:data?.onDrop,
            onfail:data?.onfail
        })
    }*/
//}