import { Location, NavigateFunction } from "react-router-dom"
import { ViewModel } from "../Utilities/ViewModelStructure"
import { mainPath } from "../Constants/MainPath"


export class NavigatorVM extends ViewModel{
    private navigator:NavigateFunction = (a)=>{}
    private locator:()=>string =()=>''
    public location :Location<any>|null=null


    public CreateArtical = (id?:string)=> this.navigateTo(id?('/articales-create/'+id):('/articales-create')) 
    public Articals = ()=> this.navigateTo('/articales') 
    public Specializations = ()=>this.navigateTo('/hr/specializations')
    public Roles = ()=>this.navigateTo('/hr/roles');
    public Employees = ()=>this.navigateTo('/hr/employees');
    public CreateEmployee = (id?:string)=>this.navigateTo(id?'/hr/employees/create/'+id:'/hr/employees/create');
    public Branchs = ()=>this.navigateTo('/branchs')
    public CreateBranch = (id?:string)=> this.navigateTo(id?('/branchs-create/'+id):('/branchs-create')) 
    public Services = ()=>this.navigateTo('/services')
    public CreateService = (id?:string)=> this.navigateTo(id?('/services-create/'+id):('/services-create')) 
    public Fqas = ()=>this.navigateTo('/fqas')
    public Events = ()=>this.navigateTo('/events')
    public Reviews = ()=>this.navigateTo('/reviews')
    public HeroSection = ()=>this.navigateTo('/hero')
    public Profile = ()=>this.navigateTo('/profile')
    public CustomerService = ()=>this.navigateTo('/customer-service')
    public Bookings = ()=>this.navigateTo('/management/bookings')
    public Servicebookings = ()=>this.navigateTo('/management/service-bookings')
    public BookingHistorys = ()=>this.navigateTo('/history/bookings')
    public ServicebookingHistorys = ()=>this.navigateTo('/history/service-bookings')
    public BeforeAndAfterCategories = ()=>this.navigateTo('/before-and-after-categorys')
    public BeforeAndAfterCategory = (id?:string)=> this.navigateTo(id?('/create-before-and-after-category/'+id):('/create-before-and-after-category')) 

    public setNavigator(value:NavigateFunction){
        this.navigator = value;
    }

    public setLocator(value:()=>string ){
        this.locator = value;
    }
    public setLocation(value:Location<any>){
        this.location = value
    }

    public removeQueryParameter (key:string){
        const searchParams = new URLSearchParams(this.location?.search);
        searchParams.delete(key)
        this.navigator({
            pathname: this.location?.pathname,
            search: searchParams.toString()
          }, { replace: true });
    }

    public updateQueryParam (key:string , value:string) {
        const searchParams = new URLSearchParams(this.location?.search);
        searchParams.set(key, value);
        this.navigator({
          pathname: this.location?.pathname,
          search: searchParams.toString()
        }, { replace: true });
    }

    private navigateTo (path:string){
        if(this.navigator)this.navigator(mainPath+path);
    }


    public getLocation():string{
        return this.locator()
    }
}