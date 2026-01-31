import { AxiosClientRepository} from "../../../MyLib/Structure/Handlers/AxiosClient";
import { Artical, ArticalElement } from "../../Models/Articale";
import { booking } from "../../Models/booking";

export class BookingClient extends AxiosClientRepository<booking>{
    protected endPoint: string = 'booking';
}