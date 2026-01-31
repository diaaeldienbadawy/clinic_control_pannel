import { AxiosClientRepository} from "../../../MyLib/Structure/Handlers/AxiosClient";
import { profile } from "../../Models/profile";



export class ProfileClient extends AxiosClientRepository<profile>{
    protected endPoint: string = 'profile';
}