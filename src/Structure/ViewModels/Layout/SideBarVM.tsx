import { faSlack } from "@fortawesome/free-brands-svg-icons"
import { Globals } from "../../../MyLib/Structure/Globals/GlobalObs"
import { InterActive } from "../../../MyLib/Structure/Utilities/ViewModelStructure"
import { faL } from "@fortawesome/free-solid-svg-icons"


export class SideBarVM extends InterActive{
    private collapsed:boolean = false
    private selectedPage:string = ''
    private sideBarPages:{page:string , path:string,open:boolean}[] = []

    public get Collapsed():boolean { return this.collapsed }
    public get SelectedPage():string { return this.selectedPage }
    public get SideBarPages():{page:string , path:string,open:boolean}[] { return this.sideBarPages }

    public set Collapsed(value:boolean) { this.collapsed = value; this.update() }
    public set SelectedPage(value:string){ this.selectedPage = value; this.update() }

    public getSideTabs(){
        if(Globals.auth.Auth){
            if(Globals.auth.Profile){
                const pagesList:{page:string , path:string,open:boolean}[] = []
                pagesList.push({page:'الحجوزات' , path:'management',open:true})
                pagesList.push({page:'السجل' , path:'history',open:true})
                pagesList.push({page:'المقالات' , path:'articales',open:false})
                pagesList.push({page:'الموارد البشرية' , path:'hr',open:false})
                pagesList.push({page:'الفروع' , path:'branchs',open:false})
                pagesList.push({page:'الخدمات' , path:'Services',open:false})
                pagesList.push({page:'الاسئلة' , path:'fqas',open:false})
                pagesList.push({page:'المناسبات' , path:'events',open:false})
                pagesList.push({page:'البومات قبل و بعد' , path:'before-and-after-categorys' , open:false})
                pagesList.push({page:'الاراء' , path:'reviews',open:false})
                pagesList.push({page:'واجهة الرئيسية' , path:'hero',open:false})
                pagesList.push({page:'السيرة الذاتيه' , path:'profile',open:false})
                pagesList.push({page:'ارقام خدمة العملاء' , path:'customer-service',open:false})

                this.sideBarPages = pagesList;
                this.update()
            }
        }
    }
    public seSelectedPage(path:string){
        let success = false
        this.sideBarPages.map(a=>{ if(a.path==path){ this.selectedPage=a.page;success=true }})
        if(!success) this.selectedPage=''
    }
}