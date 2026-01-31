
import { ILoginData } from "../Interfaces/RequestsData"
import { DeviceData } from "../Models/Device"
import { AxiosRequest } from "./AxiosHandler"

export class ApiRequest{
    //pathes
    /*private static loginURL = 'login'
    private static refreshLoginURL = 'refreshLogin'
    private static rememberLoginURL = 'rememberLogin'
    private static activateDeviceURL = 'activateDevice'
    private static checkDeviceURL = 'checkDevice'*/
    
    //auth 
    /*public static async Login(loginData:ILoginData){
        return await AxiosRequest.postlogin(this.loginURL , loginData)
    }
    public static async RefreshLogin(token:string){
        return await AxiosRequest.postAuth(this.refreshLoginURL,token)
    }
    public static async RememberLogin(token:string){
        return await AxiosRequest.postAuth(this.rememberLoginURL,token )
    }
    public static async activateDevice(password:string){
        return await AxiosRequest.postActivateDevice(this.activateDeviceURL ,{password:password})
    }
    public static async checkDevice(token:string){
        return await AxiosRequest.postCheckDevice(this.checkDeviceURL ,{token:token})
    }*/
}