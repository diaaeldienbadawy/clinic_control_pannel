import { AxiosClientRepository} from "../../../MyLib/Structure/Handlers/AxiosClient";
import { Role } from "../../Models/Role";
import { service } from "../../Models/service";


export class ServiceClient extends AxiosClientRepository<service>{
    protected endPoint: string = 'service';
}