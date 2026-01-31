import { AxiosClientRepository} from "../../../MyLib/Structure/Handlers/AxiosClient";
import { fqa } from "../../Models/fqa";


export class FqaClient extends AxiosClientRepository<fqa>{
    protected endPoint: string = 'fqa';
}