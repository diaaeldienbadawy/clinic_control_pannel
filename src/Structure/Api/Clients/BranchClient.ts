import { AxiosClientRepository} from "../../../MyLib/Structure/Handlers/AxiosClient";
import { branch } from "../../Models/branch";

export class BranchClient extends AxiosClientRepository<branch>{
    protected endPoint: string = 'branch';
}