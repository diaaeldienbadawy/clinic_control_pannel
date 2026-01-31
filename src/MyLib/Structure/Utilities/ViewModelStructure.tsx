import EventEmitter from "eventemitter3";
import React, { ReactElement, ReactNode, useEffect, useState  }  from "react";
import { DNA } from "react-loader-spinner";
import { AxiosResponse, HttpStatusCode } from "axios";
import { Notify } from "../Handlers/Notifications";
import { AxiosRequest } from "../Handlers/AxiosHandler";
import { IPaginatedResponse, IResponse } from "../Interfaces/ResponsesData";
import { SearchData } from "../Interfaces/RequestsData";
import { AuthVM } from "../ViewModels/AuthVM";
import { useMemo } from "react";


export class ViewModel {
    public updateAction :string = 'update'
    public eventEmitter = new EventEmitter(); 
    protected attatches:{viewModel:ViewModel , lis: React.Dispatch<React.SetStateAction<{viewModel:any}>>} [] = []

    public attachViewModel(viewModel:ViewModel , lis: React.Dispatch<React.SetStateAction<{viewModel:any}>>){
        this.attatches.push({viewModel:viewModel , lis:lis})
    }


    public update():void{
        this.eventEmitter?.emit(this.updateAction,  {viewModel:this});
        this.attatches?.forEach(ele=>{
            ele.viewModel.update()
        })
    }
    public subscribeUpdate(listener:React.Dispatch<React.SetStateAction<{viewModel:any}|any>>){
        this.eventEmitter?.on(this.updateAction,listener)

    }
    public unsubscribeUpdate(listener: React.Dispatch<React.SetStateAction<{viewModel:any}>>){
        this.eventEmitter?.off(this.updateAction,listener)

    }
}

export class InterActive extends ViewModel{
    protected manager?:InterActive
    //parameters
    private isLoading:boolean = false
    protected error:boolean = false
    protected messege:string = ''
    private spinner :ReactElement  = this.SpinnerJSX()
    private spinnerColor:string = 'var(--colorIII)'

    //getters
    public get IsLoading():boolean { return this.isLoading }
    public get Messege():string { return this.messege }
    public get Spinner():ReactElement { return this.spinner }
    protected get SpinnerColor():string { return this.spinnerColor }

    //setters
    protected set IsLoading(value:boolean) { this.isLoading= value ; this.update() }
    protected set Messege(value:string) { this.messege= value ; this.update() }
    protected set Spinner(value:ReactElement) { this.spinner = value; this.update() }
    protected set SpinnerColor(value:string) { this.spinnerColor = value ; this.update() }

    //constructor
    constructor(data?:{ manager?:InterActive})
    { 
        super() 
        if(data)this.manager = data.manager
    }

    //interactive
    public async loading(action : ()=>Promise<void>){
        if(!this.IsLoading){
        this.IsLoading = true
        await action()
        this.IsLoading = false}
    }

    public SpinnerJSX():ReactElement{
        const DefaulElement:ReactElement =  
        <div className="d-flex justify-content-center align-content-center">
        <div>
  
        <DNA 
              visible={true}
              height="80"
              width="80"
                  ariaLabel="dna-loading"
              wrapperStyle={{}}
              wrapperClass="dna-wrapper"
              />
      </div>
      </div>
        return(
            DefaulElement
        )
    }

    public Show(content:ReactElement|ReactNode|null):ReactElement|ReactNode|null{
        return this.IsLoading?this.Spinner:content
    }
    public ShowWithMessege(content:ReactElement|ReactNode|null):ReactElement|ReactNode|null{
        return this.IsLoading?this.spinner:(this.error?(<div className="d-flex justify-content-center align-content-center">{this.Messege}</div>):content)
    }
    protected getQueryParameter(key:string):string {
        return new URLSearchParams(window.location.search).get(key)||''
    }

