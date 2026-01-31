import { AxiosClientRepository } from "../../Handlers/AxiosClient";
import { EditableVM, InterActive } from "../../Utilities/ViewModelStructure";

export abstract class EditableItemVM<T extends {id?:string}> extends EditableVM{
    public clientType:{new():AxiosClientRepository<T>}

    protected initialData?:T

    protected data?: T;
    public get Data():T|undefined{ return this.data  }
    public set Data(value:T|undefined){ this.data = value ; this.update()  }

    constructor(clientType:{new():AxiosClientRepository<T>}){
        super()
        this.clientType = clientType
    }

    public fill(data:T){
        this.loading(async()=>{
            this.data = {...data}
            this.initialData = {...data}
            this.update()
        })
    }
}