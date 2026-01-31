
import { SideBarVM } from "../../../Structure/ViewModels/Layout/SideBarVM";
import { PopupVM } from "../../Components/Popup";
import { AuthVM } from "../ViewModels/AuthVM";


export class Globals {
    //https://be.beauty2beclinics.com/api/v1/
    public static deviceControl:boolean= true
    public static apiBaseUrl:string = "http://127.0.0.1:8000/api/v1/";
    public static apiAuthBaseUrl:string = "http://127.0.0.1:8000/api/";
    public static auth:AuthVM = new AuthVM()
    public static sideBar:SideBarVM = new SideBarVM()
    public static popup:PopupVM = new PopupVM()
}
