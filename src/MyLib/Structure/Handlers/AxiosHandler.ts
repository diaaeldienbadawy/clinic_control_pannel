import axios, { AxiosError, AxiosHeaders, AxiosRequestConfig, AxiosResponse, AxiosResponseTransformer, HeadersDefaults, HttpStatusCode, InternalAxiosRequestConfig, RawAxiosRequestHeaders } from "axios";
import Cookies from "js-cookie";
import { ILoginResponseData, IResponse } from "../Interfaces/ResponsesData";
import { ILoginData } from "../Interfaces/RequestsData";
import { Globals } from "../Globals/GlobalObs";



export class AxiosRequest{
    public static deviceControl:boolean = false
    private static baseUrl = "http://127.0.0.1:8000/api/v1/"
    private static checkDeviceURL = 'checkDevice'
    private static activateDeviceURL = 'activateDevice'
    private static loginURL = 'login'
    private static refreshLoginURL = 'refreshLogin'
    private static rememberLoginURL = 'rememberLogin'

    //'http://127.0.0.1:8000/api/'
    //'https://be.beauty2beclinics.com/api/v1/'

    private static getInstance(token:string,device_key:string,transform?:AxiosResponseTransformer | AxiosResponseTransformer[] | undefined  ){
      const instance = this.deviceControl?
        axios.create({
          baseURL:AxiosRequest.baseUrl,
          transformResponse:transform,
          headers:{'Authorization' : `Bearer ${token}` , 'x-device-key': device_key}
        }):
        axios.create({
          baseURL:AxiosRequest.baseUrl,
          transformResponse:transform,
          headers:{'Authorization' : `Bearer ${token}`}
        })
      return instance;
    }
    public static async postClear<Response>(url:string, transform?:AxiosResponseTransformer | AxiosResponseTransformer[] | undefined ){
      const token = await Globals.auth.getToken()
      if(this.deviceControl){
        const device_key = Cookies.get('dev_tkn')
        if(device_key){
          if(token){
            const instance = await AxiosRequest.getInstance(token,device_key,transform).post<IResponse<Response>>(url)
            if(instance.data.messege == 'A0006') Globals.auth.deviceFailure()
            else return instance
          }else{
            Globals.auth.authFailure()
          }
        }else Globals.auth.deviceFailure()
      }else{
        if(token){
          const instance = await AxiosRequest.getInstance(token,'',transform).post<IResponse<Response>>(url)
          if(instance.data.messege == 'A0006') Globals.auth.deviceFailure()
          else return instance
        }else{
          Globals.auth.authFailure()
        }
      }
    }
    public static async postStatusClear(url:string, transform?:AxiosResponseTransformer | AxiosResponseTransformer[] | undefined ){
      const token = await Globals.auth.getToken()
      if(this.deviceControl){
        const device_key = Cookies.get('dev_tkn')
        if(device_key){
          if(token){
            const instance = await AxiosRequest.getInstance(token,device_key,transform).post<IResponse<null>>(url)
            if(instance.data.messege == 'A0006') Globals.auth.deviceFailure()
              else return instance
          }else{
            Globals.auth.authFailure()
          }      
        }else Globals.auth.deviceFailure()
      }else {
        if(token){
          const instance = await AxiosRequest.getInstance(token,'',transform).post<IResponse<null>>(url)
          if(instance.data.messege == 'A0006') Globals.auth.deviceFailure()
          else return instance
        }else{
          Globals.auth.authFailure()
        }   
      }
    }
    public static async post<Data , Response>(url:string , data:Data , transform?:AxiosResponseTransformer | AxiosResponseTransformer[] | undefined){
      const token = await Globals.auth.getToken()
      if(this.deviceControl){
        const device_key = Cookies.get('dev_tkn')
        if(device_key){
          if(token){
            const instance = await AxiosRequest.getInstance(token,device_key,transform).post<IResponse<Response>>(url,data)
            if(instance.data.messege == 'A0006') Globals.auth.deviceFailure()
              else return instance
          }
          else{
            Globals.auth.authFailure()
          }
        }else Globals.auth.deviceFailure()
      }else {
        if(token){
          const instance = await AxiosRequest.getInstance(token,'',transform).post<IResponse<Response>>(url,data)
          if(instance.data.messege == 'A0006') Globals.auth.deviceFailure()
            else return instance
        }
        else{
          Globals.auth.authFailure()
        }
      }
    }
    public static async statusPost<Data>(url:string , data:Data , transform?:AxiosResponseTransformer | AxiosResponseTransformer[] | undefined){
      const token = await Globals.auth.getToken()
      if(this.deviceControl){
        const device_key = Cookies.get('dev_tkn')
        if(device_key){
          if(token){
            const instance = await AxiosRequest.getInstance(token,device_key,transform).post<IResponse<null>>(url,data)
            if(instance.data.messege == 'A0006') Globals.auth.deviceFailure()
              else return instance
          }
          else{
            Globals.auth.authFailure()
          }
        }else Globals.auth.deviceFailure()
      }else {
        if(token){
          const instance = await AxiosRequest.getInstance(token,'',transform).post<IResponse<null>>(url,data)
          if(instance.data.messege == 'A0006') Globals.auth.deviceFailure()
            else return instance
        }
        else{
          Globals.auth.authFailure()
        }
      }
    }
    public static async statusFilesPost<Data>(url:string , data:Data , transform?:AxiosResponseTransformer | AxiosResponseTransformer[] | undefined){
      const token = await Globals.auth.getToken()
      if(this.deviceControl){
        const device_key = Cookies.get('dev_tkn')
        if(device_key){
          if(token){
            const instance = await AxiosRequest.getInstance(token,device_key,transform).post<IResponse<null>>(url,data,
              {
                headers: {
                  'Content-Type': 'multipart/form-data'
                }
              }
            )
            if(instance.data.messege == 'A0006') Globals.auth.deviceFailure()
            else return instance
          }
          else{
            Globals.auth.authFailure()
          }
        }else Globals.auth.deviceFailure()
      }else {
        if(token){
          const instance = await AxiosRequest.getInstance(token,'',transform).post<IResponse<null>>(url,data,
            {
              headers: {
                'Content-Type': 'multipart/form-data'
              }
            }
          )
          if(instance.data.messege == 'A0006') Globals.auth.deviceFailure()
          else return instance
        }
        else{
          Globals.auth.authFailure()
        }
      }
    }