    protected async request<T>(data:{action: Promise<AxiosResponse<IResponse<T|null>, any>|undefined> , onSuccess?:(data:{data?:T})=>void, onfail?:()=>void , onDrop?:()=>void}){
        try{
            const response = await data.action
            if(response){
                if(response.status === HttpStatusCode.Ok){
                    if(response.data.status){
                        if(data.onSuccess)data.onSuccess(response.data.data?{data:response.data.data}:{})
                        this.update()
                        
                    }else {
                        if(data.onfail)data.onfail()
                        Notify({type:'danger' , title:'فشل العملية' , body:response.data.messege})
                        this.update()
                    }
                }else {
                    if(data.onDrop)data.onDrop()
                    Notify({type:'danger' , title:'فشل العملية' , body:'فشل العملية ... برجاء مراجعة الاتصال بالانترنت و اعادة المحاولة'})
                    this.update()
                }
            }
        }catch{
            if(data.onDrop)data.onDrop()
            Notify({type:'danger' , title:'فشل العملية' , body:'فشل العملية ... برجاء مراجعة الاتصال بالانترنت و اعادة المحاولة'})
            this.update()
        }
    } 
    
    protected apiGetRequest<Response>(data:{url:string ,  onSuccess:(data:{data?:Response})=>void, onfail?:()=>void , onDrop?:()=>void}){
        return this.request({
            action : AxiosRequest.get<Response>(data.url) ,
            onSuccess : data.onSuccess ,
            onfail : data.onfail , 
            onDrop : data.onDrop 
        })
    }
    protected apiPostRequest<Data,Response>(data:{url:string , data:Data ,  onSuccess:(data:{data?:Response})=>void , onfail?:()=>void , onDrop?:()=>void}){
        return this.request({
            action : AxiosRequest.post<Data,Response>(data.url,data.data) ,
            onSuccess : data.onSuccess ,
            onfail : data.onfail , 
            onDrop : data.onDrop 
        })
    }
    protected apiStatusPostRequest<Data>(data:{url:string , data:Data ,  onSuccess:(data:{data?:Response})=>void , onfail?:()=>void , onDrop?:()=>void}){
        return this.request({
            action : AxiosRequest.statusPost<Data>(data.url,data.data) ,
            onSuccess : data.onSuccess ,
            onfail : data.onfail , 
            onDrop : data.onDrop 
        })
    }
}

export class InterActiveList<T> extends InterActive{
    private list:T[] = []
    private searchData:SearchData = {page_count:10 , current_page:1}
    private url:string
    private loaded:boolean = false
    private page:number = 1
    private final_page:number = 1

    public get List():T[] { return this.list }

    public set Search(value:string){ this.searchData.search = value; this.update() }
    public set Filter(value:string){ this.searchData.filter = value; this.update() }
    public set Max(value:string){ this.searchData.max = value; this.update() }
    public set Min(value:string){ this.searchData.min = value; this.update() }
    //public set MaxId(value:string){ this.searchData.max_id = value; this.update() }
    //public set MinId(value:string){ this.searchData.min_id = value; this.update() }

    constructor(data:{url:string , manager?:InterActive}){
        super({manager:data.manager})
        this.url = data.url
    }

