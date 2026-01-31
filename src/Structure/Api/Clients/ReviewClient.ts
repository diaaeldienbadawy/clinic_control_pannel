import { AxiosClientRepository} from "../../../MyLib/Structure/Handlers/AxiosClient";
import { review } from "../../Models/review";


export class ReviewClient extends AxiosClientRepository<review>{
    protected endPoint: string = 'review';
}