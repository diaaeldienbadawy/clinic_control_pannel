import Cookies from "js-cookie";
import { AxiosService } from "../../MyLib/Structure/Handlers/AxiosService";
import { User } from "../Models/User";
import { Token } from "../../MyLib/Structure/Models/Token";
import { Globals } from "../../MyLib/Structure/Globals/GlobalObs";
import { ILoginResponseData } from "../../MyLib/Structure/Interfaces/ResponsesData";

export class AuthApi{
    private checkDeviceURL = 'checkDevice'
    private activateDeviceURL = 'activateDevice'
    private loginURL = 'login'

    public async checkDevice(){
        const token = Cookies.get('dev_tkn')
        if(token == undefined) return null
        const service = new AxiosService<{token:string},{token:string}>()
        service.setEndPoint(this.checkDeviceURL).setAuthorized(false).setDeviceControl(false).setRequestType('POST').setData({token:token})
        return await service.build()
    }
    public async activateDevice(activation_key:string){
        const service = new AxiosService<{activation_key:string},{token:string}>()
        service.setEndPoint(this.activateDeviceURL).setAuthorized(false).setDeviceControl(false).setRequestType('POST').setData({activation_key:activation_key})
        return await service.build()
    }
    public async login(emp_key:string , password:string , remember_me:boolean){
        const service = new AxiosService<{emp_key:string , password:string , remember_me:boolean},ILoginResponseData>()
        service.setEndPoint(this.loginURL).setAuthorized(false).setRequestType('POST').setData({emp_key:emp_key , password:password , remember_me:remember_me})
        return await service.build()
    }
    public async rememberAuth(remember_token:string){
        const service = new AxiosService<{remember_token:string},ILoginResponseData>()
        service.setEndPoint(this.loginURL).setAuthorized(false).setRequestType('POST').setData({remember_token:remember_token})
        return await service.build()
    }
    public async refreshAuth(refresh_token:string , remember_token?:string){
        const service = new AxiosService<{refresh_token:string, remember_token?:string},ILoginResponseData>()
        service.setEndPoint(this.loginURL).setAuthorized(false).setRequestType('POST').setData({refresh_token:refresh_token,remember_token:refresh_token})
        return await service.build()
    }
}