    public getList(){
        this.searchData.current_page=1
        this.manager?this.manager.loading(
           async()=>await this.apiGetRequest<IPaginatedResponse<T>>({
                url:this.url+'?page='+(this.searchData.current_page||'')+'&page_count='+(this.searchData.page_count||'') ,
                onSuccess:(data)=>{ 
                    if(data.data){
                        this.list = data.data.data
                        this.page = data.data.pagination.current_page
                        this.final_page = data.data.pagination.total_pages
                    }
                }
            })
        ):this.loading(
            async()=>await this.apiGetRequest<IPaginatedResponse<T>>({
                url:this.url+'?page='+(this.searchData.current_page||'')+'&page_count='+(this.searchData.page_count||'') ,
                onSuccess:(data)=>{ 
                    if(data.data){
                        this.list = data.data.data
                        this.page = data.data.pagination.current_page
                        this.final_page = data.data.pagination.total_pages
                    }
                }
            })
        )
    }
    public search(){
        this.searchData.current_page = 1
        this.apiGetRequest<IPaginatedResponse<T>>({
            url:this.url+'?search='+(this.searchData.search||'')+'&filter='+(this.searchData.filter||'')+'&max='+(this.searchData.max||'')+'&min='+(this.searchData.min||'')+'&page='+(this.searchData.current_page||'')+'&page_count='+(this.searchData.page_count||''),
            onSuccess:(data)=>{
                if(data.data){
                    this.list = data.data.data
                    this.page = data.data.pagination.current_page
                    this.final_page = data.data.pagination.total_pages
                }
            }
        })
    }
    public more(){
        if(!this.loaded){
            this.loaded = true
            if(this.page < this.final_page){
                this.searchData.page_count = this.page+1
                this.apiGetRequest<IPaginatedResponse<T>>({
                    url:this.url+'?search='+(this.searchData.search||'')+'&filter='+(this.searchData.filter||'')+'&max='+(this.searchData.max||'')+'&min='+(this.searchData.min||'')+'&page='+(this.searchData.current_page||'')+'&page_count='+(this.searchData.page_count||''),
                    onSuccess:(data)=>{
                        if(data.data){
                            this.list = [...this.list,...data.data.data]
                            this.page = data.data.pagination.current_page
                            this.final_page = data.data.pagination.total_pages
                        }
                    }
                })
            }
            this.loaded = false
        }
    }
    public getPage(page:number){
        if(!this.loaded){
            this.loaded = true
            if(page <= this.final_page){
                this.searchData.page_count = page
                this.apiGetRequest<IPaginatedResponse<T>>({
                    url:this.url+'?search='+(this.searchData.search||'')+'&filter='+(this.searchData.filter||'')+'&max='+(this.searchData.max||'')+'&min='+(this.searchData.min||'')+'&page='+(this.searchData.current_page||'')+'&page_count='+(this.searchData.page_count||''),
                    onSuccess:(data)=>{
                        if(data.data){
                            this.list = data.data.data
                            this.page = data.data.pagination.current_page
                            this.final_page = data.data.pagination.total_pages
                        }
                    }
                })
            }
            this.loaded = false
        }
    }
}


export abstract class EditableVM extends InterActive{
    protected editing:boolean = false;
    public get Editing():boolean{ return this.editing  }
    /*public set Editing(value:boolean){ 
        if(value == false){
            this.edit()
        }
        this.editing = value ; 
        this.update()  
    }*/
    public save(){
        this.onSave()
        this.editing = false
        this.update()  
    }
    public cancel(){
        this.onCancel()
        this.editing = false
        this.update()
    }
    public delete(){
        this.onDelete()
        this.update()
    }
    public activateEditingMode(){
        this.editing = true
        this.update()
    }
    public activateDeletingMode(){
        this.deleting = true
        this.update()
    }
    public closeDeletingMode(){
        this.deleting = false
        this.update()
    }

    protected deleting:boolean = false;
    public get Deleting():boolean{ return this.deleting  }
    public set Deleting(value:boolean){ this.deleting = value ; this.update()  }

    protected abstract onSave():void
    protected abstract onCancel():void
    protected abstract onDelete():void
}

type ResultType = string & { result?: string };

export const useVM = <T extends InterActive>(initial:T)=>{
    const [state , setState] = useState<{viewModel:T}>({viewModel:initial})
    useEffect(()=>{
        state.viewModel.subscribeUpdate(setState)
    },[])

    return state.viewModel;
}

export const useAuthVM = <T extends AuthVM>(initial:T)=>{
    const [state , setState] = useState<{viewModel:T}>({viewModel:initial})
    useEffect(()=>{
        state.viewModel.subscribeUpdate(setState)
        //state.viewModel.checkDeviceToken()
    },[])
    return state.viewModel;
}