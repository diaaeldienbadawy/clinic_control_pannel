import axios, { HttpStatusCode } from "axios";
import Cookies from 'js-cookie';
import { InterActive } from "../Utilities/ViewModelStructure";
import { Token } from "../Models/Token";
import { User, UserProfile } from "../../../Structure/Models/User";
import { GeneralMethods } from "../Handlers/GeneralMethods";
import { Notify } from "../Handlers/Notifications";
import { ILoginResponseData, IResponse } from "../Interfaces/ResponsesData";
import { AxiosRequest } from "../Handlers/AxiosHandler";
import { Console } from "console";
import { AuthApi } from "../../../Structure/Api/AuthSerivce";


export class AuthVM extends InterActive{
    private debug: boolean = false
    private get baseUrl():string {  return this.debug?"http://127.0.0.1:8000/api/auth/":"https://be.beauty2beclinics.com/api/auth/" }

    private loginEndPoint:string = "login"
    private accessToken?: Token
    private deviceAuthenticated:boolean = false
    private auth:boolean = false
    private userAdmin:User|undefined = undefined
    private profile:UserProfile|undefined = undefined
    private authApi:AuthApi = new AuthApi()

    private loginData:{employee_key:string , password:string , remember:boolean} = {employee_key:'' , password:'', remember:false}
    private deviceLoginData:{password:string} = {password:''}

    public get AccessToken():Token|undefined{ return this.accessToken;}

    public get Auth():boolean { return this.auth }
    public get Profile():UserProfile|undefined { return this.profile }
    public get LoginData():{employee_key:string , password:string , remember:boolean}{return this.loginData}
    public get DeviceLoginData():{ password:string }{ return this.deviceLoginData }
    public get DeviceAuth():boolean{ return this.deviceAuthenticated }

    public set Employee_Key(value:string){ this.loginData.employee_key = GeneralMethods.removeNonNumeric(value) ; this.update() }
    public set Password(value:string){ this.loginData.password = value; this.update() }
    public set Remmeber(value:boolean){ this.loginData.remember = value; this.update() }
    public set DevicePassword(value:string){ this.deviceLoginData.password = value; this.update() }

    constructor(){
        super()
        this.checkDeviceToken()
    }

    public async initiate(){
        const ref_tkn = Cookies.get('ref_tkn')
        const ref_exp = Cookies.get('ref_exp')
        const rem_tkn = Cookies.get('rem_tkn') 

        if(ref_tkn && ref_exp){
            if(new Date(ref_exp) > new Date()){
                await this.RefreshAuth( ref_tkn , ( rem_tkn != undefined && rem_tkn.length > 0 ) )
            }else {
                if(rem_tkn){
                    await this.rememberAuth(rem_tkn)
                }else this.failedAuth()
            }
        }else{
            if(rem_tkn){
              await  this.rememberAuth(rem_tkn)
            }else this.failedAuth()
        }
    }
    public activateDevice(){
        if(this.deviceLoginData.password.length===0){
            Notify({type:'warning', title:'بيانات غير صحيحة' , body:'برجاء ادخال رقم تفعيل المتصفح'})
        }else {
            this.loading(
                async()=>{
                    this.deviceAuthenticated = false
                    const response = await this.authApi.activateDevice(this.deviceLoginData.password)
                    if(response){
                        Cookies.set('dev_tkn',response.token,  { expires: 365 * 10 } )
                        this.deviceAuthenticated = true
                        this.initiate()
                        this.update()
                    }
                }
            )
        }
    }

    public checkDeviceToken(){
        this.loading(
            async()=>{
                await this.initiate()
            }
        )
    }


    public async login(){
        if(this.loginData.employee_key && this.loginData.password){
            try{
                const response = await axios.create({ baseURL:this.baseUrl }).post<IResponse<ILoginResponseData>>(this.loginEndPoint, {emp_key:this.loginData.employee_key, password:this.loginData.password,remember_me:this.loginData.remember})
                if(response){
                    if(response.status === HttpStatusCode.Ok){
                        if(response.data.status){
                            this.loginData = {employee_key:'' , password:'' , remember:false}
                            this.successAuth(response.data.data)
                        }else this.failedAuth()
                    }else  this.failedAuth()
                }else  this.failedAuth()
            }catch{
                this.failedAuth()
            }
        }else{
            Notify({type:'danger' , title:'البيانات غير صالحة', body:'يجب ادخال الرقم الوظيفي و كلمة السر'})
        }
    }  

    private async RefreshAuth(token:string,remember?:boolean){
        if(token){
            try{
                const response = await axios.create({ baseURL:this.baseUrl })
                                            .post<IResponse<ILoginResponseData>>(
                                                this.loginEndPoint, 
                                                {
                                                    refresh_token:token,
                                                    remember_me:remember
                                                }
                                            )
                if(response){
                    if(response.status === HttpStatusCode.Ok){
                        if(response.data.status){
                            this.loginData = {employee_key:'' , password:'' , remember:false}
                            this.successAuth(response.data.data)
                        }else this.failedAuth()
                    }else  this.failedAuth()
                }else  this.failedAuth()
            }catch{
                this.failedAuth()
            }
        }else this.failedAuth()
    }
    private async rememberAuth(token:string){
        if(token){
            try{
                const response = await axios.create({ baseURL:this.baseUrl })
                                            .post<IResponse<ILoginResponseData>>(
                                                this.loginEndPoint, 
                                                {
                                                    remember_token:token
                                                }
                                            )
                if(response){
                    if(response.status === HttpStatusCode.Ok){
                        if(response.data.status){
                            this.loginData = {employee_key:'' , password:'' , remember:false}
                            this.successAuth(response.data.data)
                        }else this.failedAuth()
                    }else  this.failedAuth()
                }else  this.failedAuth()
            }catch{
                this.failedAuth()
            }
        }else this.failedAuth()
    }

