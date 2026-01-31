import { AxiosClientRepository} from "../../../MyLib/Structure/Handlers/AxiosClient";
import { Role } from "../../Models/Role";


export class RoleClient extends AxiosClientRepository<Role>{
    protected endPoint: string = 'roles';
}