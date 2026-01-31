import { AxiosClientRepository} from "../../../MyLib/Structure/Handlers/AxiosClient";
import { Role } from "../../Models/Role";
import { User, UserProfile } from "../../Models/User";


export class UserAdminClient extends AxiosClientRepository<User>{
    protected endPoint: string = 'userAdmin';
}