import { AxiosClientRepository} from "../../../MyLib/Structure/Handlers/AxiosClient";
import { branch } from "../../Models/branch";

export class BranchEmployeeClient extends AxiosClientRepository<{id?:string , branch_id:string , employee_id:string}>{
    protected endPoint: string = 'branch-employee';
}