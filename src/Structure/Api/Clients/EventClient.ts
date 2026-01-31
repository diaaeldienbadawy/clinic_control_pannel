import { AxiosClientRepository} from "../../../MyLib/Structure/Handlers/AxiosClient";
import { event } from "../../Models/event";


export class EventClient extends AxiosClientRepository<event>{
    protected endPoint: string = 'event';
}