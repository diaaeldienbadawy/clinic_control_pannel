import { AxiosClientRepository} from "../../Handlers/AxiosClient";
import { GeneralMethods } from "../../Handlers/GeneralMethods";
import { Notify } from "../../Handlers/Notifications";
import { InterActive } from "../../Utilities/ViewModelStructure";

/*export abstract class EditablePageVM<DataType extends {id?:string}> extends InterActive{
    private initilaData:DataType;
    private client:AxiosClientRepository<DataType>;
    protected data:DataType  ;
    public get Data():DataType{ return this.data  }
    public set Data(value:DataType){ this.data = value ; this.update()  }

    public abstract initiate():void

    constructor(data:DataType, client:AxiosClientRepository<DataType>){
        super()
        this.initilaData = data
        this.data = data
        this.client = client
    }
    public send(){
        this.loading(async()=>{
            let response = await this.client.insert(this.data,{onSuccess:()=>Notify({type:'success' , title:'عملية ناجحة' , body:'تم اضافة المقال بنجاح'})})
            if(response){
                if(!this.data.id)this.data = this.initilaData
            }
            this.update()
        })
    }
}*/
export abstract class EditablePageVM <DataType extends {id?:string}> extends InterActive{
    protected initilaData:DataType;
    protected clientType:{new():AxiosClientRepository<DataType>};

    protected _data:DataType  ;
    public get data():DataType{ return this._data  }
    public set data(value:DataType){ this._data = value ; this.update()  }

    protected id:string = '';
    public get Id():string{ return this.id  }
    public set Id(value:string){ this.id = value ; this.update()  }

    protected _editing : boolean = true;
    public get editing() : boolean {
      return this._editing;
    }
    public set editing(v : boolean) {
      this._editing = v;
      this.update()
    }
  

    public abstract preInitiate():Promise<void>
    public abstract afterInitiate():Promise<void>

    constructor(data:DataType, clientType:{new():AxiosClientRepository<DataType>}){
        super()
        this.initilaData = data
        this._data = data
        this.clientType = clientType
    }

    public initiate(id?:string){
        this.loading(async()=>{
            await this.checkId()
            await this.preInitiate()
            await this.getData(id)
            await this.afterInitiate()
            this.update()  
        })
    }

    private checkId(){
        let id = GeneralMethods.extractIdFromUrl()

        if(id){
            this.id = id
        }else GeneralMethods.removeParamsFromUrl()
    }

    public async getData(id?:string){
        if(id) this.id = id
        if(this.id){
            let response = await new this.clientType().find(this.id,{ onDrop:()=>{ GeneralMethods.removeParamsFromUrl() } , onfail:()=>{ GeneralMethods.removeParamsFromUrl() } })
            if(response){
                this.data = response
            }
        }
    }

    public send(){

        this.loading(async()=>{
            console.log(this.data)
            let response = await new this.clientType().insert(this.data,{onSuccess:()=>Notify({type:'success' , title:'عملية ناجحة' , body:'تمت العملية بنجاح'})})
            if(response){
                if(!this.data.id)this.data = this.initilaData
            }
            this.update()
        })
    }
    public delete(onDelete?:()=>void){
        this.loading(async()=>{
            let response = await new this.clientType().delete(this.data.id??'',{onSuccess:()=>Notify({type:'success' , title:'عملية ناجحة' , body:'تم الحذف بنجاح'})})
            if(response){
                if(onDelete)onDelete()
            }
            this.update()
        })
    }
}