    private failedAuth(){
        this.profile = undefined
        this.setToken('access',undefined)
        this.setToken('refresh',undefined)
        this.setToken('remember',undefined)
        this.auth = false
        this.Messege = ''
        this.update()
    }
    private successAuth(data:ILoginResponseData){
        this.profile = data.profile
        this.setToken('access',data.accessToken)
        this.setToken('refresh',data.refreshToken)
        if(data.rememberToken)this.setToken('remember',data.rememberToken)
        this.auth = true
        this.Messege = ''
        this.update()
    }
    private setToken( type:'access'|'refresh'|'remember',token?:Token ){
        switch (type) {
            case 'access' : {
                this.accessToken = this.formatToken(token)
                break
            }
            case 'refresh' :{
                this.setSessionToken('ref',token)
                break
            }
            case 'remember' :{
                this.setLocalStorageToken('rem',token)
                break
            }
        }
        this.update()
    }

    private formatToken(token?:Token):Token|undefined{
        if(token){
            const tkn:string =  token.token
            var exp:Date|undefined = GeneralMethods.convertToLocalDateTime(token.expiration?.toString())
            return {token:tkn , expiration:exp}
        }
       else return undefined
    }
    private setSessionToken( key:string,token?:Token ){
        token = this.formatToken(token)
        if(token){
            Cookies.set(`${key}_tkn`,token.token);
           if(token.expiration) Cookies.set(`${key}_exp`,token.expiration.toString());
        } else {
            Cookies.remove(`${key}_tkn`);
            Cookies.remove(`${key}_exp`);
        }
    }
    private setLocalStorageToken( key:string,token?:Token ){
        token = this.formatToken(token)
        if(token){
            Cookies.set(`${key}_tkn`,token.token, { expires: token.expiration });
        } else {
            Cookies.remove(`${key}_tkn`);
        }
    }

    public setAccessToken(token:Token){
        this.accessToken = token
        this.update()
    }
    
    public RefreshTokens(access:Token , refresh:Token){
        this.setToken('access',access)
        this.setToken('refresh',refresh)
        this.update()
    }

    public async getToken():Promise<string|undefined>{

        if(this.accessToken && this.accessToken?.expiration && ( this.accessToken?.expiration > new Date() )){
            return this.accessToken.token
        }else await this.initiate()
        /*else {
            const ref_tkn = Cookies.get('ref_tkn')
            const ref_exp = Cookies.get('ref_exp') 
            const rem_tkn = Cookies.get('rem_tkn') 
            if(ref_tkn && ref_exp && ( new Date(ref_exp) > new Date() )){
                try{
                    const response = await AxiosRequest.refreshAuthentication(ref_tkn)
                    if(response){
                        if(response.status === HttpStatusCode.Ok){
                            if(response.data.status){
                                this.loginData = {employee_key:'' , password:'' , remember:false}
                                this.successAuth(response.data.data)
                            }else{
                                this.failedAuth()
                            }
                        }
                    }
                }catch{
                    Notify({type:'danger',title:'خطأ', body:'خطأ غير معروف .. برجاء مراجعة الاتصال بالانترنت و المحاولة مرة اخرى'})
                } 
            } else if(rem_tkn) {
                try{
                    const response = await AxiosRequest.rememberAuthentication(rem_tkn)
                    if(response){
                        if(response.status === HttpStatusCode.Ok){
                            if(response.data.status){
                                this.loginData = {employee_key:'' , password:'' , remember:false}
                                this.successAuth(response.data.data)
                            }else{
                                this.failedAuth()
                            }
                        }
                    }
                }catch{
                    Notify({type:'danger',title:'خطأ', body:'خطأ غير معروف .. برجاء مراجعة الاتصال بالانترنت و المحاولة مرة اخرى'})
                } 
            }else{
                Notify({type:'danger',title:'تنبيه', body:'انتهاء صلاحية الجلسة برجاء تسجيل الدخول مرة اخرى'})
                this.failedAuth()
            }
        }*/
        return this.accessToken?.token
    }

    public authFailure(){
        Notify({type:'danger',title:'خطأ', body:'انتهاء صلاحية الجلسة .. برجاء تسجيل الدخول مرة اخرى'})
        this.failedAuth()
    }
    public deviceFailure(){
        this.deviceAuthenticated = false
        Notify({type:'danger',title:'خطأ', body:'المتصفح لا يملك الصلاحية'})
        this.failedAuth()
    }
    public logout(){
        this.loading(
            async()=>{
                this.failedAuth()
            }
        )
    }
}