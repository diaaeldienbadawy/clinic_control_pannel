import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, HttpStatusCode } from "axios"
import { Notify } from "./Notifications"
import { IResponse } from "../Interfaces/ResponsesData"
import Cookies from "js-cookie"
import { Globals } from "../Globals/GlobalObs"

export class AxiosService<TData,TResponse>{
    private deviceControl:boolean = false
    private baseURL:string = "http://127.0.0.1:8000/api/"
    private authorized:boolean = true
    private endPoint:string = ''
    private headers: Record<string, string> = {}
    private contentType:'application/json'|'multipart/form-data'|'application/x-www-form-urlencoded' = 'application/json'
    private requestType: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET';
    private params:Record<string,string>={}
    private data: TData|null = null;

    private onSuccessAction:()=>void = ()=>{}
    private onFailureAction:()=>void = ()=>{}
    private onErrorAction:(response:IResponse<TResponse>)=>void = (response)=>{}

    private token:string = ''
    private deviceKey:string = Cookies.get('dev_tkn')??''

    //url
    setBaseURL(url: string): this {
        this.baseURL = url;
        return this;
    }
    setEndPoint(url: string): this {
        this.endPoint = url;
        return this;
    }
    setParams(params: Record<string, string>): this {
        this.params = params;
        return this;
    }
    addParameter(param:{key:string , value:string} ): this {
        this.params[param.key] = param.value;
        return this;
    }
    //autorized
    setAuthorized(authorized:boolean):this{
        this.authorized = authorized
        return this
    }
    setDeviceControl(deviceControl:boolean):this{
        this.deviceControl = deviceControl
        return this
    }

    //headers
    setHeaders(headers: Record<string, string>): this {
        this.headers = headers;
        return this;
    }
    setAuthorization(token:string): this{
        this.token = token
        return this
    }
    setDeviceKey(deviceKey:string): this{
        this.deviceKey = deviceKey 
        return this
    }
    setContentType(contentType:'application/json'|'multipart/form-data'|'application/x-www-form-urlencoded'): this{
        this.contentType = contentType
        return this
    }
    addHeader(header:{key:string, value:string}){
        this.headers[header.key] = header.value
        return this
    }
    //method
    setRequestType(type: 'GET' | 'POST' | 'PUT' | 'DELETE'): this {
        this.requestType = type;
        return this;
    }

    //data
    setData(data: TData|null): this {
        this.data = data;
        return this;
    }

    //actions
    setOnSuccess(action:()=>void):this{
        this.onSuccessAction = action
        return this
    }
    setOnFailure(action:()=>void):this{
        this.onFailureAction = action
        return this
    }
    setOnError(action:(response:IResponse<TResponse>)=>void):this{
        this.onErrorAction = action
        return this
    }

    //build
    async build(): Promise<TResponse|null> {

        if(this.authorized){
            if(!this.token)this.token = await Globals.auth.getToken()??''
        }

        if(this.deviceControl) this.headers['x-device-key'] = this.deviceKey
        if(this.authorized) this.headers['Authorization'] = `Bearer ${this.token}`
        this.headers['Content-Type'] = this.contentType

        const URL:string = this.endPoint+
        (Object.keys(this.params).length>0?
            (
                this.requestType=='GET'?('?'+Object.entries(this.params)
                .map(([key, value]) => `${key}=${value}`)
                .join('&')):(
                    '/'+Object.entries(this.params)
                    .map(([key, value]) => `${value}`)
                    .join(',')
                )
            ):(''))

        const axiosInstance: AxiosInstance = axios.create({
            baseURL: this.baseURL,
            headers: this.headers,
        });

        const config: AxiosRequestConfig = {
            method: this.requestType,
            url: URL,
            data: this.data,
        };

        try {
            const response = await axiosInstance.request<TData,AxiosResponse<IResponse<TResponse>>>(config);
            if(response){
                if(response.status === HttpStatusCode.Ok){
                    if(response.data.status){
                        this.onSuccessAction()
                        if(response.data.data)return response.data.data
                        return null
                    }else{
                        Notify({type:'danger' , title:'البيانات غير صالحة', body:response.data.messege})
                        this.onErrorAction(response.data)
                        return null
                    }
                }else {
                    Notify({type:'danger' , title:'مشكلة' , body:'مشكلة فى الخادم'})
                    this.onFailureAction()
                    return null
                }
            }else {
                this.onFailureAction()
                return null
            }

        } catch (error: any) {
            if (error.response) { 
                Notify({type:'danger' , title:'مشكلة' , body:'مشكلة فى الخادم'})
            } else {
                Notify({type:'danger' , title:'مشكلة' , body:'مشكلة فى الاتصال'})
            }
            this.onFailureAction()
            return null;
        }
    }
}