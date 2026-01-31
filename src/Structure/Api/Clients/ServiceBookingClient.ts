import { AxiosClientRepository} from "../../../MyLib/Structure/Handlers/AxiosClient";
import { Role } from "../../Models/Role";
import { service } from "../../Models/service";
import { serviceBooking } from "../../Models/serviceBooking";


export class ServiceBookingClient extends AxiosClientRepository<serviceBooking>{
    protected endPoint: string = 'service-booking';
}