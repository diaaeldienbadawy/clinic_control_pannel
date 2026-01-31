import { AxiosClientRepository } from "../../Handlers/AxiosClient";
import { IPaginatedResponse } from "../../Interfaces/ResponsesData";
import { InterActive } from "../../Utilities/ViewModelStructure";

export class PaginatedListVM<T extends {id?:string}>  extends InterActive{
    private initialData:IPaginatedResponse<T> = { data:[] , pagination:{total:0 , per_page:10 , count : 0 , total_pages:0 , current_page:1 }}
    protected reverse:boolean
    public clientType:{new():AxiosClientRepository<T>}
    protected data:(IPaginatedResponse<T>) = this.initialData
    public get Data():(IPaginatedResponse<T>) { return this.data }
    public set Data(v:(IPaginatedResponse<T>)){ this.data = v; this.update() }

    private newItem:T|undefined;
    public get NewItem():T|undefined{ return this.newItem  }
    public set NewItem(value:T|undefined){ this.newItem = value ; this.update()  }

    constructor(clientType:{new():AxiosClientRepository<T>}, reverse:boolean, data?:IPaginatedResponse<T>){
        super()
        this.clientType = clientType
        if(data){
            this.initialData = data
            this.data = data
        }
        this.reverse = reverse==undefined?false:true
        this.messege = 'لا توجد بيانات'
    }

    public initiate(page?:number): void {
        this.getPage(page)
    }

    public getPage(page?:number,reverse?:boolean){
        if(reverse === undefined) reverse = this.reverse
        this.loading(async()=>{
            this.error = true
            const response = await new this.clientType().getPage(page??1,reverse)
            if(response){
                this.data = response
                this.error = false
            }
            this.update()
        })
    }

    public async edit(item:T , onSuccess?:()=>void , onFail?:()=>void){
        this.error = true
        const success = ()=>{
            this.data.data = [...this.data.data.map(a=>a?.id==item?.id?(item as T):a as T)]
            if(onSuccess)onSuccess()
            this.error = false
        }
        const response = await new this.clientType().insert(item ,{onSuccess:success , onfail:onFail , onDrop:onFail})
        
        this.update()
    }

    public async delete(id:string , onSuccess?:()=>void , onFail?:()=>void){
        this.error = true
        const success = ()=>{
            this.data.data = [...this.data.data.filter(a=>a?.id!=id)]
            if(onSuccess)onSuccess()
            this.error = false
        }
        const response = await new this.clientType().delete(id,{onSuccess:success , onfail:onFail , onDrop:onFail})
        this.update()
    }

    public async add(){
        this.error = true
        const success = ()=>{
            this.error = false
            this.newItem = undefined
            this.getPage()
        }
        if(this.newItem)
        {
            await new this.clientType().insert(this.newItem,{onSuccess:success})
            this.update()
        } 
    }
    public async refresh(reverse?:boolean){
        const page = Number(new URLSearchParams(window.location.search).get('page') ?? '1')
        if(reverse === undefined) reverse = this.reverse
            this.error = true
            const response = await new this.clientType().getPage(page,reverse)
            if(response){
                this.data = response
                this.error = false
            }
            this.update()
    }
}

export abstract class ListVM<T extends {id?:string}>  extends InterActive{
    private initialData:T[] = []
    protected reverse:boolean
    private count:string ='10'
    protected clientType:{new():AxiosClientRepository<T>}
    protected data:(T)[] = this.initialData
    public get Data():(T)[] { return this.data }
    public set Data(v:(T)[]){ this.data = v; this.update() }

    private newItem:T|undefined;
    public get NewItem():T|undefined{ return this.newItem  }
    public set NewItem(value:T|undefined){ this.newItem = value ; this.update()  }

    public initiate(): void {
        this.get()
    }

    constructor(clientType:{new():AxiosClientRepository<T>}, reverse:boolean, data?:T[]){
        super()
        this.clientType = clientType
        if(data){
            this.initialData = data
            this.data = data
        }
        this.reverse = reverse
        this.messege = 'لا توجد بيانات'
    }

    public getAll(reverse?:boolean){
        if(reverse === undefined) reverse = this.reverse
        this.loading(async()=>{
            this.error = true
            const response = await new this.clientType().getAll(reverse)
            if(response){
                this.data = response
                this.error = false
            }
            this.update()
        })
    }
    public get(reverse?:boolean){
        if(reverse === undefined) reverse = this.reverse
        this.loading(async()=>{
            this.error = true
            let first = this.data.length>0?this.data[this.data.length-1]?.id:''
            const response = await new this.clientType().getCollection(first,this.count,reverse)
            if(response){
                this.data = [...this.data,...response]
                this.error = false
            }
            this.update()
        })
    }
    public refresh(reverse?:boolean){
        if(reverse === undefined) reverse = this.reverse
        this.loading(async()=>{
            this.error = true
            const response = await new this.clientType().getCollection('',this.count,reverse)
            if(response){
                this.data = [...response]
                this.error = false
            }
            this.update()
        })
    }

    public async edit(item:T , onSuccess?:()=>void , onFail?:()=>void){
        const success = ()=>{
            this.data = [...(this.data).map(a=>a?.id==item?.id?(item as T):a as T)]
            if(onSuccess)onSuccess()
        }
        const response = await new this.clientType().insert(item ,{onSuccess:success , onfail:onFail , onDrop:onFail})
        
        this.update()
    }

    public async delete(id:string , onSuccess?:()=>void , onFail?:()=>void){
        const success = ()=>{
            this.data = [...this.data.filter(a=>a?.id!=id)]
            if(onSuccess)onSuccess()
            this.error = false
        }
        const response = await new this.clientType().delete(id,{onSuccess:success , onfail:onFail , onDrop:onFail})
        this.update()
    }

    public async add(reverse?:boolean){
        const success = async ()=>{
            if(this.newItem){
                if(reverse === undefined) reverse = this.reverse
                //this.data.push(this.newItem)
                this.newItem = undefined
                this.error = true
                const response = await new this.clientType().getCollection('',this.count,reverse)
                if(response){
                    this.data = [...response]
                    this.error = false
                }
                this.update()
            } 
        }
        if(this.newItem)
        {
            await new this.clientType().insert(this.newItem,{onSuccess: await success})
            this.update()
        } 
    }
}