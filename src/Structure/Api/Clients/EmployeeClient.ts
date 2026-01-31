import { AxiosClientRepository} from "../../../MyLib/Structure/Handlers/AxiosClient";
import { Role } from "../../Models/Role";
import { User, UserProfile } from "../../Models/User";


export class EmployeeClient extends AxiosClientRepository<UserProfile>{
    protected endPoint: string = 'employees';
}