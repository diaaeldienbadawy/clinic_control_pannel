import { AxiosClientRepository} from "../../../MyLib/Structure/Handlers/AxiosClient";
import { Artical } from "../../Models/Articale";

export class ArticaleClient extends AxiosClientRepository<Artical>{
    protected endPoint: string = 'artical';
}