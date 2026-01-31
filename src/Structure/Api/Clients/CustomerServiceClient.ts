import { AxiosClientRepository} from "../../../MyLib/Structure/Handlers/AxiosClient";
import { customerService } from "../../Models/customerService";


export class CustomerServiceClient extends AxiosClientRepository<customerService>{
    protected endPoint: string = 'customer-service';
}