import { keyboard } from "@testing-library/user-event/dist/keyboard";
import { navigator } from "../../../MyLib/Components/Facilities";
import { Notify } from "../../../MyLib/Structure/Handlers/Notifications";
import { IPaginatedResponse } from "../../../MyLib/Structure/Interfaces/ResponsesData";
import { InterActive } from "../../../MyLib/Structure/Utilities/ViewModelStructure";
import { EditablePageVM } from "../../../MyLib/Structure/ViewModels/Abstracts/EditablePageVM";
import { Prop } from "../../../MyLib/Structure/ViewModels/Abstracts/Prop";
import { ArticaleClient } from "../../Api/Clients/ArticaleClient";
import { ArticalElementClient } from "../../Api/Clients/ArticalElementClient";
import { Artical, articalElementType } from "../../Models/Articale";

export class ArticalesPageVM extends InterActive{
    private data?: IPaginatedResponse<Artical>;
    public get Data():IPaginatedResponse<Artical>|undefined{ return this.data  }
    public set Data(value:IPaginatedResponse<Artical>|undefined){ this.data = value ; this.update()  }

    private currentPage:number = 0;
    public get CurrentPage():number{ return this.currentPage  }
    public set CurrentPage(value:number){ this.currentPage = value ; this.update()  }

    public getData(page?:number){
        this.loading(async()=>{
            const response = await new ArticaleClient().getPage(page)
            if(response){
                this.data = response
                this.currentPage = page??1
                this.update()
            }
        })
    }
    public async delete(item:Artical){
        const response = await new ArticaleClient().delete(item.id??'' , {onSuccess:()=>this.getData(this.currentPage)})
    }
}

export class EditableArticalPageVM extends EditablePageVM<Artical>{
    protected newElement:articalElementType = 'subtitle';
    public get NewElement():articalElementType{ return this.newElement  }
    public set NewElement(value:articalElementType){ this.newElement = value ; this.update()  }

    public Title:Prop<string> = new Prop<string>(()=>this.data.title ,(v:string)=>{this.data.title = v; this.data.slug=v.trim().replace(/\s+/g, '-').replace(/[^\p{L}\p{N}-]+/gu, '') } , this)
    public Prief:Prop<string> = new Prop<string>(()=>this.data.prief ,(v:string)=>this.data.prief = v , this)
    public Img:Prop<string|File> = new Prop<string|File>(()=>this.data.img??null, (v:string|File)=>this.data.img=v , this)
    public Keywords:Prop<string|undefined> = new Prop<string|undefined>(()=>this.data.keywords, (v:string|undefined)=>this.data.keywords=v , this)

    constructor(){
        let init = { title:'العنوان' , prief:'مقدمة مقدمة مقدمة مقدمة' , img:'', keyboard:'' , elements:[]} 
        super(init ,ArticaleClient)
    }

    public async preInitiate(): Promise<void> {
        
    }

    public async afterInitiate(): Promise<void> {
        
    }

    public addElement(element:{type:articalElementType,content:string|File}){
        this.data.elements?.push(element)
        if(element.content === ''){
            switch(element.type){
                case ('img') :{
                    element.content = ''
                    break;
                }
                case ('paragraph') :{
                    element.content = 'مقطع نصي...'
                    break
                }
                case ('subtitle') :{
                    element.content = 'عنوان فرعى...'
                    break;
                }
                case ('ul') :{
                    element.content  = 'نقطة جديدة...'
                    break
                }
                case ('video') :{
                    element.content  = 'فيديو يوتيوب...'
                    break
                }
                default : {
                    element.content = ''
                    break
                }
            }
        }
        this.update()
    }

    public removeElement(element:{type:articalElementType,content:string|File|null}){
        this.loading(async()=>{
            if(this.data.elements){
                this.data.elements = [...this.data.elements.filter(a=>a!==element)]
                this.update()
            }
        })
    }



    public editElement(element:{type:articalElementType,content:string|File}){
        if(this.data.elements){
            const newElements = this.data.elements.map(a=>(a===element?(element):a))
            this.data.elements = [...newElements]
        }
        this.update()
    }

    public send(): void {
        this.loading(async()=>{

            let response = await new this.clientType().insert(this.data)
            console.log(response)
            if(response){
                
                if(!this.data.id)navigator.Articals()
                navigator.Articals();
                Notify({type:'success' , title:'عملية ناجحة' , body:'تم اضافة/تعديل المقال بنجاح'})
            }
            this.update()
        })
    }
}

/*export class CreateArticalPageVM extends EditableArticalPageVM{
    public initiate(): void {
        
    }
}

export class EditArticalPageVM extends EditableArticalPageVM{
    private id:string = '';
    public get Id():string{ return this.id  }
    public set Id(value:string){ this.id = value ; this.update()  }

    constructor(id:string){
        super()
        this.id = id
    }

    public initiate(): void {
        this.getData()
    }

    public getData(){
        this.loading(async()=>{
            let client = new ArticaleClient()
            let response = await client.find(this.id,{ onDrop:()=>{ navigator.Articals() } , onfail:()=>{ navigator.Articals() } })
            if(response){
                //this.data = client.convert(response)
                this.data = response
                this.update()
            }
        })
    }
}*/