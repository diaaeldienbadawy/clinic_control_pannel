import { AxiosClientRepository} from "../../../MyLib/Structure/Handlers/AxiosClient";
import { Artical } from "../../Models/Articale";
import { specialization } from "../../Models/Specialization";

export class SpecializationClient extends AxiosClientRepository<specialization>{
    protected endPoint: string = 'specializations';
}