    public static async get<Response>(url:string , transform?:AxiosResponseTransformer | AxiosResponseTransformer[] | undefined){
      const token = await Globals.auth.getToken()
      if(this.deviceControl){
        const device_key = Cookies.get('dev_tkn')
        if(device_key){
          if(token){
            const instance = await AxiosRequest.getInstance(token,device_key,transform).get<IResponse<Response>>(url)
            if(instance.data.messege == 'A0006') Globals.auth.deviceFailure()
            else return instance
          }
          else{
            Globals.auth.authFailure()
          }
        }else Globals.auth.deviceFailure()
      } else {
        if(token){
          const instance = await AxiosRequest.getInstance(token,'',transform).get<IResponse<Response>>(url)
          if(instance.data.messege == 'A0006') Globals.auth.deviceFailure()
          else return instance
        }
        else{
          Globals.auth.authFailure()
        }
      }
    }
    public static async rememberAuthentication(token:string){
      if(this.deviceControl){
        const device_key = Cookies.get('dev_tkn')
        if(device_key){
          const instance = await AxiosRequest.getInstance(token,device_key).post<IResponse<ILoginResponseData>>(this.loginURL,{remember_token:token})
          if(instance.data.messege == 'A0006') Globals.auth.deviceFailure()
          else return instance
        }else Globals.auth.deviceFailure()
      }else {
        const instance = await AxiosRequest.getInstance(token,'').post<IResponse<ILoginResponseData>>(this.loginURL,{remember_token:token})
        if(instance.data.messege == 'A0006') Globals.auth.deviceFailure()
        else return instance
      }
    }
    public static async refreshAuthentication(token:string){
      if(this.deviceControl){
        const device_key = Cookies.get('dev_tkn')
        if(device_key){
          const instance = await AxiosRequest.getInstance(token,device_key).post<IResponse<ILoginResponseData>>(this.loginURL,{refresh_token:token})
          if(instance.data.messege == 'A0006') Globals.auth.deviceFailure()
          else return instance
        }else Globals.auth.deviceFailure()
      }else {
        const instance = await AxiosRequest.getInstance(token,'').post<IResponse<ILoginResponseData>>(this.loginURL,{refresh_token:token})
        if(instance.data.messege == 'A0006') Globals.auth.deviceFailure()
        else return instance
      }
    }
    public static async login(data:ILoginData){
      if(this.deviceControl){
        const device_key = Cookies.get('dev_tkn')
        if(device_key){
          const instance = await axios.create({baseURL:AxiosRequest.baseUrl,headers:{'x-device-key': device_key}}).post<IResponse<ILoginResponseData>>(this.loginURL,data)
          if(instance.data.messege == 'A0006') Globals.auth.deviceFailure()
          else return instance
        }else Globals.auth.deviceFailure()
      }else {
        const instance = await axios.create({baseURL:AxiosRequest.baseUrl}).post<IResponse<ILoginResponseData>>(this.loginURL,data)
        if(instance.data.error_code == 'A0006') Globals.auth.deviceFailure()
        else return instance
      }
    }
    public static async activateDevice(activation_key:string){
      return await axios.create({baseURL:AxiosRequest.baseUrl}).post<IResponse<{token:string}>>(this.activateDeviceURL,{activation_key:activation_key})
    }
    public static async checkDevice(token:string){
      return await axios.create({baseURL:AxiosRequest.baseUrl}).post<IResponse<{token:string}>>(this.checkDeviceURL,{token:token})
    }

}