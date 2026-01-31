import { AxiosClientRepository} from "../../../MyLib/Structure/Handlers/AxiosClient";
import { period } from "../../Models/period";

export class PeriodClient extends AxiosClientRepository<period>{
    protected endPoint: string = 'period';
}